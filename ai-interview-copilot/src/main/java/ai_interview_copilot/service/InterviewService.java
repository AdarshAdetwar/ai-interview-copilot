package ai_interview_copilot.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.core.ParameterizedTypeReference;

import ai_interview_copilot.model.InterviewHistory;
import ai_interview_copilot.repository.InterviewHistoryRepository;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class InterviewService {

    private static final Logger log = LoggerFactory.getLogger(InterviewService.class);

    @Autowired
    private InterviewHistoryRepository repository;

    private final AiService aiService;

    private final RestTemplate restTemplate;

    // ✅ FIX: RAG URL from config (NO HARDCODING)
    @Value("${rag.service.url}")
    private String ragServiceUrl;

    public InterviewService(RestTemplate restTemplate, AiService aiService) {
        this.restTemplate = restTemplate;
        this.aiService = aiService;
    }

    private static record SessionState(List<String> questions, int lastScore) {
        SessionState {
            if (questions == null)
                questions = new ArrayList<>();
        }
    }

    private final Cache<String, SessionState> sessions = Caffeine.newBuilder()
            .expireAfterAccess(2, TimeUnit.HOURS)
            .maximumSize(10_000)
            .build();

    public void setLastScore(String sessionId, int score) {
        if (sessionId == null)
            return;

        SessionState existing = sessions.getIfPresent(sessionId);
        if (existing != null) {
            sessions.put(sessionId, new SessionState(existing.questions(), score));
        } else {
            sessions.put(sessionId, new SessionState(new ArrayList<>(), score));
        }
    }

    public int getLastScore(String sessionId) {
        SessionState state = sessions.getIfPresent(sessionId);
        return state != null ? state.lastScore() : 5;
    }

    public void resetSession(String sessionId) {
        if (sessionId == null)
            return;
        sessions.put(sessionId, new SessionState(new ArrayList<>(), 5));
    }

    private SessionState getSessionState(String sessionId) {
        String key = sessionId != null ? sessionId : "default";
        return sessions.get(key, id -> new SessionState(new ArrayList<>(), 5));
    }

    // 🎤 Generate Question
    public String generateQuestion(String resumeText, String role, String sessionId) {
        String context = getContextFromRAG(role, sessionId);

        SessionState state = getSessionState(sessionId);
        List<String> askedQuestions = new ArrayList<>(state.questions());
        int score = state.lastScore();

        String difficulty;
        if (score <= 4)
            difficulty = "easy";
        else if (score <= 7)
            difficulty = "medium";
        else
            difficulty = "hard";

        String prompt = "DIFFICULTY LEVEL: " + difficulty + "\n\n" +
                "STRICT RULES:\n" +
                "If EASY:\n" +
                "- ONLY ask basic definition questions\n" +
                "- DO NOT ask project questions\n\n" +
                "If MEDIUM:\n" +
                "- Ask practical experience questions\n\n" +
                "If HARD:\n" +
                "- Ask deep technical/system design questions\n\n" +
                "Resume Context:\n" + context + "\n\n" +
                "Previous Questions:\n" + String.join("\n", askedQuestions) + "\n\n" +
                "Generate ONE question. Max 12 words.";

        String question = aiService.askAI(prompt, "openai/gpt-3.5-turbo");

        askedQuestions.add(question);
        sessions.put(sessionId != null ? sessionId : "default",
                new SessionState(askedQuestions, score));

        return question;
    }

    public String generateQuestion(String resumeText, String role) {
        return generateQuestion(resumeText, role, "default");
    }

    // 🧪 Evaluate Answer
    public InterviewFeedback evaluateAnswer(String answer, String question, String role, String sessionId) {

        String context = getContextFromRAG(question, sessionId);

        String prompt = "You are an AI Interviewer.\n\n" +
                "Context:\n" + context + "\n\n" +
                "Question: " + sanitizeInput(question) + "\n" +
                "Answer: " + sanitizeInput(answer) + "\n\n" +
                "Give:\n" +
                "1. Score out of 10\n" +
                "2. Strengths\n" +
                "3. Improvements\n" +
                "4. Better Answer";

        String feedback = aiService.askAI(prompt);

        int score = extractScore(feedback);
        setLastScore(sessionId, score);

        String userId = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : null;

        InterviewHistory history = new InterviewHistory(
                role, question, answer, feedback, score, sessionId, userId);

        repository.save(history);

        return new InterviewFeedback(feedback, score);
    }

    public record InterviewFeedback(String feedback, int score) {
    }

    private String sanitizeInput(String input) {
        if (input == null)
            return "";

        String cleaned = input.replaceAll(
                "(?i)(ignore|forget|disregard)\\s+(all\\s+)?(prior|previous|above)",
                "[removed]");

        return cleaned.substring(0, Math.min(cleaned.length(), 8000));
    }

    // ✅ FIXED (NO HARDCODED URL)
    public void sendResumeToRAG(String resumeText, String sessionId) {
        try {
            String url = ragServiceUrl + "/embed";

            Map<String, String> req = Map.of(
                    "text", sanitizeInput(resumeText),
                    "session_id", sessionId != null ? sessionId : "");

            restTemplate.postForObject(url, req, String.class);

        } catch (Exception e) {
            log.error("RAG embed failed for session {}", sessionId, e);
        }
    }

    // 📊 ANALYSIS
    public Map<String, Object> analyzePerformance(String sessionId) {
        List<InterviewHistory> all = repository.findBySessionId(sessionId);

        Map<String, List<Integer>> topicScores = new HashMap<>();

        for (InterviewHistory item : all) {
            String topic = detectTopic(item.getQuestion());
            topicScores.putIfAbsent(topic, new ArrayList<>());
            topicScores.get(topic).add(item.getScore());
        }

        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();
        List<String> improving = new ArrayList<>();

        for (Map.Entry<String, List<Integer>> entry : topicScores.entrySet()) {

            List<Integer> scores = entry.getValue();
            int size = scores.size();

            double recentAvg = scores.subList(Math.max(0, size - 3), size)
                    .stream()
                    .mapToInt(i -> i)
                    .average()
                    .orElse(0.0);

            if (recentAvg >= 7.0)
                strengths.add(entry.getKey());
            else if (recentAvg >= 5.0)
                improving.add(entry.getKey());
            else
                weaknesses.add(entry.getKey());
        }

        return Map.of(
                "strengths", strengths,
                "improving", improving,
                "weaknesses", weaknesses);
    }

    private String detectTopic(String question) {
        question = question.toLowerCase();

        if (question.contains("react") || question.contains("frontend"))
            return "Frontend (React)";
        if (question.contains("spring") || question.contains("java"))
            return "Backend (Spring Boot)";
        if (question.contains("database") || question.contains("sql") || question.contains("mongodb"))
            return "Database";
        if (question.contains("system") || question.contains("design"))
            return "System Design";

        return "General";
    }

    // ✅ FIXED (NO HARDCODED URL)
    private String getContextFromRAG(String query, String sessionId) {
        try {
            String url = ragServiceUrl + "/query";

            Map<String, String> req = Map.of(
                    "query", query,
                    "session_id", sessionId != null ? sessionId : "");

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(req),
                    new ParameterizedTypeReference<>() {
                    });

            Map<String, Object> body = response.getBody();
            if (body == null)
                return "";

            Object docsObj = body.get("documents");
            if (!(docsObj instanceof List<?>))
                return "";

            @SuppressWarnings("unchecked")
            List<String> docs = (List<String>) docsObj;

            return String.join("\n", docs);

        } catch (Exception e) {
            log.error("RAG query failed for session {}", sessionId, e);
            return "";
        }
    }

    private int extractScore(String feedback) {
        try {
            Pattern pattern = Pattern.compile("(\\d+)\\s*(/|out of)\\s*10");
            java.util.regex.Matcher matcher = pattern.matcher(feedback);

            if (matcher.find()) {
                int score = Integer.parseInt(matcher.group(1));
                return Math.max(0, Math.min(score, 10));
            }

            return 0;

        } catch (Exception e) {
            log.error("Failed to extract score", e);
            return 0;
        }
    }

}
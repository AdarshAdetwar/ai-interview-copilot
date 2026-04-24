package ai_interview_copilot.service;

import org.springframework.stereotype.Service;

@Service
public class MatchService {

    private final AiService aiService;

    public MatchService(AiService aiService) {
        this.aiService = aiService;
    }

    public String matchResume(String resume, String jd) {
        String safeResume = sanitizeInput(resume);
        String safeJd = sanitizeInput(jd);

        String prompt = "You are an expert recruiter.\n\n"
        + "Compare the resume and job description.\n\n"
        + "Return STRICTLY in this format:\n\n"
        + "Match Percentage: <number>%\n\n"
        + "Missing Skills:\n- skill1\n- skill2\n\n"
        + "Suggestions:\n- suggestion1\n- suggestion2\n\n"
        + "Resume:\n" + safeResume + "\n\n"
        + "Job Description:\n" + safeJd;

        return aiService.askAI(prompt);
    }

    private String sanitizeInput(String input) {
        if (input == null) {
            return "";
        }
        String cleaned = input.replaceAll("(?i)(ignore|forget|disregard)\\s+(all\\s+)?(prior|previous|above)", "[removed]");
        return cleaned.substring(0, Math.min(cleaned.length(), 8000));
    }
}
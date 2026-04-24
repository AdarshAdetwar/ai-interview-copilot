package ai_interview_copilot.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private final String API_URL = "https://openrouter.ai/api/v1/chat/completions";

    @Value("${openrouter.api.key}")
    private String API_KEY;

    @Value("${app.openrouter.referer:http://localhost:9090}")
    private String apiReferer;

    private final RestTemplate restTemplate;

    @Autowired
    public AiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String askAI(String question) {
        return askAI(question, "openai/gpt-4o-mini");
    }

    public String askAI(String question, String model) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + API_KEY);
            
            // ✅ FIXED: Correct Referer header (without HTTP- prefix)
            headers.set("Referer", apiReferer);
            headers.set("X-Title", "AI Interview Copilot");

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);
            body.put("max_tokens", 800);      // Prevent very long responses
            body.put("temperature", 0.7);

            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", question);
            messages.add(userMsg);
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.POST,
                    request,
                    new ParameterizedTypeReference<>() {}
            );

            Map<String, Object> bodyMap = response.getBody();
            if (bodyMap == null) return "Error: No response from AI";

            Object choicesObj = bodyMap.get("choices");
            if (!(choicesObj instanceof List<?> rawChoices) || rawChoices.isEmpty()) {
                return "Error: Invalid AI response";
            }

            Map<?, ?> choice = (Map<?, ?>) rawChoices.get(0);
            Map<?, ?> message = (Map<?, ?>) choice.get("message");
            Object content = message != null ? message.get("content") : null;

            return content != null ? content.toString().trim() : "Error: Empty AI response";

        } catch (Exception e) {
            log.error("AI request failed for model {}: {}", model, e.getMessage(), e);
            return "Sorry, I couldn't process your request right now. Please try again.";
        }
    }
}
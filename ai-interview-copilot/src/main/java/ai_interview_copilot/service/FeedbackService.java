package ai_interview_copilot.service;

import org.springframework.stereotype.Service;

@Service
public class FeedbackService {

    private final AiService aiService;

    public FeedbackService(AiService aiService) {
        this.aiService = aiService;
    }

    public String evaluateAnswer(String question, String answer) {

        String prompt = "You are an expert technical interviewer.\n\n"
                + "Evaluate the candidate's answer.\n\n"
                + "Return STRICTLY in this format:\n\n"
                + "Score: <x>/10\n\n"
                + "Improvements:\n- point1\n- point2\n\n"
                + "Better Answer:\n<improved answer>\n\n"
                + "Question: " + question + "\n\n"
                + "Answer: " + answer;

        return aiService.askAI(prompt);
    }
}
package ai_interview_copilot.dto;

import jakarta.validation.constraints.NotBlank;

public class AiRequest {
    @NotBlank(message = "Question is required")
    private String question;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
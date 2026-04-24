package ai_interview_copilot.dto;

import jakarta.validation.constraints.NotBlank;

public class InterviewRequest {

    @NotBlank(message = "Resume text is required")
    private String resumeText;

    @NotBlank(message = "Role is required")
    private String role;

    private String sessionId;
    private Integer score;

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}
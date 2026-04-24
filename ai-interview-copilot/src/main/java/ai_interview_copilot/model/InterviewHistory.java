package ai_interview_copilot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "interview_history")
public class InterviewHistory {

    @Id
    private String id;
    private String role;
    private String question;
    private String answer;
    private String feedback;
    private int score;
    private LocalDateTime createdAt;
    private String sessionId;
    private String userId;

    public InterviewHistory() {}

    // Original constructor (kept for any existing callers)
    public InterviewHistory(String role, String question, String answer,
            String feedback, int score) {
        this.role = role;
        this.question = question;
        this.answer = answer;
        this.feedback = feedback;
        this.score = score;
        this.createdAt = LocalDateTime.now();
    }

    // ✅ FIX: sessionId added to constructor — callers can't forget to set it
    public InterviewHistory(String role, String question, String answer,
            String feedback, int score, String sessionId) {
        this.role = role;
        this.question = question;
        this.answer = answer;
        this.feedback = feedback;
        this.score = score;
        this.sessionId = sessionId;
        this.createdAt = LocalDateTime.now();
    }

    public InterviewHistory(String role, String question, String answer,
            String feedback, int score, String sessionId, String userId) {
        this.role = role;
        this.question = question;
        this.answer = answer;
        this.feedback = feedback;
        this.score = score;
        this.sessionId = sessionId;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }

    // getters & setters
    public String getId()               { return id; }
    public String getRole()             { return role; }
    public void setRole(String role)    { this.role = role; }
    public String getQuestion()         { return question; }
    public void setQuestion(String q)   { this.question = q; }
    public String getAnswer()           { return answer; }
    public void setAnswer(String a)     { this.answer = a; }
    public String getFeedback()         { return feedback; }
    public void setFeedback(String f)   { this.feedback = f; }
    public int getScore()               { return score; }
    public void setScore(int score)     { this.score = score; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime t) { this.createdAt = t; }
    public String getSessionId()        { return sessionId; }
    public void setSessionId(String s)  { this.sessionId = s; }
    public String getUserId()           { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
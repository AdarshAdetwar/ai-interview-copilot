package ai_interview_copilot.controller;

import ai_interview_copilot.dto.ApiResponse;
import ai_interview_copilot.dto.FeedbackRequest;
import ai_interview_copilot.dto.InterviewRequest;
import ai_interview_copilot.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/interview")
@Validated
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    // ✅ Standardized response wrapper for all interview endpoints
    @PostMapping("/start")
    public ResponseEntity<ApiResponse<Map<String, String>>> startInterview(
            @Valid @RequestBody InterviewRequest request) {

        String role = request.getRole();
        String resumeText = request.getResumeText();
        String sessionId = request.getSessionId();
        Integer score = request.getScore();

        if (sessionId == null) {
            sessionId = UUID.randomUUID().toString();
            interviewService.resetSession(sessionId);
            interviewService.sendResumeToRAG(resumeText, sessionId);
        }

        if (score != null) {
            interviewService.setLastScore(sessionId, score);
        }

        String question = interviewService.generateQuestion(resumeText, role, sessionId);

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "question", question,
                "sessionId", sessionId
        )));
    }

    @PostMapping({"/feedback", "/evaluate"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> giveFeedback(
            @Valid @RequestBody FeedbackRequest request) {

        InterviewService.InterviewFeedback result = interviewService.evaluateAnswer(
                request.getAnswer(),
                request.getQuestion(),
                request.getRole(),
                request.getSessionId()
        );

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "feedback", result.feedback(),
                "score", result.score()
        )));
    }

    @GetMapping("/analysis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalysis(@RequestParam String sessionId) {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.analyzePerformance(sessionId)));
    }
}
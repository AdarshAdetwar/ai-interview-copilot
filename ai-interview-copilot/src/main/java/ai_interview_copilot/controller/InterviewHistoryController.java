package ai_interview_copilot.controller;

import ai_interview_copilot.dto.ApiResponse;
import ai_interview_copilot.model.InterviewHistory;
import ai_interview_copilot.repository.InterviewHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

// ✅ FIX: @CrossOrigin removed — SecurityConfig already defines CORS globally for all routes.
//         Keeping it here would cause a CORS error on just this endpoint if the origin
//         ever changes in SecurityConfig and this annotation is forgotten.
@RestController
@RequestMapping("/history")
public class InterviewHistoryController {

    @Autowired
    private InterviewHistoryRepository repository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getHistory() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<InterviewHistory> list =
            repository.findByUserIdOrderByCreatedAtDesc(userId);

        List<Map<String, Object>> response = new ArrayList<>();
        for (InterviewHistory h : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("role",      h.getRole());
            map.put("question",  h.getQuestion());
            map.put("answer",    h.getAnswer());
            map.put("feedback",  h.getFeedback());
            map.put("score",     h.getScore());
            map.put("createdAt", h.getCreatedAt());
            map.put("sessionId", h.getSessionId());
            response.add(map);
        }
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
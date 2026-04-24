package ai_interview_copilot.controller;

import ai_interview_copilot.dto.AiRequest;
import ai_interview_copilot.dto.ApiResponse;
import ai_interview_copilot.service.AiService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private AiService aiService; // ✅ Use the centralized service

    @PostMapping
    public ResponseEntity<ApiResponse<String>> chat(@Valid @RequestBody AiRequest body) {
        String userMessage = body.getQuestion();

        // ✅ Basic validation is already handled by @Valid and AiRequest
        String aiResponse = aiService.askAI(userMessage);
        return ResponseEntity.ok(ApiResponse.ok(aiResponse));
    }
}
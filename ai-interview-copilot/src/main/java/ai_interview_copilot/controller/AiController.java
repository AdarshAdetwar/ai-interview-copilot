package ai_interview_copilot.controller;

import ai_interview_copilot.dto.AiRequest;
import ai_interview_copilot.dto.ApiResponse;
import ai_interview_copilot.service.AiService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/ask")
    public ResponseEntity<ApiResponse<String>> ask(@Valid @RequestBody AiRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(aiService.askAI(request.getQuestion())));
    }
}
package ai_interview_copilot.controller;

import ai_interview_copilot.dto.ApiResponse;
import ai_interview_copilot.dto.MatchRequest;
import ai_interview_copilot.service.MatchService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/resume")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @PostMapping("/match")
    public ResponseEntity<ApiResponse<String>> match(@Valid @RequestBody MatchRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(matchService.matchResume(
                request.getResumeText(),
                request.getJobDescription()
        )));
    }
}
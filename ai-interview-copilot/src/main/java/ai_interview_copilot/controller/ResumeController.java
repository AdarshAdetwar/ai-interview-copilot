package ai_interview_copilot.controller;

import ai_interview_copilot.dto.ApiResponse;
import ai_interview_copilot.service.ResumeService;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@RestController
@RequestMapping("/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    // Tika for magic-byte MIME detection — getContentType() is client-controlled and can be spoofed
    private final Tika tika = new Tika();

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<String>> analyze(@RequestParam("file") MultipartFile file) {
        try {
            String detectedType = tika.detect(file.getInputStream());
            if (!"application/pdf".equals(detectedType)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PDF files are allowed");
            }
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not read file");
        }

        return ResponseEntity.ok(ApiResponse.ok(resumeService.analyzeResume(file)));
    }

    // BUG #10 FIX: Removed the dead empty private sendResumeToRAG() method.
    // It was never called and contained only a stale comment. Leaving dead code
    // like this causes confusion about where RAG embedding actually happens
    // (it is handled in InterviewController with a sessionId).
}
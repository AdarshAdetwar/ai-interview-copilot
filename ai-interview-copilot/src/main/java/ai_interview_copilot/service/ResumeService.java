package ai_interview_copilot.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

@Service
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);

    private final AiService aiService;

    // ✅ Injecting AiService to follow the "Don't Repeat Yourself" (DRY) principle
    public ResumeService(AiService aiService) {
        this.aiService = aiService;
    }

    public String analyzeResume(MultipartFile file) {
        // ✅ FIX 07: Try-with-resources ensures the document is CLOSED automatically
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            String sanitized = sanitizeInput(text);
            
            // ✅ Clean prompt construction
            String prompt = String.format(
                "You are an expert career coach. Analyze the following resume and provide: " +
                "1. Strengths (bullet points) 2. Weaknesses (bullet points) " +
                "3. Missing skills (bullet points) 4. Suggestions to improve. \n\n Resume Content: %s", 
                sanitized
            );

            // ✅ Delegates the actual AI call to your centralized AiService
            return aiService.askAI(prompt);

        } catch (Exception e) {
            log.error("Error processing resume", e);
            return "Error processing resume: " + e.getMessage();
        }
    }

    private String sanitizeInput(String input) {
        if (input == null) {
            return "";
        }
        String cleaned = input.replaceAll("(?i)(ignore|forget|disregard)\\s+(all\\s+)?(prior|previous|above)", "[removed]");
        return cleaned.substring(0, Math.min(cleaned.length(), 8000));
    }
}
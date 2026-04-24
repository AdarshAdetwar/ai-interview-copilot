package ai_interview_copilot.config;

import ai_interview_copilot.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Handle API errors like login/register failures
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Object>> handleResponseStatus(ResponseStatusException ex) {
        String msg = ex.getReason() != null ? ex.getReason() : ex.getMessage();
        return ResponseEntity.status(ex.getStatusCode())
                .body(ApiResponse.error(msg));
    }

    // Handle validation errors (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        if (msg.isEmpty()) msg = "Validation failed";

        return ResponseEntity.badRequest()
                .body(ApiResponse.error(msg));
    }

    // Handle bad input
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArg(IllegalArgumentException ex) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(ex.getMessage()));
    }

    // Catch-all error handler
    @ExceptionHandler(Exception.class)
public ResponseEntity<ApiResponse<Object>> handleGeneric(Exception ex,jakarta.servlet.http.HttpServletRequest request) {

    String path = request.getRequestURI();

    // ✅ Let actuator endpoints behave normally
    if (path.startsWith("/actuator")) {
        throw new RuntimeException(ex);
    }

    log.error("Unhandled exception at {}: {}", path, ex.getMessage(), ex);

    return ResponseEntity.status(500)
            .body(ApiResponse.error("Internal server error"));
}
}
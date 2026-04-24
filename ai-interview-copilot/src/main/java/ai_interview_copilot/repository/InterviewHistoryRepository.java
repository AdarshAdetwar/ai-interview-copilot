package ai_interview_copilot.repository;

import ai_interview_copilot.model.InterviewHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface InterviewHistoryRepository
        extends MongoRepository<InterviewHistory, String> {

    // 🔥 ADD THIS LINE
    List<InterviewHistory> findBySessionId(String sessionId);

    // 🔥 Filter history by authenticated user
    List<InterviewHistory> findByUserIdOrderByCreatedAtDesc(String userId);
}
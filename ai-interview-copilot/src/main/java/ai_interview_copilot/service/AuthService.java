package ai_interview_copilot.service;

import ai_interview_copilot.config.JwtUtil;
import ai_interview_copilot.dto.LoginRequest;
import ai_interview_copilot.dto.RegisterRequest;
import ai_interview_copilot.model.User;
import ai_interview_copilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String register(RegisterRequest request) {
        // ✅ 1. Throw actual HTTP Error 409 if user exists (Fixes BUG-03)
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
        }
        
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        
        // ✅ 2. Pass the 'name' from the request to the User model (Fixes BUG-10)
        User user = new User(request.getName(), request.getEmail(), hashedPassword);
        
        userRepository.save(user);
        return "User registered successfully";
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        
        // ✅ 3. Throw 401 Unauthorized for bad credentials (Fixes BUG-03)
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return jwtUtil.generateToken(user.getId());
    }
}
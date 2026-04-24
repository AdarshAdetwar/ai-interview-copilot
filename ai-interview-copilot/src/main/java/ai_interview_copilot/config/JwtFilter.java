package ai_interview_copilot.config;

import ai_interview_copilot.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String userId = jwtUtil.extractSubject(token);

                if (userId != null
                        && SecurityContextHolder.getContext().getAuthentication() == null
                        && userRepository.existsById(userId)) {

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    userId,
                                    null,
                                    List.of(new SimpleGrantedAuthority("ROLE_USER"))
                            );
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
                // BUG #2 FIX: Removed the else block that returned 401 here.
                // If the token is present but invalid/expired, we simply don't set
                // authentication and let Spring Security's authorization rules handle it.
                // This prevents public routes from receiving an unexpected 401.

            } catch (Exception e) {
                // Token is malformed — clear any partial auth, then fall through.
                // Spring Security will enforce route-level authorization downstream.
                SecurityContextHolder.clearContext();
            }
        }

        // Always continue the filter chain — Spring Security decides authorization.
        filterChain.doFilter(request, response);
    }
}
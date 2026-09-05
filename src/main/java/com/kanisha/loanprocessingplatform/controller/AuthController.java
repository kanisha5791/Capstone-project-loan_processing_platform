package com.kanisha.loanprocessingplatform.controller;
import com.kanisha.loanprocessingplatform.entity.LoginHistory;
import com.kanisha.loanprocessingplatform.entity.User;
import com.kanisha.loanprocessingplatform.respository.LoginHistoryRepository;
import com.kanisha.loanprocessingplatform.service.AuthService;
import com.kanisha.loanprocessingplatform.service.JwtService;
import com.kanisha.loanprocessingplatform.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
})
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private LoginHistoryRepository loginHistoryRepository;


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        User user = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        // =========================
        // SAVE LOGIN HISTORY
        // =========================

        LoginHistory loginHistory = new LoginHistory(
                user.getEmail(),
                LocalDateTime.now(),
                "SUCCESS"
        );

        loginHistoryRepository.save(loginHistory);


        // =========================
        // GENERATE JWT TOKEN
        // =========================
        emailService.sendLoginEmail(
                user.getEmail(),
                java.time.LocalDateTime.now().toString()
        );
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );


        // =========================
        // LOGIN RESPONSE
        // =========================

        return ResponseEntity.ok(
                new LoginResponse(
                        token,
                        user.getEmail(),
                        user.getRole()
                )
        );
    }


    // =========================
    // CUSTOMER REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        String password = request.getPassword();
        if (!password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%]).{8,}$")) {
            return ResponseEntity.badRequest()
                    .body("Password must be at least 8 characters and contain uppercase, lowercase, number and special character");
        }

        try {
            User user = authService.registerUser(
                    request.getEmail(),
                    request.getPassword(),
                    "CUSTOMER"
            );

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // LOGIN REQUEST
    // =========================

    public static class LoginRequest {

        private String email;

        private String password;


        public String getEmail() {
            return email;
        }


        public void setEmail(String email) {
            this.email = email;
        }


        public String getPassword() {
            return password;
        }


        public void setPassword(String password) {
            this.password = password;
        }
    }


    // =========================
    // LOGIN RESPONSE
    // =========================

    public static class LoginResponse {

        private String token;

        private String email;

        private String role;


        public LoginResponse(
                String token,
                String email,
                String role) {

            this.token = token;

            this.email = email;

            this.role = role;
        }


        public String getToken() {
            return token;
        }


        public String getEmail() {
            return email;
        }


        public String getRole() {
            return role;
        }
    }


    // =========================
    // REGISTER REQUEST
    // =========================

    public static class RegisterRequest {

        private String email;

        private String password;


        public String getEmail() {
            return email;
        }


        public void setEmail(String email) {
            this.email = email;
        }


        public String getPassword() {
            return password;
        }


        public void setPassword(String password) {
            this.password = password;
        }
    }
}
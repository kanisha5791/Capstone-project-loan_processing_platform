package com.kanisha.loanprocessingplatform.controller;
import com.kanisha.loanprocessingplatform.entity.LoginHistory;
import com.kanisha.loanprocessingplatform.entity.User;
import com.kanisha.loanprocessingplatform.respository.LoginHistoryRepository;
import com.kanisha.loanprocessingplatform.service.AuthService;
import com.kanisha.loanprocessingplatform.service.JwtService;
import com.kanisha.loanprocessingplatform.service.EmailService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

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
            @RequestBody @Valid LoginRequest request) {

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
        // SEND LOGIN EMAIL
        // =========================

       //emailService.sendLoginEmail(
             // user.getEmail(),
               // LocalDateTime.now().toString()
       // );


        // =========================
        // GENERATE JWT TOKEN
        // =========================

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
            @RequestBody @Valid RegisterRequest request) {

        try {

            User user = authService.registerUser(
                    request.getEmail(),
                    request.getPassword(),
                    "CUSTOMER"
            );
            System.out.println("SIGNUP SUCCESS = [" + user.getEmail() + "]");
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

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        private String email;


        @NotBlank(message = "Password is required")
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

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        private String email;


        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%]).{8,}$",
                message = "Password must contain uppercase, lowercase, number and special character"
        )
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
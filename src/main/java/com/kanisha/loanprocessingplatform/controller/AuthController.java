package com.kanisha.loanprocessingplatform.controller;

import com.kanisha.loanprocessingplatform.entity.LoginHistory;
import com.kanisha.loanprocessingplatform.entity.PendingRegistration;
import com.kanisha.loanprocessingplatform.entity.User;
import com.kanisha.loanprocessingplatform.respository.LoginHistoryRepository;
import com.kanisha.loanprocessingplatform.respository.PendingRegistrationRepository;
import com.kanisha.loanprocessingplatform.respository.UserRepository;
import com.kanisha.loanprocessingplatform.service.AuthService;
import com.kanisha.loanprocessingplatform.service.EmailService;
import com.kanisha.loanprocessingplatform.service.JwtService;
import com.kanisha.loanprocessingplatform.service.OtpService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private OtpService otpService;

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    @Autowired
    private PendingRegistrationRepository pendingRegistrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


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
        System.out.println("FIRST LOGIN = " + user.isFirstLogin());
        // First login -> Send OTP
        if (user.isFirstLogin()) {

            String otp = otpService.generateOtp(
                    user.getEmail(),
                    "LOGIN"
            );

            emailService.sendOtpEmail(
                    user.getEmail(),
                    otp
            );

            LoginHistory loginHistory =
                    new LoginHistory(
                            user.getEmail(),
                            LocalDateTime.now(),
                            "OTP_SENT"
                    );

            loginHistoryRepository.save(loginHistory);

            return ResponseEntity.ok(
                    new OtpResponse(
                            "OTP sent successfully",
                            user.getEmail()
                    )
            );
        }

        // Normal login -> Direct
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        LoginHistory loginHistory =
                new LoginHistory(
                        user.getEmail(),
                        LocalDateTime.now(),
                        "SUCCESS"
                );

        loginHistoryRepository.save(loginHistory);

        return ResponseEntity.ok(
                new LoginResponse(
                        token,
                        user.getEmail(),
                        user.getRole()
                )
        );
    }
    // =========================
    // VERIFY LOGIN OTP
    // =========================

    @PostMapping("/verify-login-otp")
    public ResponseEntity<?> verifyLoginOtp(
            @RequestBody @Valid VerifyOtpRequest request) {

        boolean valid = otpService.verifyOtp(
                request.getEmail(),
                request.getOtp(),
                "LOGIN"
        );

        if (!valid) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid or expired OTP");
        }

        User user = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        // FIRST LOGIN COMPLETED
        user.setFirstLogin(false);
        userRepository.save(user);

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        LoginHistory loginHistory =
                new LoginHistory(
                        user.getEmail(),
                        LocalDateTime.now(),
                        "SUCCESS"
                );

        loginHistoryRepository.save(loginHistory);

        return ResponseEntity.ok(
                new LoginResponse(
                        token,
                        user.getEmail(),
                        user.getRole()
                )
        );
    }

    // =========================
    // RESEND LOGIN OTP
    // =========================

    @PostMapping("/resend-login-otp")
    public ResponseEntity<?> resendLoginOtp(
            @RequestBody @Valid EmailRequest request) {

        User user = authService.findUserByEmail(
                request.getEmail()
        );

        if (user == null) {
            return ResponseEntity
                    .status(404)
                    .body("Email not registered");
        }

        String otp = otpService.generateOtp(
                user.getEmail(),
                "LOGIN"
        );

        emailService.sendOtpEmail(
                user.getEmail(),
                otp
        );

        return ResponseEntity.ok(
                new OtpResponse(
                        "New OTP sent successfully",
                        user.getEmail()
                )
        );
    }


    // =========================
    // FORGOT PASSWORD
    // =========================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody @Valid EmailRequest request) {

        User user = authService.findUserByEmail(
                request.getEmail()
        );

        if (user == null) {
            return ResponseEntity
                    .status(404)
                    .body("Email not registered");
        }

        String otp = otpService.generateOtp(
                user.getEmail(),
                "FORGOT_PASSWORD"
        );

        emailService.sendForgotPasswordOtpEmail(
                user.getEmail(),
                otp
        );

        return ResponseEntity.ok(
                new OtpResponse(
                        "Password reset OTP sent successfully",
                        user.getEmail()
                )
        );
    }


    // =========================
    // VERIFY FORGOT PASSWORD OTP
    // =========================

    @PostMapping("/verify-forgot-password-otp")
    public ResponseEntity<?> verifyForgotPasswordOtp(
            @RequestBody @Valid VerifyForgotOtpRequest request) {

        boolean valid = otpService.verifyOtp(
                request.getEmail(),
                request.getOtp(),
                "FORGOT_PASSWORD"
        );

        if (!valid) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid or expired OTP");
        }

        return ResponseEntity.ok(
                "OTP verified successfully"
        );
    }


    // =========================
    // RESET PASSWORD
    // =========================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody @Valid ResetPasswordRequest request) {

        if (!request.getNewPassword().equals(
                request.getConfirmPassword())) {

            return ResponseEntity
                    .badRequest()
                    .body("Passwords do not match");
        }

        User user = authService.findUserByEmail(
                request.getEmail()
        );

        if (user == null) {
            return ResponseEntity
                    .status(404)
                    .body("Email not registered");
        }

        boolean otpValid = otpService.markOtpAsUsed(
                request.getEmail(),
                request.getOtp(),
                "FORGOT_PASSWORD"
        );

        if (!otpValid) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid or expired OTP");
        }

        authService.resetPassword(
                request.getEmail(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(
                "Password reset successfully"
        );
    }


    // ==================================================
    // REGISTER - SEND OTP
    // ==================================================
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody @Valid RegisterRequest request) {

        try {

            // Check whether email already has an account
            User existingUser =
                    authService.findUserByEmail(
                            request.getEmail()
                    );

            if (existingUser != null) {

                return ResponseEntity
                        .badRequest()
                        .body("Email already exists");
            }


            // Check whether this email already has
            // a pending registration
            PendingRegistration pending =
                    pendingRegistrationRepository
                            .findByEmail(
                                    request.getEmail()
                            )
                            .orElse(null);


            // Encrypt password before storing temporarily
            String encodedPassword =
                    passwordEncoder.encode(
                            request.getPassword()
                    );


            if (pending != null) {

                // Update existing pending registration

                pending.setPassword(
                        encodedPassword
                );

                pending.setRole("CUSTOMER");

                pendingRegistrationRepository.save(
                        pending
                );

            } else {

                // Create new pending registration

                PendingRegistration newPending =
                        new PendingRegistration(
                                request.getEmail(),
                                encodedPassword,
                                "CUSTOMER"
                        );

                pendingRegistrationRepository.save(
                        newPending
                );
            }


            // Generate registration OTP
            String otp = otpService.generateOtp(
                    request.getEmail(),
                    "REGISTER"
            );


            // Send OTP to customer
            emailService.sendRegistrationOtpEmail(
                    request.getEmail(),
                    otp
            );


            return ResponseEntity.ok(
                    new OtpResponse(
                            "Registration OTP sent successfully",
                            request.getEmail()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    // ==================================================
    // VERIFY REGISTER OTP
    // ==================================================

    @PostMapping("/verify-register-otp")
    public ResponseEntity<?> verifyRegisterOtp(
            @RequestBody @Valid VerifyRegisterOtpRequest request) {

        try {

            // Find pending registration
            PendingRegistration pending =
                    pendingRegistrationRepository
                            .findByEmail(
                                    request.getEmail()
                            )
                            .orElse(null);


            if (pending == null) {

                return ResponseEntity
                        .status(404)
                        .body(
                                "Registration request not found"
                        );
            }


            // Verify and consume OTP
            boolean otpValid =
                    otpService.markOtpAsUsed(
                            request.getEmail(),
                            request.getOtp(),
                            "REGISTER"
                    );


            if (!otpValid) {

                return ResponseEntity
                        .status(401)
                        .body(
                                "Invalid or expired OTP"
                        );
            }


            // Double-check that account was not created
            User existingUser =
                    authService.findUserByEmail(
                            request.getEmail()
                    );

            if (existingUser != null) {

                pendingRegistrationRepository.delete(
                        pending
                );

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Email already exists"
                        );
            }


            // Create actual customer account
            User user = new User(
                    pending.getEmail(),
                    pending.getPassword(),
                    pending.getRole()
            );

            userRepository.save(user);


            // Remove temporary registration
            pendingRegistrationRepository.delete(
                    pending
            );


            // Send success email to customer
            emailService.sendRegistrationSuccessEmail(
                    user.getEmail()
            );


            // Send notification to admin
            String adminEmail = "YOUR_ADMIN_GMAIL@gmail.com";

            if (adminEmail != null &&
                    !adminEmail.isBlank()) {

                emailService.sendNewCustomerAdminEmail(
                        adminEmail,
                        user.getEmail()
                );
            }


            return ResponseEntity.ok(
                    "Customer registered successfully"
            );

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
    // VERIFY LOGIN OTP REQUEST
    // =========================

    public static class VerifyOtpRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        private String email;

        @NotBlank(message = "OTP is required")
        @Pattern(
                regexp = "\\d{6}",
                message = "OTP must be 6 digits"
        )
        private String otp;

        @NotBlank(message = "Password is required")
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }


    // =========================
    // EMAIL REQUEST
    // =========================

    public static class EmailRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        private String email;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }


    // =========================
    // FORGOT OTP REQUEST
    // =========================

    public static class VerifyForgotOtpRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        private String email;

        @NotBlank(message = "OTP is required")
        @Pattern(
                regexp = "\\d{6}",
                message = "OTP must be 6 digits"
        )
        private String otp;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }


    // =========================
    // RESET PASSWORD REQUEST
    // =========================

    public static class ResetPasswordRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        private String email;

        @NotBlank(message = "OTP is required")
        @Pattern(
                regexp = "\\d{6}",
                message = "OTP must be 6 digits"
        )
        private String otp;

        @NotBlank(message = "New password is required")
        @Size(
                min = 8,
                message = "Password must be at least 8 characters"
        )
        @Pattern(
                regexp =
                        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%]).{8,}$",
                message =
                        "Password must contain uppercase, lowercase, number and special character"
        )
        private String newPassword;

        @NotBlank(message = "Confirm password is required")
        private String confirmPassword;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }

        public String getConfirmPassword() {
            return confirmPassword;
        }

        public void setConfirmPassword(String confirmPassword) {
            this.confirmPassword = confirmPassword;
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
        @Size(
                min = 8,
                message = "Password must be at least 8 characters"
        )
        @Pattern(
                regexp =
                        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%]).{8,}$",
                message =
                        "Password must contain uppercase, lowercase, number and special character"
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


    // =========================
    // VERIFY REGISTER OTP REQUEST
    // =========================

    public static class VerifyRegisterOtpRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        private String email;

        @NotBlank(message = "OTP is required")
        @Pattern(
                regexp = "\\d{6}",
                message = "OTP must be 6 digits"
        )
        private String otp;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }


    // =========================
    // OTP RESPONSE
    // =========================

    public static class OtpResponse {

        private String message;
        private String email;

        public OtpResponse(
                String message,
                String email) {

            this.message = message;
            this.email = email;
        }

        public String getMessage() {
            return message;
        }

        public String getEmail() {
            return email;
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
    @PostMapping("/admin-reset-password")
    public ResponseEntity<?> adminResetPassword() {

        authService.resetPassword(
                "admin@gmail.com",
                "Admin@123"
        );

        return ResponseEntity.ok(
                "Admin password reset successfully"
        );
    }
}
package com.kanisha.loanprocessingplatform.service;

import com.kanisha.loanprocessingplatform.entity.OtpVerification;
import com.kanisha.loanprocessingplatform.respository.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpVerificationRepository otpRepository;

    private final Random random = new Random();


    // =========================
    // GENERATE OTP
    // =========================

    public String generateOtp(
            String email,
            String purpose) {

        // Generate 6-digit OTP
        String otp = String.format(
                "%06d",
                random.nextInt(1000000)
        );

        // Invalidate previous OTP
        otpRepository
                .findTopByEmailAndPurposeAndUsedFalseOrderByIdDesc(
                        email,
                        purpose
                )
                .ifPresent(oldOtp -> {
                    oldOtp.setUsed(true);
                    otpRepository.save(oldOtp);
                });

        // OTP valid for 1 minute
        LocalDateTime expiryTime =
                LocalDateTime.now().plusMinutes(1);

        OtpVerification otpVerification =
                new OtpVerification(
                        email,
                        otp,
                        expiryTime,
                        purpose,
                        false
                );

        otpRepository.save(otpVerification);

        return otp;
    }


    // =========================
    // VERIFY OTP
    // =========================

    public boolean verifyOtp(
            String email,
            String otp,
            String purpose) {

        OtpVerification otpVerification =
                otpRepository
                        .findTopByEmailAndPurposeAndUsedFalseOrderByIdDesc(
                                email,
                                purpose
                        )
                        .orElse(null);

        if (otpVerification == null) {
            return false;
        }

        // Check OTP expiry
        if (LocalDateTime.now()
                .isAfter(otpVerification.getExpiryTime())) {

            return false;
        }

        // Check OTP value
        if (!otpVerification.getOtp().equals(otp)) {
            return false;
        }

        /*
         * LOGIN OTP:
         * Mark as used immediately after successful verification.
         *
         * FORGOT_PASSWORD OTP:
         * Do NOT mark as used yet.
         * It will be marked as used after password reset.
         */

        if ("LOGIN".equals(purpose)) {

            otpVerification.setUsed(true);
            otpRepository.save(otpVerification);
        }

        return true;
    }


    // =========================
    // MARK OTP AS USED
    // =========================

    public boolean markOtpAsUsed(
            String email,
            String otp,
            String purpose) {

        OtpVerification otpVerification =
                otpRepository
                        .findTopByEmailAndPurposeAndUsedFalseOrderByIdDesc(
                                email,
                                purpose
                        )
                        .orElse(null);

        if (otpVerification == null) {
            return false;
        }

        if (LocalDateTime.now()
                .isAfter(otpVerification.getExpiryTime())) {

            return false;
        }

        if (!otpVerification.getOtp().equals(otp)) {
            return false;
        }

        otpVerification.setUsed(true);
        otpRepository.save(otpVerification);

        return true;
    }
}
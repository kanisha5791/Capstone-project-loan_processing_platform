package com.kanisha.loanprocessingplatform.respository;

import com.kanisha.loanprocessingplatform.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findTopByEmailAndPurposeAndUsedFalseOrderByIdDesc(
            String email,
            String purpose
    );
}
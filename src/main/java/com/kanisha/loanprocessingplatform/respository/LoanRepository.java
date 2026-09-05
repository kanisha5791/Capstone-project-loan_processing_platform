package com.kanisha.loanprocessingplatform.respository;

import com.kanisha.loanprocessingplatform.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    // Search by customer name
    List<Loan> findByCustomerNameContainingIgnoreCase(String customerName);

    // Customer login using Loan ID + Phone
    Optional<Loan> findByIdAndPhone(Long id, String phone);

    // Find customer loans using email
    List<Loan> findByEmail(String email);
}
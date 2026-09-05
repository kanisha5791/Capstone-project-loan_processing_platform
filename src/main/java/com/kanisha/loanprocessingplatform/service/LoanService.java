package com.kanisha.loanprocessingplatform.service;

import com.kanisha.loanprocessingplatform.entity.Loan;
import com.kanisha.loanprocessingplatform.respository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    // =========================
    // GET ALL LOANS
    // =========================

    public Iterable<Loan> getAllLoans() {
        return loanRepository.findAll();
    }


    // =========================
    // GET CUSTOMER LOAN
    // USING ID + PHONE
    // =========================

    public Loan getLoanForCustomer(Long id, String phone) {

        return loanRepository
                .findByIdAndPhone(id, phone)
                .orElse(null);
    }


    // =========================
    // GET CUSTOMER LOANS
    // USING EMAIL
    // =========================

    public List<Loan> getLoansByEmail(String email) {

        return loanRepository.findByEmail(email);
    }


    // =========================
    // SUBMIT NEW LOAN
    // =========================

    public Loan saveLoan(Loan loan) {

        return loanRepository.save(loan);
    }


    // =========================
    // SEARCH LOANS
    // BY CUSTOMER NAME
    // =========================

    public List<Loan> searchLoans(String customerName) {

        return loanRepository
                .findByCustomerNameContainingIgnoreCase(customerName);
    }


    // =========================
    // UPDATE EXISTING LOAN
    // =========================

    public Loan updateLoan(Long id, Loan loan) {

        Loan existingLoan = loanRepository
                .findById(id)
                .orElse(null);

        if (existingLoan == null) {
            return null;
        }

        existingLoan.setCustomerName(
                loan.getCustomerName()
        );

        existingLoan.setEmail(
                loan.getEmail()
        );

        existingLoan.setPhone(
                loan.getPhone()
        );

        existingLoan.setLoanAmount(
                loan.getLoanAmount()
        );

        existingLoan.setLoanType(
                loan.getLoanType()
        );

        existingLoan.setLoanTerm(
                loan.getLoanTerm()
        );

        existingLoan.setStatus(
                loan.getStatus()
        );

        return loanRepository.save(existingLoan);
    }


    // =========================
    // DELETE LOAN
    // =========================

    public boolean deleteLoan(Long id) {

        if (!loanRepository.existsById(id)) {
            return false;
        }

        loanRepository.deleteById(id);

        return true;
    }


    // =========================
    // UPDATE LOAN STATUS
    // =========================

    public Loan updateStatus(Long id, String status) {

        Loan loan = loanRepository
                .findById(id)
                .orElse(null);

        if (loan == null) {
            return null;
        }

        loan.setStatus(status);

        return loanRepository.save(loan);
    }
}
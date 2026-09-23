package com.kanisha.loanprocessingplatform.service;

import com.kanisha.loanprocessingplatform.entity.Loan;
import com.kanisha.loanprocessingplatform.respository.LoanRepository;
import com.kanisha.loanprocessingplatform.respository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private DocumentRepository documentRepository;


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

        double income = loan.getMonthlyIncome();
        double asset = loan.getAssetValue();
        double loanAmount = loan.getLoanAmount();
        double existingEmi = loan.getExistingEmi();

        // =========================
        // ELIGIBILITY CHECK
        // =========================

        if (income >= 30000
                && asset >= loanAmount
                && existingEmi <= (income * 0.40)) {

            loan.setEligibilityStatus("Eligible");

        } else if (income < 20000
                || asset < (loanAmount * 0.50)
                || existingEmi > (income * 0.60)) {

            loan.setEligibilityStatus("Not Eligible");

        } else {

            loan.setEligibilityStatus("Review Required");
        }


        // =========================
        // DEFAULT LOAN STATUS
        // =========================

        if (loan.getStatus() == null
                || loan.getStatus().isEmpty()) {

            loan.setStatus("Pending");
        }


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


        // =========================
        // FINANCIAL DETAILS
        // =========================

        existingLoan.setMonthlyIncome(
                loan.getMonthlyIncome()
        );

        existingLoan.setAssetValue(
                loan.getAssetValue()
        );

        existingLoan.setExistingEmi(
                loan.getExistingEmi()
        );


        // =========================
        // RECALCULATE ELIGIBILITY
        // =========================

        double income = loan.getMonthlyIncome();
        double asset = loan.getAssetValue();
        double loanAmount = loan.getLoanAmount();
        double existingEmi = loan.getExistingEmi();


        if (income >= 30000
                && asset >= loanAmount
                && existingEmi <= (income * 0.40)) {

            existingLoan.setEligibilityStatus("Eligible");

        } else if (income < 20000
                || asset < (loanAmount * 0.50)
                || existingEmi > (income * 0.60)) {

            existingLoan.setEligibilityStatus("Not Eligible");

        } else {

            existingLoan.setEligibilityStatus("Review Required");
        }


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


        // =========================
        // APPROVAL CHECK
        // =========================

        if ("Approved".equalsIgnoreCase(status)) {


            // Eligibility must be Eligible
            if (!"Eligible".equalsIgnoreCase(
                    loan.getEligibilityStatus())) {

                throw new RuntimeException(
                        "Loan cannot be approved because eligibility is not Eligible"
                );
            }


            // =========================
            // DOCUMENT VERIFICATION
            // =========================

            long verifiedDocuments =
                    documentRepository
                            .findByCustomerEmail(
                                    loan.getEmail()
                            )
                            .stream()
                            .filter(document ->
                                    "Verified".equalsIgnoreCase(
                                            document.getStatus()
                                    )
                            )
                            .count();


            // All 4 documents must be verified
            if (verifiedDocuments < 4) {

                throw new RuntimeException(
                        "Loan cannot be approved until all 4 documents are verified"
                );
            }
        }


        // =========================
        // UPDATE STATUS
        // =========================

        loan.setStatus(status);

        Loan updatedLoan =
                loanRepository.save(loan);


        // =========================
        // SEND EMAIL
        // =========================

        if ("Approved".equalsIgnoreCase(status)) {

            emailService.sendLoanApprovedEmail(
                    updatedLoan.getEmail(),
                    updatedLoan.getCustomerName(),
                    updatedLoan.getLoanType(),
                    updatedLoan.getLoanAmount()
            );

        } else if ("Rejected".equalsIgnoreCase(status)) {

            emailService.sendLoanRejectedEmail(
                    updatedLoan.getEmail(),
                    updatedLoan.getCustomerName(),
                    updatedLoan.getLoanType(),
                    updatedLoan.getLoanAmount()
            );
        }


        return updatedLoan;
    }
}
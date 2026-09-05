package com.kanisha.loanprocessingplatform.controller;

import com.kanisha.loanprocessingplatform.entity.Loan;
import com.kanisha.loanprocessingplatform.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loan")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174","http://localhost:5175"})
public class LoanController {

    @Autowired
    private LoanService loanService;


    // =========================
    // GET ALL LOANS - ADMIN
    // =========================

    @GetMapping
    public Iterable<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }


    // =========================
    // GET CUSTOMER LOAN
    // OLD METHOD - ID + PHONE
    // =========================

    @GetMapping("/customer/{id}")
    public ResponseEntity<Loan> getCustomerLoan(
            @PathVariable Long id,
            @RequestParam String phone) {

        Loan loan = loanService.getLoanForCustomer(id, phone);

        if (loan == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(loan);
    }


    // =========================
    // GET CUSTOMER LOANS
    // USING EMAIL
    // =========================

    @GetMapping("/customer/email")
    public ResponseEntity<List<Loan>> getCustomerLoansByEmail(
            @RequestParam String email) {

        List<Loan> loans =
                loanService.getLoansByEmail(email);

        return ResponseEntity.ok(loans);
    }


    // =========================
    // SEARCH LOANS
    // =========================

    @GetMapping("/search")
    public List<Loan> searchLoans(
            @RequestParam String customerName) {

        return loanService.searchLoans(customerName);
    }


    // =========================
    // SUBMIT NEW LOAN
    // =========================

    @PostMapping
    public Loan createLoan(
            @RequestBody Loan loan) {

        return loanService.saveLoan(loan);
    }


    // =========================
    // EDIT LOAN
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<Loan> updateLoan(
            @PathVariable Long id,
            @RequestBody Loan loan) {

        Loan updatedLoan =
                loanService.updateLoan(id, loan);

        if (updatedLoan == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedLoan);
    }


    // =========================
    // DELETE LOAN
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(
            @PathVariable Long id) {

        boolean deleted =
                loanService.deleteLoan(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }


    // =========================
    // UPDATE LOAN STATUS
    // =========================

    @PutMapping("/{id}/status")
    public ResponseEntity<Loan> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Loan updatedLoan =
                loanService.updateStatus(id, status);

        if (updatedLoan == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedLoan);
    }
}
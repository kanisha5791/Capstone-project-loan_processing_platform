package com.kanisha.loanprocessingplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    // =========================
    // LOGIN SUCCESS EMAIL
    // =========================

    public void sendLoginEmail(
            String to,
            String time) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
                "Login Successful"
        );

        message.setText(
                "Hello,\n\n" +
                        "You have successfully logged in " +
                        "to the Loan Processing Platform.\n\n" +
                        "Login Time: " + time + "\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }


    // =========================
    // LOGIN OTP EMAIL
    // =========================

    public void sendOtpEmail(
            String to,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
                "Your Loan Platform OTP"
        );

        message.setText(
                "Hello,\n\n" +
                        "Your OTP for the Loan Processing Platform is:\n\n" +
                        otp + "\n\n" +
                        "This OTP is valid for 1 minute.\n\n" +
                        "Please do not share this OTP with anyone.\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }


    // =========================
    // FORGOT PASSWORD OTP
    // =========================

    public void sendForgotPasswordOtpEmail(
            String to,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
                "Password Reset OTP - Loan Platform"
        );

        message.setText(
                "Hello,\n\n" +
                        "We received a request to reset " +
                        "your password.\n\n" +
                        "Your password reset OTP is:\n\n" +
                        otp + "\n\n" +
                        "This OTP is valid for 1 minute.\n\n" +
                        "Please do not share this OTP with anyone.\n\n" +
                        "If you did not request a password reset, " +
                        "please ignore this email.\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }


    // =========================
    // REGISTRATION OTP EMAIL
    // =========================

    public void sendRegistrationOtpEmail(
            String to,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
                "Customer Registration OTP"
        );

        message.setText(
                "Hello,\n\n" +
                        "Thank you for registering " +
                        "with the Loan Processing Platform.\n\n" +
                        "Your registration OTP is:\n\n" +
                        otp + "\n\n" +
                        "This OTP is valid for 1 minute.\n\n" +
                        "Please do not share this OTP with anyone.\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }


    // =========================
    // REGISTRATION SUCCESS EMAIL
    // =========================

    public void sendRegistrationSuccessEmail(
            String to) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
                "Registration Successful"
        );

        message.setText(
                "Hello,\n\n" +
                        "Your customer account has been " +
                        "successfully created.\n\n" +
                        "You can now login to the " +
                        "Loan Processing Platform " +
                        "using your email and password.\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }


    // =========================
    // ADMIN - NEW CUSTOMER
    // =========================

    public void sendNewCustomerAdminEmail(
            String adminEmail,
            String customerEmail) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(adminEmail);

        message.setSubject(
                "New Customer Registered"
        );

        message.setText(
                "Hello Admin,\n\n" +
                        "A new customer has successfully " +
                        "registered on the Loan Processing Platform.\n\n" +
                        "Customer Email: " +
                        customerEmail + "\n\n" +
                        "Please check the admin dashboard " +
                        "for customer details.\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }


    // =========================
    // LOAN APPROVED EMAIL
    // =========================

    public void sendLoanApprovedEmail(
            String to,
            String customerName,
            String loanType,
            Double loanAmount) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
                "Loan Application Approved"
        );

        message.setText(
                "Hello " + customerName + ",\n\n" +
                        "Congratulations!\n\n" +
                        "Your loan application has been approved.\n\n" +
                        "Loan Type: " + loanType + "\n" +
                        "Loan Amount: ₹" + loanAmount + "\n\n" +
                        "You can login to the Loan Processing Platform " +
                        "to view your loan details.\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }


    // =========================
    // LOAN REJECTED EMAIL
    // =========================

    public void sendLoanRejectedEmail(
            String to,
            String customerName,
            String loanType,
            Double loanAmount) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
                "Loan Application Status"
        );

        message.setText(
                "Hello " + customerName + ",\n\n" +
                        "We regret to inform you that your loan application " +
                        "has been rejected.\n\n" +
                        "Loan Type: " + loanType + "\n" +
                        "Loan Amount: ₹" + loanAmount + "\n\n" +
                        "You can login to the Loan Processing Platform " +
                        "to view your loan status.\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }
}
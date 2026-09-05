package com.kanisha.loanprocessingplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendLoginEmail(String to, String time) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Login Successful");
        message.setText(
                "Hello,\n\n" +
                        "You have successfully logged in to the Loan Processing Platform.\n\n" +
                        "Login Time: " + time + "\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }
}
package com.kanisha.loanprocessingplatform.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_history")
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(name = "login_time")
    private LocalDateTime loginTime;

    @Column(nullable = false)
    private String status;

    public LoginHistory() {
    }

    public LoginHistory(
            String email,
            LocalDateTime loginTime,
            String status) {

        this.email = email;
        this.loginTime = loginTime;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(
            LocalDateTime loginTime) {

        this.loginTime = loginTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
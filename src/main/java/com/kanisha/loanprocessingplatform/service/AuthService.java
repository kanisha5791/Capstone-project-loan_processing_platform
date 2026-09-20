package com.kanisha.loanprocessingplatform.service;

import com.kanisha.loanprocessingplatform.entity.User;
import com.kanisha.loanprocessingplatform.respository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // =========================
    // CHECK EMAIL
    // =========================

    public boolean emailExists(String email) {

        return userRepository
                .findByEmail(email)
                .isPresent();
    }


    // =========================
    // REGISTER USER
    // =========================

    public User registerUser(
            String email,
            String password,
            String role) {

        if (userRepository.findByEmail(email).isPresent()) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        User user = new User(
                email,
                passwordEncoder.encode(password),
                role
        );

        return userRepository.save(user);
    }


    // =========================
    // LOGIN
    // =========================

    public User login(
            String email,
            String password) {

        System.out.println(
                "LOGIN EMAIL = [" + email + "]"
        );

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {

            System.out.println("USER NOT FOUND");

            return null;
        }

        // Temporary check
        boolean passwordMatch =
                passwordEncoder.matches(
                        password,
                        user.getPassword()
                );

        System.out.println(
                "PASSWORD MATCH = " + passwordMatch
        );

        if (!passwordMatch) {

            return null;
        }

        return user;
    }


    // =========================
    // FIND USER BY EMAIL
    // =========================

    public User findUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElse(null);
    }


    // =========================
    // RESET PASSWORD
    // =========================

    public void resetPassword(
            String email,
            String newPassword) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {

            throw new RuntimeException(
                    "Email not registered"
            );
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);
    }
}
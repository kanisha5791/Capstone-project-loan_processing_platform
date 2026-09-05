package com.kanisha.loanprocessingplatform.service;

import com.kanisha.loanprocessingplatform.entity.User;
import com.kanisha.loanprocessingplatform.respository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginSuccess() {

        User user = new User(
                "test@gmail.com",
                "encodedPassword",
                "CUSTOMER"
        );

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("Password@123", "encodedPassword"))
                .thenReturn(true);

        User result = authService.login(
                "test@gmail.com",
                "Password@123"
        );

        assertNotNull(result);
        assertEquals("test@gmail.com", result.getEmail());
        assertEquals("CUSTOMER", result.getRole());
    }
    @Test
    void loginWrongPassword() {

        User user = new User(
                "test@gmail.com",
                "encodedPassword",
                "CUSTOMER"
        );

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("WrongPassword", "encodedPassword"))
                .thenReturn(false);

        User result = authService.login(
                "test@gmail.com",
                "WrongPassword"
        );

        assertNull(result);
    }
    @Test
    void registerUserSuccess() {

        User user = new User(
                "newuser@gmail.com",
                "encodedPassword",
                "CUSTOMER"
        );

        when(userRepository.findByEmail("newuser@gmail.com"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("Password@123"))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        User result = authService.registerUser(
                "newuser@gmail.com",
                "Password@123",
                "CUSTOMER"
        );

        assertNotNull(result);
        assertEquals("newuser@gmail.com", result.getEmail());
        assertEquals("CUSTOMER", result.getRole());
    }
    @Test
    void registerUserDuplicateEmail() {

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(new User(
                        "test@gmail.com",
                        "encodedPassword",
                        "CUSTOMER"
                )));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.registerUser(
                        "test@gmail.com",
                        "Password@123",
                        "CUSTOMER"
                )
        );

        assertEquals("Email already exists", exception.getMessage());
    }
}
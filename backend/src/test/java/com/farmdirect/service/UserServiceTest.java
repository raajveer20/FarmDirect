package com.farmdirect.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.farmdirect.model.User;
import com.farmdirect.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    void registerUserEncodesPasswordAndSavesUser() {
        when(userRepository.existsByEmail("farmer@example.com")).thenReturn(false);
        when(passwordEncoder.encode("plain-password")).thenReturn("encoded-password");
        User savedUser = new User("farmer@example.com", "encoded-password", "Farmer", "FARMER");
        when(userRepository.save(org.mockito.ArgumentMatchers.any(User.class))).thenReturn(savedUser);

        User result = userService.registerUser("Farmer", "farmer@example.com", "plain-password", "FARMER");

        assertEquals(savedUser, result);
        verify(passwordEncoder).encode("plain-password");
        verify(userRepository).save(org.mockito.ArgumentMatchers.argThat(user ->
            user.getEmail().equals("farmer@example.com")
                && user.getFullName().equals("Farmer")
                && user.getRole().equals("FARMER")
                && user.getPassword().equals("encoded-password")));
    }

    @Test
    void registerUserRejectsDuplicateEmail() {
        when(userRepository.existsByEmail("farmer@example.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () ->
            userService.registerUser("Farmer", "farmer@example.com", "plain-password", "FARMER"));
    }

    @Test
    void loadUserByUsernameReturnsStoredCredentialsAndRole() {
        User user = new User("buyer@example.com", "encoded-password", "Buyer", "BUYER");
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        var details = userService.loadUserByUsername(user.getEmail());

        assertEquals(user.getEmail(), details.getUsername());
        assertEquals(user.getPassword(), details.getPassword());
        assertEquals("BUYER", details.getAuthorities().iterator().next().getAuthority());
    }

    @Test
    void loadUserByUsernameRejectsUnknownEmail() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () ->
            userService.loadUserByUsername("missing@example.com"));
    }
}

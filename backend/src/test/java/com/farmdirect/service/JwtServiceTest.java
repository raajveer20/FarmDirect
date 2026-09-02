package com.farmdirect.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.farmdirect.model.User;
import java.lang.reflect.Field;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtServiceTest {
    private JwtService jwtService;

    @BeforeEach
    void setUp() throws Exception {
        jwtService = new JwtService();
        setField("secret", "farmdirect-test-secret-key-that-is-long-enough");
        setField("expirationMs", 60_000L);
    }

    @Test
    void generateTokenIncludesUserAndRoleClaims() {
        User user = new User("farmer@example.com", "encoded", "Farmer", "FARMER");

        String token = jwtService.generateToken(user);

        assertEquals("farmer@example.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, user));
    }

    @Test
    void tokenIsInvalidForAnotherUser() {
        User owner = new User("owner@example.com", "encoded", "Owner", "BUYER");
        User anotherUser = new User("other@example.com", "encoded", "Other", "BUYER");

        String token = jwtService.generateToken(owner);

        assertFalse(jwtService.isTokenValid(token, anotherUser));
    }

    private void setField(String name, Object value) throws Exception {
        Field field = JwtService.class.getDeclaredField(name);
        field.setAccessible(true);
        field.set(jwtService, value);
    }
}

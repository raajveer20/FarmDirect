package com.farmdirect.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.farmdirect.model.OtpRecord;
import com.farmdirect.repository.OtpRecordRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OtpServiceTest {
    @Mock
    private OtpRecordRepository otpRecordRepository;

    private OtpService otpService;

    @BeforeEach
    void setUp() {
        otpService = new OtpService(otpRecordRepository);
    }

    @Test
    void generateOtpCreatesRecordWhenEmailHasNoExistingOtp() {
        when(otpRecordRepository.findByEmail("user@example.com")).thenReturn(Optional.empty());

        String otp = otpService.generateOtp("user@example.com");

        org.junit.jupiter.api.Assertions.assertEquals(6, otp.length());
        org.junit.jupiter.api.Assertions.assertTrue(otp.chars().allMatch(Character::isDigit));
        verify(otpRecordRepository).save(org.mockito.ArgumentMatchers.argThat(record ->
            record.getEmail().equals("user@example.com") && record.getOtp().equals(otp)));
    }

    @Test
    void validateOtpAcceptsMatchingUnexpiredOtp() {
        OtpRecord record = new OtpRecord("user@example.com", "123456", LocalDateTime.now().minusMinutes(4));
        when(otpRecordRepository.findByEmail(record.getEmail())).thenReturn(Optional.of(record));

        assertTrue(otpService.validateOtp(record.getEmail(), "123456"));
    }

    @Test
    void validateOtpRejectsMissingWrongAndExpiredOtp() {
        when(otpRecordRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        assertFalse(otpService.validateOtp("missing@example.com", "123456"));

        OtpRecord wrongCode = new OtpRecord("user@example.com", "123456", LocalDateTime.now());
        when(otpRecordRepository.findByEmail("user@example.com")).thenReturn(Optional.of(wrongCode));
        assertFalse(otpService.validateOtp("user@example.com", "000000"));

        OtpRecord expired = new OtpRecord("expired@example.com", "123456", LocalDateTime.now().minusMinutes(6));
        when(otpRecordRepository.findByEmail("expired@example.com")).thenReturn(Optional.of(expired));
        assertFalse(otpService.validateOtp("expired@example.com", "123456"));
    }
}

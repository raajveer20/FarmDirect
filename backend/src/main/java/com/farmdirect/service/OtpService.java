package com.farmdirect.service;

import com.farmdirect.model.OtpRecord;
import com.farmdirect.repository.OtpRecordRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import org.springframework.stereotype.Service;

@Service
public class OtpService {
    private final OtpRecordRepository otpRecordRepository;

    public OtpService(OtpRecordRepository otpRecordRepository) {
        this.otpRecordRepository = otpRecordRepository;
    }

    public String generateOtp(String identifier) {
        String otp = String.format("%06d", new Random().nextInt(1000000));
        Optional<OtpRecord> existing = otpRecordRepository.findByEmail(identifier);
        if (existing.isPresent()) {
            OtpRecord record = existing.get();
            record.setOtp(otp);
            record.setCreatedAt(LocalDateTime.now());
            otpRecordRepository.save(record); 
            return otp;
        }
        OtpRecord record = new OtpRecord(identifier, otp, LocalDateTime.now());
        otpRecordRepository.save(record);
        return otp;
    }

    public boolean validateOtp(String identifier, String otp) {
        if (identifier == null || otp == null || otp.isBlank()) {
            return false;
        }

        Optional<OtpRecord> record = otpRecordRepository.findByEmail(identifier);
        if (record.isEmpty()) {
            return false;
        }

        if (!record.get().getOtp().equals(otp.trim())) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now();
        return !record.get().getCreatedAt().plusMinutes(5).isBefore(now);
    }
}

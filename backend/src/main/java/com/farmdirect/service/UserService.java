package com.farmdirect.service;

import com.farmdirect.dto.FarmerVerificationRequest;
import com.farmdirect.dto.RegisterRequest;
import com.farmdirect.model.User;
import com.farmdirect.repository.UserRepository;
import java.util.Optional;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String fullName, String email, String rawPassword, String role) {
        RegisterRequest req = new RegisterRequest();
        req.setName(fullName);
        req.setEmail(email);
        req.setPassword(rawPassword);
        req.setRole(role);
        return registerUser(req);
    }

    public User registerUser(RegisterRequest req) {
        String email = req.getEmail();
        if (email == null || email.isBlank()) {
            email = (req.getPhoneNumber() != null ? req.getPhoneNumber().replaceAll("[^0-9]", "") : "user" + System.currentTimeMillis()) + "@farmdirect.in";
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email/phone already exists. Please login.");
        }

        User user = new User();
        user.setFullName(req.getName() != null && !req.getName().isBlank() ? req.getName() : "FarmDirect User");
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(req.getPassword() != null ? req.getPassword() : "Farmer@123"));
        user.setRole(req.getRole() != null ? req.getRole().toUpperCase() : "FARMER");
        user.setPhoneNumber(req.getPhoneNumber());
        user.setLocation(req.getLocation());

        // Farmer specifics
        if (req.getVerificationMethod() != null) {
            user.setVerificationMethod(req.getVerificationMethod());
            user.setVerificationDocNumber(req.getVerificationDocNumber());
            user.setVerificationStatus("PENDING_REVIEW");
        } else {
            user.setVerificationStatus("UNVERIFIED");
        }
        user.setLandSizeAcres(req.getLandSizeAcres());
        user.setPrimaryCrops(req.getPrimaryCrops());
        user.setFpoName(req.getFpoName());
        user.setBankUpiId(req.getBankUpiId());

        // Buyer specifics
        user.setBuyerType(req.getBuyerType());
        user.setBusinessName(req.getBusinessName());
        user.setGstin(req.getGstin());

        // Logistics specifics
        user.setVehicleType(req.getVehicleType());
        user.setVehicleRcNumber(req.getVehicleRcNumber());
        user.setVehicleCapacityTons(req.getVehicleCapacityTons());

        return userRepository.save(user);
    }

    public User registerOrLoginWithOtp(String identifier, String role, String name) {
        String email = identifier.contains("@") ? identifier : identifier.replaceAll("[^0-9]", "") + "@farmdirect.in";
        Optional<User> existing = userRepository.findByEmail(email);

        if (existing.isPresent()) {
            return existing.get();
        }

        User user = new User();
        user.setFullName(name != null && !name.isBlank() ? name : "Farmer (" + identifier + ")");
        user.setEmail(email);
        user.setPhoneNumber(identifier.contains("@") ? null : identifier);
        user.setPassword(passwordEncoder.encode("OTP_USER_" + System.currentTimeMillis()));
        user.setRole(role != null ? role.toUpperCase() : "FARMER");
        user.setVerificationStatus("UNVERIFIED");
        return userRepository.save(user);
    }

    public User updateFarmerVerification(String email, FarmerVerificationRequest req) {
        User user = findByEmail(email);
        user.setVerificationMethod(req.getVerificationMethod());
        user.setVerificationDocNumber(req.getVerificationDocNumber());
        user.setLandSizeAcres(req.getLandSizeAcres());
        user.setPrimaryCrops(req.getPrimaryCrops());
        user.setFpoName(req.getFpoName());
        user.setBankUpiId(req.getBankUpiId());
        if (req.getLocation() != null) {
            user.setLocation(req.getLocation());
        }
        user.setVerificationStatus("VERIFIED_FARMER"); // Automatically grant verified badge for demo / verification
        return userRepository.save(user);
    }

    public Optional<User> findByEmailOptional(String email) {
        return userRepository.findByEmail(email);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            java.util.List.of(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}

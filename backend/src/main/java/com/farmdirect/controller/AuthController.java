package com.farmdirect.controller;

import com.farmdirect.dto.AuthResponse;
import com.farmdirect.dto.FarmerVerificationRequest;
import com.farmdirect.dto.LoginRequest;
import com.farmdirect.dto.RegisterRequest;
import com.farmdirect.dto.SendOtpRequest;
import com.farmdirect.dto.UserDto;
import com.farmdirect.dto.VerifyOtpRequest;
import com.farmdirect.model.User;
import com.farmdirect.service.JwtService;
import com.farmdirect.service.OtpService;
import com.farmdirect.service.UserService;
import java.security.Principal;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserService userService, JwtService jwtService, OtpService otpService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(Map.of(
                "token", token,
                "user", UserDto.fromEntity(user),
                "message", "Account registered successfully"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            User user = userService.findByEmail(request.getEmail());
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(Map.of(
                "token", token,
                "user", UserDto.fromEntity(user),
                "message", "Logged in successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password credentials"));
        }
    }

    @PostMapping("/otp/send")
    public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest request) {
        if (request.getIdentifier() == null || request.getIdentifier().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mobile number or email is required"));
        }

        String otp = otpService.generateOtp(request.getIdentifier().trim());
        // In production, trigger SMS gateway (Twilio / MSG91) here.
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "OTP sent successfully to " + request.getIdentifier(),
            "demoOtp", otp // Included for seamless testing & demonstration
        ));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        if (request.getIdentifier() == null || request.getOtp() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Identifier and OTP are required"));
        }

        boolean isValid = otpService.validateOtp(request.getIdentifier().trim(), request.getOtp().trim());
        if (!isValid) {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid or expired OTP. (Try 123456)"));
        }

        User user = userService.registerOrLoginWithOtp(
            request.getIdentifier().trim(),
            request.getRole() != null ? request.getRole() : "FARMER",
            request.getName()
        );

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", UserDto.fromEntity(user),
            "message", "OTP verified successfully"
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        User user = userService.findByEmail(principal.getName());
        return ResponseEntity.ok(UserDto.fromEntity(user));
    }

    @PostMapping("/verify-farmer")
    public ResponseEntity<?> verifyFarmer(@RequestBody FarmerVerificationRequest request, Principal principal) {
        String email = principal != null ? principal.getName() : null;
        if (email == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Please authenticate first"));
        }
        User updated = userService.updateFarmerVerification(email, request);
        return ResponseEntity.ok(Map.of(
            "user", UserDto.fromEntity(updated),
            "message", "Farmer profile verified successfully with " + request.getVerificationMethod()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}

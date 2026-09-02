package com.farmdirect.dto;

public class SendOtpRequest {
    private String identifier; // Mobile phone or email
    private String role;       // FARMER, BUYER, LOGISTICS, ADMIN

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

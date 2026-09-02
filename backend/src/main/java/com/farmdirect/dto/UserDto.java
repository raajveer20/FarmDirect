package com.farmdirect.dto;

import com.farmdirect.model.User;

public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String phoneNumber;
    private String location;
    private String verificationStatus;
    private String verificationMethod;
    private String verificationDocNumber;
    private Double landSizeAcres;
    private String primaryCrops;
    private String fpoName;
    private String bankUpiId;
    private String buyerType;
    private String businessName;
    private String gstin;
    private String vehicleType;
    private String vehicleRcNumber;
    private Double vehicleCapacityTons;

    public UserDto() {}

    public static UserDto fromEntity(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setLocation(user.getLocation());
        dto.setVerificationStatus(user.getVerificationStatus());
        dto.setVerificationMethod(user.getVerificationMethod());
        dto.setVerificationDocNumber(user.getVerificationDocNumber());
        dto.setLandSizeAcres(user.getLandSizeAcres());
        dto.setPrimaryCrops(user.getPrimaryCrops());
        dto.setFpoName(user.getFpoName());
        dto.setBankUpiId(user.getBankUpiId());
        dto.setBuyerType(user.getBuyerType());
        dto.setBusinessName(user.getBusinessName());
        dto.setGstin(user.getGstin());
        dto.setVehicleType(user.getVehicleType());
        dto.setVehicleRcNumber(user.getVehicleRcNumber());
        dto.setVehicleCapacityTons(user.getVehicleCapacityTons());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getVerificationMethod() {
        return verificationMethod;
    }

    public void setVerificationMethod(String verificationMethod) {
        this.verificationMethod = verificationMethod;
    }

    public String getVerificationDocNumber() {
        return verificationDocNumber;
    }

    public void setVerificationDocNumber(String verificationDocNumber) {
        this.verificationDocNumber = verificationDocNumber;
    }

    public Double getLandSizeAcres() {
        return landSizeAcres;
    }

    public void setLandSizeAcres(Double landSizeAcres) {
        this.landSizeAcres = landSizeAcres;
    }

    public String getPrimaryCrops() {
        return primaryCrops;
    }

    public void setPrimaryCrops(String primaryCrops) {
        this.primaryCrops = primaryCrops;
    }

    public String getFpoName() {
        return fpoName;
    }

    public void setFpoName(String fpoName) {
        this.fpoName = fpoName;
    }

    public String getBankUpiId() {
        return bankUpiId;
    }

    public void setBankUpiId(String bankUpiId) {
        this.bankUpiId = bankUpiId;
    }

    public String getBuyerType() {
        return buyerType;
    }

    public void setBuyerType(String buyerType) {
        this.buyerType = buyerType;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getVehicleRcNumber() {
        return vehicleRcNumber;
    }

    public void setVehicleRcNumber(String vehicleRcNumber) {
        this.vehicleRcNumber = vehicleRcNumber;
    }

    public Double getVehicleCapacityTons() {
        return vehicleCapacityTons;
    }

    public void setVehicleCapacityTons(Double vehicleCapacityTons) {
        this.vehicleCapacityTons = vehicleCapacityTons;
    }
}

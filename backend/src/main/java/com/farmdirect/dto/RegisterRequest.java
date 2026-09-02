package com.farmdirect.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role = "FARMER";
    private String phoneNumber;
    private String location;

    // Farmer specific fields
    private String verificationMethod;
    private String verificationDocNumber;
    private Double landSizeAcres;
    private String primaryCrops;
    private String fpoName;
    private String bankUpiId;

    // Buyer specific fields
    private String buyerType;
    private String businessName;
    private String gstin;

    // Logistics specific fields
    private String vehicleType;
    private String vehicleRcNumber;
    private Double vehicleCapacityTons;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

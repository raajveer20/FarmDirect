package com.farmdirect.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role = "FARMER"; // FARMER, BUYER, LOGISTICS, ADMIN

    @Column
    private String phoneNumber;

    @Column
    private String location; // Village / District / State

    // Farmer Profile & Verification Fields
    @Column
    private String verificationStatus = "UNVERIFIED"; // UNVERIFIED, PENDING_REVIEW, VERIFIED_FARMER, VERIFIED_FPO

    @Column
    private String verificationMethod; // PM_KISAN, KHASRA_RECORD, FPO_MEMBERSHIP, GEO_PHOTO

    @Column
    private String verificationDocNumber; // e.g. 12-digit Kisan ID, Khasra Survey No, or FPO ID

    @Column
    private Double landSizeAcres;

    @Column
    private String primaryCrops; // e.g. "Tomatoes, Onions, Wheat"

    @Column
    private String fpoName;

    @Column
    private String bankUpiId; // For direct escrow payouts

    // Buyer Profile Fields
    @Column
    private String buyerType; // RETAIL, B2B_WHOLESALE

    @Column
    private String businessName;

    @Column
    private String gstin;

    // Logistics Profile Fields
    @Column
    private String vehicleType; // PICKUP_1T, TRUCK_3T, REEFER_10T

    @Column
    private String vehicleRcNumber;

    @Column
    private Double vehicleCapacityTons;

    public User() {}

    public User(String email, String password, String fullName, String role) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

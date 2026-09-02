package com.farmdirect.dto;

public class FarmerVerificationRequest {
    private String verificationMethod; // PM_KISAN, KHASRA_RECORD, FPO_MEMBERSHIP, GEO_PHOTO
    private String verificationDocNumber;
    private Double landSizeAcres;
    private String primaryCrops;
    private String fpoName;
    private String bankUpiId;
    private String location;

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}

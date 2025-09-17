package handinhandstore.demo.model.enums;

public enum DonationStatus {
    PENDING,      // Donation has been calculated but not yet transferred
    TRANSFERRED,  // Donation has been transferred to the charity
    FAILED        // Donation transfer failed (will be retried)
}
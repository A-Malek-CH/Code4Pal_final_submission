package handinhandstore.demo.controller;

import handinhandstore.demo.model.entity.Donation;
import handinhandstore.demo.model.enums.DonationStatus;
import handinhandstore.demo.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Donation>> getDonationsByOrder(@PathVariable Long orderId) {
        List<Donation> donations = donationService.getDonationsByOrder(orderId);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Donation>> getDonationsBySeller(@PathVariable Long sellerId) {
        List<Donation> donations = donationService.getDonationsBySeller(sellerId);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<Donation>> getDonationsByBuyer(@PathVariable Long buyerId) {
        List<Donation> donations = donationService.getDonationsByBuyer(buyerId);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Donation>> getDonationsByStatus(@PathVariable DonationStatus status) {
        List<Donation> donations = donationService.getDonationsByStatus(status);
        return ResponseEntity.ok(donations);
    }

    @PatchMapping("/{donationId}/transfer")
    public ResponseEntity<?> markDonationAsTransferred(@PathVariable Long donationId) {
        try {
            Donation donation = donationService.markDonationAsTransferred(donationId);
            return ResponseEntity.ok(donation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating donation: " + e.getMessage());
        }
    }

    @PatchMapping("/{donationId}/fail")
    public ResponseEntity<?> markDonationAsFailed(@PathVariable Long donationId) {
        try {
            Donation donation = donationService.markDonationAsFailed(donationId);
            return ResponseEntity.ok(donation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating donation: " + e.getMessage());
        }
    }

    @PatchMapping("/order/{orderId}/transfer")
    public ResponseEntity<?> markOrderDonationsAsTransferred(@PathVariable Long orderId) {
        try {
            List<Donation> donations = donationService.markOrderDonationsAsTransferred(orderId);
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating donations: " + e.getMessage());
        }
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalDonations() {
        BigDecimal total = donationService.getTotalDonations();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/total/pending")
    public ResponseEntity<BigDecimal> getTotalPendingDonations() {
        BigDecimal total = donationService.getTotalPendingDonations();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/total/seller/{sellerId}")
    public ResponseEntity<BigDecimal> getTotalDonationsBySeller(@PathVariable Long sellerId) {
        BigDecimal total = donationService.getTotalDonationsBySeller(sellerId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/total/buyer/{buyerId}")
    public ResponseEntity<BigDecimal> getTotalDonationsByBuyer(@PathVariable Long buyerId) {
        BigDecimal total = donationService.getTotalDonationsByBuyer(buyerId);
        return ResponseEntity.ok(total);
    }
}
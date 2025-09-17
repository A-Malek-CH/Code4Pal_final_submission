package handinhandstore.demo.service;

import handinhandstore.demo.model.entity.Donation;
import handinhandstore.demo.model.entity.Order;
import handinhandstore.demo.model.entity.OrderItem;
import handinhandstore.demo.model.entity.User;
import handinhandstore.demo.model.enums.DonationStatus;
import handinhandstore.demo.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Transactional
    public List<Donation> createDonationsFromOrder(Order order) {
        List<Donation> donations = new ArrayList<>();
        
        for (OrderItem item : order.getItems()) {
            Donation donation = new Donation();
            
            // Calculate donation amount for this item
            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            BigDecimal itemDonation = itemTotal.multiply(item.getDonationPercentage())
                                              .divide(BigDecimal.valueOf(100));
            
            // Set donation details
            donation.setOrder(order);
            donation.setSeller(item.getProduct().getSeller());
            donation.setBuyer(order.getBuyer());
            donation.setAmount(itemDonation);
            donation.setPercentage(item.getDonationPercentage());
            donation.setCharityName("Default Charity");
            donation.setStatus(DonationStatus.PENDING);
            
            donations.add(donation);
        }
        
        return donationRepository.saveAll(donations);
    }

    @Transactional
    public Donation markDonationAsTransferred(Long donationId) {
        Optional<Donation> donationOptional = donationRepository.findById(donationId);
        if (!donationOptional.isPresent()) {
            throw new RuntimeException("Donation not found with ID: " + donationId);
        }
        
        Donation donation = donationOptional.get();
        donation.setStatus(DonationStatus.TRANSFERRED);
        donation.setTransferDate(LocalDateTime.now());
        
        return donationRepository.save(donation);
    }

    @Transactional
    public Donation markDonationAsFailed(Long donationId) {
        Optional<Donation> donationOptional = donationRepository.findById(donationId);
        if (!donationOptional.isPresent()) {
            throw new RuntimeException("Donation not found with ID: " + donationId);
        }
        
        Donation donation = donationOptional.get();
        donation.setStatus(DonationStatus.FAILED);
        
        return donationRepository.save(donation);
    }

    @Transactional
    public List<Donation> markOrderDonationsAsTransferred(Long orderId) {
        List<Donation> donations = donationRepository.findByOrderId(orderId);
        LocalDateTime now = LocalDateTime.now();
        
        for (Donation donation : donations) {
            donation.setStatus(DonationStatus.TRANSFERRED);
            donation.setTransferDate(now);
        }
        
        return donationRepository.saveAll(donations);
    }

    public List<Donation> getDonationsByOrder(Long orderId) {
        return donationRepository.findByOrderId(orderId);
    }

    public List<Donation> getDonationsBySeller(Long sellerId) {
        return donationRepository.findBySellerId(sellerId);
    }

    public List<Donation> getDonationsByBuyer(Long buyerId) {
        return donationRepository.findByBuyerId(buyerId);
    }

    public List<Donation> getDonationsByStatus(DonationStatus status) {
        return donationRepository.findByStatus(status);
    }

    public BigDecimal getTotalDonations() {
        List<Donation> allDonations = donationRepository.findAll();
        return allDonations.stream()
                .filter(d -> d.getStatus() == DonationStatus.TRANSFERRED)
                .map(Donation::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalPendingDonations() {
        List<Donation> pendingDonations = donationRepository.findByStatus(DonationStatus.PENDING);
        return pendingDonations.stream()
                .map(Donation::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalDonationsBySeller(Long sellerId) {
        List<Donation> sellerDonations = donationRepository.findBySellerId(sellerId);
        return sellerDonations.stream()
                .filter(d -> d.getStatus() == DonationStatus.TRANSFERRED)
                .map(Donation::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalDonationsByBuyer(Long buyerId) {
        List<Donation> buyerDonations = donationRepository.findByBuyerId(buyerId);
        return buyerDonations.stream()
                .filter(d -> d.getStatus() == DonationStatus.TRANSFERRED)
                .map(Donation::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
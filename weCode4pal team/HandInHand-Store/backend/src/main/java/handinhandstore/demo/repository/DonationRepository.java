package handinhandstore.demo.repository;

import handinhandstore.demo.model.entity.Donation;
import handinhandstore.demo.model.enums.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByOrderId(Long orderId);
    List<Donation> findBySellerId(Long sellerId);
    List<Donation> findByBuyerId(Long buyerId);
    List<Donation> findByStatus(DonationStatus status);
    List<Donation> findByCharityName(String charityName);
}
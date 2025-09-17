package handinhandstore.demo.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

import handinhandstore.demo.model.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{
   List<Product> findAllByOrderByDonationPercentageDesc(Pageable pageable);

   @Query("SELECT p FROM Product p WHERE p.id = :id")
   Optional<Product>  findById(@Param("id") Long id);

   @Query("SELECT p FROM Product p ORDER BY p.id DESC")
	List<Product> findAllProducts();

   List<Product> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

   List<Product> findByCategories_Id(Long categoryId);

   List<Product> findBySellerId(Long sellerId);
}

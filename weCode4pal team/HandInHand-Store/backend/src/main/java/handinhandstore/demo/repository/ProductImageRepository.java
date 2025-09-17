package handinhandstore.demo.repository;

import handinhandstore.demo.model.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    
}

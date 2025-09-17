package handinhandstore.demo.repository;

import handinhandstore.demo.model.entity.Category;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(String name);

   @Query("SELECT c FROM Category c WHERE c.id = :id")
   Optional<Category>  findById(@Param("id") Long id);
}

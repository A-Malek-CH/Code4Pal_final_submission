package handinhandstore.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import handinhandstore.demo.model.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User>  findById(@Param("id") Long id);

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.password = :password")
    Optional<User> findUserByEmailAndPassword(String email, String password);
    
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User>  findByEmail(@Param("email") String email);    
}



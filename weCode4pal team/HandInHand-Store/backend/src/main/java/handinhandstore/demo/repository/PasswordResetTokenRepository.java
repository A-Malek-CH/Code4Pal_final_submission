package handinhandstore.demo.repository;

import handinhandstore.demo.model.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByEmailAndCode(String email, String code);
    void deleteByEmail(String email);
}

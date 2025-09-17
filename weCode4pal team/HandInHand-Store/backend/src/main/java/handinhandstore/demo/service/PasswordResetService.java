package handinhandstore.demo.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import handinhandstore.demo.repository.PasswordResetTokenRepository;
import handinhandstore.demo.model.entity.PasswordResetToken;

@Service
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Transactional  // Ensures delete & save run inside a transaction
    public void createOrUpdateResetToken(String email, String code) {
        tokenRepository.deleteByEmail(email); // old tokens removed
        PasswordResetToken token = new PasswordResetToken(email, code, LocalDateTime.now().plusMinutes(1));
        tokenRepository.save(token);
    }
}

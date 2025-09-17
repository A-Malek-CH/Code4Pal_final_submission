package handinhandstore.demo.service;

import org.springframework.stereotype.Service;
import java.util.Optional;

import handinhandstore.demo.model.entity.User;
import handinhandstore.demo.repository.UserRepository;
import handinhandstore.demo.repository.PasswordResetTokenRepository;
import jakarta.transaction.Transactional;

@Service
public class AuthenticationService {
    private final UserRepository userRepo;
    private final PasswordResetTokenRepository tokenRepo;

    public AuthenticationService(UserRepository userRepo, PasswordResetTokenRepository tokenRepo) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
    }

    public User userRegisteration(User user) {
        return userRepo.save(user);
    }

    public User getById(Long id) {
        Optional<User> userOptional = userRepo.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("-------------------------------User found: " );
            return user;
        } else {
            System.out.println("-------------------------------User NOT found");
            return null; // or throw a custom exception
        }
    }

    public User login(String email, String password) {
        Optional<User> userOptional = userRepo.findUserByEmailAndPassword(email, password);
        return userOptional.orElse(null);
    }

    @Transactional
    public void updatePassword(String email, String newPassword) {
        Optional<User> optUser = userRepo.findByEmail(email);
        if (optUser.isPresent()) {
            User user = optUser.get();
            user.setPassword(newPassword);
            userRepo.save(user);
        }
        tokenRepo.deleteByEmail(email);
    }
}

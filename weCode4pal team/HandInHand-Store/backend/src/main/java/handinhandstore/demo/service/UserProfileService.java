package handinhandstore.demo.service;

import handinhandstore.demo.dto.ChangePasswordRequestDTO;
import handinhandstore.demo.dto.UpdateUserProfileRequestDTO;
import handinhandstore.demo.model.entity.Product;
import handinhandstore.demo.model.entity.User;
import handinhandstore.demo.repository.ProductRepository;
import handinhandstore.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public UserProfileService(UserRepository userRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public User updateUserProfile(Long userId, UpdateUserProfileRequestDTO dto) {
        // Fetch user or throw exception if not found
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        // Update fields (only if not null to allow partial updates)
        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getBio() != null) user.setBio(dto.getBio());

        // Update the updatedAt field manually (PreUpdate also works, but we ensure it here)
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }
    
    public void changePassword(Long userId, ChangePasswordRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Check current password matches (plain text comparison)
        if (!dto.getCurrentPassword().equals(user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // 2. Check new password & confirmation match
        if (!dto.getNewPassword().equals(dto.getConfirmNewPassword())) {
            throw new RuntimeException("New passwords do not match");
        }

        // 3. Update password
        user.setPassword(dto.getNewPassword());
        userRepository.save(user);
    }

    public List<Product> findBySellerId(Long userId){
        return productRepository.findBySellerId(userId);
    }
}

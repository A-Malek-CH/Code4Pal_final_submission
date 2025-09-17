package handinhandstore.demo.controller;

import handinhandstore.demo.dto.ChangePasswordRequestDTO;
import handinhandstore.demo.dto.UpdateUserProfileRequestDTO;
import handinhandstore.demo.model.entity.Product;
import handinhandstore.demo.model.entity.User;
import handinhandstore.demo.service.UserProfileImageService;
import handinhandstore.demo.service.UserProfileService;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @Autowired
    private UserProfileImageService userProfileImageService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PutMapping("/update-info/{id}")
    public ResponseEntity<User> updateUserProfile(
            @PathVariable Long id,
            @RequestBody UpdateUserProfileRequestDTO dto) {

        User updatedUser = userProfileService.updateUserProfile(id, dto);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/{userId}/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = userProfileImageService.uploadProfileImage(userId, file);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @PatchMapping("/{userId}/change-profile-image")
    public ResponseEntity<?> changeProfileImage(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile newFile) {
        try {
            String newImageUrl = userProfileImageService.changeProfileImage(userId, newFile);
            return ResponseEntity.ok(newImageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Change failed: " + e.getMessage());
        }
    }


    @DeleteMapping("/{userId}/delete-profile-image")
    public ResponseEntity<?> deleteProfileImage(@PathVariable Long userId) {
        try {
            userProfileImageService.deleteProfileImage(userId);
            return ResponseEntity.ok("Profile image deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Delete failed: " + e.getMessage());
        }
    }

    @PatchMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordRequestDTO dto) {
        try {
            userProfileService.changePassword(userId, dto);
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{userId}/products")
    public List<Product> getUserProducts(@PathVariable Long userId) {
        return userProfileService.findBySellerId(userId);
    }
    
}


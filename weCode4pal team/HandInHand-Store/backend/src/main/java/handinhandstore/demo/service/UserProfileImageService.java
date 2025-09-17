package handinhandstore.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import handinhandstore.demo.model.entity.User;
import handinhandstore.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class UserProfileImageService {

    private final Cloudinary cloudinary;
    private final UserRepository userRepository;

    public UserProfileImageService(Cloudinary cloudinary, UserRepository userRepository) {
        this.cloudinary = cloudinary;
        this.userRepository = userRepository;
    }

    public String uploadProfileImage(Long userId, MultipartFile file) throws IOException {
        // 1. Upload image to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", "users")); // saves under /users folder

        String imageUrl = uploadResult.get("secure_url").toString();

        // 2. Update user profileImageUrl
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);

        return imageUrl;
    }

    public String changeProfileImage(Long userId, MultipartFile newFile) throws IOException {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. If there is an old image from cloudinary, delete it
        if (user.getProfileImageUrl() != null) {
            String oldPublicId = extractPublicId(user.getProfileImageUrl());
            cloudinary.uploader().destroy(oldPublicId, ObjectUtils.emptyMap());
        }

        // 2. Upload the new image
        Map uploadResult = cloudinary.uploader().upload(newFile.getBytes(),
                ObjectUtils.asMap("folder", "users"));

        String newImageUrl = uploadResult.get("secure_url").toString();

        // 3. Update user
        user.setProfileImageUrl(newImageUrl);
        userRepository.save(user);

        return newImageUrl;
    }

    public void deleteProfileImage(Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getProfileImageUrl() == null) {
            throw new RuntimeException("No profile image to delete");
        }

        // Extract public_id from the URL to delete from Cloudinary
        String imageUrl = user.getProfileImageUrl();
        String publicId = extractPublicId(imageUrl);

        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

        // Remove image reference from user
        user.setProfileImageUrl(null);
        userRepository.save(user);
    }

    private String extractPublicId(String imageUrl) {
        // Example URL: https://res.cloudinary.com/demo/image/upload/v123456789/users/abc123.jpg
        // We need: users/abc123 (without extension)
        String[] parts = imageUrl.split("/");
        String lastPart = parts[parts.length - 1]; // abc123.jpg
        String fileNameWithoutExtension = lastPart.substring(0, lastPart.lastIndexOf('.'));
        return "users/" + fileNameWithoutExtension;
    }

}

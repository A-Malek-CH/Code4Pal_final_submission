package handinhandstore.demo.controller;

import handinhandstore.demo.model.entity.Product;
import handinhandstore.demo.model.entity.ProductImage;
import handinhandstore.demo.repository.ProductRepository;
import handinhandstore.demo.repository.ProductImageRepository;
import handinhandstore.demo.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @PostMapping("/products/{productId}/upload-image")
    public ResponseEntity<?> uploadProductImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file) {

        try {
            // Upload image to Cloudinary
            String imageUrl = productImageService.uploadImage(file);

            // Find product
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Save ProductImage
            ProductImage productImage = new ProductImage();
            productImage.setProduct(product);
            productImage.setImageUrl(imageUrl);

            productImageRepository.save(productImage);

            return ResponseEntity.ok(productImage);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}

package handinhandstore.demo.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Set;
import java.util.Collections; // Add this import at the top

import handinhandstore.demo.service.ProductService;
import handinhandstore.demo.dto.ProductRequest;
import handinhandstore.demo.dto.ProductUpdateRequest;
import handinhandstore.demo.model.entity.Product;
import handinhandstore.demo.model.entity.User;
import handinhandstore.demo.model.enums.PriceType;
import handinhandstore.demo.model.entity.Category;
import handinhandstore.demo.repository.CategoryRepository;

@RestController
public class ProductController {
    private final ProductService productService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @PostMapping("/Add-Product")
    public ResponseEntity<Map<String, Long>> publishProduct(
        @RequestBody ProductRequest productRequest
    ) {
        try {
            Set<Category> categories = new HashSet<>();
            for(Long category_id:productRequest.getCategories_ids()){
                // Find category
                Category category = categoryRepository.findById(category_id)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
                // Add category
                categories.add(category);
            }

            Product product = new Product();
            product.setTitle(productRequest.getTitle());
            product.setDescription(productRequest.getDescription());
            product.setPriceType(productRequest.getPriceType());
            product.setFixedPrice(productRequest.getPriceType() == PriceType.FIXED ? productRequest.getFixedPrice() : null);
            product.setStatus(productRequest.getStatus());
            product.setCreatedAt(LocalDateTime.now());   
            product.setDonationPercentage(productRequest.getDonationPercentage());  
            product.setCategories(categories);

            // Set seller (only ID from request)
            User seller = new User();
            seller.setId(productRequest.getSellerId());
            product.setSeller(seller);

            productService.saveProduct(product);

            Map<String, Long> response = new HashMap<>();
            response.put("productId", product.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Long> errorResponse = new HashMap<>();
            errorResponse.put("error", -1L);
            return ResponseEntity.status(500).body(errorResponse);
        }   
    }

    @DeleteMapping("Delete-Product/{id_Product}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id_Product) {
        System.out.println("---------------------calling the delete process-------------");
        System.out.println("/n/n*********the id of the product to delete is"+id_Product+"/n/n************");
        productService.deleteProduct(id_Product);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @PutMapping("Update-Product/{id_Product}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id_Product,
            @RequestBody ProductUpdateRequest updatedRequest
    ) {
        Product product = productService.updateProduct(id_Product, updatedRequest);
        return ResponseEntity.ok(product);
    }

    @GetMapping("products/get/featured-donation")
    public List<Product> getLatestProducts(@RequestParam(defaultValue = "10") int limit) {
        return productService.getMostFeaturedDonationProducts(limit);
    }

    @GetMapping("products/getById")
    public Product getById(@RequestParam Long id) {
        return productService.findById(id);
    }

    @GetMapping("products/get")
    public List<Product> getProducts(){
        return productService.findAllProducts();
    }

    @GetMapping("/products/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
         List<Product> results = productService.searchProducts(keyword);
         return results != null ? results : Collections.emptyList();
    }

     @GetMapping("/products/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

}



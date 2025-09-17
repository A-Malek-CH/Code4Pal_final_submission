package handinhandstore.demo.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import handinhandstore.demo.repository.CategoryRepository;
import handinhandstore.demo.repository.ProductRepository;
import handinhandstore.demo.dto.ProductUpdateRequest;
import handinhandstore.demo.model.entity.Category;
import handinhandstore.demo.model.entity.Product;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public void saveProduct(Product product) {
        productRepository.save(product);
    } 

    public void deleteProduct(Long id){
       productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, ProductUpdateRequest req) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setPriceType(req.getPriceType());
        product.setFixedPrice(req.getFixedPrice());
        product.setStatus(req.getStatus());
        product.setDonationPercentage(req.getDonationPercentage());

        if (req.getCategoriesIds() != null) {
            Set<Category> categories = new HashSet<>();
            for (Long categoryId : req.getCategoriesIds()) {
                Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
                categories.add(category);
            }
            product.setCategories(categories);
        }

        return productRepository.save(product);
    }

    public List<Product> getMostFeaturedDonationProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit); // first page, with "limit" items
        return productRepository.findAllByOrderByDonationPercentageDesc(pageable);
    }

    public Product findById(Long id) {
        Optional<Product> productOptional = productRepository.findById(id);

        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            return product;
        } else {
            return null; // or throw a custom exception
        }
    }

    public Optional<Product> getProductById(Long id){
        return productRepository.findById(id);
    }

    public  List<Product> findAllProducts (){
        List<Product> listProducts = productRepository.findAllProducts();
        return listProducts;
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategories_Id(categoryId);
    }

}

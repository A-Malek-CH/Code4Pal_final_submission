package handinhandstore.demo.controller;

import handinhandstore.demo.model.entity.Category;
import handinhandstore.demo.service.CategoryService;
import handinhandstore.demo.dto.CategoryRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/get/all")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping("/save")
    public Category createCategory(@RequestBody CategoryRequest categoryRequest) {
        Category category = new Category(categoryRequest.getName(), categoryRequest.getIcon());
        return categoryService.createCategory(category);
    }

    @DeleteMapping("/delete/{id_Category}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id_Category) {
        categoryService.deleteCategory(id_Category);
        return ResponseEntity.ok("Category deleted successfully");
    }

    @PutMapping("/update/{id_Category}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id_Category,
            @RequestBody Category updatedCategory
    ) {
        Category category = categoryService.updateCategory(id_Category, updatedCategory);
        return ResponseEntity.ok(category);
    }
}

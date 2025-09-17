package handinhandstore.demo.service;

import handinhandstore.demo.model.entity.Category;
import handinhandstore.demo.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id){
       categoryRepository.deleteById(id);
    }

    public Category updateCategory(Long id, Category updatedCategory) {
        Optional<Category> existingCategoryOpt = categoryRepository.findById(id);

        if (existingCategoryOpt.isEmpty()) {
            throw new RuntimeException("Category not found with id: " + id);
        }

        Category existingCategory = existingCategoryOpt.get();

        // Update fields
        existingCategory.setName(updatedCategory.getName());
        existingCategory.setIcon(updatedCategory.getIcon());

        return categoryRepository.save(existingCategory);
    }
}

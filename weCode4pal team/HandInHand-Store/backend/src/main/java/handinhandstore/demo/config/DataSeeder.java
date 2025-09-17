package handinhandstore.demo.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import handinhandstore.demo.model.entity.Category;
import handinhandstore.demo.repository.CategoryRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    public DataSeeder(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        seedCategories();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.saveAll(List.of(
                new Category("Men’s Clothing", "👕"),
                new Category("Women’s Clothing", "👗"),
                new Category("Kids & Baby", "🧒"),
                new Category("Shoes & Footwear", "👟"),
                new Category("Bags & Accessories", "🎒"),
                new Category("Beauty & Personal Care", "💄"),
                new Category("Watches & Jewelry", "⌚"),
                new Category("Electronics", "💻"),
                new Category("Smartphones & Gadgets", "📱"),
                new Category("Home & Kitchen", "🏠"),
                new Category("Furniture & Decor", "🛋"),
                new Category("Kitchenware", "🍳"),
                new Category("Gaming", "🎮"),
                new Category("Audio & Headphones", "🎧"),
                new Category("Books & Stationery", "📚"),
                new Category("Hobbies & Crafts", "🎨"),
                new Category("Sports & Outdoors", "🏋️‍♂️"),
                new Category("Pets", "🐾"),
                new Category("Best Sellers", "🛒"),
                new Category("Summer Sale", "🏷"),
                new Category("Eco-Friendly", "🌱"),
                new Category("Work Essentials", "💼"),
                new Category("Gifts & Occasions", "🎁")
            ));
        }
    }
}


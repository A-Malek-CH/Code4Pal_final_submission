package handinhandstore.demo.dto;

import java.util.HashSet;
import java.util.Set;

import handinhandstore.demo.model.entity.Product;
import jakarta.persistence.ManyToMany;

public class CategoryRequest {
    private String name;    // e.g. "Men’s Clothing"
    private String icon;    // e.g. "👕"

    @ManyToMany(mappedBy = "categories")
    private Set<Product> products = new HashSet<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Set<Product> getProducts() {
        return products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    
}

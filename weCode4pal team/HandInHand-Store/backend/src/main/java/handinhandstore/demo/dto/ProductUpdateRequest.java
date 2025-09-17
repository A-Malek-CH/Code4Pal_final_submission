package handinhandstore.demo.dto;

import handinhandstore.demo.model.enums.PriceType;
import handinhandstore.demo.model.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.List;

public class ProductUpdateRequest {
    private String title;
    private String description;
    private PriceType priceType;
    private Double fixedPrice;
    private ProductStatus status;
    private BigDecimal donationPercentage;
    private List<Long> categoriesIds;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public PriceType getPriceType() { return priceType; }
    public void setPriceType(PriceType priceType) { this.priceType = priceType; }

    public Double getFixedPrice() { return fixedPrice; }
    public void setFixedPrice(Double fixedPrice) { this.fixedPrice = fixedPrice; }

    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public BigDecimal getDonationPercentage() { return donationPercentage; }
    public void setDonationPercentage(BigDecimal donationPercentage) { this.donationPercentage = donationPercentage; }

    public List<Long> getCategoriesIds() { return categoriesIds; }
    public void setCategoriesIds(List<Long> categoriesIds) { this.categoriesIds = categoriesIds; }
}

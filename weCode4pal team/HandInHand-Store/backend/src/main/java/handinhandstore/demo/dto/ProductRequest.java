package handinhandstore.demo.dto;

import java.math.BigDecimal;
import java.util.List;

import handinhandstore.demo.model.enums.PriceType;
import handinhandstore.demo.model.enums.ProductStatus;

public class ProductRequest {
    private Long sellerId;
    private String title;
    private String description;
    private PriceType priceType; // FIXED or AUCTION
    private Double fixedPrice;
    private ProductStatus status; // AVAILABLE, SOLD, REMOVED
    private BigDecimal donationPercentage;
    private List<Long> categories_ids;

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public PriceType getPriceType() {
        return priceType;
    }

    public void setPriceType(PriceType priceType) {
        this.priceType = priceType;
    }

    public Double getFixedPrice() {
        return fixedPrice;
    }

    public void setFixedPrice(Double fixedPrice) {
        this.fixedPrice = fixedPrice;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }

    public BigDecimal getDonationPercentage() {
        return donationPercentage;
    }

    public void setDonationPercentage(BigDecimal donationPercentage) {
        this.donationPercentage = donationPercentage;
    }

    public List<Long> getCategories_ids() {
        return categories_ids;
    }

    public void setCategories_ids(List<Long> categories_ids) {
        this.categories_ids = categories_ids;
    }

    
}


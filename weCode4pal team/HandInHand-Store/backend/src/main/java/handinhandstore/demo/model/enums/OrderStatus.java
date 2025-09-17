package handinhandstore.demo.model.enums;

public enum OrderStatus {
    PENDING,        // Order placed but payment not confirmed
    CONFIRMED,      // Payment confirmed, order being processed
    PROCESSING,     // Order is being prepared for shipment
    SHIPPED,        // Order has been shipped
    DELIVERED,      // Order has been delivered
    CANCELLED,      // Order was cancelled
    REFUNDED,       // Order was refunded
    FAILED          // Payment failed or order processing failed
}
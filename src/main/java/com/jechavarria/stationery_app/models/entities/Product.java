package com.jechavarria.stationery_app.models.entities;

import java.math.BigDecimal;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Products")
public class Product {

    @Id
    @Column(name = "id_product", length = 10)
    private String id;

    @Column(name = "product_name", length = 50, nullable = false)
    private String name;

    @Column(nullable = true, length = 300)
    private String description;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "current_stock", nullable = false)
    private Integer currentStock;

    @OneToMany(mappedBy = "product")
    private List<PurchaseDetail> purchaseDetails;

}

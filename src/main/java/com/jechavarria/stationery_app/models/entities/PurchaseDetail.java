package com.jechavarria.stationery_app.models.entities;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Purchase_detail")
public class PurchaseDetail {

    @Id
    @ManyToOne
    @JoinColumn(name = "id_purchase", referencedColumnName = "id_purchase", nullable = false)
    private Purchase purchase;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_product", referencedColumnName = "id_product", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price" ,precision = 10, scale = 2)
    private BigDecimal unitPrice;

}

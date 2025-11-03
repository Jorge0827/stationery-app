package com.jechavarria.stationery_app.models.entities;

import java.math.BigDecimal;

import com.jechavarria.stationery_app.models.dtos.dtoSaleDetail.SaleDetailId;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@IdClass(SaleDetailId.class)
@Table(name = "Sales_detail")
public class SaleDetail {

    @Id
    @ManyToOne
    @MapsId("sale")
    @JoinColumn(name = "id_sale", referencedColumnName = "id_sale", nullable = false)
    private Sale sale;

    @Id
    @ManyToOne
    @MapsId("product")
    @JoinColumn(name = "id_product", referencedColumnName = "id_product", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    

}

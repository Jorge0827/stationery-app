package com.jechavarria.stationery_app.models.dtos.dtoSales;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopProductResponse {

    private String productId;
    private String productName;
    private Long totalQuantity;
    private BigDecimal totalAmount;

}


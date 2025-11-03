package com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class PurchaseDetailResponse {

    private String purchase;

    private String product;

    private Integer quantity;

    private BigDecimal unitPrice;

}

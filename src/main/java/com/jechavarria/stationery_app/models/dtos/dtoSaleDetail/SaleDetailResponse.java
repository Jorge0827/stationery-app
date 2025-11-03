package com.jechavarria.stationery_app.models.dtos.dtoSaleDetail;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class SaleDetailResponse {

    private Integer idSale;

    private String product;

    private Integer quantity;

    private BigDecimal unitPrice;

}

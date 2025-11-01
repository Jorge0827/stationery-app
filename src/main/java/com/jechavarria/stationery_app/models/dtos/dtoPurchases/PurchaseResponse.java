package com.jechavarria.stationery_app.models.dtos.dtoPurchases;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;

@Data
public class PurchaseResponse {

    private Integer id;
    private LocalDate date;
    private BigDecimal total;
    private String Supplier;
    private String User;


}

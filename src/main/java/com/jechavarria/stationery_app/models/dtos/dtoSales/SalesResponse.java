package com.jechavarria.stationery_app.models.dtos.dtoSales;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class SalesResponse {

    private Integer id;
    private LocalDate salesDate;
    private BigDecimal total;
    private String user;

    private String notes;

}

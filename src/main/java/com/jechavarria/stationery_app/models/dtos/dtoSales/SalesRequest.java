package com.jechavarria.stationery_app.models.dtos.dtoSales;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SalesRequest {


    @NotNull(message = "La fecha es obligatoria")
    private LocalDate salesDate;

    @DecimalMin(value = "0.00", inclusive = true, message = "El total debe ser >= 0")
    @NotNull(message = "El total de la venta es obligatoria")
    private BigDecimal total;

    @NotNull(message = "El id del usuario es obligatorio")
    @Positive(message = "El id del usuario debe ser un entero positivo")
    private Integer user;

    

}

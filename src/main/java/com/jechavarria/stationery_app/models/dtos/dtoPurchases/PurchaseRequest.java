package com.jechavarria.stationery_app.models.dtos.dtoPurchases;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;


@Data
public class PurchaseRequest {

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate date;

    @DecimalMin(value = "0.00", inclusive = true, message = "El total debe ser >= 0")
    @NotNull(message = "El total de la compra es obligatoria")
    private BigDecimal total;

    @JsonProperty("supplier")
    @NotNull(message = "El id del proveedor es obligatorio")
    @Positive(message = "El id del proveedor debe ser un entero positivo")
    private Integer idSupplier;

    @JsonProperty("user")
    @NotNull(message = "El id del usuario es obligatorio")
    @Positive(message = "El id del usuario debe ser un entero positivo")
    private Integer idUser;


}

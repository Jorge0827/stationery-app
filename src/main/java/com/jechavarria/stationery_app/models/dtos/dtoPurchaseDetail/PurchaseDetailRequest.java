package com.jechavarria.stationery_app.models.dtos.dtoPurchaseDetail;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jechavarria.stationery_app.models.entities.Product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PurchaseDetailRequest {

    @JsonProperty("purchase")
    @NotNull(message = "El id de la compra es obligatorio")
    @Positive(message = "El id de la compra debe ser un entero positivo")
    private Integer idpurchase;

    @JsonProperty("product")
    @NotNull(message = "El id del producto es obligatorio")
    @Positive(message = "El id del producto debe ser un entero positivo")
    private Product idproduct;

    @Positive(message = "La cantidad debe ser mayor que 0")
    @NotNull(message = "La cantidad no puede estar vacía")
    private Integer quantity;

    @DecimalMin("0.01") // debe ser mayor a 0
    @NotNull(message = "El precio del producto no puede estar vacío")
    private BigDecimal unitPrice;

}

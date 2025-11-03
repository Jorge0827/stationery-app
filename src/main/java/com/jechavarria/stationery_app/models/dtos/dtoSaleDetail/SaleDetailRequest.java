package com.jechavarria.stationery_app.models.dtos.dtoSaleDetail;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SaleDetailRequest {

    @NotNull(message = "El id de la venta es obligatorio")
    @Positive(message = "El id de la compra debe ser un entero positivo")
    private Integer idSale;

    @NotNull(message = "El id del producto es obligatorio")
    private String idProduct;

    @Positive(message = "La cantidad debe ser mayor que 0")
    @NotNull(message = "La cantidad no puede estar vacía")
    private Integer quantity;

    @DecimalMin("0.01") // debe ser mayor a 0
    @NotNull(message = "El precio del producto no puede estar vacío")
    private BigDecimal unitPrice;

}

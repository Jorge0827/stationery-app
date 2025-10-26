package com.jechavarria.stationery_app.models.dtos.dtoProducts;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductRequest {

    @NotBlank(message = "El id debe ser unico y no puede estar vacío")
    @Size(max = 10)
    private String id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50)
    private String name;

    @Size(max = 300)
    private String description;

    @DecimalMin("0.01") //debe ser mayor a 0
    @NotNull(message = "El precio del producto no puede estar vacío")
    private BigDecimal unitPrice;

    @Min(0)
    @NotNull(message = "La cantidad actual no puede estar vacía")
    private Integer currentStock;

}

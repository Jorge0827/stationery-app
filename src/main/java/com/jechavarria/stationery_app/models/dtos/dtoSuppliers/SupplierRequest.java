package com.jechavarria.stationery_app.models.dtos.dtoSuppliers;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupplierRequest {

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(max = 50)
    private String name;

    private String prefix;

    @NotBlank(message = "El telefono no puede estar vacío")
    @Size(max = 10)
    private String phoneNumber;

    @NotBlank(message = "La dirrección es obligatoria")
    private String addres;

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "El formato del email no es válido")
    private String email;

    @NotBlank(message = "El nit es obligatotio")
    private String nit;

}

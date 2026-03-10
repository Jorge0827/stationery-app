package com.jechavarria.stationery_app.models.dtos.dtoUsers;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PublicRegisterRequest {

    @NotBlank
    @Size(max = 25)
    private String userName;

    @Email
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(message = "Debe tener mínimo 8 caracteres", min = 8, max = 25)
    private String password;

    @NotNull
    @Positive
    private Integer idRol;

}


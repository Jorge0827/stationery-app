package com.jechavarria.stationery_app.models.dtos.dtoLogin;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "El nombre de usuario el obligatorio")
    @Length(message = "El nombre de usuario debe tener mínimo 5 caracteres")
    private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(message = "Debe tener mínimo 8 caracteres",min = 8, max = 25)
    private String password;

}

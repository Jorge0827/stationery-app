package com.jechavarria.stationery_app.exceptions;

public class EmailAlreadyExistsException extends RuntimeException{

    public EmailAlreadyExistsException(String email){
        super("El email " + email + " ya está registrado");
    }

}

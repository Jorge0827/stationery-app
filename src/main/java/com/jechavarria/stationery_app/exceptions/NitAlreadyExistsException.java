package com.jechavarria.stationery_app.exceptions;

public class NitAlreadyExistsException extends RuntimeException {

    public NitAlreadyExistsException(String nit){
        super("El nit " + nit + " ya se encuentra registrado");
    }

}

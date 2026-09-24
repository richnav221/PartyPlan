package com.example.ProyectoWeb.Exception;

public class CorreoDuplicadoException extends RuntimeException {

    public CorreoDuplicadoException(String correo) {
        super("Ya existe un usuario con el correo electrónico " + correo + " ya está en uso.");
    }
    
}

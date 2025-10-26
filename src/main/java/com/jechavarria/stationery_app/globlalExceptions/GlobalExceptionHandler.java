package com.jechavarria.stationery_app.globlalExceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.jechavarria.stationery_app.exceptions.EmailAlreadyExistsException;
import com.jechavarria.stationery_app.exceptions.IdNotFoundException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(IdNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleIdNotFoundException(
            IdNotFoundException ex, WebRequest request) {

        log.warn("Id no encontrado: {}", ex.getMessage());

        String path = request.getDescription(false).replace("uri=", "");
        ApiErrorResponse errorResponse = new ApiErrorResponse(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                path);

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleEmailAlreadyExists(EmailAlreadyExistsException ex, HttpServletRequest request){
        ApiErrorResponse error = new ApiErrorResponse(
        HttpStatus.CONFLICT,
        ex.getMessage(), 
        request.getRequestURI());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

}

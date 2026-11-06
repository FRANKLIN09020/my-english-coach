package com.myenglishcoach.shared.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientResponseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class ApiExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, String>> validation(MethodArgumentNotValidException exception) {
        String field = exception.getBindingResult().getFieldError() == null ? "input" : exception.getBindingResult().getFieldError().getField();
        String message = "name".equals(field)
                ? "Please enter only the name you would like your coach to use (up to 80 characters)."
                : "Please check your " + field + " and try again.";
        return response(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(NoSuchElementException.class)
    ResponseEntity<Map<String, String>> notFound(NoSuchElementException exception) {
        return response(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    ResponseEntity<Map<String, String>> configuration(IllegalStateException exception) {
        return response(HttpStatus.SERVICE_UNAVAILABLE, exception.getMessage());
    }

    @ExceptionHandler(RestClientResponseException.class)
    ResponseEntity<Map<String, String>> groqFailure(RestClientResponseException exception) {
        log.warn("Groq request failed with status {}: {}", exception.getStatusCode().value(), exception.getResponseBodyAsString());
        HttpStatus status = switch (exception.getStatusCode().value()) {
            case 400 -> HttpStatus.BAD_REQUEST;
            case 401 -> HttpStatus.UNAUTHORIZED;
            case 402 -> HttpStatus.PAYMENT_REQUIRED;
            case 429 -> HttpStatus.TOO_MANY_REQUESTS;
            default -> HttpStatus.BAD_GATEWAY;
        };
        String message = switch (exception.getStatusCode().value()) {
            case 400 -> "Groq rejected the request. Check that GROQ_MODEL in apps/api/.env is available in your Groq account.";
            case 401 -> "Groq rejected the API key. Add a valid key to apps/api/.env and restart the backend.";
            case 402 -> "Your Groq account does not have enough credits for this model.";
            case 429 -> "Groq is rate-limiting requests. Please wait a moment and try again.";
            default -> "Groq could not complete this assessment request. Please try again shortly.";
        };
        return response(status, message);
    }

    private ResponseEntity<Map<String, String>> response(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}

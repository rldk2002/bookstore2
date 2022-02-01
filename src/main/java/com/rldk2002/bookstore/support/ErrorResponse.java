package com.rldk2002.bookstore.support;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponse {
    private String code;
    private String message;
    private String description;

    public ErrorResponse(
        String code,
        String message
    ) {
        this.code = code;
        this.message = message;
    }

    public ErrorResponse(String code, String message, String description) {
        this.code = code;
        this.message = message;
        this.description = description;
    }

}

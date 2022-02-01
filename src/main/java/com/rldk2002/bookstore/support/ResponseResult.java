package com.rldk2002.bookstore.support;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResponseResult<T> {
    private String code;
    private T content;
}

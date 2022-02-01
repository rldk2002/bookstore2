package com.rldk2002.bookstore.book.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookCart {
    private String memberNo;
    private int itemId;
    private int count;
    private LocalDateTime timestamp;
}

package com.rldk2002.bookstore.book.entity;

import com.rldk2002.bookstore.book.validation.BookGroupMarker.*;
import com.rldk2002.bookstore.book.validation.UnescapeContentSize;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.*;
import java.time.LocalDateTime;

@Getter
@Setter
public class BookReview {
    private String no;  // 리뷰 식별번호

    @Positive(groups = { Review.class })
    private int itemId; // 책 식별번호
    private String writerNo;    // 작성자 회원번호
    private String writerName;  // 작성자 이름

    @NotBlank(groups = { Review.class })
    @UnescapeContentSize(min = 10, max = 300, groups = { Review.class })
    private String content;     // 글 내용

    @Min(value = 1, groups = { Review.class })
    @Max(value = 5, groups = { Review.class })
    private double starRating;  // 별점

    private LocalDateTime writeDate;    // 작성일
}

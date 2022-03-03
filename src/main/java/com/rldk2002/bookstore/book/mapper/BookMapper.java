package com.rldk2002.bookstore.book.mapper;

import com.rldk2002.bookstore.book.entity.BookCart;
import com.rldk2002.bookstore.book.entity.BookLike;
import com.rldk2002.bookstore.book.entity.BookReview;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface BookMapper {
    void mergeBookcart (
            @Param("memberNo") String memberNo,
            @Param("itemId") int itemId,
            @Param("count") int count
    );
    List<BookCart> selectBookcart (
            @Param("memberNo") String memberNo
    );
    void updateBookcart (
            @Param("memberNo") String memberNo,
            @Param("itemId") int itemId,
            @Param("count") int count
    );
    void deleteBookCart (
            @Param("memberNo") String memberNo,
            @Param("itemId") int itemId
    );
    void mergeBookLike (
            @Param("memberNo") String memberNo,
            @Param("itemId") int itemId
    );
    BookLike selectBookLike (
            @Param("memberNo") String memberNo,
            @Param("itemId") int itemId
    );
    void mergeBookReview (
           BookReview review
    );
    BookReview selectBookReview (
          Map<String, Object> params
    );
    void deleteBookReview (
          Map<String, Object> params
    );
}

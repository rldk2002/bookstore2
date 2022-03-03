package com.rldk2002.bookstore.book.service;

import com.nhncorp.lucy.security.xss.XssPreventer;
import com.rldk2002.bookstore.book.entity.BookCart;
import com.rldk2002.bookstore.book.entity.BookLike;
import com.rldk2002.bookstore.book.entity.BookReview;
import com.rldk2002.bookstore.book.mapper.BookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class BookService {
    private final BookMapper bookMapper;

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public void addBookToBookCart (
        String memberNo,
        int itemId,
        int count
    ) {
        bookMapper.mergeBookcart(memberNo, itemId, count);
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public void modifyBookCartCount (
        String memberNo,
        int itemId,
        int count
    ) {
        bookMapper.updateBookcart(memberNo, itemId, count);
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public List<BookCart> getBookCarts (
        String memberNo
    ) {
        return bookMapper.selectBookcart(memberNo);
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public void removeBookCarts (
        String memberNo,
        List<Integer> itemIds
    ) {
        itemIds.stream().forEach(itemId -> {
            bookMapper.deleteBookCart(memberNo, itemId);
        });
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public void toggleBookLike (
        String memberNo,
        int itemId
    ) {
        bookMapper.mergeBookLike(memberNo, itemId);
    }

    @PreAuthorize("isAuthenticated() and (#memberNo == principal.no)")
    public BookLike getBookLike (
        String memberNo,
        int itemId
    ) {
        return bookMapper.selectBookLike(memberNo, itemId);
    }

    @PreAuthorize("isAuthenticated() and (#review.writerNo == principal.no)")
    public void writeBookReview (
        BookReview review
    ) {
        bookMapper.mergeBookReview(review);
    }

    @PreAuthorize("permitAll()")
    public BookReview getBookReview (
        String writerNo,
        int itemId
    ) {
        final Map<String, Object> params = Map.of("writerNo", writerNo, "itemId", itemId);
        BookReview review = bookMapper.selectBookReview(params);
        if (review != null) {
            review.setContent(XssPreventer.unescape(review.getContent()));
        }
        return review;
    }

    @PreAuthorize("isAuthenticated() and (#writerNo == principal.no)")
    public void removeBookReview (
        String writerNo,
        int itemId
    ) {
        final Map<String, Object> params = Map.of("writerNo", writerNo, "itemId", itemId);
        bookMapper.deleteBookReview(params);
    }
}

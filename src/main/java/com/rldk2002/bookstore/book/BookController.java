package com.rldk2002.bookstore.book;

import com.nhncorp.lucy.security.xss.XssPreventer;
import com.rldk2002.bookstore.book.entity.BookCart;
import com.rldk2002.bookstore.book.entity.BookLike;
import com.rldk2002.bookstore.book.entity.BookReview;
import com.rldk2002.bookstore.book.service.BookService;
import com.rldk2002.bookstore.book.validation.BookGroupMarker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @GetMapping("/cart")
    public List<BookCart> bookCartList (
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        if (memberNo == null) return null;
        return bookService.getBookCarts(memberNo);
    }

    @PostMapping("/cart")
    public boolean bookCartListSave (
            @RequestParam("itemId") int itemId,
            @RequestParam("count") int count,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        if (memberNo == null) return false;

        bookService.addBookToBookCart(memberNo, itemId, count);
        log.debug("[ 책 장바구니에 추가 ] memberNo: {}, itemId: {}, 개수: +{}", memberNo, itemId, count);
        return true;
    }

    @PatchMapping("/cart")
    public boolean bookCartModify (
            @RequestParam("itemId") int itemId,
            @RequestParam("count") int count,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        if (memberNo == null) return false;

        bookService.modifyBookCartCount(memberNo, itemId, count);
        log.debug("[ 책 장바구니 수량 변경 ] memberNo: {}, itemId: {}, 개수: {}", memberNo, itemId, count);
        return true;
    }

    @DeleteMapping("/cart")
    public boolean bookCartRemove (
            @RequestParam("itemIds") List<Integer> itemIds,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        if (memberNo == null) return false;

        bookService.removeBookCarts(memberNo, itemIds);
        return true;
    }

    @GetMapping("/item/{itemId}/like")
    public BookLike bookLikeOne (
            @PathVariable("itemId") int itemId,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        if (memberNo == null) return null;

        BookLike result = bookService.getBookLike(memberNo, itemId);
        log.debug("[ 책 좋아요 조회 ] memberNo: {}, itemId: {}", memberNo, itemId);
        return result;
    }

    @PostMapping("/like")
    public boolean bookLikeSave (
            @RequestParam("itemId") int itemId,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        if (memberNo == null) return false;

        bookService.toggleBookLike(memberNo, itemId);
        log.debug("[ 책 좋아요 토글 ] memberNo: {}, itemId: {}", memberNo, itemId);
        return true;
    }

    @PostMapping("/review")
    public boolean bookReviewSave (
            @ModelAttribute @Validated(BookGroupMarker.Review.class) BookReview review,
            BindingResult bindingResult,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) throws BindException {
        if (memberNo == null) return false;

        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        String todayDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String no = todayDate + RandomStringUtils.randomAlphanumeric(6);
        review.setNo(no);
        review.setWriterNo(memberNo);

        bookService.writeBookReview(review);
        log.debug("[ 책 리뷰 등록 또는 수정 ] memberNo: {}, itemId: {}", memberNo, review.getItemId());

        return true;
    }

    @GetMapping("/review")
    public BookReview bookReviewOne (
            @RequestParam("itemId") int itemId,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        if (memberNo == null) return null;

        return bookService.getBookReview(memberNo, itemId);
    }

    @DeleteMapping("/review")
    public boolean bookReviewRemove (
            @RequestParam("itemId") int itemId,
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        if (memberNo == null) return false;
        bookService.removeBookReview(memberNo, itemId);
        log.debug("[ 책 리뷰 삭제 ] memberNo: {}, itemId: {}", memberNo, itemId);

        return true;
    }

}

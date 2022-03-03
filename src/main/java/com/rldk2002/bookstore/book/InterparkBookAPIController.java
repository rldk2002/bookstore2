package com.rldk2002.bookstore.book;

import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.rldk2002.bookstore.book.entity.InterparkBook;
import com.rldk2002.bookstore.book.entity.InterparkBookResult;
import com.rldk2002.bookstore.book.service.InterparkBookService;
import com.rldk2002.bookstore.book.validation.BookGroupMarker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/books")
public class InterparkBookAPIController {
    private final InterparkBookService interparkBookService;

    @JsonView(BookGroupMarker.View.class)
    @GetMapping("/{corner}/category/{categoryId}")
    public InterparkBookResult searchBookListByCategory (
            @PathVariable("corner") String corner,
            @PathVariable("categoryId") String categoryId
    ) throws JsonProcessingException {
        InterparkBookResult result = interparkBookService.searchOnCornerByCategory(corner, categoryId);

        log.debug("[ 인터파크 도서 API ] categoryId: {}, apiType: {}", categoryId, corner);

        return result;
    }

    @JsonView(BookGroupMarker.View.class)
    @GetMapping("/search")
    public InterparkBookResult searchBookListByKeyword (
            @RequestParam(name = "query") String query,
            @RequestParam(name = "queryType", defaultValue = "title") String queryType,
            @RequestParam(name = "searchTarget", defaultValue = "book") String searchTarget,
            @RequestParam(name = "page", defaultValue = "1") String page,
            @RequestParam(name = "sort", defaultValue = "accuracy") String sort,
            @RequestParam(name = "categoryId", defaultValue = "100") String categoryId
    ) throws JsonProcessingException {
        InterparkBookResult result = interparkBookService.search(
                query,
                queryType,
                searchTarget,
                page,
                "15",
                sort,
                categoryId
        );

        log.debug("[ 인터파크 도서 API ] query: {}, searchTarget: {}, categoryId: {}, page: {}, sort: {}", query, searchTarget, categoryId, page, sort);

        return result;
    }

    @JsonView(BookGroupMarker.View.class)
    @GetMapping("/item/{itemId}")
    public InterparkBook searchBookOneByItemId (
            @PathVariable("itemId") int itemId
    ) throws JsonProcessingException {
        try {
            return interparkBookService.search(itemId);
        } catch (IndexOutOfBoundsException exception) {
            log.debug("[ 인터파크 도서 API ] itemId: {} 검색결과 없음.", itemId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

}

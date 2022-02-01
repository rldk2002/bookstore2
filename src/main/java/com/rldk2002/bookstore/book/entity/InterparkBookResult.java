package com.rldk2002.bookstore.book.entity;

import com.fasterxml.jackson.annotation.JsonView;
import com.rldk2002.bookstore.book.validation.BookGroupMarker;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InterparkBookResult {
    @JsonView({ BookGroupMarker.View.class })
    private int totalResults;

    @JsonView({ BookGroupMarker.View.class })
    private int startIndex;

    @JsonView({ BookGroupMarker.View.class })
    private int itemsPerPage;

    @JsonView({ BookGroupMarker.View.class })
    private int maxResults;

    @JsonView({ BookGroupMarker.View.class })
    private String query;

    @JsonView({ BookGroupMarker.View.class })
    private String queryType;

    @JsonView({ BookGroupMarker.View.class })
    private String searchCategoryId;

    @JsonView({ BookGroupMarker.View.class })
    private String searchCategoryName;

    @JsonView({ BookGroupMarker.View.class })
    private List<InterparkBook> item;

    private String title;
    private String link;
    private String imageUrl;
    private String language;
    private String copyright;
    private String pubDate;
    private String returnCode;
    private String returnMessage;
}

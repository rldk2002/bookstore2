package com.rldk2002.bookstore.book.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rldk2002.bookstore.book.entity.InterparkBook;
import com.rldk2002.bookstore.book.entity.InterparkBookResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class InterparkBookService {

    private @Value("${interpark.key}") String key;

    public InterparkBookResult searchOnCornerByCategory(
            String corner,
            String categoryId
    ) throws JsonProcessingException {
        String json = WebClient.create("http://book.interpark.com/api/" + corner + ".api")
                .get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("key", key)
                        .queryParam("output", "json")
                        .queryParam("categoryId", categoryId)
                        .build()
                )
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(json, InterparkBookResult.class);
    }

    public InterparkBookResult search(
            String query,
            String queryType,
            String searchTarget,
            String page,
            String resultCount,
            String sort,
            String categoryId
    ) throws JsonProcessingException {
        String json = WebClient.create("http://book.interpark.com/api/search.api")
                .get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("key", key)
                        .queryParam("output", "json")
                        .queryParam("query", query)
                        .queryParam("queryType", queryType)
                        .queryParam("searchTarget", searchTarget)
                        .queryParam("start", page)
                        .queryParam("maxResults", resultCount)
                        .queryParam("sort", sort)
                        .queryParam("categoryId", categoryId)
                        .build()
                )
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(json, InterparkBookResult.class);
    }

    public InterparkBook search(
            int itemId
    ) throws JsonProcessingException {
        String json = WebClient.create("http://book.interpark.com/api/search.api")
                .get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("key", key)
                        .queryParam("output", "json")
                        .queryParam("queryType", "productNumber")
                        .queryParam("query", itemId)
                        .build()
                )
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        ObjectMapper objectMapper = new ObjectMapper();
        InterparkBookResult result = objectMapper.readValue(json, InterparkBookResult.class);
        return result.getItem().get(0);
    }

}

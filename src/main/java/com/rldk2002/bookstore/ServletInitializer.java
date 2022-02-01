package com.rldk2002.bookstore;

import com.rldk2002.bookstore.support.FullBeanNameGenerator;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        application.beanNameGenerator(new FullBeanNameGenerator());
        return application.sources(BookstoreApplication.class);
    }

}

package com.rldk2002.bookstore.book.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.constraints.Size;
import java.lang.annotation.*;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.ElementType.TYPE_USE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Constraint(validatedBy = UnescapoContentSizeValidator.class)
@Target({ METHOD, FIELD, CONSTRUCTOR, PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface UnescapeContentSize {
    int min() default 0;
    int max() default Integer.MAX_VALUE;

    String message() default "길이가 {min}이상 {max}이하 이어야 합니다.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    @Target({ METHOD, FIELD, CONSTRUCTOR, PARAMETER })
    @Retention(RUNTIME)
    @Documented
    @interface List {

        UnescapeContentSize[] value();
    }
}

package com.rldk2002.bookstore.book.validation;

import com.nhncorp.lucy.security.xss.XssPreventer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
@RequiredArgsConstructor
public class UnescapoContentSizeValidator implements ConstraintValidator<UnescapeContentSize, String> {
    private int min, max;

    @Override
    public void initialize(UnescapeContentSize constraintAnnotation) {
        this.min = constraintAnnotation.min();
        this.max = constraintAnnotation.max();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        String unescapeValue = XssPreventer.unescape(value);
        System.out.println(unescapeValue);
        int length = unescapeValue.length();

        if (length < min || length > max) return false;
        return true;
    }

}

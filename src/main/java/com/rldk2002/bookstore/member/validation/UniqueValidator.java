package com.rldk2002.bookstore.member.validation;

import com.rldk2002.bookstore.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
@RequiredArgsConstructor
public class UniqueValidator implements ConstraintValidator<Unique, String> {
    private final MemberService memberService;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return !memberService.existsMemberById(value);
    }

}

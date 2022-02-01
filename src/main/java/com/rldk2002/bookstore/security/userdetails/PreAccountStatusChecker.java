package com.rldk2002.bookstore.security.userdetails;

import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.security.core.SpringSecurityMessageSource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;

public class PreAccountStatusChecker implements UserDetailsChecker {
    protected final MessageSourceAccessor messages = SpringSecurityMessageSource.getAccessor();

    @Override
    public void check(UserDetails userDetails) {
        // 익셉션 내용 작성은 여기에...
    }


}

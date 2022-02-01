package com.rldk2002.bookstore.security.userdetails;

import com.rldk2002.bookstore.member.Member;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Objects;
import java.util.Set;

public class User implements UserDetails {

    @Getter
    private String no;

    @Getter
    private String id;

    private String username;
    private String password;

    // 회원 등급
    private Set<SimpleGrantedAuthority> roles;

    // 회원 상태
    @Getter
    private Set<AccountStatus> statuses;

    public User(Member member) {
        Objects.requireNonNull(member);

        this.no = member.getNo();
        this.username = member.getId();
        this.id = member.getId();
        this.password = member.getPassword();
        this.roles = member.getRoles();
        this.statuses = member.getStatuses();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    @Deprecated
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !statuses.contains(AccountStatus.ACCOUNT_EXPIRED);
    }

    @Override
    public boolean isAccountNonLocked() {
        return !statuses.contains(AccountStatus.ACCOUNT_LOCKED);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !statuses.contains(AccountStatus.CREDENTIALS_EXPIRED);
    }

    @Override
    public boolean isEnabled() {
        return !statuses.contains(AccountStatus.DISABLED);
    }

}

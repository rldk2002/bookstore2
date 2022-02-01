package com.rldk2002.bookstore.security;

import com.rldk2002.bookstore.member.Member;
import com.rldk2002.bookstore.member.service.MemberService;
import com.rldk2002.bookstore.member.validation.MemberGroupMarker;
import com.rldk2002.bookstore.security.jwt.JwtAuthenticationService;
import com.rldk2002.bookstore.security.jwt.JwtToken;
import com.rldk2002.bookstore.security.jwt.JwtTokenProvider;
import com.rldk2002.bookstore.security.userdetails.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private static final int REFRESH_TOKEN_EXPIRE_TIME = 60 * 60 * 24 * 7;  // 7일
    private final JwtAuthenticationService authenticationService;
    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;

    /*
     * 회원 JWT Form 로그인
     */
    @PostMapping("/login/jwt")
    public Map<String, String> jwtFormLogin(
            @RequestParam("id") String id,
            @RequestParam("password") String password,
            HttpServletResponse response
    ) {
        JwtToken token = authenticationService.login(id, password);

        Cookie cookie = new Cookie("Authorization", token.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(REFRESH_TOKEN_EXPIRE_TIME);
        response.addCookie(cookie);

        log.debug("[ JWT Form 로그인 성공 ] id: {}", id);
        return Map.of("Authorization", token.getAccessToken());
    }


    /*
     * 로그아웃
     */
    @PostMapping("/logout")
    public Map<String, Boolean> logout(
            HttpServletResponse response,
            Authentication authentication
    ) {
        if (authentication != null && authentication.isAuthenticated()) {
            SecurityContextHolder.clearContext();
            Cookie refreshTokenCooike = new Cookie("Authorization", "");
            refreshTokenCooike.setMaxAge(0);
            refreshTokenCooike.setPath("/");
            response.addCookie(refreshTokenCooike);
            log.debug("[ JWT 로그아웃 성공 ] id: {}", authentication.getName());
            return Map.of("logout", true);
        }
        return Map.of("logout", false);
    }

    /*
     * 로그인 인증
     */
    @GetMapping("/authenticated")
    public Object authentication (
            Authentication authentication
    ) {
        if (authentication == null) {
            log.debug("[ 로그인 여부 및 권한 체크 ] Access Token이 유효하지 않아 권한 불충분");
            return Map.of("authenticated", false);
        }
        return Map.of("authenticated", true);
    }


    /*
     * 회원 가입
     */
    @PostMapping("/signup")
    public ResponseEntity signUp (
            @ModelAttribute @Validated(MemberGroupMarker.SignUp.class) Member member,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        final String no = RandomStringUtils.randomAlphanumeric(8);
        member.setNo(no);

        final String encodedPassword = passwordEncoder.encode(member.getPassword());
        member.setPassword(encodedPassword);

        final Set<SimpleGrantedAuthority> roles = Set.of(new SimpleGrantedAuthority(Role.ROLE_USER.name()));
        member.setRoles(roles);

        memberService.addMember(member);
        return ResponseEntity.ok().build();
    }


    /*
     * 회원 가입 여부 체크
     */
    @GetMapping(value = "/has/member", params = "id")
    public boolean checkExistsMember(
            @RequestParam("id") String id
    ) {
        boolean exists = memberService.existsMemberById(id);
        log.trace("[ 회원 조회 ] id: {}, 존재여부: {}", id, exists);
        return exists;
    }

}

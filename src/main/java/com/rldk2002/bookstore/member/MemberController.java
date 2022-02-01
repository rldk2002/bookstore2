package com.rldk2002.bookstore.member;

import com.fasterxml.jackson.annotation.JsonView;
import com.rldk2002.bookstore.member.service.MemberService;
import com.rldk2002.bookstore.member.validation.MemberGroupMarker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/member")
public class MemberController {
    private final MemberService memberService;

    @JsonView(MemberGroupMarker.Profile.class)
    @GetMapping("/profile")
    public Member getMyMemberProfile(
            @AuthenticationPrincipal(expression = "#this == 'anonymousUser' ? null : no") String memberNo
    ) {
        if (memberNo == null) {
            return null;
        }
        return memberService.getMemberByNo(memberNo);
    }

}

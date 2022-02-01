package com.rldk2002.bookstore.member.service;

import com.rldk2002.bookstore.member.Member;
import com.rldk2002.bookstore.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    private final MemberMapper memberMapper;

    /**
     * 회원 추가
     */
    @PreAuthorize("permitAll()")
    public void addMember (
            Member member
    ) {
        memberMapper.insertMember(member);
    }

    /**
     * 회원 정보 조회
     */
    @PreAuthorize("isAuthenticated() and (#no == principal.no)")
    public Member getMemberByNo(String no) {
        final Map<String, Object> params = Map.of("param", "no", "value", no);
        return memberMapper.selectMember(params);
    }

    /**
     * 회원 정보 조회
     */
    @PreAuthorize("isAuthenticated() and (#id == principal.id)")
    public Member getMemberById(String id) {
        final Map<String, Object> params = Map.of("param", "id", "value", id);
        return memberMapper.selectMember(params);
    }

    /**
     * 회원 존재 여부 확인
     */
    @PreAuthorize("permitAll()")
    public boolean existsMemberById(String id) {
        return getMemberById(id) != null;
    }
}

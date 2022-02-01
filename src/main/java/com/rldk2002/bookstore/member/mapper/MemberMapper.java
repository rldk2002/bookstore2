package com.rldk2002.bookstore.member.mapper;

import com.rldk2002.bookstore.member.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface MemberMapper {
    void insertMember(@Param("member") Member member);
    Member selectMember(Map<String, Object> params);
}

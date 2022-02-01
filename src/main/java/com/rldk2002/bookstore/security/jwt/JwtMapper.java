package com.rldk2002.bookstore.security.jwt;

import com.rldk2002.bookstore.member.Member;
import com.rldk2002.bookstore.security.userdetails.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface JwtMapper {
    void insertRefreshToken(@Param("memberNo") String memberNo, @Param("refresh") String refreshToken);
    Member selectUserDetails(@Param("refresh") String refreshToken);
}

package com.wootae.backend.domain.api.user.controller;
import com.wootae.backend.domain.api.user.dto.PrincipalDetails;
import com.wootae.backend.domain.api.user.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie; // [추가] 스프링이 제공하는 쿠키 유틸
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;

@Component
@RequiredArgsConstructor
public class OAuthLoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        String username = principalDetails.getUsername();

        // [개선 1] Role 추출 로직 안전하게 변경 (Stream 사용)
        Collection<? extends GrantedAuthority> authorities = principalDetails.getAuthorities();
        String role = authorities.stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER"); // 권한이 없을 경우 기본값 설정

        // 토큰 유효시간 변수화 (유지보수 용이)
        long tokenTime = 1000 * 60 * 10L;
        String token = jwtUtil.createJwt(username, role, tokenTime);

        // [개선 2] ResponseCookie 사용 (SameSite 설정 가능)
        ResponseCookie cookie = ResponseCookie.from("Authorization", token)
                .path("/")
                .httpOnly(true)
                .maxAge(tokenTime / 1000) // maxAge는 초 단위입니다 (밀리초 아님 주의!)
                .sameSite("Lax") // [중요] Lax 또는 None. (None은 Secure=true 필수)
                .secure(false) // [중요] 로컬(http)에선 false, 배포(https)에선 true로 변경 필요
                .build();

        // 응답 헤더에 쿠키 추가
        response.addHeader("Set-Cookie", cookie.toString());

        // [팁] 프론트엔드 주소는 설정 파일(application.yml)에서 관리하는 것이 좋습니다.
        response.sendRedirect("http://localhost:5173/");
    }
}
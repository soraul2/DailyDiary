package com.wootae.backend.domain.api.user.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wootae.backend.domain.api.user.dto.PrincipalDetails;
import com.wootae.backend.domain.api.user.dto.UserDTO;
import com.wootae.backend.domain.api.user.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;

@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            // JSON 데이터 파싱
            ObjectMapper objectMapper = new ObjectMapper();
            UserDTO.LoginRequest loginRequest = objectMapper.readValue(request.getInputStream(), UserDTO.LoginRequest.class);

            // 토큰 생성 및 검증 요청
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword(), null);

            return authenticationManager.authenticate(authToken);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {

        PrincipalDetails principalDetails = (PrincipalDetails) authResult.getPrincipal();
        String username = principalDetails.getUsername();

        // [수정] 권한 추출 로직 안전하게 변경
        Collection<? extends GrantedAuthority> authorities = principalDetails.getAuthorities();
        String role = authorities.stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");

        long tokenTime = 1000 * 60 * 10L;
        String token = jwtUtil.createJwt(username, role, tokenTime);

        ResponseCookie cookie = ResponseCookie.from("Authorization", token)
                .path("/")
                .httpOnly(true)
                .maxAge(tokenTime / 1000)
                .sameSite("Lax")
                .secure(false) // 배포 시 true
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        response.setStatus(HttpServletResponse.SC_OK);

        // (선택사항) 프론트에서 쓸 수 있게 JSON 메시지를 바디에 담아줄 수도 있습니다.
        // response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        // response.getWriter().write("{\"message\": \"login success\"}");
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
}
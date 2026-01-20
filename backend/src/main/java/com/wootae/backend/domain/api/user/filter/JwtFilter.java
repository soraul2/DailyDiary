package com.wootae.backend.domain.api.user.filter;

import com.wootae.backend.domain.api.user.dto.PrincipalDetails;
import com.wootae.backend.domain.api.user.entity.User;
import com.wootae.backend.domain.api.user.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 쿠키에서 토큰 추출
        String token = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("Authorization".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        // 2. 토큰이 없으면 -> 그냥 다음 필터로 진행 (인증 없이)
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. 토큰 검증 및 인증 처리
        try {
            // [성능 팁] isExpired를 먼저 호출하지 않고 바로 파싱해도 됩니다.
            // jjwt 라이브러리는 파싱 시 만료되었으면 알아서 ExpiredJwtException을 던집니다.
            // (JwtUtil 구현에 따라 다르지만 보통 파싱 1번으로 처리하는 게 효율적입니다.)

            String username = jwtUtil.getUsername(token);
            String role = jwtUtil.getRole(token);

            // 임시 User 객체 생성 (비밀번호는 null이어도 됨)
            User user = User.builder()
                    .username(username)
                    .password(null)
                    .role(role)
                    .build();

            PrincipalDetails principalDetails = new PrincipalDetails(user);

            // SecurityContext에 인증 정보 저장
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authToken);

        } catch (ExpiredJwtException e) {
            log.info("토큰 만료됨: {}", e.getMessage());

            // [중요 수정] 만료된 토큰이 있으면 쿠키를 삭제해줍니다.
            clearCookie(response);

            // 여기서 401을 바로 리턴하지 않고, '인증 안 된 상태'로 다음 필터로 넘깁니다.
            // -> 공개 페이지면 접속 가능, 비공개면 SecurityConfig가 알아서 막음.

        } catch (JwtException | IllegalArgumentException e) {
            log.warn("유효하지 않은 토큰: {}", e.getMessage());
            clearCookie(response);
        }

        // 4. 결론: 인증이 됐든(Context설정됨), 안 됐든(예외발생) 필터 체인은 계속 흘러가야 합니다.
        filterChain.doFilter(request, response);
    }

    // 쿠키 삭제 헬퍼 메서드
    private void clearCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("Authorization", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}
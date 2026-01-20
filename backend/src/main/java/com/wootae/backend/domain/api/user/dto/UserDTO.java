package com.wootae.backend.domain.api.user.dto;

import com.wootae.backend.domain.api.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

public class UserDTO {

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class LoginRequest{

        @NotBlank(message = "아이디는 필수 입력 값입니다.")
        private String username;
        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        private String password;

    }


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class JoinRequest {

        @NotBlank(message = "아이디는 필수 입력 값입니다.")
        @Size(min = 4, max = 20, message = "아이디는 4~20자 사이여야 합니다.")
        private String username;

        @ToString.Exclude // [보안] 로그에 비밀번호가 찍히지 않도록 제외
        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        @Size(min = 4, max = 20, message = "비밀번호는 4~20자 사이여야 합니다.")
        private String password;

        @NotBlank(message = "닉네임은 필수 입력 값입니다.")
        @Size(min = 2, max = 20, message = "닉네임은 2~20자 사이여야 합니다.") // 닉네임은 보통 2글자 이상
        private String nickname;

        @NotBlank(message = "이메일은 필수 입력 값입니다.")
        @Email(message = "올바른 이메일 형식이 아닙니다.") // [추가] 이메일 형식 검증
        private String email;

        // 소셜 로그인 관련 필드는 일반 가입 시 null일 수 있으므로 @NotBlank 제외
        private String provider;
        private String providerId;

        // [중요] 암호화된 비밀번호를 인자로 받음
        public User toEntity(String encodedPassword) {
            return User.builder()
                    .username(this.username)
                    .password(encodedPassword) // [수정됨] 인자로 받은 암호화된 비밀번호 사용!
                    .nickname(this.nickname)
                    .email(this.email)
                    .role("ROLE_USER")
                    // provider가 null이면 "local"로 설정
                    .provider(this.provider == null || this.provider.isBlank() ? "local" : this.provider)
                    .providerId(this.providerId)
                    .build();
        }
    }



}
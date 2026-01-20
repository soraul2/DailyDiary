package com.wootae.backend.domain.api.user.service;

import com.wootae.backend.domain.api.user.dto.GoogleUserInfo;
import com.wootae.backend.domain.api.user.dto.NaverUserInfo;
import com.wootae.backend.domain.api.user.dto.OAuth2UserInfo;
import com.wootae.backend.domain.api.user.dto.PrincipalDetails;
import com.wootae.backend.domain.api.user.entity.User;
import com.wootae.backend.domain.api.user.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class OAuth2LoginService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public OAuth2LoginService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // 1. 구글/네이버 등에서 사용자 정보 가져오기
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2. 어떤 소셜 로그인인지 확인 (google, naver, kakao...)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2UserInfo oAuth2UserInfo = null;

        if (registrationId.equals("google")) {
            oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
        } else if (registrationId.equals("naver")) {
            oAuth2UserInfo = new NaverUserInfo(oAuth2User.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("지원하지 않는 소셜 로그인입니다.");
        }

        // 3. 표준화된 인터페이스(OAuth2UserInfo)를 통해 데이터 추출
        String provider = oAuth2UserInfo.getProvider();
        String providerId = oAuth2UserInfo.getProviderId();
        String username = provider + "_" + providerId; // google_10293... 충돌 방지
        String email = oAuth2UserInfo.getEmail();
        String nickname = oAuth2UserInfo.getName();

        // 4. DB 저장 또는 조회 로직 (작성하신 부분과 동일하지만 Password 처리 보완)
        User user = userRepository.findByUsername(username).orElseGet(() -> {
            User newUser = User.builder()
                    .username(username)
                    .password(UUID.randomUUID().toString()) // [보완] null 대신 랜덤값 권장
                    .email(email)
                    .nickname(nickname)
                    .role("ROLE_USER")
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            return userRepository.save(newUser);
        });

        // 5. PrincipalDetails 반환 (SuccessHandler에서 사용 가능해짐)
        // attributes 맵도 같이 넣어줘야 나중에 정보 꺼내기 쉽습니다.
        return new PrincipalDetails(user, oAuth2User.getAttributes());
    }
}

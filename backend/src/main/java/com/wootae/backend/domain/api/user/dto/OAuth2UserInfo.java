package com.wootae.backend.domain.api.user.dto;
import java.util.Map;

public interface OAuth2UserInfo {
    String getProviderId(); // 공급자 ID (google의 sub, naver의 id)
    String getProvider();   // google, naver, kakao
    String getEmail();
    String getName();
}
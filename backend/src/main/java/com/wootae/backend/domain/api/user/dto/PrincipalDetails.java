package com.wootae.backend.domain.api.user.dto;

import com.wootae.backend.domain.api.user.entity.User;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Data
public class PrincipalDetails implements UserDetails, OAuth2User {

    private User user; // 우리의 User 엔티티 (콤포지션)
    private Map<String, Object> attributes; // OAuth2 제공 정보 (구글 등)

    // 1. [일반 로그인용 생성자]
    public PrincipalDetails(User user) {
        this.user = user;
    }

    // 2. [OAuth2 로그인용 생성자]
    public PrincipalDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    // === UserDetails 구현 (일반 로그인) ===
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collect = new ArrayList<>();
        collect.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return user.getRole();
            }
        });
        return collect;
    }

    @Override
    public String getPassword() { return user.getPassword(); }

    @Override
    public String getUsername() { return user.getUsername(); }

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }

    // === OAuth2User 구현 (소셜 로그인) ===
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        // 보통 sub(google)나 id(facebook) 같은 PK를 리턴하지만
        // 잘 안 써서 null 처리하거나 별도 로직 넣음
        return user.getUsername();
    }
}
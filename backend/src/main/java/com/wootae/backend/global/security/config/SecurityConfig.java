
package com.wootae.backend.global.security.config;

import com.wootae.backend.domain.api.user.controller.OAuthLoginSuccessHandler;
import com.wootae.backend.domain.api.user.filter.JwtFilter;
import com.wootae.backend.domain.api.user.filter.LoginFilter;
import com.wootae.backend.domain.api.user.service.OAuth2LoginService;
import com.wootae.backend.domain.api.user.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // 필터 위치 지정을 위해 필요
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuth2LoginService oAuth2LoginService;
    private final OAuthLoginSuccessHandler oAuthLoginSuccessHandler;
    private final JwtUtil jwtUtil;
    private final AuthenticationConfiguration authenticationConfiguration;

    @Bean
    BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        AuthenticationManager authenticationManager = authenticationConfiguration.getAuthenticationManager();

        http
                .httpBasic((auth) -> auth.disable())
                .csrf((auth) -> auth.disable())
                .formLogin((auth) -> auth.disable())
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http
                .cors((cors) -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:5173"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                }));

        // [수정 2] 주입받은 객체를 사용 (코드가 훨씬 깔끔해짐)
        http
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(info -> info.userService(oAuth2LoginService))
                        .successHandler(oAuthLoginSuccessHandler)
                );

        http.addFilterAt(new LoginFilter(authenticationManager, jwtUtil), UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);


        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/user/join", "/api/user/login","/login/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .anyRequest().authenticated()
                );


        return http.build();
    }
}
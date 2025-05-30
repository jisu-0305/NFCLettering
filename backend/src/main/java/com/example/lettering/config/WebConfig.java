package com.example.lettering.config;

import com.example.lettering.config.interceptor.KeyringSessionValidationInterceptor;
import com.example.lettering.config.interceptor.SessionValidationInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * SecurityConfig를 통해서 넘어온 api에 대해서 검증
 * 로그인 검증 관련 공통 처리 config
 * 로그인 검증이 필요한 api를 등록하면 됨, 관련 검증은 SessionValidInterceptor 클래스로 위임
 * */

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final SessionValidationInterceptor sessionValidationInterceptor;
    private final KeyringSessionValidationInterceptor keyringSessionValidationInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionValidationInterceptor)
                .addPathPatterns("/api/messages/**", "/api/users/**", "/api/payment/**", "/api/keyrings/**")
                .excludePathPatterns("/api/messages/dear/**", "/api/messages/postcards/dear/**", "/api/messages/letters/dear/**", "/api/users/login", "/api/users/logout","/api/users/signup", "/api/keyrings/designs/**", "/api/keyrings/backoffice", "/api/keyrings/*/delete", "/api/keyrings/nfc-access", "/api/keyrings/custom-message", "/api/messages/unread/**", "/api/messages/highimage", "/api/messages/reply/**", "/api/messages/favorite/**");

        registry.addInterceptor(keyringSessionValidationInterceptor)
                .addPathPatterns("/api/messages/dear/**", "/api/messages/postcards/dear/**", "/api/messages/letters/dear/**", "/api/messages/reply/**", "/api/messages/favorite/**", "/api/messages/unread/**")
                .excludePathPatterns("/api/keyrings/**");
    }
}

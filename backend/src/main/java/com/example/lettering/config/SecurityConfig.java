package com.example.lettering.config;


import com.example.lettering.domain.user.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    @Value("${domain.name}")
    private String domainName;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/","/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**", "/webjars/**", "login/oauth2/**", "/api/**", "/error").permitAll() // ❗️ `/login` 삭제
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/oauth2/authorization/kakao") // 🔹 `/login` 대신 명확하게 설정
                        .successHandler((request, response, authentication) -> {
                            response.sendRedirect(domainName + "home"); // React로 이동
                        })
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                )
                .logout(logout -> logout
                        .logoutUrl("/api/users/logout") // 로그아웃 엔드포인트 지정
                        .logoutSuccessHandler(customLogoutSuccessHandler()) // 커스텀 핸들러 추가
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID") // 세션 쿠키 삭제
                )
                .formLogin(form -> form.disable()); // ❗️ 기존 `formLogin`을 완전히 비활성화

        return http.build();
    }

    @Bean
    public LogoutSuccessHandler customLogoutSuccessHandler() {
        return (HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.Authentication authentication) -> {
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"로그아웃 성공\"}");
            response.getWriter().flush();
        };
    }
}

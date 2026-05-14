package com.smartguardian.app.config;

import lombok.AllArgsConstructor;
import net.javaguides.todo.security.JwtAuthenticationFilter;
import net.javaguides.todo.security.CustomOAuth2SuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.RequestEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequestEntityConverter;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


//import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
//import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequestEntityConverter;
//import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
//import org.springframework.security.oauth2.client.registration.ClientRegistration;
//import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
//import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.RequestEntity;

@Configuration
@EnableMethodSecurity
@AllArgsConstructor
public class SpringSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;  // Inject the custom success handler

    @Bean
    public DefaultAuthorizationCodeTokenResponseClient customOAuth2TokenResponseClient() {
        DefaultAuthorizationCodeTokenResponseClient tokenResponseClient = new DefaultAuthorizationCodeTokenResponseClient();
        tokenResponseClient.setRequestEntityConverter(new OAuth2AuthorizationCodeGrantRequestEntityConverter() {
            @Override
            public RequestEntity<?> convert(OAuth2AuthorizationCodeGrantRequest authorizationCodeGrantRequest) {
                ClientRegistration clientRegistration = authorizationCodeGrantRequest.getClientRegistration();
                RequestEntity<?> request = super.convert(authorizationCodeGrantRequest);

                // Clone the headers and modify them
                HttpHeaders modifiedHeaders = new HttpHeaders();
                modifiedHeaders.putAll(request.getHeaders()); // Clone the original headers

                // Modify headers to use client_secret_post
                if ("client_secret_post".equals(clientRegistration.getClientAuthenticationMethod().getValue())) {
                    modifiedHeaders.set(OAuth2ParameterNames.CLIENT_ID, clientRegistration.getClientId());
                    modifiedHeaders.set(OAuth2ParameterNames.CLIENT_SECRET, clientRegistration.getClientSecret());
                }

                return new RequestEntity<>(request.getBody(), modifiedHeaders, request.getMethod(), request.getUrl());
            }
        });
        return tokenResponseClient;
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //neechy wale code ko uncomment kar dena adat webscoket implement na ho to
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.csrf().disable()
//                .authorizeHttpRequests((authorize) ->
//                        authorize
//                                .requestMatchers("/api/auth/**", "/oauth2/**", "/login/**", "/").permitAll()  // Permit public endpoints
//                                .anyRequest().authenticated()
//                )
//                .oauth2Login(oauth2 ->
//                        oauth2
//                                .successHandler(customOAuth2SuccessHandler)  // Use custom success handler
//                                .failureUrl("/login?error=true")
//                )
//                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//
//        // Optional: Set session management to stateless if it's a REST API
//        http.sessionManagement()
//                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
//
//        // Optional: Add CORS configuration if necessary
//        http.cors();
//
//        // Optional: Security headers for added protection
//        http.headers().frameOptions().sameOrigin();  // Adjust as needed if you're using frames
//
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable() // Disable CSRF for APIs and WebSocket connections
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**", "/oauth2/**", "/login/**", "/ws/**").permitAll() // Allow public access to WebSocket endpoints
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(customOAuth2SuccessHandler)
                        .failureUrl("/login?error=true")
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        http.headers()
                .frameOptions().sameOrigin(); // Allow same-origin frames

        http.cors(); // Enable CORS for cross-origin requests

        http.sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS); // Stateless sessions for REST APIs

        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}


//(oauth2 ->  // OAuth2 login configuration
//        oauth2
//        .loginPage("/login")  // You can specify a custom login page if you have one
//                                .defaultSuccessUrl("/dashboard") // Redirect URL after successful OAuth2 login
//                                .failureUrl("/login?error=true") // Redirect URL after OAuth2 login failure
//                                .permitAll()
//                );
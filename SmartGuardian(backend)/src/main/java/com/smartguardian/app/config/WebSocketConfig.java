package com.smartguardian.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple memory-based message broker for all topics
        // This maintains existing functionality and adds new topics
        config.enableSimpleBroker(
                "/topic",                    // Maintain existing general topic
                "/topic/geofence-entries",   // Specific topic for entries (optional)
                "/topic/geofence-exits", // New topic for exits
                "/topic/locations"        // Add this new topic
        );

        // Maintain existing application prefix
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Keep existing WebSocket endpoint configuration
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Allow all origins (adjust in production)
                .withSockJS(); // Enable SockJS fallback
    }
}
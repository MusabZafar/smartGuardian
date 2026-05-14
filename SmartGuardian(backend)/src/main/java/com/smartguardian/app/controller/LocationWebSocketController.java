package com.smartguardian.app.controller;

import net.javaguides.todo.dto.LocationUpdateDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class LocationWebSocketController {

    @MessageMapping("/location")
    @SendTo("/topic/locations")
    public LocationUpdateDTO handleLocationUpdate(
            LocationUpdateDTO location,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        // Get username from WebSocket session attributes
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        location.setUsername(username);
        return location;
    }
}

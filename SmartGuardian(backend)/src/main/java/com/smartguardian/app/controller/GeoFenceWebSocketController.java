package com.smartguardian.app.controller;

import net.javaguides.todo.dto.GeoFenceEntryDTO;
import net.javaguides.todo.dto.LocationUpdateDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class GeoFenceWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public GeoFenceWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Method to broadcast GeoFence entry via service or controller
    public void broadcastGeoFenceEntry(GeoFenceEntryDTO geoFenceEntryDTO) {
        System.out.println("Broadcasting GeoFenceEntry: " + geoFenceEntryDTO);
        messagingTemplate.convertAndSend("/topic/geofence-entries", geoFenceEntryDTO);
    }


    // Method to broadcast GeoFence exit
    public void broadcastGeoFenceExit(GeoFenceEntryDTO geoFenceEntryDTO) {
        System.out.println("Broadcasting GeoFence Exit: " + geoFenceEntryDTO);
        messagingTemplate.convertAndSend("/topic/geofence-exits", geoFenceEntryDTO);
    }

    // Add this method to your existing GeoFenceWebSocketController
    @MessageMapping("/location/update")
    @SendTo("/topic/locations")
    public LocationUpdateDTO handleLocationUpdate(LocationUpdateDTO locationUpdate) {
        System.out.println("Received location update: " + locationUpdate);
        return locationUpdate;
    }
}

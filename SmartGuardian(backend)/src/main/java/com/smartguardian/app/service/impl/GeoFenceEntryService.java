package com.smartguardian.app.service.impl;

import net.javaguides.todo.controller.GeoFenceWebSocketController;
import net.javaguides.todo.dto.GeoFenceEntryDTO;
import net.javaguides.todo.entity.GeoFenceEntry;
import net.javaguides.todo.repository.GeoFenceEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class GeoFenceEntryService {

    @Autowired
    private GeoFenceEntryRepository geoFenceEntryRepository;

    @Autowired
    private GeoFenceWebSocketController webSocketController;
    @Autowired
    private WhatsAppService whatsAppService;

    public GeoFenceEntry createGeoFenceEntry(GeoFenceEntryDTO geoFenceEntryDTO) {
        GeoFenceEntry geoFenceEntry = new GeoFenceEntry();
        geoFenceEntry.setGeoFenceId(geoFenceEntryDTO.getGeoFenceId());
        geoFenceEntry.setGeoFenceName(geoFenceEntryDTO.getGeoFenceName());
        geoFenceEntry.setEntryTime(geoFenceEntryDTO.getEntryTime());
        geoFenceEntry.setSelectedUsers(geoFenceEntryDTO.getSelectedUsers());
        geoFenceEntry.setSelectedGroups(geoFenceEntryDTO.getSelectedGroups());
        geoFenceEntry.setLatitude(geoFenceEntryDTO.getLatitude());
        geoFenceEntry.setLongitude(geoFenceEntryDTO.getLongitude());

        // Save the entry
        GeoFenceEntry savedEntry = geoFenceEntryRepository.save(geoFenceEntry);

        // Broadcast the entry via WebSocket
        webSocketController.broadcastGeoFenceEntry(geoFenceEntryDTO);
// Send WhatsApp notification
        String message = String.format(
                "New GeoFence Entry:\nFence: %s\nTime: %s\nUsers: %s",
                geoFenceEntryDTO.getGeoFenceName(),
                geoFenceEntryDTO.getEntryTime(),
                String.join(", ", geoFenceEntryDTO.getSelectedUsers())
        );
        whatsAppService.sendWhatsAppMessage("+923315129893", message);
        return savedEntry;
    }


    public GeoFenceEntry recordExit(Long id, GeoFenceEntryDTO geoFenceEntryDTO) {
        GeoFenceEntry entry = geoFenceEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        entry.setExitTime(geoFenceEntryDTO.getExitTime());
        entry.setActive(false);

        // Add the last known location
        entry.setLastKnownLatitude(geoFenceEntryDTO.getLatitude());
        entry.setLastKnownLongitude(geoFenceEntryDTO.getLongitude());
        entry.setLocationUpdateTime(LocalDateTime.now());

        // Calculate time spent
        if (entry.getEntryTime() != null && geoFenceEntryDTO.getExitTime() != null) {
            long timeSpentMinutes = java.time.Duration.between(
                    entry.getEntryTime(),
                    geoFenceEntryDTO.getExitTime()
            ).toMinutes();
            entry.setTimeSpentMinutes(timeSpentMinutes);
        }

        GeoFenceEntry updatedEntry = geoFenceEntryRepository.save(entry);

        // Broadcast the exit via WebSocket
        webSocketController.broadcastGeoFenceExit(geoFenceEntryDTO);

        // Send WhatsApp notification
        String message = String.format(
                "GeoFence Exit:\nFence: %s\nExit Time: %s\nTime Spent: %d minutes\nLast Known Location: %.6f, %.6f",
                entry.getGeoFenceName(),
                geoFenceEntryDTO.getExitTime(),
                entry.getTimeSpentMinutes(),
                entry.getLastKnownLatitude(),
                entry.getLastKnownLongitude()
        );
        whatsAppService.sendWhatsAppMessage("+923315129893", message);

        return updatedEntry;
    }
}

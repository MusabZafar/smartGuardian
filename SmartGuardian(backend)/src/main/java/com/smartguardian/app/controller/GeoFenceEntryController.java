package com.smartguardian.app.controller;

import net.javaguides.todo.dto.GeoFenceEntryDTO;
import net.javaguides.todo.entity.GeoFenceEntry;
import net.javaguides.todo.service.impl.GeoFenceEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/geofence-entries")
public class    GeoFenceEntryController {

    @Autowired
    private GeoFenceEntryService geoFenceEntryService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createGeoFenceEntry(@RequestBody GeoFenceEntryDTO geoFenceEntryDTO) {
        // Log incoming DTO
        System.out.println("Received GeoFenceEntryDTO: " + geoFenceEntryDTO);

        GeoFenceEntry createdEntry = geoFenceEntryService.createGeoFenceEntry(geoFenceEntryDTO);

        Map<String, Object> response = new HashMap<>();
        response.put("id", createdEntry.getId());
        response.put("geoFenceId", createdEntry.getGeoFenceId());
        response.put("geoFenceName", createdEntry.getGeoFenceName());
        response.put("entryTime", createdEntry.getEntryTime().toString());
        response.put("selectedUsers", createdEntry.getSelectedUsers());
        response.put("selectedGroups", createdEntry.getSelectedGroups());
        response.put("latitude", createdEntry.getLatitude());
        response.put("longitude", createdEntry.getLongitude());

        // Log response

        System.out.println("sending data as a response back");
        System.out.println("Sending response: " + response);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/exit")
    public ResponseEntity<Map<String, Object>> recordGeoFenceExit(
            @PathVariable Long id,
            @RequestBody GeoFenceEntryDTO geoFenceEntryDTO) {

        GeoFenceEntry updatedEntry = geoFenceEntryService.recordExit(id, geoFenceEntryDTO);

        Map<String, Object> response = new HashMap<>();
        response.put("id", updatedEntry.getId());
        response.put("geoFenceId", updatedEntry.getGeoFenceId());
        response.put("exitTime", updatedEntry.getExitTime().toString());
        response.put("timeSpentMinutes", updatedEntry.getTimeSpentMinutes());
        response.put("lastKnownLatitude", updatedEntry.getLastKnownLatitude());
        response.put("lastKnownLongitude", updatedEntry.getLastKnownLongitude());
        response.put("locationUpdateTime", updatedEntry.getLocationUpdateTime().toString());
        response.put("status", "Exit recorded successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
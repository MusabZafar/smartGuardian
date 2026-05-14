package com.smartguardian.app.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class GeoFenceEntryDTO {
    private Long geoFenceId;
    private String geoFenceName;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;  // New field
    private Long timeSpentMinutes; // New field
    private boolean isActive;
    private List<String> selectedUsers;
    private List<String> selectedGroups;
    private double latitude;
    private double longitude;

    private double lastKnownLatitude;
    private double lastKnownLongitude;
    private LocalDateTime locationUpdateTime;
}
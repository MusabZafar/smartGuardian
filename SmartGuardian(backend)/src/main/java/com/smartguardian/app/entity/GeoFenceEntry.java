package com.smartguardian.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class GeoFenceEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long geoFenceId;
    private String geoFenceName;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;  // New field
    private Long timeSpentMinutes; // New field to store time spent in minutes
    private boolean isActive;
    @ElementCollection
    private List<String> selectedUsers;

    @ElementCollection
    private List<String> selectedGroups;

    private double latitude;
    private double longitude;
    private double lastKnownLatitude;
    private double lastKnownLongitude;
    private LocalDateTime locationUpdateTime;
}
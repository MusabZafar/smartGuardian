package com.smartguardian.app.dto;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LocationUpdateDTO {
    private double latitude;
    private double longitude;
    private long timestamp;
    private String username;



}


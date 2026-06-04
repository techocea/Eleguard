package com.basic.elepent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class SensorEnrollmentReqestDTO {
    private String sectionId;
    private String farmername;
    private int water_canal_present;
    private int forest_distance_m;
    private Boolean active;
    private String GPS_Location;


}

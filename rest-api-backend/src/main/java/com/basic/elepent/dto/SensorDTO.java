package com.basic.elepent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SensorDTO {

    private String sectionId;
    private String season ;
    private String  moon_phase;
    private String crop_type ;
    private String     crop_maturity_stage;
    private int hour_of_day;
    private int night;
    private  double temperature_c;
    private double l_last_24h_mm ;
    private int days_to_harvest;
    private int water_canal_present;   // this
    private int forest_distance_m;      // this
    private int riggered_last_1hr;
    private int triggered_last_6hrs;
    private boolean s_last_7days;
    private boolean ection_triggered_yesterday;
    private int closest_detection_last_24h_m;
    private double _risk_score_last_week;
    private double   neighbor_max_risk_score;
    private boolean neighbor_any_triggered_1hr;
    private int inutes_since_last_trigger;
    private double ecay_factor;
    private String farmername;

}

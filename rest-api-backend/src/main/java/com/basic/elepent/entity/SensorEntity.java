package com.basic.elepent.entity;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;




@NoArgsConstructor
@Data
@Document(collection = "Sensors")

public class SensorEntity {
    @Id
    @Indexed(unique = true)
    private String  Id;
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
    private int water_canal_present;
    private int forest_distance_m;
    private int riggered_last_1hr;
    private int triggered_last_6hrs;
    private boolean s_last_7days;
    private boolean ection_triggered_yesterday;
    private int closest_detection_last_24h_m;
    private double _risk_score_last_week;
    private double      neighbor_max_risk_score;
    private boolean neighbor_any_triggered_1hr;
    private int inutes_since_last_trigger;
    private double ecay_factor;
    private String farmername;

    public SensorEntity(String sectionId, String season, String moon_phase, String crop_type, String crop_maturity_stage, int hour_of_day, int night, double temperature_c, double l_last_24h_mm, int days_to_harvest, int water_canal_present, int forest_distance_m, int riggered_last_1hr, int triggered_last_6hrs, boolean s_last_7days, boolean ection_triggered_yesterday, int closest_detection_last_24h_m, double _risk_score_last_week, double neighbor_max_risk_score, boolean neighbor_any_triggered_1hr, int inutes_since_last_trigger, double ecay_factor,String farmername) {
        this.sectionId = sectionId;
        this.season = season;
        this.moon_phase = moon_phase;
        this.crop_type = crop_type;
        this.crop_maturity_stage = crop_maturity_stage;
        this.hour_of_day = hour_of_day;
        this.night = night;
        this.temperature_c = temperature_c;
        this.l_last_24h_mm = l_last_24h_mm;
        this.days_to_harvest = days_to_harvest;
        this.water_canal_present = water_canal_present;
        this.forest_distance_m = forest_distance_m;
        this.riggered_last_1hr = riggered_last_1hr;
        this.triggered_last_6hrs = triggered_last_6hrs;
        this.s_last_7days = s_last_7days;
        this.ection_triggered_yesterday = ection_triggered_yesterday;
        this.closest_detection_last_24h_m = closest_detection_last_24h_m;
        this._risk_score_last_week = _risk_score_last_week;
        this.neighbor_max_risk_score = neighbor_max_risk_score;
        this.neighbor_any_triggered_1hr = neighbor_any_triggered_1hr;
        this.inutes_since_last_trigger = inutes_since_last_trigger;
        this.ecay_factor = ecay_factor;
        this.farmername = farmername;
    }
}

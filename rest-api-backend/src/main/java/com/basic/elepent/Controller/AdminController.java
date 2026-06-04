package com.basic.elepent.Controller;


import com.basic.elepent.dto.*;
import com.basic.elepent.entity.FarmerEntity;
import com.basic.elepent.entity.SensorEntity;
import com.basic.elepent.service.AdminService;
import com.basic.elepent.service.AuthService;
import com.basic.elepent.service.SensorService;
import com.basic.elepent.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v1/admin")
public class AdminController {


    private final SensorService sensorService;
    private final UserService userService;
    private final AdminService adminService;
    private final AuthService authService;

    public AdminController(SensorService sensorService, UserService userService, AdminService adminService, AuthService authService) {
        this.sensorService = sensorService;
        this.userService = userService;
        this.adminService = adminService;
        this.authService = authService;
    }

    @PostMapping("/AddSensorData")
    public ResponseEntity<SensorRespondDTO> addSensorData(@RequestBody SensorDTO dto){

        FarmerEntity farmer = userService.findFarmerByUsername(dto.getFarmername());

        if(farmer == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        SensorEntity data = new SensorEntity(
                dto.getSectionId(),
                dto.getSeason(),
                dto.getMoon_phase(),
                dto.getCrop_type(),
                dto.getCrop_maturity_stage(),
                dto.getHour_of_day(),
                dto.getNight(),
                dto.getTemperature_c(),
                dto.getL_last_24h_mm(),
                dto.getDays_to_harvest(),
                dto.getWater_canal_present(),
                dto.getForest_distance_m(),
                dto.getRiggered_last_1hr(),
                dto.getTriggered_last_6hrs(),
                dto.isS_last_7days(),
                dto.isEction_triggered_yesterday(),
                dto.getClosest_detection_last_24h_m(),
                dto.get_risk_score_last_week(),
                dto.getNeighbor_max_risk_score(),
                dto.isNeighbor_any_triggered_1hr(),
                dto.getInutes_since_last_trigger(),
                dto.getEcay_factor(), dto.getFarmername());

        SensorRespondDTO respond =  sensorService.addSensorData(data);

        if(respond == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(respond, HttpStatus.OK);
    }



    @GetMapping("/Sensor")
    public ResponseEntity<List<SensorEntity>> sensorData(@RequestParam String sectionId){
        List<SensorEntity> data = sensorService.SecsorDataBySensorId(sectionId);
        if(data.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/SensorByName")
    public ResponseEntity<List<SensorEntity>> sensorDataByFarmerName(@RequestParam String farmername){
        List<SensorEntity> data = sensorService.SecsorDataBySensorName(farmername);
        if(data.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(data, HttpStatus.OK);
    }


    @PostMapping("/AddSensor")
    public ResponseEntity<SensorEnrollmentRespondDTO> addSensor(@RequestBody SensorEnrollmentReqestDTO dto){
        SensorEnrollmentRespondDTO data = userService.sensorEnrollment(dto);
        if(data == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(data, HttpStatus.OK);
    }


    @PostMapping("/activeness")
    public ResponseEntity<SensorActivenessDTO> activeness(@RequestBody SensorActivenessDTO dto){
        SensorActivenessDTO data = sensorService.sensorActiveness(dto);
        if(data.getFarmername() == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(data, HttpStatus.OK);
    }


    @PostMapping("/allFarmer")
    public ResponseEntity<List<FarmerEntity>> allFarmer(){
        List<FarmerEntity> data= adminService.findall();
        if(data.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PostMapping("/addadmin")
    public ResponseEntity<RegisterRespondDTO> AdminRegister(@RequestBody UserDTO dto) {


        RegisterReqestDTO Admin = new RegisterReqestDTO(dto.getUsername(), dto.getPassword(), dto.getEmail(), LocalDateTime.now(), dto.getFullname(), dto.getPhonemumber(), dto.getLocation(), null,null,null,null,null,null,null);
        Admin.setRole("ADMIN");
        RegisterRespondDTO respont =   authService.RegisterFarmer(Admin);
        if(respont == null){
            return  new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        System.out.println("Admin is enrolleed");
        return new ResponseEntity<>(respont, HttpStatus.OK);

    }


}

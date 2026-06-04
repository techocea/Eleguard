package com.basic.elepent.service;


import com.basic.elepent.dto.*;
import com.basic.elepent.entity.FarmerEntity;
import com.basic.elepent.entity.SensorEnrollmentEntity;
import com.basic.elepent.repository.SensorEnrollmentRepository;
import com.basic.elepent.repository.FarmerRepository;

import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class UserService {
    private final FarmerRepository farmerRepository;
    private final SensorEnrollmentRepository sensorEnrollmentRepository;



    public UserService(FarmerRepository farmerRepository, SensorEnrollmentRepository sensorEnrollmentRepository) {
        this.farmerRepository = farmerRepository;

        this.sensorEnrollmentRepository = sensorEnrollmentRepository;
    }





    public  FarmerEntity findFarmerByUsername(String username) {
        FarmerEntity farmer = farmerRepository.findByUsername(username).orElse(null);
        return farmer;
    }





    public SensorEnrollmentRespondDTO sensorEnrollment(SensorEnrollmentReqestDTO data){
        FarmerEntity farmer= farmerRepository.findByUsername(data.getFarmername()).orElse(null);
        if(isExist(data.getSectionId(), data.getFarmername())){ return  new SensorEnrollmentRespondDTO(null,"data  is already add",true,false);}
        if(farmer==null){
            return  new SensorEnrollmentRespondDTO(null,"farmer not found",true,false);
        }
        SensorEnrollmentEntity sensor =  new SensorEnrollmentEntity( data.getFarmername(), data.getSectionId(), data.getWater_canal_present(), data.getForest_distance_m(), Instant.now(),true, data.getGPS_Location());
        SensorEnrollmentEntity respond =  sensorEnrollmentRepository.save(sensor);
        return  new SensorEnrollmentRespondDTO(respond.getId(),"success",false,true);
    }


        public  Boolean isExist(String sectionId,String farmername){
                return sensorEnrollmentRepository.findByFarmernameAndSectionId(farmername,sectionId).isPresent();
        }


}

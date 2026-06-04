package com.basic.elepent.service;



import com.basic.elepent.dto.SensorActivenessDTO;
import com.basic.elepent.dto.SensorRespondDTO;
import com.basic.elepent.entity.SensorEnrollmentEntity;
import com.basic.elepent.entity.SensorEntity;
import com.basic.elepent.repository.SensorEnrollmentRepository;
import com.basic.elepent.repository.SensorRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class SensorService {

    private final SensorRepository sensorRepository;
    private final SensorEnrollmentRepository sensorEnrollmentRepository;

    public SensorService(SensorRepository sensorRepository, SensorEnrollmentRepository sensorEnrollmentRepository) {
        this.sensorRepository = sensorRepository;
        this.sensorEnrollmentRepository = sensorEnrollmentRepository;
    }

    public SensorRespondDTO addSensorData(SensorEntity data) {

        SensorEntity respond = sensorRepository.save(data);

        if (respond == null) {
            return new SensorRespondDTO(null, null, "error", true);
        }
        return new SensorRespondDTO(respond.getId(), respond.getSectionId(), "success", false);

    }



    public List<SensorEntity> SecsorDataBySensorId(String sensorId){

        List<SensorEntity> sensors = sensorRepository.findBySectionId(sensorId);
        return sensors;
    }

    public List<SensorEntity> SecsorDataBySensorName(String famername){
        List<SensorEntity> sensors = sensorRepository.findByFarmername(famername);
        return sensors;
    }


    public SensorActivenessDTO sensorActiveness(SensorActivenessDTO data){
        SensorEnrollmentEntity exsitDATA= sensorEnrollmentRepository.findByFarmernameAndSectionId(data.getFarmername(),data.getSensorId()).orElse(null);
        if(exsitDATA==null){
            return  new SensorActivenessDTO(null,null,null);
        }
        exsitDATA.setActive(data.getActive());
        SensorEnrollmentEntity updatedData= sensorEnrollmentRepository.save(exsitDATA);
        return   new SensorActivenessDTO(exsitDATA.getSectionId(), exsitDATA.getFarmername(), exsitDATA.getActive());

    }


}

package com.basic.elepent.repository;
import com.basic.elepent.entity.SensorEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface SensorRepository extends MongoRepository<SensorEntity, String> {
  List<SensorEntity> findBySectionId(String sectionId);
  List<SensorEntity> findByFarmername(String farmername);
}

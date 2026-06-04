package com.basic.elepent.repository;

import com.basic.elepent.entity.SensorEnrollmentEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SensorEnrollmentRepository extends MongoRepository<SensorEnrollmentEntity, String> {
    Optional<SensorEnrollmentEntity> findByFarmernameAndSectionId(String farmername,String sectionid);
    Optional<SensorEnrollmentEntity> findBySectionId(String sectionid);
}

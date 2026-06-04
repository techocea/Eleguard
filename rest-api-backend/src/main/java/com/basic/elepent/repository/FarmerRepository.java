package com.basic.elepent.repository;


import com.basic.elepent.entity.FarmerEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface FarmerRepository extends MongoRepository<FarmerEntity, String> {
    Optional<FarmerEntity> findByUsername(String username);

}

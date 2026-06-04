package com.basic.elepent.service;

import com.basic.elepent.entity.FarmerEntity;
import com.basic.elepent.repository.FarmerRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AdminService {



    private final FarmerRepository farmerRepository;


    public AdminService(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }


    public List<FarmerEntity> findall(){
        List<FarmerEntity> data  = farmerRepository.findAll();
        return data;
    }





}

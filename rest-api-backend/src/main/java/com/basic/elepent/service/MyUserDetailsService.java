package com.basic.elepent.service;


import com.basic.elepent.entity.FarmerEntity;
import com.basic.elepent.repository.FarmerRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class MyUserDetailsService implements UserDetailsService {

    private final FarmerRepository farmerRepository;

    public MyUserDetailsService(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }




    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        FarmerEntity farmer = farmerRepository.findByUsername(username).orElse(null);
        if (farmer == null) {
            throw new UsernameNotFoundException(username);
        }

        UserDetails user = User.builder()
                .username(farmer.getUsername())
                .password(farmer.getPassword())
                .build();

        return user;
    }
}


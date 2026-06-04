package com.basic.elepent.configure;

import com.basic.elepent.Filter.JWTFilter;
import com.basic.elepent.repository.FarmerRepository;
import com.basic.elepent.service.MyUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private  final JWTFilter jwtFilter;
    private  final FarmerRepository farmerRepository;

    public SecurityConfig(JWTFilter jwtFilter, FarmerRepository farmerRepository) {
        this.jwtFilter = jwtFilter;
        this.farmerRepository = farmerRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(c->c.disable())
                .sessionManagement( s->s.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS
                ))
                .authorizeHttpRequests(r->

                        r.requestMatchers("/api/v1/admin/**").hasAnyAuthority("ADMIN")

                                .requestMatchers("/api/v1/farmer/**").hasAnyAuthority("ADMIN")
                                .requestMatchers("/api/v1/farmer/**").hasAnyAuthority("USER")
                        .requestMatchers("/api/v1/auth/login","/api/v1/auth/register")
                        .permitAll()
                        .anyRequest().
                        authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(authenticationProvider())
                .build();
    }


    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return   new MyUserDetailsService(farmerRepository);
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) {

        return configuration.getAuthenticationManager();
    }
}

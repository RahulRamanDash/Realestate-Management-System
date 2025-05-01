package com.server.RealestateApiServer.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.server.RealestateApiServer.Entity.Property;

public interface PropertyRepository extends JpaRepository<Property, Long>{

    List<Property> findByAgentId(Long agentId);
    List<Property> findByCity(String city);
    List<Property> findByType(String type);
    List<Property> findByPriceBetween(double minPrice, double maxPrice);
}

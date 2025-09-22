package com.server.RealestateApiServer.Service;

import java.util.List;

import com.server.RealestateApiServer.Entity.Property;

public interface PropertyService {


    Property findById(String id);
    List<Property> findAll();
    List<Property> findByAgentId(String agentId);
    List<Property> findByCity(String city);
    List<Property> findByType(String type);
    List<Property> findByPriceBetween(double minPrice, double maxPrice);



}

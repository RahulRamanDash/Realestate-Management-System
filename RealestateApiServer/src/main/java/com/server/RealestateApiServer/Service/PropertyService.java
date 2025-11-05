package com.server.RealestateApiServer.Service;

import java.util.List;

import com.server.RealestateApiServer.Entity.Property;
import org.springframework.web.bind.annotation.RequestBody;

public interface PropertyService {


    Property findById(String id);
    List<Property> findAll();
    List<Property> findByAgentId(String agentId);
    List<Property> findByBuyerId(String agentId);
    List<Property> findByCity(String city);
    List<Property> findByType(String type);
    List<Property> findByPriceBetween(double minPrice, double maxPrice);
    Property addProperty(Property property);


}

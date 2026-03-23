package com.server.RealestateApiServer.Service;

import java.util.List;

import com.server.RealestateApiServer.Dto.PropertyPageResponse;
import com.server.RealestateApiServer.Entity.Property;

public interface PropertyService {


    Property findById(String id);
    List<Property> findAll();
    List<Property> findByAgentId(String agentId);
    List<Property> findByBuyerId(String agentId);
    List<Property> findByCity(String city);
    List<Property> findByType(String type);
    List<Property> findByPriceBetween(double minPrice, double maxPrice);
    PropertyPageResponse searchProperties(String city, String type, String availability, Double minPrice, Double maxPrice, int page, int size);
    Property addProperty(Property property);
    Property updateProperty(String id, Property property);
    Property purchaseProperty(String id, String buyerId);
    void deleteProperty(String id);


}

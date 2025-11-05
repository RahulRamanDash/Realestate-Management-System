package com.server.RealestateApiServer.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.server.RealestateApiServer.Entity.Property;
import com.server.RealestateApiServer.Repository.PropertyRepository;

@Service
public class PropertyServiceImpl implements PropertyService{

    @Autowired
    private PropertyRepository propertyRepository;

    @Override
    public Property findById(String id) {
        return propertyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
    }

    @Override
    public List<Property> findAll() {
        
        return propertyRepository.findAll();
    }

    @Override
    public List<Property> findByAgentId(String agentId) {
       return propertyRepository.findByAgentId(agentId);
    }

    @Override
    public List<Property> findByBuyerId(String buyerId) {
        return propertyRepository.findByBuyerId(buyerId);
    }

    @Override
    public List<Property> findByCity(String city) {
        return propertyRepository.findByCity(city);
       
    }

    @Override
    public List<Property> findByType(String type) {
        return propertyRepository.findByType(type);
       
    }

    @Override
    public List<Property> findByPriceBetween(double minPrice, double maxPrice) {
        return propertyRepository.findByPriceBetween(minPrice, maxPrice);
       
    }

    @Override
    public Property addProperty(Property property) {
        return propertyRepository.save(property);
    }

}

package com.server.RealestateApiServer.Repository;

import com.server.RealestateApiServer.Entity.Property;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PropertyRepository extends MongoRepository<Property, String> {

    List<Property> findByAgentId(String agentId);
    List<Property> findByCity(String city);
    List<Property> findByType(String type);
    List<Property> findByPriceBetween(double minPrice, double maxPrice);
}

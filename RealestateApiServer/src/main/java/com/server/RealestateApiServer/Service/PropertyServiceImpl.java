package com.server.RealestateApiServer.Service;

import java.util.ArrayList;
import java.util.List;

import com.server.RealestateApiServer.Dto.PropertyPageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.server.RealestateApiServer.Entity.Property;
import com.server.RealestateApiServer.Repository.PropertyRepository;

@Service
public class PropertyServiceImpl implements PropertyService{

    @Autowired
    private PropertyRepository propertyRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

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
    public PropertyPageResponse searchProperties(String city, String type, String availability, Double minPrice, Double maxPrice, int page, int size) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (city != null && !city.isBlank()) {
            criteriaList.add(Criteria.where("city").regex(city.trim(), "i"));
        }

        if (type != null && !type.isBlank()) {
            criteriaList.add(Criteria.where("type").is(type.trim()));
        }

        if (availability != null && !availability.isBlank()) {
            if ("available".equalsIgnoreCase(availability.trim())) {
                criteriaList.add(Criteria.where("available").is(true));
                criteriaList.add(new Criteria().orOperator(
                        Criteria.where("buyerId").is(null),
                        Criteria.where("buyerId").is("")
                ));
            } else if ("sold".equalsIgnoreCase(availability.trim())) {
                criteriaList.add(new Criteria().orOperator(
                        Criteria.where("available").is(false),
                        new Criteria().andOperator(
                                Criteria.where("buyerId").ne(null),
                                Criteria.where("buyerId").ne("")
                        )
                ));
            }
        }

        if (minPrice != null) {
            criteriaList.add(Criteria.where("price").gte(minPrice));
        }

        if (maxPrice != null) {
            criteriaList.add(Criteria.where("price").lte(maxPrice));
        }

        Query query = new Query();
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        long totalElements = mongoTemplate.count(query, Property.class);
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));
        query.with(pageable);

        List<Property> content = mongoTemplate.find(query, Property.class);
        int totalPages = totalElements == 0 ? 0 : (int) Math.ceil((double) totalElements / pageable.getPageSize());

        return new PropertyPageResponse(
                content,
                totalElements,
                totalPages,
                pageable.getPageNumber(),
                pageable.getPageSize(),
                pageable.getOffset() + content.size() < totalElements,
                pageable.getPageNumber() > 0
        );
    }

    @Override
    public Property addProperty(Property property) {
        if (property.getBuyerId() == null || property.getBuyerId().isBlank()) {
            property.setAvailable(true);
            property.setBuyerId(null);
        } else {
            property.setAvailable(false);
        }
        return propertyRepository.save(property);
    }

    @Override
    public Property updateProperty(String id, Property property) {
        Property existingProperty = findById(id);

        existingProperty.setTitle(property.getTitle());
        existingProperty.setDescription(property.getDescription());
        existingProperty.setAddress(property.getAddress());
        existingProperty.setCity(property.getCity());
        existingProperty.setState(property.getState());
        existingProperty.setPrice(property.getPrice());
        existingProperty.setType(property.getType());
        existingProperty.setAvailable(property.isAvailable());
        existingProperty.setImageUrls(property.getImageUrls());
        existingProperty.setAgentId(property.getAgentId());
        existingProperty.setBuyerId(property.getBuyerId());
        if (existingProperty.getBuyerId() != null && !existingProperty.getBuyerId().isBlank()) {
            existingProperty.setAvailable(false);
        }

        return propertyRepository.save(existingProperty);
    }

    @Override
    public Property purchaseProperty(String id, String buyerId) {
        Property property = findById(id);

        if (buyerId == null || buyerId.isBlank()) {
            throw new IllegalArgumentException("Buyer id is required");
        }

        if (!property.isAvailable() || (property.getBuyerId() != null && !property.getBuyerId().isBlank())) {
            throw new IllegalStateException("Property is already sold");
        }

        property.setBuyerId(buyerId);
        property.setAvailable(false);

        return propertyRepository.save(property);
    }

    @Override
    public void deleteProperty(String id) {
        Property existingProperty = findById(id);
        propertyRepository.delete(existingProperty);
    }

}

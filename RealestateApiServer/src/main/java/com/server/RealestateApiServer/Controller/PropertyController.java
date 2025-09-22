package com.server.RealestateApiServer.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.server.RealestateApiServer.Entity.Property;
import com.server.RealestateApiServer.Service.PropertyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;




@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/properties")
public class PropertyController {
    @Autowired
    private PropertyService propertyService;
    
   @GetMapping
   public ResponseEntity<List<Property>> getAllProperties(){
    List<Property> properties = propertyService.findAll();
    return ResponseEntity.ok(properties);
   }

   @GetMapping("/{id}")
   public ResponseEntity<Property> getPropertyById(@PathVariable String id){
    return ResponseEntity.ok(propertyService.findById(id));
   }

   @GetMapping("/agent/{agentId}")
   public ResponseEntity<List<Property>> getPropertiesByAgentId(@PathVariable String agentId){
    return ResponseEntity.ok(propertyService.findByAgentId(agentId));
   }

   @GetMapping("/city/{city}")
   public ResponseEntity<List<Property>> getPropertiesByCity(@PathVariable String city){
    return ResponseEntity.ok(propertyService.findByCity(city));
   }

   @GetMapping("/type/{type}")
   public ResponseEntity<List<Property>> getPropertiesByType(@PathVariable String type){
    return ResponseEntity.ok(propertyService.findByType(type));
   }

   @GetMapping("/price")
   public ResponseEntity<List<Property>> getPropertiesByPrice(@RequestParam double minPrice, @RequestParam double maxPrice) {
       return ResponseEntity.ok(propertyService.findByPriceBetween(minPrice, maxPrice));
   }
   
}
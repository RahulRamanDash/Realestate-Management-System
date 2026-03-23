package com.server.RealestateApiServer.Controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.server.RealestateApiServer.Dto.PropertyPageResponse;
import com.server.RealestateApiServer.Entity.Property;
import com.server.RealestateApiServer.Service.PropertyService;
import org.springframework.web.multipart.MultipartFile;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private PropertyService propertyService;
    
   @GetMapping
   public ResponseEntity<List<Property>> getAllProperties(@RequestParam(required = false) String agentId){
    List<Property> properties = agentId != null && !agentId.isBlank()
            ? propertyService.findByAgentId(agentId)
            : propertyService.findAll();
    return ResponseEntity.ok(properties);
   }

   @GetMapping("/search")
   public ResponseEntity<PropertyPageResponse> searchProperties(
           @RequestParam(required = false) String city,
           @RequestParam(required = false) String type,
           @RequestParam(required = false) String availability,
           @RequestParam(required = false) Double minPrice,
           @RequestParam(required = false) Double maxPrice,
           @RequestParam(defaultValue = "0") int page,
           @RequestParam(defaultValue = "9") int size
   ) {
    return ResponseEntity.ok(propertyService.searchProperties(city, type, availability, minPrice, maxPrice, page, size));
   }

   @GetMapping("/{id}")
   public ResponseEntity<Property> getPropertyById(@PathVariable String id){
    return ResponseEntity.ok(propertyService.findById(id));
   }

   @GetMapping("/agent/{agentId}")
   public ResponseEntity<List<Property>> getPropertiesByAgentId(@PathVariable String agentId){
    return ResponseEntity.ok(propertyService.findByAgentId(agentId));
   }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<Property>> getPropertiesByBuyerId(@PathVariable String buyerId) {
        return ResponseEntity.ok(propertyService.findByBuyerId(buyerId));
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

//   @PostMapping
//    public ResponseEntity<Property> addProperty(@RequestBody Property property) {
//        Property savedProperty = propertyService.addProperty(property);
//        return ResponseEntity.ok(savedProperty);
//    }

    @PostMapping(value = "/add", consumes = {"multipart/form-data"})
    public ResponseEntity<?> addPropertyWithImages(
            @RequestPart("property") Property property,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {

        List<String> imageUrls = new ArrayList<>();

        if (images != null && !images.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile image : images) {
                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                imageUrls.add("/api/upload/images/" + fileName);
            }
        }

        property.setImageUrls(imageUrls);
        if (property.getBuyerId() == null || property.getBuyerId().isBlank()) {
            property.setAvailable(true);
            property.setBuyerId(null);
        } else {
            property.setAvailable(false);
        }

        Property saved = propertyService.addProperty(property);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Property> updatePropertyWithImages(
            @PathVariable String id,
            @RequestPart("property") Property property,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {

        Property existingProperty = propertyService.findById(id);
        List<String> imageUrls = property.getImageUrls() == null
                ? new ArrayList<>()
                : new ArrayList<>(property.getImageUrls());

        if (images != null && !images.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            for (MultipartFile image : images) {
                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                imageUrls.add("/api/upload/images/" + fileName);
            }
        }

        property.setId(id);
        property.setImageUrls(imageUrls);

        return ResponseEntity.ok(propertyService.updateProperty(id, property));
    }

    @PatchMapping("/{id}/purchase/{buyerId}")
    public ResponseEntity<Property> purchaseProperty(
            @PathVariable String id,
            @PathVariable String buyerId
    ) {
        return ResponseEntity.ok(propertyService.purchaseProperty(id, buyerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable String id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }


}

package com.server.RealestateApiServer.Controller;

import com.server.RealestateApiServer.Dto.PropertyPageResponse;
import com.server.RealestateApiServer.Entity.Property;
import com.server.RealestateApiServer.Entity.User;
import com.server.RealestateApiServer.Exception.ResourceNotFoundException;
import com.server.RealestateApiServer.Repository.UserRepository;
import com.server.RealestateApiServer.Service.FileStorageService;
import com.server.RealestateApiServer.Service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties(@RequestParam(required = false) String agentId) {
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
    public ResponseEntity<Property> getPropertyById(@PathVariable String id) {
        return ResponseEntity.ok(propertyService.findById(id));
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<Property>> getPropertiesByAgentId(@PathVariable String agentId) {
        return ResponseEntity.ok(propertyService.findByAgentId(agentId));
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<Property>> getPropertiesByBuyerId(@PathVariable String buyerId, Authentication authentication) {
        User currentUser = requireCurrentUser(authentication);
        ensureBuyerOrAdmin(currentUser, buyerId);
        return ResponseEntity.ok(propertyService.findByBuyerId(buyerId));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Property>> getPropertiesByCity(@PathVariable String city) {
        return ResponseEntity.ok(propertyService.findByCity(city));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Property>> getPropertiesByType(@PathVariable String type) {
        return ResponseEntity.ok(propertyService.findByType(type));
    }

    @GetMapping("/price")
    public ResponseEntity<List<Property>> getPropertiesByPrice(@RequestParam double minPrice, @RequestParam double maxPrice) {
        return ResponseEntity.ok(propertyService.findByPriceBetween(minPrice, maxPrice));
    }

    @PostMapping(value = "/add", consumes = {"multipart/form-data"})
    public ResponseEntity<Property> addPropertyWithImages(
            @Valid @RequestPart("property") Property property,
            Authentication authentication,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        User currentUser = requireCurrentUser(authentication);
        ensureAgentOrAdmin(currentUser);

        property.setImageUrls(fileStorageService.storeImages(images));
        property.setAgentId(resolveAgentId(property, currentUser));

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
            @Valid @RequestPart("property") Property property,
            Authentication authentication,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        Property existingProperty = propertyService.findById(id);
        User currentUser = requireCurrentUser(authentication);
        ensureCanManageProperty(currentUser, existingProperty);

        List<String> imageUrls = property.getImageUrls() == null
                ? new ArrayList<>()
                : new ArrayList<>(property.getImageUrls());
        imageUrls.addAll(fileStorageService.storeImages(images));

        property.setId(id);
        property.setImageUrls(imageUrls);
        property.setAgentId(resolveAgentId(existingProperty, currentUser));

        return ResponseEntity.ok(propertyService.updateProperty(id, property));
    }

    @PatchMapping("/{id}/purchase/{buyerId}")
    public ResponseEntity<Property> purchaseProperty(
            @PathVariable String id,
            @PathVariable String buyerId,
            Authentication authentication
    ) {
        User currentUser = requireCurrentUser(authentication);
        if (!isAdmin(currentUser) && !currentUser.getId().equals(buyerId)) {
            throw new AccessDeniedException("You can only purchase property for your own account");
        }
        return ResponseEntity.ok(propertyService.purchaseProperty(id, buyerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable String id, Authentication authentication) {
        User currentUser = requireCurrentUser(authentication);
        ensureCanManageProperty(currentUser, propertyService.findById(id));
        propertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    private User requireCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Authentication is required");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user was not found"));
    }

    private void ensureAgentOrAdmin(User currentUser) {
        if (!isAdmin(currentUser) && !"ROLE_AGENT".equals(currentUser.getRole())) {
            throw new AccessDeniedException("Only agents and admins can manage properties");
        }
    }

    private void ensureBuyerOrAdmin(User currentUser, String buyerId) {
        if (!isAdmin(currentUser) && !currentUser.getId().equals(buyerId)) {
            throw new AccessDeniedException("You can only view properties assigned to your account");
        }
    }

    private void ensureCanManageProperty(User currentUser, Property property) {
        ensureAgentOrAdmin(currentUser);
        if (!isAdmin(currentUser) && !currentUser.getId().equals(property.getAgentId())) {
            throw new AccessDeniedException("You can only manage your own listings");
        }
    }

    private String resolveAgentId(Property property, User currentUser) {
        if (isAdmin(currentUser)) {
            return property.getAgentId() == null || property.getAgentId().isBlank()
                    ? currentUser.getId()
                    : property.getAgentId();
        }

        return currentUser.getId();
    }

    private boolean isAdmin(User currentUser) {
        return "ROLE_ADMIN".equals(currentUser.getRole());
    }
}

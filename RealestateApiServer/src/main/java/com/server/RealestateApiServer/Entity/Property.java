package com.server.RealestateApiServer.Entity;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "properties")
public class Property {
    @Id
    private String id;
    @NotBlank(message = "Title is required")
    @Size(max = 120, message = "Title cannot exceed 120 characters")
    private String title;
    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;
    @NotBlank(message = "Address is required")
    @Size(max = 240, message = "Address cannot exceed 240 characters")
    private String address;
    @NotBlank(message = "City is required")
    @Size(max = 80, message = "City cannot exceed 80 characters")
    private String city;
    @NotBlank(message = "State is required")
    @Size(max = 80, message = "State cannot exceed 80 characters")
    private String state;
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private double price;
    @NotBlank(message = "Property type is required")
    private String type; // e.g., Apartment, House
    private boolean available;
    private List<String> imageUrls;

    @NotBlank(message = "Agent id is required")
    private String agentId;  // Reference to Agent
    private String buyerId;  // Optional: if bought
}

package com.server.RealestateApiServer.Dto;

import com.server.RealestateApiServer.Entity.Property;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PropertyPageResponse {
    private List<Property> content;
    private long totalElements;
    private int totalPages;
    private int page;
    private int size;
    private boolean hasNext;
    private boolean hasPrevious;
}

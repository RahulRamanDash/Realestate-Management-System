package com.server.RealestateApiServer.Dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminPropertyReassignRequest {
    @NotBlank(message = "Agent id is required")
    private String agentId;
}

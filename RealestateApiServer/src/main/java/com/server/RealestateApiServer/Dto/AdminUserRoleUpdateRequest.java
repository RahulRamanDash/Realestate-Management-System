package com.server.RealestateApiServer.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AdminUserRoleUpdateRequest {
    @NotBlank
    @Pattern(regexp = "ROLE_ADMIN|ROLE_AGENT|ROLE_BUYER", message = "Role must be ROLE_ADMIN, ROLE_AGENT, or ROLE_BUYER")
    private String role;
}

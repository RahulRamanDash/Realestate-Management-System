package com.server.RealestateApiServer.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    @NotBlank(message = "Name is required")
    @Size(max = 80, message = "Name cannot exceed 80 characters")
    private String name;
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    private String password;
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must contain exactly 10 digits")
    private String phone;
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "ROLE_AGENT|ROLE_BUYER", message = "Role must be ROLE_AGENT or ROLE_BUYER")
    private String role;
}

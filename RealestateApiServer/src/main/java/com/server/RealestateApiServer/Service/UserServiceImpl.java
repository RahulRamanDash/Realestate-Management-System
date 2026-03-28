package com.server.RealestateApiServer.Service;

import com.server.RealestateApiServer.Dto.AuthRequest;
import com.server.RealestateApiServer.Dto.AuthResponse;
import com.server.RealestateApiServer.Dto.RefreshRequest;
import com.server.RealestateApiServer.Dto.UserResponseDto;
import com.server.RealestateApiServer.Repository.UserRepository;
import com.server.RealestateApiServer.Security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.server.RealestateApiServer.Dto.UserDto;
import com.server.RealestateApiServer.Entity.User;

import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authManager;
	@Autowired
    private JwtService jwt;

	@Override
	public UserResponseDto register(UserDto userDto) {
        String normalizedEmail = userDto.getEmail().trim().toLowerCase();
        if (userRepo.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Email already registered");
        }

		User user = new User();
		user.setName(userDto.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setPhone(userDto.getPhone().trim());
        user.setRole(normalizeRequestedRole(userDto.getRole()));

        User savedUser = userRepo.save(user);
        return toResponse(savedUser);
	}

//	@Override
//	public User loginAgent(String email, String password) {
//		Optional<User> agent = userRepo.findByEmail(email);
//		if (agent.isPresent() && agent.get().getPassword().equals(password)) {
//			return agent.orElse(null);
//		}
//		return null;
//	}
    @Override
    public AuthResponse login(AuthRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        authManager.authenticate(new UsernamePasswordAuthenticationToken(email, req.getPassword()));
        User user = userRepo.findByEmail(email).orElseThrow();
        String access = jwt.generateAccessToken(user.getEmail(),
                Map.of("uid", user.getId(), "role", user.getRole(), "name", user.getName()));
        String refresh = jwt.generateRefreshToken(user.getEmail());
        return new AuthResponse(access, refresh, user);
    }

    @Override
    public AuthResponse refresh(RefreshRequest req) {
        if (!jwt.isRefreshToken(req.getRefreshToken())) throw new BadCredentialsException("Invalid refresh token");
        String email = jwt.extractSubject(req.getRefreshToken());
        User user = userRepo.findByEmail(email).orElseThrow();
        String newAccess = jwt.generateAccessToken(user.getEmail(),
                Map.of("uid", user.getId(), "role", user.getRole(), "name", user.getName()));
        String newRefresh = jwt.generateRefreshToken(user.getEmail()); // optional: rotate
        return new AuthResponse(newAccess, newRefresh, user);
    }

    private String normalizeRequestedRole(String role) {
        if (role == null || role.isBlank()) {
            return "ROLE_BUYER";
        }

        String normalizedRole = role.trim().toUpperCase();
        if (!"ROLE_AGENT".equals(normalizedRole) && !"ROLE_BUYER".equals(normalizedRole)) {
            throw new IllegalArgumentException("Only buyer and agent registrations are allowed");
        }

        return normalizedRole;
    }

    private UserResponseDto toResponse(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole()
        );
    }

}

package com.server.RealestateApiServer.Service;

import com.server.RealestateApiServer.Dto.AuthRequest;
import com.server.RealestateApiServer.Dto.AuthResponse;
import com.server.RealestateApiServer.Dto.RefreshRequest;
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
import java.util.Optional;

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
	public User register(UserDto userDto) {
        if (userRepo.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

		User user = new User();
		user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setPhone(userDto.getPhone());
        user.setRole(userDto.getRole() == null ? "ROLE_BUYER" : userDto.getRole());
        
        return userRepo.save(user);
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
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow();
        String access = jwt.generateAccessToken(user.getEmail(),
                Map.of("uid", user.getId(), "role", user.getRole(), "name", user.getName()));
        String refresh = jwt.generateRefreshToken(user.getEmail());
        return new AuthResponse(access, refresh, user);
    }

    @Override
    public AuthResponse refresh(RefreshRequest req) {
        if (!jwt.isValid(req.getRefreshToken())) throw new BadCredentialsException("Invalid refresh token");
        String email = jwt.extractSubject(req.getRefreshToken());
        User user = userRepo.findByEmail(email).orElseThrow();
        String newAccess = jwt.generateAccessToken(user.getEmail(),
                Map.of("uid", user.getId(), "role", user.getRole(), "name", user.getName()));
        String newRefresh = jwt.generateRefreshToken(user.getEmail()); // optional: rotate
        return new AuthResponse(newAccess, newRefresh, user);
    }

}

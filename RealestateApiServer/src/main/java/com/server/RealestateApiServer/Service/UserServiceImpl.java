package com.server.RealestateApiServer.Service;

import com.server.RealestateApiServer.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.server.RealestateApiServer.Dto.UserDto;
import com.server.RealestateApiServer.Entity.User;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public User registerAgent(UserDto userDto) {
		User existingAgent = userRepository.findByEmail(userDto.getEmail());

        if (existingAgent != null) {
            // ⚠️ Built-in Spring way to return a 409 Conflict with message
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
		User user = new User();
		user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setPhone(userDto.getPhone());
        user.setRole(userDto.getRole());
        
        return userRepository.save(user);
	}

	@Override
	public User loginAgent(String email, String password) {
		User agent = userRepository.findByEmail(email);
		if (agent != null && agent.getPassword().equals(password)) {
			return agent;
		}
		return null;
	}

}

package com.server.RealestateApiServer.Service;

import com.server.RealestateApiServer.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.server.RealestateApiServer.Dto.AgentDto;
import com.server.RealestateApiServer.Entity.User;

@Service
public class AgentServiceImpl implements AgentService{
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public User registerAgent(AgentDto agentDto) {
		User existingAgent = userRepository.findByEmail(agentDto.getEmail());

        if (existingAgent != null) {
            // ⚠️ Built-in Spring way to return a 409 Conflict with message
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
		User agent = new User();
		agent.setName(agentDto.getName());
        agent.setEmail(agentDto.getEmail());
        agent.setPassword(agentDto.getPassword());
        agent.setPhone(agentDto.getPhone());
        
        return userRepository.save(agent);
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

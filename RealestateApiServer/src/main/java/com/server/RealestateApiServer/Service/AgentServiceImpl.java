package com.server.RealestateApiServer.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.server.RealestateApiServer.Dto.AgentDto;
import com.server.RealestateApiServer.Entity.Agent;
import com.server.RealestateApiServer.Repository.AgentRepository;

@Service
public class AgentServiceImpl implements AgentService{
	
	@Autowired
	private AgentRepository agentRepository;

	@Override
	public Agent registerAgent(AgentDto agentDto) {
		Agent existingAgent = agentRepository.findByEmail(agentDto.getEmail());

        if (existingAgent != null) {
            // ⚠️ Built-in Spring way to return a 409 Conflict with message
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
		
		
		Agent agent = new Agent();
        
		agent.setName(agentDto.getName());
        agent.setEmail(agentDto.getEmail());
        agent.setPassword(agentDto.getPassword());
        agent.setPhone(agentDto.getPhone());
        
        return agentRepository.save(agent);
	}

	@Override
	public Agent loginAgent(String email, String password) {
		Agent agent = agentRepository.findByEmail(email);
		if (agent != null && agent.getPassword().equals(password)) {
			return agent;
		}
		return null;
	}

}

package com.server.RealestateApiServer.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.server.RealestateApiServer.Dto.AgentDto;
import com.server.RealestateApiServer.Entity.Agent;
import com.server.RealestateApiServer.Repository.AgentRepository;

@Service
public class AgentServiceImpl implements AgentService{
	
	@Autowired
	private AgentRepository agentRepository;

	@Override
	public Agent registerAgent(AgentDto agentDto) {
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

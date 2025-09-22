package com.server.RealestateApiServer.Service;

import com.server.RealestateApiServer.Dto.UserDto;
import com.server.RealestateApiServer.Entity.User;

public interface UserService {
	User registerAgent(UserDto userDto);
    User loginAgent(String email, String password);
}

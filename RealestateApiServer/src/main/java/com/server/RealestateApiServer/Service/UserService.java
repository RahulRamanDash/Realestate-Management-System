package com.server.RealestateApiServer.Service;

import com.server.RealestateApiServer.Dto.AuthRequest;
import com.server.RealestateApiServer.Dto.AuthResponse;
import com.server.RealestateApiServer.Dto.RefreshRequest;
import com.server.RealestateApiServer.Dto.UserDto;
import com.server.RealestateApiServer.Entity.User;

public interface UserService {
	User register(UserDto userDto);
    public AuthResponse login(AuthRequest req);
    public AuthResponse refresh(RefreshRequest req);
}

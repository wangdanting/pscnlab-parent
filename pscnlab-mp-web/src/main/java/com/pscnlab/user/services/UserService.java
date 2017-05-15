package com.pscnlab.user.services;

import com.pscnlab.user.services.dtos.LoginDTO;
import com.pscnlab.user.services.dtos.UserDTO;

/**
 * Created by xiong on 2017/5/11 .
 */
public interface UserService {
    UserDTO findOneById(Long id);

    void login(LoginDTO loginDTO);

//    List<UserDTO> users();

//    Page<UserDTO> pagedUsers();
}

package com.pscnlab.user.services.impls;

import com.google.inject.Inject;
import com.jiabangou.core.beans.ConvertUtils;
import com.jiabangou.core.exceptions.ServiceException;
import com.pscnlab.user.daos.UserDao;
import com.pscnlab.user.models.User;
import com.pscnlab.user.services.UserService;
import com.pscnlab.user.services.dtos.LoginDTO;
import com.pscnlab.user.services.dtos.UserDTO;

import javax.inject.Singleton;
import java.util.Objects;

/**
 * Created by xiong on 2017/5/11 .
 */
@Singleton
public class UserServiceImpl implements UserService {
    @Inject
    private UserDao userDao;

    @Override
    public UserDTO findOneById(Long id) {
        User user = userDao.findOne(id);
        return ConvertUtils.convert(user,UserDTO.class);
    }

    /**
     * user login
     * @param loginDTO
     */
    @Override
    public void login(LoginDTO loginDTO) {

        if (Objects.isNull(loginDTO)) {

        }

        User user = userDao.findOneByUserNameAndPssword(loginDTO.getUserName(), loginDTO.getPassword());
        if (Objects.isNull(user)) {
            throw ServiceException.build(1000L, "用户不存在");
        }

    }
}

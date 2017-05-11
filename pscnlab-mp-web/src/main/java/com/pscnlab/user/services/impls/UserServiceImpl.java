/*
 *  Copyright (c) 2015.  meicanyun.com Corporation Limited.
 *  All rights reserved.
 *
 *  This software is the confidential and proprietary information of
 *  meicanyun Company. ("Confidential Information").  You shall not
 *  disclose such Confidential Information and shall use it only in
 *  accordance with the terms of the license agreement you entered into
 *  with meicanyun.com.
 */

package com.pscnlab.user.services.impls;

import com.google.inject.Inject;
import com.jiabangou.core.beans.ConvertUtils;
import com.pscnlab.user.daos.UserDao;
import com.pscnlab.user.models.User;
import com.pscnlab.user.services.UserService;
import com.pscnlab.user.services.dtos.UserDTO;

import javax.inject.Singleton;

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
}

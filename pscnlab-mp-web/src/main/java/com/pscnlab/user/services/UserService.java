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

package com.pscnlab.user.services;

import com.pscnlab.user.services.dtos.UserDTO;

import javax.inject.Singleton;

/**
 * Created by xiong on 2017/5/11 .
 */
@Singleton
public interface UserService {
    UserDTO findOneById(Long id);
}

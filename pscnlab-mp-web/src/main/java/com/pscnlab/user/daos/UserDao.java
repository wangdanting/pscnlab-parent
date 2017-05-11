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

package com.pscnlab.user.daos;

import com.google.inject.ImplementedBy;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.pscnlab.user.daos.impls.UserDaoImpl;
import com.pscnlab.user.models.User;

/**
 * Created by xiong on 2017/5/11 .
 */
@ImplementedBy(UserDaoImpl.class)
public interface UserDao extends IBaseDao<Long,User>{
    User findOneById(Long id);
    //save
    //update
    //delete
    //count
}

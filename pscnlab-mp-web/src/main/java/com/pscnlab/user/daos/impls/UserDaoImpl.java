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

package com.pscnlab.user.daos.impls;

import com.jiabangou.guice.persist.jpa.BaseDao;
import com.jiabangou.guice.persist.jpa.util.FilterMap;
import com.pscnlab.user.daos.UserDao;
import com.pscnlab.user.models.User;

/**
 * Created by xiong on 2017/5/11 .
 */
public class UserDaoImpl extends BaseDao<Long,User> implements UserDao {

    @Override
    public User findOneById(Long id) {
        FilterMap filterMap=new FilterMap();
        filterMap.eq("id",id);
        return super.findOne(filterMap);
    }

    @Override
    public User findOneByUserNameAndPssword(String userName, String password) {
        FilterMap filterMap=new FilterMap();
        filterMap.eq("name",userName);
        filterMap.eq("password",password);
        return super.findOne(filterMap);
    }
}

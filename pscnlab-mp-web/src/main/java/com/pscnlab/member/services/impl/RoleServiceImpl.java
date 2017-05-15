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

package com.pscnlab.member.services.impl;

import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.member.daos.RoleDao;
import com.pscnlab.member.models.Role;
import com.pscnlab.member.services.RoleService;

import javax.inject.Inject;

/**
 * Created by xiong on 2017/5/15 .
 */
public class RoleServiceImpl extends BaseServiceImpl<Integer,Role> implements RoleService {
    @Inject
    private RoleDao roleDao;

    @Override
    protected IBaseDao<Integer, Role> getBaseDao() {
        return roleDao;
    }
}

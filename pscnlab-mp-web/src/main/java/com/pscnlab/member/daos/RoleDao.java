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

package com.pscnlab.member.daos;

import com.google.inject.ImplementedBy;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.pscnlab.member.daos.impls.RoleDaoImpl;
import com.pscnlab.member.models.Role;

import java.util.List;

/**
 * Created by xiong on 2017/5/15 .
 */
@ImplementedBy(RoleDaoImpl.class)
public interface RoleDao extends IBaseDao<Integer,Role> {
    List<Role> findAll();

    Role findByRoleAndPosition(String role, String position);
}

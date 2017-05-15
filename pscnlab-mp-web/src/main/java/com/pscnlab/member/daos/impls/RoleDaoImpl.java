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

package com.pscnlab.member.daos.impls;

import com.jiabangou.guice.persist.jpa.BaseDao;
import com.jiabangou.guice.persist.jpa.util.FilterMap;
import com.pscnlab.member.daos.RoleDao;
import com.pscnlab.member.models.Role;

import java.util.List;

/**
 * Created by xiong on 2017/5/15 .
 */
public class RoleDaoImpl extends BaseDao<Integer,Role> implements RoleDao {
    @Override
    public List<Role> findAll() {
        return super.list(new FilterMap());
    }

    @Override
    public Role findByRoleAndPosition(String role, String position) {
        FilterMap filterMap=new FilterMap();
        filterMap.eq("role",role);
        filterMap.eq("position",position);
        return super.findOne(filterMap);
    }
}

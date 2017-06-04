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
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.member.daos.impls.RoleDaoImpl;
import com.pscnlab.member.models.Role;

import java.util.List;
import java.util.Set;

@ImplementedBy(RoleDaoImpl.class)
public interface RoleDao extends IBaseDao<Integer,Role> {
    List<Role> findListByRoleIds(Set<Integer> roleIdsSet);

    List<Role> findAll();

    Role findByRoleAndPosition(String role, String position);

    Page<Role> findByRoleOrPosition(String role, String position,Integer offset,Integer size);
}

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

package com.pscnlab.member.services;

import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.BaseService;
import com.pscnlab.member.models.Role;

import java.util.List;

/**
 * Created by xiong on 2017/5/15 .
 */
public interface RoleService extends BaseService<Integer,Role> {
    List<Role> findAll();
    Role findByRoleAndPosition(String role,String position);

    Page<Role> findByRoleOrPosition(String role, String position, Integer offset, Integer size);
}

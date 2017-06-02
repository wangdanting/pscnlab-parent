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
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.member.daos.RoleDao;
import com.pscnlab.member.models.Role;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Set;

/**
 * Created by xiong on 2017/5/15 .
 */
public class RoleDaoImpl extends BaseDao<Integer,Role> implements RoleDao {


    @Override
    public List<Role> findListByRoleIds(Set<Integer> roleIdsSet){

        if(CollectionUtils.isEmpty(roleIdsSet)){
            return Collections.EMPTY_LIST;
        }
        FilterMap filterMap = new FilterMap();
        filterMap.in("uuidRole",roleIdsSet);

        return super.list(filterMap);
    }

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

    @Override
    public Page<Role> findByRoleOrPosition(String role, String position, Integer offset,Integer size){

        FilterMap filterMap=new FilterMap();
        if(StringUtils.isNotBlank(role)) {
            filterMap.eq("role", role);
        }
        if(StringUtils.isNotBlank(position)) {
            FilterMap filterMap1 = new FilterMap();
            filterMap1.eq("position", position);
            filterMap.or(filterMap1);
        }
        return super.page(filterMap,offset,size);
    }
}

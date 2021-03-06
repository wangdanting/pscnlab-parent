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

import com.jiabangou.core.beans.ConvertUtils;
import com.jiabangou.core.exceptions.ServiceException;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.member.daos.RoleDao;
import com.pscnlab.member.models.Role;
import com.pscnlab.member.services.MemberSevice;
import com.pscnlab.member.services.RoleService;
import org.apache.commons.collections.CollectionUtils;

import javax.inject.Inject;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Created by xiong on 2017/5/15 .
 */
public class RoleServiceImpl extends BaseServiceImpl<Integer,Role> implements RoleService {
    @Inject
    private RoleDao roleDao;
    @Inject
    private MemberSevice memberSevice;

    @Override
    protected IBaseDao<Integer, Role> getBaseDao() {
        return roleDao;
    }

    @Override
    public Map<Integer,Role> findMapByRoleIds(Set<Integer> roleIdsSet){
        List<Role> roles = roleDao.findListByRoleIds(roleIdsSet);
        if(CollectionUtils.isEmpty(roles)){
            return Collections.EMPTY_MAP;
        }
        return roles.stream().collect(Collectors.toMap(Role::getUuidRole, Function.identity()));
    }

    @Override
    public List<Role> findAll() {
        return roleDao.findAll();
    }

    @Override
    public Role findByRoleAndPosition(String role, String position) {

        return roleDao.findByRoleAndPosition(role,position);
    }

    @Override
    public Page<Role> findByRoleOrPosition(String role, String position,Integer offset,Integer size){
        return roleDao.findByRoleOrPosition(role,position,offset,size);
    }

    @Override
    public void save(Role var1) {
        if(this.findByRoleAndPosition(var1.getRole(),var1.getPosition())!=null){
            throw ServiceException.build(1000,"当前角色已存在");
        }
        super.save(var1);
    }

    @Override
    public void delete(Role var1) {
        Long aLong = memberSevice.countMemberByUuidRole(var1.getUuidRole());
        if(aLong>0){
            throw ServiceException.build(1000,"当期角色还有成员，无法删除！");
        }
        super.delete(var1);
    }

    @Override
    public void update(Role var1) {
        Role byRoleAndPosition = this.findByRoleAndPosition(var1.getRole(), var1.getPosition());
        if(byRoleAndPosition !=null&&!byRoleAndPosition.getUuidRole().equals(var1.getUuidRole())){
            throw ServiceException.build(1000,"当前角色已存在");
        }
        super.update(var1);
    }

    @Override
    public void deleteById(Integer var1) {
        Role one = this.findOne(var1);
        if(one==null){
            throw ServiceException.build(1000,"数据不存在");
        }
        this.delete(one);
    }
}

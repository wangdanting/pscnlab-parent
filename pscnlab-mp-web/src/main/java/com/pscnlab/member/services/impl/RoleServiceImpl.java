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

import com.jiabangou.core.exceptions.ServiceException;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.member.daos.RoleDao;
import com.pscnlab.member.models.Role;
import com.pscnlab.member.services.MemberSevice;
import com.pscnlab.member.services.RoleService;

import javax.inject.Inject;
import java.util.List;

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
    public List<Role> findAll() {
        return roleDao.findAll();
    }

    @Override
    public Role findByRoleAndPosition(String role, String position) {

        return roleDao.findByRoleAndPosition(role,position);
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
    public void deleteById(Integer var1) {
        Role one = this.findOne(var1);
        if(one==null){
            throw ServiceException.build(1000,"数据不存在");
        }
        this.delete(one);
    }
}

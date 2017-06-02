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

import com.google.common.collect.Maps;
import com.jiabangou.core.exceptions.ServiceException;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.member.daos.MemberDao;
import com.pscnlab.member.models.Member;
import com.pscnlab.member.models.Role;
import com.pscnlab.member.services.MemberSevice;
import com.pscnlab.member.services.RoleService;
import com.pscnlab.member.services.dtos.MemberPageDTO;
import com.pscnlab.member.services.dtos.MemberPageQueryDTO;
import org.apache.commons.collections.CollectionUtils;

import javax.inject.Inject;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by xiong on 2017/5/15 .
 */
public class MemberSeviceImpl extends BaseServiceImpl<Integer,Member> implements MemberSevice {
    @Inject
    private MemberDao memberDao;
    @Inject
    private RoleService roleService;

    @Override
    protected IBaseDao<Integer, Member> getBaseDao() {
        return memberDao;
    }

    @Override
    public void save(Member var1) {
        Member oneByTelephone = this.findOneByTelephone(var1.getTelephone());
        if(oneByTelephone!=null){
            throw ServiceException.build(1000,"手机号已存在，添加失败！");
        }
        var1.setPassword("123456");
        super.save(var1);
    }


    @Override
    public Long countMemberByUuidRole(Integer uuidRole) {
        return memberDao.countMemberByUuidRole(uuidRole);
    }

    @Override
    public Member findOneByTelephone(String telephone) {
        return memberDao.findOneByTelephone(telephone);
    }

    @Override
    public void update(Member var1) {
        Member member = memberDao.findOne(var1.getUuidMember());
        member.setUuidRole(var1.getUuidRole());
        member.setGender(var1.getGender());
        //member.setTelephone(var1.getTelephone());
        member.setName(var1.getName());
        member.setAge(var1.getAge());
        member.setGradeClass(var1.getGradeClass());
        member.setHobby(var1.getHobby());
        member.setManage(var1.getManage());
        memberDao.update(member);
    }

    @Override
    public void deleteById(Integer var1) {
        Member one = this.findOne(var1);
        if(one==null){
            throw ServiceException.build(1000,"数据不存在");
        }
        super.delete(one);
    }

    @Override
    public void deleteByUUId(Integer memberUUId){
        Member member = memberDao.findByUUId(memberUUId);
        if (member==null){
            throw ServiceException.build(1000,"数据不存在");
        }
        super.delete(member);
    }

    //通过成员ID查询成员列表
    @Override
    public Map<Integer,MemberPageDTO> findMemberWithRoleByIds(Set<Integer> memberIdsSet){

        List<Member> members = memberDao.findListByMemberIdsSet(memberIdsSet);
        if(CollectionUtils.isEmpty(members)){
            return Collections.emptyMap();
        }

        Set<Integer> roleIds = members.stream().map(Member::getUuidRole).collect(Collectors.toSet());
        Map<Integer, Role> roleMap = roleService.findMapByRoleIds(roleIds);

        Map<Integer,MemberPageDTO> memberPageDTOMap = Maps.newHashMap();
        for (Member result : members) {
            MemberPageDTO memberPageDTO=new MemberPageDTO();
            memberPageDTO.setRole(roleMap.get(result.getUuidRole()));
            memberPageDTO.setMember(result);
            memberPageDTOMap.put(result.getUuidMember(),memberPageDTO);
        }

        return memberPageDTOMap;
    }

    //通过成员姓名查询成员列表
    @Override
    public List<Member> findMemberWithMemberName(String memeberName){

        List<Member> members = memberDao.findListByMemberName(memeberName);
        return members;
    }

    //分页查询成员列表
    @Override
    public Page<MemberPageDTO> findPage(MemberPageQueryDTO query, Integer offset, Integer size) {

        Page<Member> page = memberDao.findPage(query, offset, size);
        List<Member> results = page.getResults();
        if(CollectionUtils.isEmpty(results)){
            return Page.build(new ArrayList<>(),page.getTotalCount());
        }

        //查询成员角色
        Set<Integer> roleIds = results.stream().map(Member::getUuidRole).collect(Collectors.toSet());
        Map<Integer, Role> roleMap = roleService.findMapByRoleIds(roleIds);

        List<MemberPageDTO>memberPageDTOS=new ArrayList<>();
        for (Member result : results) {
            MemberPageDTO memberPageDTO=new MemberPageDTO();
            memberPageDTO.setMember(result);
            memberPageDTO.setRole(roleMap.get(result.getUuidRole()));
            memberPageDTOS.add(memberPageDTO);
        }

        return Page.build(memberPageDTOS,page.getTotalCount());
    }

    @Override
    public Member login(String userName,String password) {
        Member member = this.findOneByTelephone(userName);
        if(member==null||!member.getPassword().equals(password)){
            throw ServiceException.build(0,"账户或密码错误！");
        }
        return member;
    }

}

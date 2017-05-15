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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
    public Long countMemberByUuidRole(Integer uuidRole) {
        return memberDao.countMemberByUuidRole(uuidRole);
    }

    @Override
    public Page<MemberPageDTO> findPage(MemberPageQueryDTO query, Integer offset, Integer size) {

        Page<Member> page = memberDao.findPage(query, offset, size);
        List<Member> results = page.getResults();
        if(CollectionUtils.isEmpty(results)){
            return Page.build(new ArrayList<>(),page.getTotalCount());
        }

        Set<Integer> roleIds = results.stream().map(Member::getUuidRole).collect(Collectors.toSet());
        Map<Integer, Role> roleMap = roleService.findMapByIds(new ArrayList<>(roleIds));

        List<MemberPageDTO>memberPageDTOS=new ArrayList<>();
        for (Member result : results) {
            MemberPageDTO memberPageDTO=new MemberPageDTO();
            memberPageDTO.setMember(result);
            memberPageDTO.setRole(roleMap.get(result.getUuidRole()));
            memberPageDTOS.add(memberPageDTO);
        }

        return Page.build(memberPageDTOS,page.getTotalCount());
    }
}

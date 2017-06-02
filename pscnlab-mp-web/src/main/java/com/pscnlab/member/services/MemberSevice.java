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
import com.pscnlab.member.models.Member;
import com.pscnlab.member.services.dtos.MemberPageDTO;
import com.pscnlab.member.services.dtos.MemberPageQueryDTO;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by xiong on 2017/5/15 .
 */
public interface MemberSevice extends BaseService<Integer,Member> {
    Long countMemberByUuidRole(Integer uuidRole);
    Member findOneByTelephone(String telephone);

    void deleteByUUId(Integer memberUUId);

    //通过成员ID查询成员列表
    Map<Integer,MemberPageDTO> findMemberWithRoleByIds(Set<Integer> memberIdsSet);

    //通过成员姓名查询成员列表
    List<Member> findMemberWithMemberName(String memeberName);

    Page<MemberPageDTO> findPage(MemberPageQueryDTO query, Integer offset, Integer size);
    Member login(String userName, String password);

    void updatePassword(String telephone, String oldPassword, String newPassword);
}

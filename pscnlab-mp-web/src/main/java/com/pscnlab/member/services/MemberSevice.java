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

/**
 * Created by xiong on 2017/5/15 .
 */
public interface MemberSevice extends BaseService<Integer,Member> {
    Long countMemberByUuidRole(Integer uuidRole);
    Member findOneByTelephone(String telephone);
    Page<MemberPageDTO> findPage(MemberPageQueryDTO query, Integer offset, Integer size);
    Member login(String userName, String password);
}

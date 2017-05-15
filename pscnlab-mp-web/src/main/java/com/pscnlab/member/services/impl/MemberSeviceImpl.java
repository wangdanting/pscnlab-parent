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
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.member.daos.MemberDao;
import com.pscnlab.member.models.Member;
import com.pscnlab.member.services.MemberSevice;

import javax.inject.Inject;

/**
 * Created by xiong on 2017/5/15 .
 */
public class MemberSeviceImpl extends BaseServiceImpl<Integer,Member> implements MemberSevice {
    @Inject
    private MemberDao memberDao;

    @Override
    protected IBaseDao<Integer, Member> getBaseDao() {
        return memberDao;
    }

}

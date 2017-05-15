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
import com.pscnlab.member.daos.impls.MemberDaoImpl;
import com.pscnlab.member.models.Member;

/**
 * Created by xiong on 2017/5/15 .
 */
@ImplementedBy(MemberDaoImpl.class)
public interface MemberDao extends IBaseDao<Integer,Member> {
}

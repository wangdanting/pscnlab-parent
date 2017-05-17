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

package com.pscnlab.recruit.services.impls;

import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.recruit.daos.RecruitDao;
import com.pscnlab.recruit.models.Recruit;
import com.pscnlab.recruit.services.RecruitService;

import javax.inject.Inject;

/**
 * Created by xiong on 2017/5/16 .
 */
public class RecruitServiceImpl extends BaseServiceImpl<Integer,Recruit> implements RecruitService {
    @Inject
    private RecruitDao recruitDao;
    @Override
    protected IBaseDao<Integer, Recruit> getBaseDao() {
        return recruitDao;
    }
}

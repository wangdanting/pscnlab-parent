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

package com.pscnlab.recruit.daos;

import com.google.inject.ImplementedBy;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.recruit.daos.impls.RecruitDaoImpl;
import com.pscnlab.recruit.models.Recruit;

@ImplementedBy(RecruitDaoImpl.class)
public interface RecruitDao extends IBaseDao<Integer,Recruit>{
    Page<Recruit> findPageByCondition(String position, Integer offset, Integer size);

    Recruit findOneById(Integer uuid);
}

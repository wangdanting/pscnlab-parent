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

package com.pscnlab.train.daos;

import com.google.inject.ImplementedBy;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.pscnlab.train.daos.impls.TrainPeopleDaoImpl;
import com.pscnlab.train.models.TrainPeople;

/**
 * Created by xiong on 2017/5/15 .
 */
@ImplementedBy(TrainPeopleDaoImpl.class)
public interface TrainPeopleDao extends IBaseDao<Integer,TrainPeople> {

    TrainPeople findOneByUuidTrainAndUuidMember(String uuidTrain, String uuidMember);
}
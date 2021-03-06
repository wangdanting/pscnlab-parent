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
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.train.daos.impls.TrainDaoImpl;
import com.pscnlab.train.models.Train;

@ImplementedBy(TrainDaoImpl.class)
public interface TrainDao extends IBaseDao<Integer,Train>{
    Page<Train> findPage(Long  startTime,Long endTime, Integer offset, Integer size);

    Page<Train> findPageByTime(String time, Integer offset, Integer size);

    Train findOneByUUId(Integer uuid);
}

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

package com.pscnlab.train.services;

import com.pscnlab.base.services.BaseService;
import com.pscnlab.train.models.TrainPeople;

import java.util.List;
import java.util.Map;

public interface TrainPeopleService  extends BaseService<Integer,TrainPeople> {

    List<TrainPeople> findListByTrainIds(List<Integer> es);
    Map<Integer, List<TrainPeople>>  findMapByTrainIds(List<Integer> es);
}

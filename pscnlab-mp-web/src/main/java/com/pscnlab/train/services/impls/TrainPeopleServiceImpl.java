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

package com.pscnlab.train.services.impls;

import com.jiabangou.core.exceptions.ServiceException;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.train.daos.TrainPeopleDao;
import com.pscnlab.train.models.Train;
import com.pscnlab.train.models.TrainPeople;
import com.pscnlab.train.services.TrainPeopleService;
import com.pscnlab.train.services.TrainService;
import org.apache.commons.collections.CollectionUtils;

import javax.inject.Inject;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class TrainPeopleServiceImpl  extends BaseServiceImpl<Integer,TrainPeople> implements TrainPeopleService {
    @Inject
    private TrainPeopleDao trainPeopleDao;
    @Inject
    private TrainService trainService;

    @Override
    protected IBaseDao<Integer, TrainPeople> getBaseDao() {
        return trainPeopleDao;
    }

    @Override
    public void save(TrainPeople var1) {
        Train one = trainService.findOne(var1.getUuidTrain());
        if(one==null){
            throw ServiceException.build(1000,"培训不存在");
        }
        List<TrainPeople> trainPeoples = trainPeopleDao.findListByTrainIds(Arrays.asList(one.getUuidTrain()));
        if(trainPeoples.size()>=one.getNumber()){
            throw ServiceException.build(1000,"参加培训的人已达到上限，参加失败！");
        }

        TrainPeople member = trainPeopleDao.findOneByUuidTrainAndUuidMember(var1.getUuidTrain(), var1.getUuidMember());
        if(member==null) {
            super.save(var1);
        }
    }

    @Override
    public List<TrainPeople> findListByTrainIds(List<Integer> es) {

        return trainPeopleDao.findListByTrainIds(es);
    }

    @Override
    public Map<Integer, List<TrainPeople>> findMapByTrainIds(List<Integer> es) {
        List<TrainPeople> trainPeoples = this.findListByTrainIds(es);
        if(CollectionUtils.isEmpty(trainPeoples)){
            return Collections.EMPTY_MAP;
        }
        return trainPeoples.stream().collect(Collectors.groupingBy(TrainPeople::getUuidTrain));
    }
}

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

import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.train.daos.TrainDao;
import com.pscnlab.train.models.Train;
import com.pscnlab.train.services.TrainService;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import utils.DateUtil;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by xiong on 2017/5/15 .
 */
public class TrainServiceImpl extends BaseServiceImpl<Integer,Train> implements TrainService {
    @Inject
    private TrainDao trainDao;

    @Override
    protected IBaseDao<Integer, Train> getBaseDao() {
        return trainDao;
    }


    @Override
    public Page<Train> findPage(String time, Integer offset, Integer size) {
        Long startTime=null;
        Long endTime=null;
        if(StringUtils.isNotEmpty(time)){
            startTime = DateUtil.stringToTime(time+" 00:00:00").getTime();
            endTime = DateUtil.stringToTime(time+" 23:59:59", DateUtil.yyyy_MM_dd).getTime();
        }

        Page<Train> trainPage=trainDao.findPage(startTime,endTime,offset,size);
        List<Train> results = trainPage.getResults();
        if(CollectionUtils.isEmpty(results)){
            return Page.build(new ArrayList<>(),trainPage.getTotalCount());
        }


        return null;
    }
}

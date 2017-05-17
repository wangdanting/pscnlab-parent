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
import com.pscnlab.member.models.Member;
import com.pscnlab.member.services.MemberSevice;
import com.pscnlab.train.daos.TrainDao;
import com.pscnlab.train.models.Train;
import com.pscnlab.train.models.TrainPeople;
import com.pscnlab.train.services.TrainPeopleService;
import com.pscnlab.train.services.TrainService;
import com.pscnlab.train.services.dtos.TrainPageDTO;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import utils.DateUtil;

import javax.inject.Inject;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by xiong on 2017/5/15 .
 */
public class TrainServiceImpl extends BaseServiceImpl<Integer,Train> implements TrainService {
    @Inject
    private TrainDao trainDao;
    @Inject
    private TrainPeopleService trainPeopleService;
    @Inject
    private MemberSevice memberSevice;

    @Override
    protected IBaseDao<Integer, Train> getBaseDao() {
        return trainDao;
    }


    @Override
    public Page<TrainPageDTO> findPage(String time, Integer offset, Integer size) {
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
        Set<Integer> trainIds = results.stream().map(Train::getUuidTrain).collect(Collectors.toSet());
        Map<Integer, List<TrainPeople>> trainPeopleMap = trainPeopleService.findMapByTrainIds(new ArrayList<>(trainIds));
        Map<Integer, Member> memberMap=new HashMap<>();
        if(trainPeopleMap.size()>0){
            Set<Integer> memberIds = trainPeopleMap.values().stream().flatMap(List::stream).map(TrainPeople::getUuidMember).collect(Collectors.toSet());
            memberMap = memberSevice.findMapByIds(new ArrayList<>(memberIds));
        }

        List<TrainPageDTO> trainPageDTOS=new ArrayList<>();
        for (Train result : results) {
            TrainPageDTO trainPageDTO=new TrainPageDTO();
            trainPageDTO.setTrain(result);

            List<TrainPeople> trainPeoples = trainPeopleMap.get(result.getUuidTrain());
            if(CollectionUtils.isNotEmpty(trainPeoples)){
                List<Member> members=new ArrayList<>();
                for (TrainPeople trainPeople : trainPeoples) {
                    Member member = memberMap.get(trainPeople.getUuidMember());
                    if(member!=null) {
                        members.add(member);
                    }
                }
                trainPageDTO.setMembers(members);
            }
            trainPageDTOS.add(trainPageDTO);
        }





        return  Page.build(trainPageDTOS,trainPage.getTotalCount());
    }
}

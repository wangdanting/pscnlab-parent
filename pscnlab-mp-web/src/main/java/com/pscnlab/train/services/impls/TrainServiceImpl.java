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

import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.core.exceptions.ServiceException;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.member.models.Member;
import com.pscnlab.member.services.MemberSevice;
import com.pscnlab.member.services.dtos.MemberPageDTO;
import com.pscnlab.train.daos.TrainDao;
import com.pscnlab.train.daos.TrainPeopleDao;
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
    private TrainPeopleDao trainPeopleDao;

    @Inject
    private MemberSevice memberSevice;

    @Override
    protected IBaseDao<Integer, Train> getBaseDao() {
        return trainDao;
    }

    //新增培训
    @Override
    public void saveTrain(Train train){
        trainDao.save(train);
    }

    //更新项目
    @Override
    public void updateTrain(Train newTrain){
        Train  train = trainDao.findOneByUUId(newTrain.getUuidTrain());
        if(newTrain.getNumber()!=null) {
            train.setNumber(newTrain.getNumber());
        }
        if(StringUtils.isNotBlank(newTrain.getPlace())){
            train.setPlace(newTrain.getPlace());
        }
        if(StringUtils.isNotBlank(newTrain.getSpeaker())){
            train.setSpeaker(newTrain.getSpeaker());
        }
        if(StringUtils.isNotBlank(newTrain.getTime())) {
            train.setTime(newTrain.getTime());
        }
        if(StringUtils.isNotBlank(newTrain.getTitle())) {
            train.setTitle(newTrain.getTitle());
        }
        if(StringUtils.isNotBlank(newTrain.getTelephone())) {
            train.setTelephone(newTrain.getTelephone());
        }
        trainDao.update(train);
    }


    //删除培训
    @Override
    public void deleteTrain(Integer trainId){
        Train train = trainDao.findOneByUUId(trainId);
        if(train==null){
            throw ServiceException.build(700001l,"数据不存在，删除失败");
        }
        trainDao.delete(train);
    }

    //参加培训
    @Override
    public void trainAddMember(Integer trainId,Integer memberUUId){
        Train one = trainDao.findOne(trainId);
        if(one==null){
            throw ServiceException.build(1000,"培训不存在");
        }
        List<TrainPeople> trainPeoples = trainPeopleDao.findListByTrainIds(Arrays.asList(one.getUuidTrain()));
        if(trainPeoples.size()>=one.getNumber()){
            throw ServiceException.build(1000,"参加培训的人已达到上限，参加失败！");
        }

        TrainPeople trainPeople = trainPeopleDao.findOneByUuidTrainAndUuidMember(trainId, memberUUId);
        if(trainPeople==null) {
            trainPeople = new TrainPeople();
            trainPeople.setUuidMember(memberUUId);
            trainPeople.setUuidTrain(trainId);
            trainPeopleDao.save(trainPeople);
        }
    }

    //退出培训
    @Override
    public void trainDeleteMember(Integer trainId,Integer memberUUId){
        Train one = trainDao.findOne(trainId);
        if(one==null){
            throw ServiceException.build(1000,"培训不存在");
        }
        TrainPeople trainPeople = trainPeopleDao.findOneByUuidTrainAndUuidMember(trainId, memberUUId);
        if(trainPeople!=null) {
            trainPeopleDao.delete(trainPeople);
        }
    }


    //查询培训列表
    @Override
    public ResultsTotalDTO<TrainPageDTO> findPageByTime(String time, Integer offset, Integer size, Integer memberUUId){
        Page<Train> trainPage = trainDao.findPageByTime(time,offset,size);
        List<Train> results = trainPage.getResults();
        if(CollectionUtils.isEmpty(results)){
            return ResultsTotalDTO.build(Collections.EMPTY_LIST,trainPage.getTotalCount());
        }

        Set<Integer> trainIds = results.stream().map(Train::getUuidTrain).collect(Collectors.toSet());
        Map<Integer, List<TrainPeople>> trainPeopleMap = trainPeopleService.findMapByTrainIds(new ArrayList<>(trainIds));
        Map<Integer,MemberPageDTO> memberPageDTOMap= new HashMap<>();
        if(trainPeopleMap.size()>0){
            Set<Integer> memberIds = trainPeopleMap.values().stream().flatMap(List::stream).map(TrainPeople::getUuidMember).collect(Collectors.toSet());
            memberPageDTOMap = memberSevice.findMemberWithRoleByIds(memberIds);
        }

        //拼装培训成员
        List<TrainPageDTO> trainPageDTOS=new ArrayList<>();
        for (Train result : results) {
            TrainPageDTO trainPageDTO=new TrainPageDTO();
            trainPageDTO.setTrain(result);
            //单前成员是否在培训列表内
            Boolean isInTrainMember = Boolean.FALSE;
            List<Member> members=new ArrayList<>();
            List<TrainPeople> trainPeoples = trainPeopleMap.get(result.getUuidTrain());
            if(CollectionUtils.isNotEmpty(trainPeoples)){
                for (TrainPeople trainPeople : trainPeoples) {
                    MemberPageDTO memberPageDTO = memberPageDTOMap.get(trainPeople.getUuidMember());
                    if(memberPageDTO!=null) {
                        members.add(memberPageDTO.getMember());
                        if(memberPageDTO.getMember().getUuidMember().equals(memberUUId)){
                            isInTrainMember = Boolean.TRUE;
                        }
                    }
                }
            }
            trainPageDTO.setIsInTrainMember(isInTrainMember);
            trainPageDTO.setMembers(members);
            trainPageDTOS.add(trainPageDTO);
        }

        return ResultsTotalDTO.build(trainPageDTOS,trainPage.getTotalCount());
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

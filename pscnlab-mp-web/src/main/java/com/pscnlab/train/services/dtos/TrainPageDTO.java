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

package com.pscnlab.train.services.dtos;

import com.pscnlab.member.models.Member;
import com.pscnlab.train.models.Train;

import java.io.Serializable;
import java.util.List;

/**
 * Created by xiong on 2017/5/16 .
 */
public class TrainPageDTO implements Serializable {
    private Train train;
    private List<Member> members;
    private Boolean isInTrainMember; //当前登录成员是否在培训中

    public Boolean getIsInTrainMember() {
        return isInTrainMember;
    }

    public void setIsInTrainMember(Boolean inTrainMember) {
        isInTrainMember = inTrainMember;
    }

    public Train getTrain() {
        return train;
    }

    public void setTrain(Train train) {
        this.train = train;
    }

    public List<Member> getMembers() {
        return members;
    }

    public void setMembers(List<Member> members) {
        this.members = members;
    }
}

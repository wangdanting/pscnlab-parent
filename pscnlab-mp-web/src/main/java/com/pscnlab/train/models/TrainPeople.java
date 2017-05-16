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

package com.pscnlab.train.models;

import javax.persistence.*;

/**
 * Created by xiong on 2017/5/15 .
 */
@Entity
@Table(name = "train_people")
public class TrainPeople {
    private Integer uuid;
    private Integer uuidMember;
    private Integer uuidTrain;

    @Id
    @Column(name = "uuid")
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getUuid() {
        return uuid;
    }

    public void setUuid(Integer uuid) {
        this.uuid = uuid;
    }

    @Basic
    @Column(name = "uuid_member")
    public Integer getUuidMember() {
        return uuidMember;
    }

    public void setUuidMember(Integer uuidMember) {
        this.uuidMember = uuidMember;
    }

    @Basic
    @Column(name = "uuid_train")
    public Integer getUuidTrain() {
        return uuidTrain;
    }

    public void setUuidTrain(Integer uuidTrain) {
        this.uuidTrain = uuidTrain;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TrainPeople that = (TrainPeople) o;

        if (uuid != null ? !uuid.equals(that.uuid) : that.uuid != null) return false;
        if (uuidMember != null ? !uuidMember.equals(that.uuidMember) : that.uuidMember != null) return false;
        if (uuidTrain != null ? !uuidTrain.equals(that.uuidTrain) : that.uuidTrain != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = uuid != null ? uuid.hashCode() : 0;
        result = 31 * result + (uuidMember != null ? uuidMember.hashCode() : 0);
        result = 31 * result + (uuidTrain != null ? uuidTrain.hashCode() : 0);
        return result;
    }
}

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
@Table(name = "train")
public class Train {
    private Integer uuidTrain;
    private String title;
    private String speaker;
    private String time;
    private String place;
    private Integer number;
    private String telephone;

    @Id
    @Column(name = "uuid_train")
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getUuidTrain() {
        return uuidTrain;
    }

    public void setUuidTrain(Integer uuidTrain) {
        this.uuidTrain = uuidTrain;
    }

    @Basic
    @Column(name = "title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Basic
    @Column(name = "speaker")
    public String getSpeaker() {
        return speaker;
    }

    public void setSpeaker(String speaker) {
        this.speaker = speaker;
    }

    @Basic
    @Column(name = "time")
    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    @Basic
    @Column(name = "place")
    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    @Basic
    @Column(name = "number")
    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    @Basic
    @Column(name = "telephone")
    public String getTelephone() {return telephone;}

    public void setTelephone(String telephone) {this.telephone = telephone;}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Train train = (Train) o;

        if (uuidTrain != null ? !uuidTrain.equals(train.uuidTrain) : train.uuidTrain != null) return false;
        if (title != null ? !title.equals(train.title) : train.title != null) return false;
        if (speaker != null ? !speaker.equals(train.speaker) : train.speaker != null) return false;
        if (time != null ? !time.equals(train.time) : train.time != null) return false;
        if (place != null ? !place.equals(train.place) : train.place != null) return false;
        if (number != null ? !number.equals(train.number) : train.number != null) return false;
        if (telephone != null ? !telephone.equals(train.telephone) : train.telephone != null) return false;
        return true;
    }

    @Override
    public int hashCode() {
        int result = uuidTrain != null ? uuidTrain.hashCode() : 0;
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (speaker != null ? speaker.hashCode() : 0);
        result = 31 * result + (time != null ? time.hashCode() : 0);
        result = 31 * result + (place != null ? place.hashCode() : 0);
        result = 31 * result + (number != null ? number.hashCode() : 0);
        result = 31 * result + (telephone != null ? telephone.hashCode() : 0);
        return result;
    }
}

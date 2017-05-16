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

package com.pscnlab.recruit.models;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * Created by xiong on 2017/5/16 .
 */
@Entity
public class Recruit {
    private Integer uuid;
    private Integer uuidRole;
    private String number;
    private String condition;
    private String responsePerson;
    private String telephone;

    @Id
    @Column(name = "uuid")
    public Integer getUuid() {
        return uuid;
    }

    public void setUuid(Integer uuid) {
        this.uuid = uuid;
    }

    @Basic
    @Column(name = "uuid_role")
    public Integer getUuidRole() {
        return uuidRole;
    }

    public void setUuidRole(Integer uuidRole) {
        this.uuidRole = uuidRole;
    }

    @Basic
    @Column(name = "number")
    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    @Basic
    @Column(name = "condition")
    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    @Basic
    @Column(name = "response_person")
    public String getResponsePerson() {
        return responsePerson;
    }

    public void setResponsePerson(String responsePerson) {
        this.responsePerson = responsePerson;
    }

    @Basic
    @Column(name = "telephone")
    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Recruit recruit = (Recruit) o;

        if (uuid != null ? !uuid.equals(recruit.uuid) : recruit.uuid != null) return false;
        if (uuidRole != null ? !uuidRole.equals(recruit.uuidRole) : recruit.uuidRole != null) return false;
        if (number != null ? !number.equals(recruit.number) : recruit.number != null) return false;
        if (condition != null ? !condition.equals(recruit.condition) : recruit.condition != null) return false;
        if (responsePerson != null ? !responsePerson.equals(recruit.responsePerson) : recruit.responsePerson != null)
            return false;
        if (telephone != null ? !telephone.equals(recruit.telephone) : recruit.telephone != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = uuid != null ? uuid.hashCode() : 0;
        result = 31 * result + (uuidRole != null ? uuidRole.hashCode() : 0);
        result = 31 * result + (number != null ? number.hashCode() : 0);
        result = 31 * result + (condition != null ? condition.hashCode() : 0);
        result = 31 * result + (responsePerson != null ? responsePerson.hashCode() : 0);
        result = 31 * result + (telephone != null ? telephone.hashCode() : 0);
        return result;
    }
}

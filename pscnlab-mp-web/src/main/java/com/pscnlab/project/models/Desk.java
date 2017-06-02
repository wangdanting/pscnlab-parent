package com.pscnlab.project.models;

import javax.persistence.*;

/**
 * Created by zengyh on 2017/5/15.
 */
@Entity
@javax.persistence.Table(name = "desk")
public class Desk {
    private Integer uuid;
    private String num;
    private String attention;
    private String state;
    private String userName;
    private String userTelephone;

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
    @Column(name = "num")
    public String getNum() {
        return num;
    }

    public void setNum(String num) {
        this.num = num;
    }

    @Basic
    @Column(name = "attention")
    public String getAttention() {
        return attention;
    }

    public void setAttention(String attention) {
        this.attention = attention;
    }

    @Basic
    @Column(name = "state")
    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    @Basic
    @Column(name = "user_name")
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Basic
    @Column(name = "user_telephone")
    public String getUserTelephone() {
        return userTelephone;
    }

    public void setUserTelephone(String userTelephone) {
        this.userTelephone = userTelephone;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Desk desk = (Desk) o;

        if (uuid != null ? !uuid.equals(desk.uuid) : desk.uuid != null) return false;
        if (num != null ? !num.equals(desk.num) : desk.num != null) return false;
        if (attention != null ? !attention.equals(desk.attention) : desk.attention != null) return false;
        if (state != null ? !state.equals(desk.state) : desk.state != null) return false;
        if (userName != null ? !userName.equals(desk.userName) : desk.userName != null) return false;
        if (userTelephone != null ? !userTelephone.equals(desk.userTelephone) : desk.userTelephone != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = uuid != null ? uuid.hashCode() : 0;
        result = 31 * result + (num != null ? num.hashCode() : 0);
        result = 31 * result + (attention != null ? attention.hashCode() : 0);
        result = 31 * result + (state != null ? state.hashCode() : 0);
        result = 31 * result + (userName != null ? userName.hashCode() : 0);
        result = 31 * result + (userTelephone != null ? userTelephone.hashCode() : 0);
        return result;
    }
}

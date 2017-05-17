package com.pscnlab.project.services.dtos;

import java.io.Serializable;

/**
 * Created by zengyh on 2017/5/15.
 */
public class ProjectProgressPeopleDTO implements Serializable {

    private String uuidProgessPeople;//成员进度表ID
    private String memberName;     //成员名称
    private String roleName;       //角色
    private String position;       //职位
    private String progress;       //进度

    public String getUuidProgessPeople() {
        return uuidProgessPeople;
    }

    public void setUuidProgessPeople(String uuidProgessPeople) {
        this.uuidProgessPeople = uuidProgessPeople;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }
}

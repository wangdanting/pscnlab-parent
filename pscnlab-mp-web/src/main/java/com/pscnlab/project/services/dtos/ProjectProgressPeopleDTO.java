package com.pscnlab.project.services.dtos;

import java.io.Serializable;

/**
 * Created by zengyh on 2017/5/15.
 */
public class ProjectProgressPeopleDTO implements Serializable {

    private Integer uuidMember; //成员ID
    private String memberName;     //成员名称
    private String telephone;      //电话号码
    private String roleName;       //角色
    private String position;       //职位
    private String progress;       //进度
    private String progressInfo;   //进度信息

    public Integer getUuidMember() {
        return uuidMember;
    }

    public void setUuidMember(Integer uuidMember) {
        this.uuidMember = uuidMember;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getProgressInfo() {
        return progressInfo;
    }

    public void setProgressInfo(String progressInfo) {
        this.progressInfo = progressInfo;
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

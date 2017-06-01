package com.pscnlab.project.services.dtos;

import java.io.Serializable;
import java.util.List;

/**
 * Created by zengyh on 2017/5/15.
 */
public class ProjectQueryPageDTO implements Serializable {

    private Integer uuid;        //项目ID
    private String uuidProjectProgress;
    private String title;       //标题
    private String state;       //状态
    private String responsiblePersonName;  //负责人姓名
    private String responsiblePersonTelephone;  //负责人电话
    private String demand;               //项目需求
    private String startTime;           //开始时间
    private String startEnd;            //结束时间
    private String attention;           //注意事项

    private List<ProjectProgressPeopleDTO> projectPepoles; //项目成员与进度

    public Integer getUuid() {
        return uuid;
    }

    public void setUuid(Integer uuid) {
        this.uuid = uuid;
    }

    public String getUuidProjectProgress() {
        return uuidProjectProgress;
    }

    public void setUuidProjectProgress(String uuidProjectProgress) {
        this.uuidProjectProgress = uuidProjectProgress;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getResponsiblePersonName() {
        return responsiblePersonName;
    }

    public void setResponsiblePersonName(String responsiblePersonName) {
        this.responsiblePersonName = responsiblePersonName;
    }

    public String getResponsiblePersonTelephone() {
        return responsiblePersonTelephone;
    }

    public void setResponsiblePersonTelephone(String responsiblePersonTelephone) {
        this.responsiblePersonTelephone = responsiblePersonTelephone;
    }

    public String getDemand() {
        return demand;
    }

    public void setDemand(String demand) {
        this.demand = demand;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getStartEnd() {
        return startEnd;
    }

    public void setStartEnd(String startEnd) {
        this.startEnd = startEnd;
    }

    public String getAttention() {
        return attention;
    }

    public void setAttention(String attention) {
        this.attention = attention;
    }

    public List<ProjectProgressPeopleDTO> getProjectPepoles() {
        return projectPepoles;
    }

    public void setProjectPepoles(List<ProjectProgressPeopleDTO> projectPepoles) {
        this.projectPepoles = projectPepoles;
    }
}

package com.pscnlab.project.models;

import javax.persistence.*;

/**
 * Created by zengyh on 2017/5/15.
 */
@Entity
@javax.persistence.Table(name = "project")
public class Project {
    private Integer uuid;
    private Integer uuidRole;
    private String uuidProjectProgress;
    private String title;
    private String state;
    private String responsiblePersonName;
    private String responsiblePersonTelephone;
    private String demand;
    private String startTime;
    private String startEnd;
    private String attention;

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
    @Column(name = "uuid_role")
    public Integer getUuidRole() {
        return uuidRole;
    }

    public void setUuidRole(Integer uuidRole) {
        this.uuidRole = uuidRole;
    }

    @Basic
    @Column(name = "uuid_project_progress")
    public String getUuidProjectProgress() {
        return uuidProjectProgress;
    }

    public void setUuidProjectProgress(String uuidProjectProgress) {
        this.uuidProjectProgress = uuidProjectProgress;
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
    @Column(name = "state")
    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    @Basic
    @Column(name = "responsible_person_name")
    public String getResponsiblePersonName() {
        return responsiblePersonName;
    }

    public void setResponsiblePersonName(String responsiblePersonName) {
        this.responsiblePersonName = responsiblePersonName;
    }

    @Basic
    @Column(name = "responsible_person_telephone")
    public String getResponsiblePersonTelephone() {
        return responsiblePersonTelephone;
    }

    public void setResponsiblePersonTelephone(String responsiblePersonTelephone) {
        this.responsiblePersonTelephone = responsiblePersonTelephone;
    }

    @Basic
    @Column(name = "demand")
    public String getDemand() {
        return demand;
    }

    public void setDemand(String demand) {
        this.demand = demand;
    }

    @Basic
    @Column(name = "start_time")
    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    @Basic
    @Column(name = "start_end")
    public String getStartEnd() {
        return startEnd;
    }

    public void setStartEnd(String startEnd) {
        this.startEnd = startEnd;
    }

    @Basic
    @Column(name = "attention")
    public String getAttention() {
        return attention;
    }

    public void setAttention(String attention) {
        this.attention = attention;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Project project = (Project) o;

        if (uuid != null ? !uuid.equals(project.uuid) : project.uuid != null) return false;
        if (uuidRole != null ? !uuidRole.equals(project.uuidRole) : project.uuidRole != null) return false;
        if (uuidProjectProgress != null ? !uuidProjectProgress.equals(project.uuidProjectProgress) : project.uuidProjectProgress != null)
            return false;
        if (title != null ? !title.equals(project.title) : project.title != null) return false;
        if (state != null ? !state.equals(project.state) : project.state != null) return false;
        if (responsiblePersonName != null ? !responsiblePersonName.equals(project.responsiblePersonName) : project.responsiblePersonName != null)
            return false;
        if (responsiblePersonTelephone != null ? !responsiblePersonTelephone.equals(project.responsiblePersonTelephone) : project.responsiblePersonTelephone != null)
            return false;
        if (demand != null ? !demand.equals(project.demand) : project.demand != null) return false;
        if (startTime != null ? !startTime.equals(project.startTime) : project.startTime != null) return false;
        if (startEnd != null ? !startEnd.equals(project.startEnd) : project.startEnd != null) return false;
        if (attention != null ? !attention.equals(project.attention) : project.attention != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = uuid != null ? uuid.hashCode() : 0;
        result = 31 * result + (uuidRole != null ? uuidRole.hashCode() : 0);
        result = 31 * result + (uuidProjectProgress != null ? uuidProjectProgress.hashCode() : 0);
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (state != null ? state.hashCode() : 0);
        result = 31 * result + (responsiblePersonName != null ? responsiblePersonName.hashCode() : 0);
        result = 31 * result + (responsiblePersonTelephone != null ? responsiblePersonTelephone.hashCode() : 0);
        result = 31 * result + (demand != null ? demand.hashCode() : 0);
        result = 31 * result + (startTime != null ? startTime.hashCode() : 0);
        result = 31 * result + (startEnd != null ? startEnd.hashCode() : 0);
        result = 31 * result + (attention != null ? attention.hashCode() : 0);
        return result;
    }
}

package com.pscnlab.project.models;

import javax.persistence.*;

/**
 * Created by zengyh on 2017/5/15.
 */
@Entity
@javax.persistence.Table(name = "project_progress_people")
public class ProjectProgressPeople {
    private Integer uuid;
    private Integer uuidProject;
    private Integer uuidMember;
    private String progress;
    private String progressInfo;

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
    @Column(name = "uuid_project")
    public Integer getUuidProject() {
        return uuidProject;
    }

    public void setUuidProject(Integer uuidProject) {
        this.uuidProject = uuidProject;
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
    @Column(name = "progress")
    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }

    @Basic
    @Column(name = "progressInfo")
    public String getProgressInfo() {
        return progressInfo;
    }

    public void setProgressInfo(String progressInfo) {
        this.progressInfo = progressInfo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ProjectProgressPeople that = (ProjectProgressPeople) o;

        if (uuid != null ? !uuid.equals(that.uuid) : that.uuid != null) return false;
        if (uuidProject != null ? !uuidProject.equals(that.uuidProject) : that.uuidProject != null) return false;
        if (uuidMember != null ? !uuidMember.equals(that.uuidMember) : that.uuidMember != null) return false;
        if (progress != null ? !progress.equals(that.progress) : that.progress != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = uuid != null ? uuid.hashCode() : 0;
        result = 31 * result + (uuidProject != null ? uuidProject.hashCode() : 0);
        result = 31 * result + (uuidMember != null ? uuidMember.hashCode() : 0);
        result = 31 * result + (progress != null ? progress.hashCode() : 0);
        return result;
    }
}

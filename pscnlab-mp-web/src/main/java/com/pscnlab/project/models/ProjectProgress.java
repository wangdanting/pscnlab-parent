package com.pscnlab.project.models;

import javax.persistence.*;

/**
 * Created by zengyh on 2017/5/15.
 */
@Entity
@javax.persistence.Table(name = "project_progress")
public class ProjectProgress {
    private Integer uuid;
    private Integer uuidProgressPeople;
    private Integer uuidProjectProgress;

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
    @Column(name = "uuid_progress_people")
    public Integer getUuidProgressPeople() {
        return uuidProgressPeople;
    }

    public void setUuidProgressPeople(Integer uuidProgressPeople) {
        this.uuidProgressPeople = uuidProgressPeople;
    }

    @Basic
    @Column(name = "uuid_project_progress")
    public Integer getUuidProjectProgress() {
        return uuidProjectProgress;
    }

    public void setUuidProjectProgress(Integer uuidProjectProgress) {
        this.uuidProjectProgress = uuidProjectProgress;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ProjectProgress that = (ProjectProgress) o;

        if (uuid != null ? !uuid.equals(that.uuid) : that.uuid != null) return false;
        if (uuidProgressPeople != null ? !uuidProgressPeople.equals(that.uuidProgressPeople) : that.uuidProgressPeople != null)
            return false;
        if (uuidProjectProgress != null ? !uuidProjectProgress.equals(that.uuidProjectProgress) : that.uuidProjectProgress != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = uuid != null ? uuid.hashCode() : 0;
        result = 31 * result + (uuidProgressPeople != null ? uuidProgressPeople.hashCode() : 0);
        result = 31 * result + (uuidProjectProgress != null ? uuidProjectProgress.hashCode() : 0);
        return result;
    }
}

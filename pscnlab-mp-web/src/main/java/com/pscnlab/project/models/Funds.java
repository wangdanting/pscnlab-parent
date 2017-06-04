package com.pscnlab.project.models;

import javax.persistence.*;

@Entity
@javax.persistence.Table(name = "funds")
public class Funds {
    private Integer uuidFund;
    private String event;
    private String time;
    private Integer money;

    @Id
    @Column(name = "uuid_fund")
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getUuidFund() {
        return uuidFund;
    }

    public void setUuidFund(Integer uuidFund) {
        this.uuidFund = uuidFund;
    }

    @Basic
    @Column(name = "event")
    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
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
    @Column(name = "money")
    public Integer getMoney() {
        return money;
    }

    public void setMoney(Integer money) {
        this.money = money;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Funds funds = (Funds) o;

        if (uuidFund != null ? !uuidFund.equals(funds.uuidFund) : funds.uuidFund != null) return false;
        if (event != null ? !event.equals(funds.event) : funds.event != null) return false;
        if (time != null ? !time.equals(funds.time) : funds.time != null) return false;
        if (money != null ? !money.equals(funds.money) : funds.money != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = uuidFund != null ? uuidFund.hashCode() : 0;
        result = 31 * result + (event != null ? event.hashCode() : 0);
        result = 31 * result + (time != null ? time.hashCode() : 0);
        result = 31 * result + (money != null ? money.hashCode() : 0);
        return result;
    }
}

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

package com.pscnlab.member.models;

import javax.persistence.*;

@Entity
public class Role {
    private Integer uuidRole;
    private String role;
    private String position;

    @Id
    @Column(name = "uuid_role")
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getUuidRole() {
        return uuidRole;
    }

    public void setUuidRole(Integer uuidRole) {
        this.uuidRole = uuidRole;
    }

    @Basic
    @Column(name = "role")
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Basic
    @Column(name = "position")
    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Role role1 = (Role) o;

        if (uuidRole != null ? !uuidRole.equals(role1.uuidRole) : role1.uuidRole != null) return false;
        if (role != null ? !role.equals(role1.role) : role1.role != null) return false;
        if (position != null ? !position.equals(role1.position) : role1.position != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = uuidRole != null ? uuidRole.hashCode() : 0;
        result = 31 * result + (role != null ? role.hashCode() : 0);
        result = 31 * result + (position != null ? position.hashCode() : 0);
        return result;
    }
}

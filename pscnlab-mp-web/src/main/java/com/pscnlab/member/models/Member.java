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
public class Member {
    private Integer uuidMember;
    private Integer uuidRole;
    private String name;
    private String gender;
    private String age;
    private String gradeClass;
    private String telephone;
    private String hobby;
    private String password;
    private Integer manage;

    @Id
    @Column(name = "uuid_member")
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer getUuidMember() {
        return uuidMember;
    }

    public void setUuidMember(Integer uuidMember) {
        this.uuidMember = uuidMember;
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
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "gender")
    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    @Basic
    @Column(name = "age")
    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    @Basic
    @Column(name = "grade_class")
    public String getGradeClass() {
        return gradeClass;
    }

    public void setGradeClass(String gradeClass) {
        this.gradeClass = gradeClass;
    }

    @Basic
    @Column(name = "telephone")
    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    @Basic
    @Column(name = "hobby")
    public String getHobby() {
        return hobby;
    }

    public void setHobby(String hobby) {
        this.hobby = hobby;
    }

    @Basic
    @Column(name = "password")
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }


    @Basic
    @Column(name = "manage")
    public Integer getManage() {
        return manage;
    }

    public void setManage(Integer manage) {
        this.manage = manage;
    }



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Member member = (Member) o;

        if (uuidMember != null ? !uuidMember.equals(member.uuidMember) : member.uuidMember != null) return false;
        if (uuidRole != null ? !uuidRole.equals(member.uuidRole) : member.uuidRole != null) return false;
        if (name != null ? !name.equals(member.name) : member.name != null) return false;
        if (gender != null ? !gender.equals(member.gender) : member.gender != null) return false;
        if (age != null ? !age.equals(member.age) : member.age != null) return false;
        if (gradeClass != null ? !gradeClass.equals(member.gradeClass) : member.gradeClass != null) return false;
        if (telephone != null ? !telephone.equals(member.telephone) : member.telephone != null) return false;
        if (hobby != null ? !hobby.equals(member.hobby) : member.hobby != null) return false;
        if (password != null ? !password.equals(member.password) : member.password != null) return false;
        if (manage != null ? !manage.equals(member.manage) : member.manage != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = uuidMember != null ? uuidMember.hashCode() : 0;
        result = 31 * result + (uuidRole != null ? uuidRole.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (gender != null ? gender.hashCode() : 0);
        result = 31 * result + (age != null ? age.hashCode() : 0);
        result = 31 * result + (gradeClass != null ? gradeClass.hashCode() : 0);
        result = 31 * result + (telephone != null ? telephone.hashCode() : 0);
        result = 31 * result + (hobby != null ? hobby.hashCode() : 0);
        result = 31 * result + (password != null ? password.hashCode() : 0);
        result = 31 * result + (password != null ? password.hashCode() : 0);
        result = 31 * result + (manage != null ? manage.hashCode() : 0);
        return result;
    }
}

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

package com.pscnlab.member.services.dtos;

import com.pscnlab.member.models.Member;
import com.pscnlab.member.models.Role;

import java.io.Serializable;

/**
 * Created by xiong on 2017/5/15 .
 */
public class MemberPageDTO implements Serializable {
    private Member member;
    private Role role;

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}

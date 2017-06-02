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

package com.pscnlab.member.daos.impls;

import com.jiabangou.guice.persist.jpa.BaseDao;
import com.jiabangou.guice.persist.jpa.util.FilterMap;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.member.daos.MemberDao;
import com.pscnlab.member.models.Member;
import com.pscnlab.member.services.dtos.MemberPageQueryDTO;
import org.apache.commons.lang.StringUtils;

import java.util.List;
import java.util.Set;

/**
 * Created by xiong on 2017/5/15 .
 */
public class MemberDaoImpl extends BaseDao<Integer,Member> implements MemberDao {
    @Override
    public Long countMemberByUuidRole(Integer uuidRole) {
        FilterMap filterMap=new FilterMap();
        filterMap.eq("uuidRole",uuidRole);
        return super.count(filterMap);
    }

    @Override
    public Page<Member> findPage(MemberPageQueryDTO query, Integer offset, Integer size) {
        FilterMap filterMap=new FilterMap();
        if(query!=null) {
            filterMap.eq("uuidRole", query.getUuidRole());
            filterMap.eq("gender", query.getGender());
            if(StringUtils.isNotEmpty(query.getName())) {
                filterMap.like("name", "%"+query.getName()+"%");
            }
            if(StringUtils.isNotEmpty(query.getTelephone())) {
                filterMap.like("telephone", "%"+query.getTelephone()+"%");
            }
        }
        return super.page(filterMap,offset,size);
    }

    @Override
    public Member findOneByTelephone(String telephone) {
        FilterMap filterMap=new FilterMap();
        filterMap.eq("telephone",telephone);
        return super.findOne(filterMap);
    }

    @Override
    public List<Member> findListByMemberName(String memberName){
        FilterMap filterMap = new FilterMap();
        filterMap.like("name","%"+memberName+"%");
        return super.list(filterMap);
    }

    @Override
    public List<Member> findListByMemberIdsSet(Set<Integer> memberIdsSet){

        FilterMap filterMap = new FilterMap();
        filterMap.in("uuidMember",memberIdsSet);
        return super.list(filterMap);
    }
}

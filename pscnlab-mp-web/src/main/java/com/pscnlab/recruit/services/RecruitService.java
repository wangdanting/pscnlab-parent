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

package com.pscnlab.recruit.services;

import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.pscnlab.base.services.BaseService;
import com.pscnlab.recruit.models.Recruit;

public interface RecruitService extends BaseService<Integer,Recruit> {
    //查询招聘列表
    ResultsTotalDTO<Recruit> findPageByCondition(String position, Integer offset, Integer size);

    //查询某项招聘
    Recruit findOneRecruit(Integer uuid);

    //新增经费
    void saveRecruit(Recruit recruit);

    //修改经费
    void updateRecruit(Recruit newRecruit);

    //删除经费
    void deleteRecruit(Integer uuid);
}

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

package com.pscnlab.recruit.services.impls;

import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.core.exceptions.ServiceException;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.recruit.daos.RecruitDao;
import com.pscnlab.recruit.models.Recruit;
import com.pscnlab.recruit.services.RecruitService;
import org.apache.commons.lang.StringUtils;

import javax.inject.Inject;

public class RecruitServiceImpl extends BaseServiceImpl<Integer,Recruit> implements RecruitService {
    @Inject
    private RecruitDao recruitDao;

    //查询招聘列表
    @Override
    public ResultsTotalDTO<Recruit> findPageByCondition(String position, Integer offset, Integer size){

        Page<Recruit> fundsPage = recruitDao.findPageByCondition(position,offset,size);
        return ResultsTotalDTO.build(fundsPage.getResults(),fundsPage.getTotalCount());
    }

    //查询某项招聘
    @Override
    public Recruit findOneRecruit(Integer uuid){
        return recruitDao.findOneById(uuid);
    }


    //新增经费
    @Override
    public void saveRecruit(Recruit recruit){
        recruitDao.save(recruit);
    }

    //修改经费
    @Override
    public void updateRecruit(Recruit newRecruit){
        Recruit recruit = recruitDao.findOneById(newRecruit.getUuid());
        if(recruit==null){
            throw ServiceException.build(600001l,"数据不存在，修改失败");
        }
        recruit = new Recruit();
        if(StringUtils.isNotBlank(newRecruit.getCondition())){
            recruit.setCondition(newRecruit.getCondition());
        }
        if(StringUtils.isNotBlank(newRecruit.getNumber())){
            recruit.setNumber(newRecruit.getNumber());
        }
        if(StringUtils.isNotBlank(newRecruit.getPosition())){
            recruit.setPosition(newRecruit.getPosition());
        }
        if(StringUtils.isNotBlank(newRecruit.getResponsePerson())){
            recruit.setResponsePerson(newRecruit.getResponsePerson());
        }
        if(StringUtils.isNotBlank(newRecruit.getTelephone())){
            recruit.setTelephone(newRecruit.getTelephone());
        }

        recruitDao.update(recruit);
    }

    //删除经费
    @Override
    public void deleteRecruit(Integer uuid){
        Recruit recruit = recruitDao.findOneById(uuid);
        if(recruit==null){
            throw ServiceException.build(600001l,"数据不存在，删除失败");
        }
        recruitDao.delete(recruit);
    }



    @Override
    protected IBaseDao<Integer, Recruit> getBaseDao() {
        return recruitDao;
    }
}

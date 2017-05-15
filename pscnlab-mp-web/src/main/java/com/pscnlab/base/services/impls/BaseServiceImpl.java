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

package com.pscnlab.base.services.impls;

import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.pscnlab.base.services.BaseService;

import java.util.List;
import java.util.Map;

/**
 * Created by xiong on 2017/5/15 .
 */
public abstract class BaseServiceImpl<ID, T> implements BaseService<ID, T>  {

    protected abstract IBaseDao<ID,T> getBaseDao();

    @Override
    public T findOne(ID var1) {
        return this.getBaseDao().findOne(var1);
    }

    @Override
    public List<T> findByIds(List<ID> var1) {
        return this.getBaseDao().findByIds(var1);
    }

    @Override
    public Map<ID, T> findMapByIds(List<ID> var1) {
        return this.getBaseDao().findMapByIds(var1);
    }

    @Override
    public void save(T var1) {
        this.getBaseDao().save(var1);
    }

    @Override
    public void saveAll(List<T> var1) {
        this.getBaseDao().saveAll(var1);
    }

    @Override
    public void update(T var1) {
        this.getBaseDao().update(var1);
    }

    @Override
    public void updateAll(List<T> var1) {
        this.getBaseDao().updateAll(var1);
    }
}

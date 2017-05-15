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

package com.pscnlab.base.services;

import java.util.List;
import java.util.Map;

/**
 * Created by xiong on 2017/5/15 .
 */
public interface BaseService<ID, T> {
    T findOne(ID var1);

    List<T> findByIds(List<ID> var1);

    Map<ID, T> findMapByIds(List<ID> var1);

    void save(T var1);

    void saveAll(List<T> var1);

    void update(T var1);

    void updateAll(List<T> var1);
}

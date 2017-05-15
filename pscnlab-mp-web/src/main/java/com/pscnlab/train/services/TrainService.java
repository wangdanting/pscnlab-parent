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

package com.pscnlab.train.services;

import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.BaseService;
import com.pscnlab.train.models.Train;

/**
 * Created by xiong on 2017/5/15 .
 */
public interface TrainService extends BaseService<Integer,Train>{
    Page<Train> findPage(String time, Integer offset, Integer size);
}

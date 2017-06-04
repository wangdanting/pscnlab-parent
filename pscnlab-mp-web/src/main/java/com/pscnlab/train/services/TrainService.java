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

import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.BaseService;
import com.pscnlab.train.models.Train;
import com.pscnlab.train.services.dtos.TrainPageDTO;

public interface TrainService extends BaseService<Integer,Train>{
    //新增培训
    void saveTrain(Train train);

    //更新培训
    void updateTrain(Train newTrain);

    //删除培训
    void deleteTrain(Integer trainId);

    //参加培训
    void trainAddMember(Integer trainId, Integer memberUUId);

    //退出培训
    void trainDeleteMember(Integer trainId, Integer memberUUId);

    //查询培训列表
    ResultsTotalDTO<TrainPageDTO> findPageByTime(String time, Integer offset, Integer size, Integer memberUUId);

    Page<TrainPageDTO> findPage(String time, Integer offset, Integer size);
}

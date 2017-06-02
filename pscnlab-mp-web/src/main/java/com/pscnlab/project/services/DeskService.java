package com.pscnlab.project.services;

import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.pscnlab.base.services.BaseService;
import com.pscnlab.project.models.Desk;

/**
 * Created by zengyh on 2017/6/2.
 */
public interface DeskService extends BaseService {
    ResultsTotalDTO<Desk> findListByCondition(String tableNum,
                                              String userName,
                                              String state,
                                              Integer offset,
                                              Integer size);

    //查询单个桌位
    Desk findOneByTableId(Integer tableId);

    //新增桌位
    void addDesk(Desk desk);

    //更新桌位
    void updateDesk(Desk newDesk);

    //删除桌位
    void deleteDesk(Integer deskId);
}

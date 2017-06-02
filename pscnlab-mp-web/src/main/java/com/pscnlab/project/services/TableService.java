package com.pscnlab.project.services;

import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.pscnlab.base.services.BaseService;
import com.pscnlab.project.models.Table;

/**
 * Created by zengyh on 2017/6/2.
 */
public interface TableService extends BaseService {
    ResultsTotalDTO<Table> findListByCondition(String tableNum,
                                               String userName,
                                               String state,
                                               Integer offset,
                                               Integer size);

    //新增桌位
    void addTable(Table table);

    //更新桌位
    void updateTable(Table newTable);

    //删除桌位
    void deleteTable(Integer tableId);
}

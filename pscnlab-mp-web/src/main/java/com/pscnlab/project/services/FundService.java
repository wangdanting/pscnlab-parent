package com.pscnlab.project.services;

import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.pscnlab.base.services.BaseService;
import com.pscnlab.project.models.Funds;

public interface FundService extends BaseService{
    //统计经费余额
    Integer countAllFund();

    //查询经费列表
    ResultsTotalDTO<Funds> findPageByCondition(Integer offset, Integer size);

    //查询某项经费
    Funds findOneFund(Integer fundId);

    //新增经费
    void saveFunds(Funds funds);

    //修改经费
    void updateFund(Funds newFunds);

    //删除经费
    void deleteFund(Integer fundId);
}

package com.pscnlab.project.services.impls;

import com.google.inject.Inject;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.core.exceptions.ServiceException;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.BaseService;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.project.daos.FundDao;
import com.pscnlab.project.models.Funds;
import com.pscnlab.project.services.FundService;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

/**
 * Created by zengyh on 2017/6/3.
 */
public class FundServiceImpl extends BaseServiceImpl implements FundService  {

    @Inject
    private FundDao fundDao;

    //统计经费余额
    @Override
    public Integer countAllFund(){
        List<Funds> fundsList = fundDao.findListAll();
        Integer fundsCountBalance = 0 ;
        if(CollectionUtils.isNotEmpty(fundsList)){
            for(Funds funds:fundsList){
                fundsCountBalance += funds.getMoney();
            }
        }
        return fundsCountBalance;

    }


    //查询经费列表
    @Override
    public ResultsTotalDTO<Funds> findPageByCondition(Integer offset, Integer size){

        Page<Funds> fundsPage = fundDao.findPageByCondition(offset,size);
        return ResultsTotalDTO.build(fundsPage.getResults(),fundsPage.getTotalCount());
    }

    //查询某项经费
    @Override
    public Funds findOneFund(Integer fundId){
        return fundDao.findOneById(fundId);
    }


    //新增经费
    @Override
    public void saveFunds(Funds funds){
        fundDao.save(funds);
    }

    //修改经费
    @Override
    public void updateFund(Funds newFunds){
        Funds funds = fundDao.findOneById(newFunds.getUuidFund());
        if(funds==null){
            throw ServiceException.build(600001l,"数据不存在，修改失败");
        }
        funds = new Funds();
        if(StringUtils.isNotBlank(newFunds.getEvent())){
            funds.setEvent(newFunds.getEvent());
        }
        if(newFunds.getMoney()!=null) {
            funds.setMoney(newFunds.getMoney());
        }
        if(StringUtils.isNotBlank(newFunds.getTime())) {
            funds.setTime(newFunds.getTime());
        }
        fundDao.update(funds);
    }

    //删除经费
    @Override
    public void deleteFund(Integer fundId){
        Funds funds = fundDao.findOneById(fundId);
        if(funds==null){
            throw ServiceException.build(600001l,"数据不存在，删除失败");
        }
        fundDao.delete(funds);
    }

    @Override
    protected IBaseDao getBaseDao() {
        return fundDao;
    }
}

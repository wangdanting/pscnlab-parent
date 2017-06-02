package com.pscnlab.project.services.impls;

import com.google.inject.Inject;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.core.exceptions.ServiceException;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.BaseService;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.project.daos.TableDao;
import com.pscnlab.project.models.Table;
import com.pscnlab.project.services.TableService;
import javafx.scene.control.Tab;
import ninja.Result;

/**
 * Created by zengyh on 2017/6/2.
 */
public class TableServiceImpl extends BaseServiceImpl implements TableService {


    @Inject
    private TableDao tableDao;

    //按条件查询桌位
    @Override
    public ResultsTotalDTO<Table> findListByCondition(String tableNum,
                                                      String userName,
                                                      String state,
                                                      Integer offset,
                                                      Integer size){

        Page<Table> tablePage = tableDao.findListByConditions(tableNum,userName,state,offset,size);
        return ResultsTotalDTO.build(tablePage.getResults(),tablePage.getTotalCount());
    }

    //查询单个桌位
    @Override
    public Table findOneByTableId(Integer tableId){

        Table table = tableDao.findOneByTableId(tableId);
        return table;
    }

    //新增桌位
    @Override
    public void addTable(Table table){
        tableDao.save(table);
    }

    //更新桌位
    @Override
    public void updateTable(Table newTable){

        Table table = tableDao.findOneByTableId(newTable.getUuid());
        if(table==null){
            throw ServiceException.build(500002l,"桌位不存在");
        }
        table.setState(newTable.getState());
        table.setAttention(newTable.getAttention());
        table.setNum(newTable.getNum());
        table.setUserName(newTable.getUserName());
        table.setUserTelephone(newTable.getUserTelephone());

        tableDao.update(table);
    }

    //删除桌位
    @Override
    public void deleteTable(Integer tableId){
        Table table = tableDao.findOneByTableId(tableId);
        if(table==null){
            throw ServiceException.build(500002l,"桌位不存在");
        }
        tableDao.delete(table);
    }

    @Override
    protected IBaseDao getBaseDao() {
        return null;
    }
}

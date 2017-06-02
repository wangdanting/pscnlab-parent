package com.pscnlab.project.services.impls;

import com.google.inject.Inject;
import com.jiabangou.core.dtos.ResultsTotalDTO;
import com.jiabangou.core.exceptions.ServiceException;
import com.jiabangou.guice.persist.jpa.IBaseDao;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.pscnlab.base.services.impls.BaseServiceImpl;
import com.pscnlab.project.daos.DeskDao;
import com.pscnlab.project.models.Desk;
import com.pscnlab.project.services.DeskService;

/**
 * Created by zengyh on 2017/6/2.
 */
public class DeskServiceImpl extends BaseServiceImpl implements DeskService {


    @Inject
    private DeskDao deskDao;

    //按条件查询桌位
    @Override
    public ResultsTotalDTO<Desk> findListByCondition(String tableNum,
                                                      String userName,
                                                      String state,
                                                      Integer offset,
                                                      Integer size){

        Page<Desk> deskPage = deskDao.findListByConditions(tableNum,userName,state,offset,size);
        return ResultsTotalDTO.build(deskPage.getResults(),deskPage.getTotalCount());
    }

    //查询单个桌位
    @Override
    public Desk findOneByTableId(Integer tableId){

        Desk desk = deskDao.findOneByTableId(tableId);
        return desk;
    }

    //新增桌位
    @Override
    public void addDesk(Desk desk){
        deskDao.save(desk);
    }

    //更新桌位
    @Override
    public void updateDesk(Desk newDesk){

        Desk desk = deskDao.findOneByTableId(newDesk.getUuid());
        if(desk==null){
            throw ServiceException.build(500002l,"桌位不存在");
        }
        desk.setState(newDesk.getState());
        desk.setAttention(newDesk.getAttention());
        desk.setNum(newDesk.getNum());
        desk.setUserName(newDesk.getUserName());
        desk.setUserTelephone(newDesk.getUserTelephone());

        deskDao.update(desk);
    }

    //删除桌位
    @Override
    public void deleteDesk(Integer deskId){
        Desk desk = deskDao.findOneByTableId(deskId);
        if(desk==null){
            throw ServiceException.build(500002l,"桌位不存在");
        }
        deskDao.delete(desk);
    }

    @Override
    protected IBaseDao getBaseDao() {
        return null;
    }
}

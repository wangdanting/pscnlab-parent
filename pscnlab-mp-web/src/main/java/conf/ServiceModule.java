package conf;

import com.google.inject.AbstractModule;
import com.pscnlab.member.services.MemberSevice;
import com.pscnlab.member.services.RoleService;
import com.pscnlab.member.services.impl.MemberSeviceImpl;
import com.pscnlab.member.services.impl.RoleServiceImpl;
import com.pscnlab.project.models.Table;
import com.pscnlab.project.services.ProjectService;
import com.pscnlab.project.services.TableService;
import com.pscnlab.project.services.impls.ProjectServiceImpl;
import com.pscnlab.project.services.impls.TableServiceImpl;
import com.pscnlab.recruit.services.RecruitService;
import com.pscnlab.recruit.services.impls.RecruitServiceImpl;
import com.pscnlab.train.services.TrainPeopleService;
import com.pscnlab.train.services.TrainService;
import com.pscnlab.train.services.impls.TrainPeopleServiceImpl;
import com.pscnlab.train.services.impls.TrainServiceImpl;


/**
 * Created by freeway on 15/12/16.
 */
public class ServiceModule extends AbstractModule {


    protected void configure() {
        bind(MemberSevice.class).to(MemberSeviceImpl.class);
        bind(RoleService.class).to(RoleServiceImpl.class);
        bind(TrainService.class).to(TrainServiceImpl.class);
        bind(TrainPeopleService.class).to(TrainPeopleServiceImpl.class);
        bind(RecruitService.class).to(RecruitServiceImpl.class);

        bind(ProjectService.class).to(ProjectServiceImpl.class);
        bind(TableService.class).to(TableServiceImpl.class);
    }
}

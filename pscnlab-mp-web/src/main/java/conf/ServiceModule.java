package conf;

import com.google.inject.AbstractModule;
import com.pscnlab.member.services.MemberSevice;
import com.pscnlab.member.services.RoleService;
import com.pscnlab.member.services.impl.MemberSeviceImpl;
import com.pscnlab.member.services.impl.RoleServiceImpl;
import com.pscnlab.user.services.UserService;
import com.pscnlab.user.services.impls.UserServiceImpl;


/**
 * Created by freeway on 15/12/16.
 */
public class ServiceModule extends AbstractModule {


    protected void configure() {
        bind(UserService.class).to(UserServiceImpl.class);
        bind(MemberSevice.class).to(MemberSeviceImpl.class);
        bind(RoleService.class).to(RoleServiceImpl.class);


    }
}

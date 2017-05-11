package conf;

import com.google.inject.AbstractModule;
import com.pscnlab.user.services.UserService;
import com.pscnlab.user.services.impls.UserServiceImpl;


/**
 * Created by freeway on 15/12/16.
 */
public class ServiceModule extends AbstractModule {


    protected void configure() {
        bind(UserService.class).to(UserServiceImpl.class);


    }
}

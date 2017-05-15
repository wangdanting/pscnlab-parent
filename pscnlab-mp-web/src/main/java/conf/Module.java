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

package conf;

import com.google.inject.AbstractModule;
import com.google.inject.Singleton;
import com.jiabangou.core.validator.ValidationModule;
import com.jiabangou.guice.lifecycle.extentions.ninja.GuiceLifecycleNinjaModule;
import com.jiabangou.guice.persist.jpa.JpaTxnModule;
import com.jiabangou.ninja.extentions.NinjaExtModule;

@Singleton
public class Module extends AbstractModule {


    protected void configure() {

        // 根据我们项目的一些特有情况对ninja做了再包装
        install(new NinjaExtModule());
        install(new JpaTxnModule("^com.pscnlab..*.daos.impls.*"));
        install(new GuiceLifecycleNinjaModule());
        // bind validation
        install(new ValidationModule());
        // bind services
        install(new ServiceModule());

        // bind param parser
        //Multibinder<ParamParser> paramParserMultibinder = Multibinder.newSetBinder(binder(), ParamParser.class);
        //paramParserMultibinder.addBinding().to(DishItemParamParser.class);
    }

}

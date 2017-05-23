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


import com.google.inject.Inject;
import com.jiabangou.ninja.extentions.AssetsController;
import controllers.apis.LoginApiController;
import controllers.apis.PasswordApiController;
import controllers.pages.IndexController;
import controllers.pages.LoginController;
import controllers.pages.PasswordController;
import ninja.Router;
import ninja.application.ApplicationRoutes;
import ninja.utils.NinjaProperties;

//import controllers.pages.IndexController;

public class Routes implements ApplicationRoutes {

    @Inject
    private NinjaProperties ninjaProperties;

    @Override
    public void init(Router router) {

        router.GET().route("/assets/webjars/{fileName: .*}").with(AssetsController.class, "serveWebJars");
        router.GET().route("/assets/{fileName: .*}").with(AssetsController.class, "serveStatic");

        // 登录
        router.GET().route("/login").with(LoginController.class, "index");
        router.POST().route("/login").with(LoginApiController.class, "login");

        //找回密码
        router.GET().route("/password_find").with(PasswordController.class,"index");
        router.POST().route("/password_find").with(PasswordApiController.class,"password");

        //主页 就是角色管理
        router.GET().route("/.*").with(IndexController.class, "index"); //登录后并且选择商户
    }
}

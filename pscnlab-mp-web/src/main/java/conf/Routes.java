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
import controllers.apis.Test;
import ninja.Router;
import ninja.application.ApplicationRoutes;
import ninja.utils.NinjaProperties;

public class Routes implements ApplicationRoutes {

    @Inject
    private NinjaProperties ninjaProperties;

    @Override
    public void init(Router router) {

        /*
         参照Ruby On Rails中提供的命名和规范，见下表：

         HTTP Verb	Path	Controller#Action	Used for
         GET	/photos	photos#index	display a list of all photos
         GET	/photos/new	photos#newForm	return an HTML form for creating a new photo
         POST	/photos	photos#create	create a new photo
         GET	/photos/:id	photos#show	display a specific photo
         GET	/photos/:id/edit	photos#editForm	return an HTML form for editing a photo
         PATCH/PUT	/photos/:id	photos#update	update a specific photo
         DELETE	/photos/:id	photos#destroy	delete a specific photo

         */

        ///////////////////////////////////////////////////////////////////////
        // Assets (pictures / javascript)
        ///////////////////////////////////////////////////////////////////////

      /*  router.GET().route("/photos/:id").with(ControllerMethods.of(ActivityApiController::countUseAbleCoupon));
        router.PUT().route("/photos/:id").with(ActivityApiController::put);
        router.DELETE().route("/photos/:id").with(ActivityApiController.class,"delete");*/


        router.GET().route("/.*").with(Test::test); //登录后并且选择商户
    }
}

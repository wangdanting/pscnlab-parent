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

package controllers.apis;

import com.google.inject.Inject;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.user.services.UserService;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;

/**
 * Created by xiong on 2017/4/5 .
 */
@FilterWith(JsonAndJsonpResult.class)
public class Test {
    @Inject
    private UserService userService;
    public Result test(){
        //userService.xxx();
        return Results.text().render("sxx","12321321321312312");
    }
}

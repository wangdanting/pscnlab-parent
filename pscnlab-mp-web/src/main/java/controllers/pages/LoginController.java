package controllers.pages;

import ninja.Result;
import ninja.Results;

/**
 * Created by wangdanting on 17/5/15.
 */
public class LoginController {

    /**
     *
     * @return
     */
    public Result index() {
        return Results.ok().template("/views/login.ftl.html");
    }
}

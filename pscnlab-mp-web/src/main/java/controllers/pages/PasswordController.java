package controllers.pages;

import ninja.Result;
import ninja.Results;

/**
 * Created by wangdanting on 17/5/17.
 */
public class PasswordController {

    /**
     *
     * @return
     */
    public Result index() {
        return Results.ok().template("/views/password.ftl.html");
    }
}

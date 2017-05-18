package controllers.pages;

import ninja.Result;
import ninja.Results;

/**
 * Created by wangdanting on 17/5/18.
 */
public class RoleController {
    /**
     *
     * @return
     */
    public Result index() {
        return Results.ok().template("/views/index.ftl.html");
    }
}

package controllers.pages;

import ninja.Result;
import ninja.Results;

public class RoleController {
    /**
     *
     * @return
     */
    public Result index() {
        return Results.ok().template("/views/index.ftl.html");
    }
}

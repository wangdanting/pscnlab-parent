package controllers.pages;

import ninja.Result;
import ninja.Results;

public class LoginController {

    /**
     *
     * @return
     */
    public Result index() {
        return Results.ok().template("/views/login.ftl.html");
    }
}

package controllers.pages;

import ninja.Result;
import ninja.Results;

public class PasswordController {

    /**
     *
     * @return
     */
    public Result index() {
        return Results.ok().template("/views/password.ftl.html");
    }
}

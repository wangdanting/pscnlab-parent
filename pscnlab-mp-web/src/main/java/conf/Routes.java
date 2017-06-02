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
import controllers.apis.*;
import controllers.pages.IndexController;
import controllers.pages.LoginController;
import controllers.pages.PasswordController;
import ninja.Router;
import ninja.application.ApplicationRoutes;
import ninja.utils.NinjaProperties;

public class Routes implements ApplicationRoutes {

    @Inject
    private NinjaProperties ninjaProperties;

    @Override
    public void init(Router router) {

        router.GET().route("/assets/webjars/{fileName: .*}").with(AssetsController.class, "serveWebJars");
        router.GET().route("/assets/{fileName: .*}").with(AssetsController.class, "serveStatic");

        // 登录
        router.GET().route("/login").with(LoginController.class, "index");
        router.POST().route("/login.json").with(LoginApiController.class, "login");
        router.POST().route("/user/update_passwd.json").with(LoginApiController.class,"updatePasswd");

        //找回密码
        router.GET().route("/password_find").with(PasswordController.class,"index");
        router.POST().route("/password_find").with(PasswordApiController.class,"password");

        //角色
        router.POST().route("/role/new.json").with(RoleApiController.class,"newRole");
        router.GET().route("/role/id/{roleId}.json").with(RoleApiController.class,"findOneRole");
        router.PUT().route("/role/update.json").with(RoleApiController.class,"updateRole");
        router.DELETE().route("/role/delete.json").with(RoleApiController.class,"deleteRole");
        router.GET().route("/role.json").with(RoleApiController.class,"researchRole");
        router.GET().route("/role/lists.json").with(RoleApiController.class,"roleListAll");

        //成员
        router.GET().route("/member.json").with(MemberApiController.class,"findPage");
        router.POST().route("/member/new.json").with(MemberApiController.class,"newMember");
        router.GET().route("/member/tel/{memberId}.json").with(MemberApiController.class,"findOneMember");
        router.PUT().route("/member/update.json").with(MemberApiController.class,"updateMember");
        router.DELETE().route("/member/delete.json").with(MemberApiController.class,"deleteMember");

        //成员查询
        router.GET().route("/member/lists.json").with(MemberApiController.class,"memberList");

        //项目管理
        //项目查询
        router.GET().route("/project/lists.json").with(ProjectApiController.class,"projectList");
        //查询某一个项目
        router.GET().route("/project/id/{projectId}/infos.json").with(ProjectApiController.class,"projectInfo");
        //新增项目
        router.POST().route("/project/news.json").with(ProjectApiController.class,"projectNew");
        //编辑项目
        router.POST().route("/project/id/{projectId}/updates.json").with(ProjectApiController.class,"projectUpdate");
        //删除项目
        router.DELETE().route("/project/id/{projectId}/deletes.json").with(ProjectApiController.class,"projectDelete");
        //查询项目成员
        router.GET().route("/project/id/{projectId}/members.json").with(ProjectApiController.class,"projectMember");
        //加入成员
        router.POST().route("/project/id/{projectId}/add_members.json").with(ProjectApiController.class,"projectAddMember");
        //删除成员
        router.POST().route("/project/id/{projectId}/delete_members.json").with(ProjectApiController.class,"projectDeleteMember");
        //查询成员项目进度
        router.GET().route("/project/id/{projectId}/mid/{memberId}/infos.json").with(ProjectApiController.class,"projectProgressInfo");
        //成员编辑项目进度
        router.POST().route("/project/id/{projectId}/mid/{memberId}/updates.json").with(ProjectApiController.class,"projectUpdateProgress");

        //桌位管理
        //桌位查询
        router.GET().route("/desk/lists.json").with(DeskApiController.class,"deskList");
        //查询某一个桌位
        router.GET().route("/desk/id/{deskId}/infos.json").with(DeskApiController.class,"deskInfo");
        //添加桌位
        router.POST().route("/desk/new_desks.json").with(DeskApiController.class,"addDesk");
        //修改桌位
        router.POST().route("/desk/update_desks.json").with(DeskApiController.class,"updateDesk");
        //删除桌位
        router.POST().route("/desk/id/{deskId}/delete_desks.json").with(DeskApiController.class,"deleteDesk");


        //经费
        //查询经费
        //router.GET().route("").with();
        //查询某项经费
        //router.GET().route("").with();
        //添加经分


        //


        //主页 就是角色管理
        router.GET().route("/.*").with(IndexController.class, "index"); //登录后并且选择商户

    }
}

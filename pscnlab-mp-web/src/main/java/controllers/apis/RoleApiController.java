package controllers.apis;

import com.jiabangou.core.vos.ResultVO;
import com.jiabangou.guice.persist.jpa.util.Page;
import com.jiabangou.ninja.extentions.filter.JsonAndJsonpResult;
import com.pscnlab.member.models.Role;
import com.pscnlab.member.services.RoleService;
import ninja.FilterWith;
import ninja.Result;
import ninja.Results;
import ninja.params.Param;
import ninja.params.PathParam;

import javax.inject.Inject;
import java.util.List;

@FilterWith(JsonAndJsonpResult.class)
public class RoleApiController {
    @Inject
    private RoleService roleService;
    /**
     * 角色
     * @param
     * @return
     */
    public Result role(){
        return Results.ok().render(ResultVO.build(true));
    }

    public Result getAllRole() {
        return Results.ok().render(roleService.findAll());
    }

    public Result newRole(Role role) {
        roleService.save(role);
        return Results.ok().render(ResultVO.build(true));
    }

    public Result findOneRole(@PathParam("roleId")Integer roleId) {
        Role role=roleService.findOne(roleId);
        return Results.ok().render(role);
    }

    public Result updateRole(Role role) {
        roleService.update(role);
        return Results.ok().render(ResultVO.build(true));
    }

    public Result deleteRole(@Param("id") Integer id) {
        roleService.deleteById(id);
        return Results.ok().render(ResultVO.build(true));
    }

    public Result researchRole(@Param("role") String role,
                               @Param("position") String position,
                               @Param("offset") Integer offset,
                               @Param("size") Integer size) {
        Page<Role> page = roleService.findByRoleOrPosition(role, position,offset,size);

        return Results.ok().render(page);
    }

    public Result roleListAll(){
        List list = roleService.findAll();
        return Results.ok().render(list);
    }
}

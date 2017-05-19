export default [
    // 角色信息
    {
        path: `role`,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./role/Role.jsx'));
            });
        },
    },
    // 增加角色
    {
        path: `role/add-role`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./role/CreateRole.jsx'));
            });
        },
    },

    //成员信息
    {
        path: `member`,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./member/Member.jsx'));
            });
        },
    },
    //新增成员
    {
        path: `member/add-member`,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./member/CreateMember.jsx'));
            });
        },
    }

];

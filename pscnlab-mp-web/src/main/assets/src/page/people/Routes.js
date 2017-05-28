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
    // 修改角色
    {
        path: `role/modify-role/:id`, noHaveMenu: true,
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
        path: `member/add-member`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./member/CreateMember.jsx'));
            });
        },
    },

    //培训信息
    {
        path: `train`,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./train/Train.jsx'));
            });
        },
    },
    //新增培训
    {
        path: `train/add-train`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./train/CreateTrain.jsx'));
            });
        },
    },
    //修改培训
    {
        path: `train/modify-trai/:id`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./train/CreateTrain.jsx'));
            });
        },
    },

    //招聘信息
    {
        path: `recruit`,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./recruit/Recruit.jsx'));
            });
        },
    },
    //新增招聘
    {
        path: `recruit/add-recruit`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./recruit/CreateRecruit.jsx'));
            });
        },
    },
    //修改招聘
    {
        path: `recruit/modify-recruit/:id`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./recruit/CreateRecruit.jsx'));
            });
        },
    },
];

export default [
    // 项目信息
    {
        path: `project`,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./Project.jsx'));
            });
        },
    },
    // 新增项目
    {
        path: `project/add-project`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./CreateProject.jsx'));
            });
        },
    },
    // 修改项目
    {
        path: `project/modify-project/:id`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./CreateProject.jsx'));
            });
        },
    },

    //管理员编辑成员
    {
        path: `project/add-member/:id`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./EditProjectMember.jsx'));
            });
        },
    },
    //总体项目进度信息
    {
        path: `project/all-progress/:id`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./ProjectProgress.jsx'));
            });
        },
    },
    //个人项目进度信息
    {
        path: `project/one-progress/:id`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./CreateProjectProgress.jsx'));
            });
        },
    },
    //编辑个人项目进度
    {
        path: `project/modify-progress/:id`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./CreateProjectProgress.jsx'));
            });
        },
    },
];

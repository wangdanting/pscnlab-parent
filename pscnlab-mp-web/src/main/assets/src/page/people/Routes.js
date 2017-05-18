export default [
    // 增加角色
    {
        path: `addRole`,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./role/Role.jsx'));
            });
        },
    },
];

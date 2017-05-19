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
];

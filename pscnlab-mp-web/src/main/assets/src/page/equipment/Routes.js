export default [
    // 桌位信息
    {
        path: `table`,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./Table.jsx'));
            });
        },
    },
    // 新增桌位
    {
        path: `table/add-table`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./CreateTable.jsx'));
            });
        },
    },
    // 修改桌位
    {
        path: `table/modify-table/:id`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./CreateTable.jsx'));
            });
        },
    },

    //经费
    {
        path: `fund`,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./Fund.jsx'));
            });
        },
    },
    //新增经费
    {
        path: `fund/add-fund`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./EditFund.jsx'));
            });
        },
    },
    //修改经费 ttt
    {
        path: `fund/modify-fund/:id`, noHaveMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./EditFund.jsx'));
            });
        },
    },
];

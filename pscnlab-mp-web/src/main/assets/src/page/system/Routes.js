import Common from '../../common/common.jsx';
let merchantId = Common.getMerchantID.byUrl();
let mchId = `/m/${merchantId}`;

let storeId = '';
if (Common.currentPosition.isStore()) {
    storeId = Common.getStoreID.byUrl();
} else {
    if (Common.getStores() && Common.getStores().length > 0) {
        storeId = Common.getStores()[0].id;
    }
}
let stoId = `/s/${storeId}`;

export default [
    {
        path: `${mchId}/system/mail/unread`, isSystemMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./mail/UnReadMail'));
            })
        }
    },
    {
        path: `${mchId}/system/mail/read`, isSystemMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./mail/ReadMail'));
            })
        }
    },
    {
        path: `${mchId}/system/remind`, isSystemMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./remind/Remind'));
            })
        }
    },
    {
        path: `${mchId}/system/profile/message`, isSystemMenu: true,
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./profile/ProfileMessage'));
            })
        }
    },
];

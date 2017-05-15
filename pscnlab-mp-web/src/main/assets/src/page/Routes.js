// import {Common} from 'common';
// let merchantId = Common.getMerchantID.byUrl();
//
// let storeId = '';
//
// if (Common.currentPosition.isStore()) {
//     storeId = Common.getStoreID.byUrl();
// } else {
//     if (Common.getStores() && Common.getStores().length > 0) {
//         storeId = Common.getStores()[0].id;
//     }
// }
//
// let mchId = '/m/' + merchantId;
// let stoId = '/s/' + storeId;
//
// export default[
//     {
//         path: mchId + '/component',
//         getComponent: (location, cb) => {
//             require.ensure([], (require) => {
//                 cb(null, require('../component/Index'));
//             })
//         }
//     },
// ]

import request from '../common/request/request-promise.jsx';
import superagentPromisePlugin from './superagent-promise.js';

/*
 * model层，用来统一与后台交互，page（view）层，统一调用model层获取后台数据，不允许在view层调用ajax
 * */

export function acceptNeedConfirm() {
    return request
        .put('/stock/' + dishId + '.json')
        .use(superagentPromisePlugin)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({remainingCount: number, id: dishId})
        .end()
        .then(function(res, err) {
            return Promise.resolve(res);
        });
};
import { VertxEventbus } from 'utils';
import { message } from 'antd';
import { PubSubMsg } from 'framework';
import { Common } from 'common';
import { Link } from 'react-router';

// push相关
let isOpen = false;
let eventBus = '';
let clientId = 0;
let resultBody = [];

const makeUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (a, b) {
        return b = Math.random() * 16, (a == 'y' ? b & 3 | 8 : b | 0).toString(16);
    });
};

const openEventbus = exports.openEventbus = (callback) => {
    try {
        if (!isOpen) {
            const messagePushHost = CONTEXT.MESSAGEPUSHHOST;
            if (!messagePushHost) {
                return message.error('消息推送地址不能为空', 2);
            }

            eventBus = new VertxEventbus(`${messagePushHost}/mp/`, {
                reconnectionAttempts: Infinity,
                reconnectionDelay: 5000,
            });

            eventBus.onopen = () => {
                isOpen = true;
                clientId = makeUUID();

                PubSubMsg.publish('store-new-order-search'); // 断线重连读取新订单数据
                callback();
            };

            eventBus.onerror = () => {
                isOpen = false;
            };

            eventBus.onclose = () => {
                isOpen = false;
            };

            eventBus.onfatal = (e) => {
                message.error('连接错误，请刷新当前页面', 100);
            };
        } else {
            callback();
        }
    } catch (e) {
        console.log(e, 'error');
        message.error('获取提醒数据错误', 2);
    }
};

const push = exports.push = {
    merchant: {
        dealMessage: (messages) => {
            PubSubMsg.publish('show-global-notification', {
                changeContent: (callback) => {
                    const results = resultBody;
                    const taskUrl = Common.taskCode.getTaskUrl();
                    if (results && results.length) {
                        let content = [];
                        let title = [];
                        results.forEach((d, index) => {
                            const msg = d.body;
                            const typeName = (d.typeName || '').replace('通知', '');
                            const typeKey = d.type;
                            const orderIds = msg.orderIds;
                            const summary = msg.summary;
                            const description = msg.description;
                            const style = {};
                            if (parseInt(summary, 10) > 0 || summary === '未设置') {
                                style.color = 'red';
                                title.push(
                                    <span key={index}>
                                            {typeName}(<span style={style}>{summary}</span>)
                                        </span>
                                );
                            }
                            if (typeKey === 'order_refund_mch') {
                                content.push(<div key={index}>
                                    <Link to={`${taskUrl[typeKey]}`}
                                          onClick={() => setTimeout(() => PubSubMsg.publish('order-search-refunding', orderIds), 0)}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: 100,
                                                    paddingRight: 8,
                                                    textAlign: 'right'
                                                }}
                                            >
                                                {typeName}：
                                            </span>
                                        <span style={style}>{description}</span>
                                    </Link>
                                </div>);
                            } else {
                                content.push(<div key={index}>
                                    <Link to={taskUrl[typeKey]}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    width: 100,
                                                    paddingRight: 8,
                                                    textAlign: 'right'
                                                }}
                                            >
                                                {typeName}：
                                            </span>
                                        <span style={style}>{description}</span>
                                    </Link>
                                </div>);
                            }

                            // 品牌 已退款语音提示
                            if (typeKey === 'order_refund_mch' && summary !== '0' && summary !== 0) {
                                PubSubMsg.publish('tipAudio', 'refund');
                            }
                            // 品牌 待审核语音提示
                            if (typeKey === 'order_refund_review' && summary !== '0' && summary !== 0) {
                                PubSubMsg.publish('tipAudio', 'refund-review');
                            }
                        });
                        callback({
                            title: title.length ? title : '无任务提醒',
                            content,
                        });
                    } else {
                        callback({
                            title: '无任务提醒',
                            content: '暂无任务',
                        });
                    }
                },
            });
        },
        register: {
            merchantTask: () => {
                eventBus.registerHandler(`push.task.message.to.client/m/${Common.getMerchantID.byUrl()}`, (err, res) => {
                    const resultBodyString = res.body;
                    const resultBodyContent = JSON.parse(resultBodyString);

                    console.log(resultBodyContent, 'wo shi result body string');

                    let currentOption = resultBody.filter((opt) => opt.type === resultBodyContent.type);

                    console.log(currentOption, resultBody, 'woshi deal qian de shuju');

                    if (currentOption && currentOption.length) {
                        resultBody = resultBody.map((result) => {
                            if (result.type === resultBodyContent.type) {
                                return resultBodyContent;
                            }
                            return result;
                        });

                        push.merchant.dealMessage(resultBody);
                    }

                    console.log(currentOption, res, resultBody, 990);
                });
            },
            pullTask: () => {
                eventBus.registerHandler(`pull.task.message.to.client/${clientId}`, (err, res) => {
                    window.a = res;
                    const resultBodyString = res.body;
                    resultBody = JSON.parse(resultBodyString);

                    console.log(err, res, resultBody, 990);
                    push.merchant.dealMessage(resultBody);
                });
            },
        },
        send: {
            pullTask: () => {
                const taskCode = Common.taskCode.get();
                eventBus.send('mp.to.server', {
                    mchId: Common.getMerchantID.byUrl(),
                    storeId: '',
                    taskTypes: taskCode,
                }, {
                    channel: clientId,
                    tag: 'pull.task.message',
                });
            },
        },
    },
    store: {
        dealMessage: (messages) => {
            PubSubMsg.publish('show-global-notification', {
                changeContent(callback) {
                    const results = resultBody;
                    console.log(results, 'results');
                    const taskUrl = Common.taskCode.getTaskUrl();

                    if (results && results.length) {
                        let content = [];
                        let title = [];
                        results.forEach((d, index) => {
                            const style = {};
                            const msg = d.body;
                            const typeKey = d.type;
                            const typeName = (d.typeName || '').replace('通知', '');
                            const summary = msg.summary;
                            const orderIds = msg.orderIds;
                            const description = msg.description;

                            // title
                            if (parseInt(summary, 10) > 0 || summary === '未设置') {
                                style.color = 'red';
                                title.push(
                                    <span key={index}>
                                                    {typeName}(<span style={style}>{summary}</span>)
                                                </span>
                                );
                            }
                            // 门店 已退款
                            if (typeKey === 'order_refund_store') {
                                content.push(<div key={index}>
                                    <Link to={taskUrl[typeKey]}
                                          onClick={() => setTimeout(() => PubSubMsg.publish('store-order-search-refunding', orderIds), 0)}>
                                                    <span
                                                        style={{
                                                            display: 'inline-block',
                                                            width: 100,
                                                            paddingRight: 8,
                                                            textAlign: 'right',
                                                        }}
                                                    >
                                                        {typeName}：
                                                    </span>
                                        <span style={style}>{description}</span>
                                    </Link>
                                </div>);
                            } else if (typeKey === 'order_status_changed' && /\/m\/\d+\/s\/\d+\/need_accept$/.test(location.pathname)) {
                                // 当前页面是新订单页面，直接刷新数据
                                if (parseInt(summary, 10) > 0) {
                                    // PubSubMsg.publish('store-new-order-search');
                                }
                                // 当前页面是新订单页面，点击通过发布订阅查询数据。
                                content.push(<div key={index}>
                                    <Link
                                        to={taskUrl[typeKey]}
                                        onClick={() => setTimeout(() => PubSubMsg.publish('store-new-order-search'), 0)}
                                    >
                                                    <span style={{
                                                        display: 'inline-block',
                                                        width: 100,
                                                        paddingRight: 8,
                                                        textAlign: 'right',
                                                    }}>{typeName}：</span>
                                        <span style={style}>{description}</span>
                                    </Link>
                                </div>);
                            } else {
                                content.push(<div key={index}>
                                    <Link to={taskUrl[typeKey]}>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        width: 100,
                                                        paddingRight: 8,
                                                        textAlign: 'right',
                                                    }}>{typeName}：</span>
                                        <span style={style}>{description}</span>
                                    </Link>
                                </div>);
                            }

                            // 门店 待入厨订单语音提示
                            if (typeKey === 'order_status_changed' && summary !== '0' && summary !== 0) {
                                PubSubMsg.publish('tipAudio');
                            }
                            // 门店 已退款语音提示
                            if (typeKey === 'order_refund_store' && summary !== '0' && summary !== 0) {
                                PubSubMsg.publish('tipAudio', 'refund');
                            }
                        });
                        callback({
                            title: title.length ? title : '无任务提醒',
                            content,
                        });
                    } else {
                        callback({
                            title: '无任务提醒',
                            content: '暂无任务',
                        });
                    }
                },
            });
        },
        register: {
            storeTask: () => {
                openEventbus(() => {
                    eventBus.registerHandler(`push.task.message.to.client/${Common.getStoreID.byUrl()}`, (err, res) => {
                        const resultBodyString = res.body;
                        const resultBodyContent = JSON.parse(resultBodyString);

                        console.log(resultBodyContent, 'wo shi result body string');

                        let currentOption = resultBody.filter((opt) => opt.type === resultBodyContent.type);

                        console.log(currentOption, resultBody, 'woshi deal qian de shuju');

                        if (currentOption && currentOption.length) {
                            if (currentOption[0].type === 'order_status_changed') {
                                const currentOptionBody = currentOption[0].body || {};
                                const curentOptionsIds = currentOptionBody.orderIdList || [];

                                const count = ((resultBodyContent.body || {}).count) || 0;
                                const optionId = (resultBodyContent.body || {}).orderId;
                                if (count > 0) { // 如果是新消息
                                    console.log(currentOptionBody, currentOptionBody.summary, parseInt(currentOptionBody.summary, 10), count, 9990);
                                    if (curentOptionsIds.map((orderItem) => orderItem.orderId).includes(optionId)) {
                                        currentOptionBody.summary = parseInt(currentOptionBody.summary, 10) + count;
                                    } else {
                                        curentOptionsIds.push({orderId: optionId});
                                        currentOptionBody.summary = parseInt(currentOptionBody.summary, 10) + count;
                                    }

                                    currentOptionBody.description = `您有${curentOptionsIds.length}个新订单待入厨`;

                                    console.log('alert', curentOptionsIds, optionId, count, currentOptionBody.summary);
                                } else {
                                    console.log(curentOptionsIds, optionId, 'woshi current option ids');
                                    if (curentOptionsIds.map((orderItem) => orderItem.orderId).includes(optionId)) {
                                        const optionIdIndex = curentOptionsIds.findIndex((opt) => opt.orderId === optionId);
                                        console.log(curentOptionsIds, optionId, optionIdIndex, count, currentOptionBody.summary, 'woshi jian');
                                        if (optionIdIndex >= 0) {
                                            curentOptionsIds.splice(optionIdIndex, 1);
                                            currentOptionBody.summary = parseInt(currentOptionBody.summary, 10) + count;
                                        }
                                    }

                                    currentOptionBody.description = `您有${curentOptionsIds.length}个新订单待入厨`;
                                }

                                console.log(resultBody, 'woshi deal hou de result body');
                            } else {
                                resultBody = resultBody.map((result) => {
                                    if (result.type === resultBodyContent.type) {
                                        return resultBodyContent;
                                    }
                                    return result;
                                });
                            }

                            // 处理新得到的数据结束
                            // 开始解析dom展示到页面

                            push.store.dealMessage(resultBody);
                        }
                    });
                });
            },
            orderStatusChanged: () => {
                openEventbus(() => {
                    if (location.href.includes('/need_accept')) {
                        eventBus.registerHandler(`push.order.status.change.to.client/${Common.getStoreID.byUrl()}`, (err, msg) => {
                            const order = JSON.parse(msg.body) || {};

                            PubSubMsg.publish('updateOrder', order);
                        });
                    }
                });
            },
            pullTask: () => {
                openEventbus(() => {
                    eventBus.registerHandler(`pull.task.message.to.client/${clientId}`, (err, res) =>    {
                        const resultBodyString = res.body;
                        resultBody = JSON.parse(resultBodyString);

                        console.log(resultBody, 'woshi result body');

                        push.store.dealMessage(resultBody);
                    });
                });
            },
        },
        send: {
            pullTask: () => {
                const taskCode = Common.taskCode.get();
                openEventbus(() => {
                    eventBus.send('mp.to.server', {
                        mchId: Common.getMerchantID.byUrl(),
                        storeId: Common.getStoreID.byUrl(),
                        taskTypes: taskCode,
                    }, {
                        channel: clientId,
                        tag: 'pull.task.message',
                    });
                });
            },
        },
    },
};

import './style.css';
import React from 'react';
import {Icon, Row, Col, Tooltip, Spin, message} from 'antd';
import classNames from 'classnames';
import request from '../../common/request/request.jsx';
import PubSub from '../common/pubsubmsg.js';
import Common from '../../common/common.jsx';
import {Link} from 'react-router';

const notificationContent = {
    stock_setted: '今日库存',
    stock_saled_out: '库存告警',
    order_new_order: '新订单',
    order_status_changed: '待入厨',
};

class Notification extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            notificationIsMax: true,
            iconDirection: 'up',
            iconTitle: '最小化',
            isLoading: false,
            currentIsStore: true,
            config: {
                persistent: false,
                batchConfirm: false,
                pullIntervalTime: 120,
            },
            taskCode: [],
            notificationList: [],
            taskNumberTip: {
                'stock_setted': '已设置',
                'stock_saled_out': '无',
                'order_status_changed': 0,
            },
            taskMaxTip: {
                'stock_setted': '已设置',
                'stock_saled_out': '没有售罄的商品',
                'order_status_changed': '没有订单需要入厨'
            },
            loadingData: false,
        }
    }
    componentDidMount() {
        const _this = this;
        let taskCode = Common.taskCode.get();
        let taskCodeIsShow = Common.notification.getCurrentShow();
        let notificationList = Common.notification.getNotification();

        if(taskCode.length === 0) {
            taskCodeIsShow = false;
        }

        this.setState({
            config: Common.systemSetting.get(),
            taskCode: taskCode,
            currentIsStore: taskCodeIsShow,
            notificationList: notificationList
        });

        if(Common.currentPosition.isStore()) {
            request
                .post('/message/container/store.json')
                .send({storeId: Common.getStoreID.byUrl()})
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    if (err || !res.ok) {
                        message.error(res.body.message, 1);
                    }else {
                        setTimeoutNotification();

                        if(Common.currentPosition.isStore()) {
                            this.setState({
                                loadingData: true
                            });

                            const sendData = {
                                level: 'store',
                                mchId: Common.getMerchantID.byUrl(),
                                storeId: Common.getStoreID.byUrl(),
                                taskTypes: taskCode
                            };
                            request
                                .post('/messages.json')
                                .send(sendData)
                                .set('Content-Type', 'application/json')
                                .end((err, res) => {
                                    if (err || !res.ok) {
                                        message.error(res.body.message, 1);
                                    } else{
                                        let notification = {};

                                        if(!notification) {
                                            notification = {};
                                        }

                                        res.body.results.forEach((value) => {
                                            notification[value.typeKey] = value;
                                            _this.state.taskNumberTip[value.typeKey] = (value.jsonMsg != null && value.jsonMsg != 'null' ? JSON.parse(value.jsonMsg).summary : '');
                                            _this.state.taskMaxTip[value.typeKey] = (value.jsonMsg != null && value.jsonMsg != 'null' ? JSON.parse(value.jsonMsg).description : '');

                                        });

                                        let storageNotification = notification;
                                        if(storageNotification && storageNotification['order_status_changed'] && storageNotification['order_status_changed'].jsonMsg && JSON.parse(storageNotification['order_status_changed'].jsonMsg)) {
                                            if(JSON.parse(storageNotification['order_status_changed'].jsonMsg).summary > 0) {//有新订单需要入厨,则提示声音
                                                let taskUrl = Common.taskCode.getTaskUrl();
                                                if(location.pathname == taskUrl['order_status_changed']) {
                                                    PubSub.publish('update-need-accept');
                                                };
                                                PubSub.publish('tipAudio');
                                            }
                                        }

                                        _this.setState({
                                            notificationList: storageNotification,
                                            taskNumberTip: _this.state.taskNumberTip,
                                            taskMaxTip: _this.state.taskMaxTip,
                                        });
                                    }

                                    _this.setState({
                                        loadingData: false
                                    });
                                });
                        }
                    }
                });
        }

        PubSub.subscribe('set-notification-state', 'set-notification-state', (value) => {
            this.setState({
                currentIsStore: value
            });
        });

        let setTimeoutNotification = () => {
            setTimeout(() => {
                if(Common.currentPosition.isStore()) {
                    this.setState({
                        loadingData: true
                    });

                    const sendData = {
                        level: 'store',
                        mchId: Common.getMerchantID.byUrl(),
                        storeId: Common.getStoreID.byUrl(),
                        taskTypes: _this.state.taskCode
                    };
                    request
                        .post('/messages.json')
                        .send(sendData)
                        .set('Content-Type', 'application/json')
                        .end((err, res) => {
                            if (err || !res.ok) {
                                message.error(res.body.message, 1);
                            } else {
                                let notification = {};

                                if(!notification) {
                                    notification = {};
                                }

                                res.body.results.forEach((value) => {
                                    notification[value.typeKey] = value;
                                    _this.state.taskNumberTip[value.typeKey] = (value.jsonMsg != null && value.jsonMsg != 'null' ? JSON.parse(value.jsonMsg).summary : '');
                                    _this.state.taskMaxTip[value.typeKey] = (value.jsonMsg != null && value.jsonMsg != 'null' ? JSON.parse(value.jsonMsg).description : '');

                                });

                                let storageNotification = notification;
                                if(storageNotification && storageNotification['order_status_changed'] && storageNotification['order_status_changed'].jsonMsg && JSON.parse(storageNotification['order_status_changed'].jsonMsg)) {
                                    if(JSON.parse(storageNotification['order_status_changed'].jsonMsg).summary > 0) {//有新订单需要入厨,则提示声音
                                        let taskUrl = Common.taskCode.getTaskUrl();
                                        if(location.pathname == taskUrl['order_status_changed']) {
                                            PubSub.publish('update-need-accept');
                                        };
                                        PubSub.publish('tipAudio');
                                    }
                                }

                                _this.setState({
                                    notificationList: storageNotification,
                                    taskNumberTip: _this.state.taskNumberTip,
                                    taskMaxTip: _this.state.taskMaxTip,
                                });
                            }

                            _this.setState({
                                loadingData: false
                            });
                        });
                }

                setTimeoutNotification();
            }, (_this.state.config.pullIntervalTime ? _this.state.config.pullIntervalTime : 120) * 1000);
        };


        PubSub.subscribe('update-notification', () => {
            this.setState({
                loadingData: true
            });

            const sendData = {
                level: 'store',
                mchId: Common.getMerchantID.byUrl(),
                storeId: Common.getStoreID.byUrl(),
                taskTypes: taskCode
            };
            request
                .post('/messages.json')
                .send(sendData)
                .set('Content-Type', 'application/json')
                .end((err, res) => {
                    if (err || !res.ok) {
                        message.error(res.body.message, 1);
                    } else{
                        let notification = {};

                        if(!notification) {
                            notification = {};
                        }

                        res.body.results.forEach((value) => {
                            notification[value.typeKey] = value;
                            _this.state.taskNumberTip[value.typeKey] = (value.jsonMsg != null && value.jsonMsg != 'null' ? JSON.parse(value.jsonMsg).summary : '');
                            _this.state.taskMaxTip[value.typeKey] = (value.jsonMsg != null && value.jsonMsg != 'null' ? JSON.parse(value.jsonMsg).description : '');

                        });

                        let storageNotification = notification;
                        if(storageNotification && storageNotification['order_status_changed'] && storageNotification['order_status_changed'].jsonMsg && JSON.parse(storageNotification['order_status_changed'].jsonMsg)) {
                            if(JSON.parse(storageNotification['order_status_changed'].jsonMsg).summary > 0) {//有新订单需要入厨,则提示声音
                                let taskUrl = Common.taskCode.getTaskUrl();
                                if(location.pathname == taskUrl['order_status_changed']) {
                                    PubSub.publish('update-need-accept');
                                };
                                PubSub.publish('tipAudio');
                            }
                        }

                        _this.setState({
                            notificationList: storageNotification,
                            taskNumberTip: _this.state.taskNumberTip,
                            taskMaxTip: _this.state.taskMaxTip,
                        });
                    }

                    _this.setState({
                        loadingData: false
                    });
                });
        });
    }
    minNotification() {
        if(this.state.iconDirection === 'up') {
            this.state.iconDirection = 'down';
            this.state.iconTitle = '最小化';
        }else {
            this.state.iconDirection = 'up';
            this.state.iconTitle = '最大化';
        }

        this.setState({
            notificationIsMax: !this.state.notificationIsMax,
            iconDirection: this.state.iconDirection,
            iconTitle: this.state.iconTitle,
        });
    }
    taskCodeIsIncludes(array, value) {
        let result = false;
        array.forEach((key) => {
            if(key === value) {
                result = true;
            }
        });
        return result;
    }
    render() {
        let stock_setted_detail = '';
        if(this.state.notificationList['stock_setted'] && this.state.notificationList['stock_setted'].jsonMsg) {
            stock_setted_detail = <p style={{color: 'red'}}>{JSON.parse(this.state.notificationList['stock_setted'].jsonMsg).notSetted.map((value) => {
                return value.saleDate
            }).join(' , ')}</p>;
        }

        let stock_saled_out_detail = '';
        if(this.state.notificationList['stock_saled_out'] && this.state.notificationList['stock_saled_out'].jsonMsg) {
            stock_saled_out_detail = <p style={{color: 'red'}}>{JSON.parse(this.state.notificationList['stock_saled_out'].jsonMsg).saledOutDates.map((value) => {
                return value.saleDate
            }).join(' , ')}</p>;
        }

        const notificationContainer = classNames({
            'notification-container-max': true,
            'notification-container-min': this.state.notificationIsMax,
        });

        const notificationHeader = classNames({
            'notification-header-max': true,
            'notification-header-min': this.state.notificationIsMax,
        });

        const notificationHeaderTitle = classNames({
            'notification-header-title-max': true,
            'notification-header-title-min': this.state.notificationIsMax,
        });

        let taskUrl = Common.taskCode.getTaskUrl();
        let taskCode = Common.taskCode.get();

        return (
            <Spin spining={false}>
                <div className={notificationContainer} style={{display: this.state.currentIsStore ? 'block' : 'none'}}>
                    <div className={notificationHeader} onClick={this.minNotification.bind(this)}>
                        <div style={{display: this.state.notificationIsMax ? 'block' : 'none', float: 'left'}}>
                            <span style={{display: taskCode.length > 0 && this.taskCodeIsIncludes(taskCode, 'order_status_changed') ? 'inline-block' : 'none'}} className="notification-min-content">待入厨( <span style={{color: this.state.taskNumberTip['order_status_changed'] > 0 ? 'red' : '#fff'}}>{this.state.taskNumberTip['order_status_changed']}</span> )</span>
                            <span style={{display: taskCode.length > 0 && this.taskCodeIsIncludes(taskCode, 'stock_setted') ? 'inline-block' : 'none'}} className="notification-min-content">今日库存( <span style={{color: this.state.taskNumberTip['stock_setted'] == '未设置' ? 'red' : '#fff'}}>{this.state.taskNumberTip['stock_setted']}</span> )</span>
                            <span style={{display: taskCode.length > 0 && this.taskCodeIsIncludes(taskCode, 'stock_saled_out') ? 'inline-block' : 'none'}} className="notification-min-content">库存告警( <span style={{color: this.state.taskNumberTip['stock_saled_out'] > 0 ? 'red' : '#fff'}}>{this.state.taskNumberTip['stock_saled_out']}</span> )</span>
                        </div>
                        <span className={notificationHeaderTitle}>{this.state.notificationIsMax ? '' : '任务提醒'}</span>
                        <Tooltip placement="topRight" title={this.state.iconTitle}>
                            <Icon type={this.state.iconDirection} style={{marginRight: 12, color: '#fff'}}/>
                        </Tooltip>
                    </div>
                    <div className="notification-content">
                        <Spin spining={false}>

                            <Link to={taskUrl['order_new_order'] ? taskUrl['order_new_order']: ''} style={{display: 'none'}}>
                                <Row>
                                    <Col className="col-7">
                                        待确认
                                    </Col>
                                    <Col className="col-17">
                                        <span style={{color: this.state.taskNumberTip['order_new_order'] ? 'red' : '#2db7f5'}}>{this.state.taskNumberTip['order_new_order']}</span>个订单需要接单
                                    </Col>
                                </Row>
                            </Link>
                            <Link to={taskUrl['order_status_changed'] ? taskUrl['order_status_changed']: ''} style={{display: taskCode.length > 0 && this.taskCodeIsIncludes(taskCode, 'order_status_changed') ? 'block' : 'none'}}>
                                <Row>
                                    <Col className="col-7">
                                        待入厨
                                    </Col>
                                    <Col className="col-17">
                                        <span style={{color: this.state.taskNumberTip['order_status_changed'] > 0 ? 'red' : '#2db7f5'}}>{this.state.taskMaxTip['order_status_changed']}</span>
                                    </Col>
                                </Row>
                            </Link>
                            <Link to={taskUrl['stock_setted'] ? taskUrl['stock_setted']: ''} style={{display: taskCode.length > 0 && this.taskCodeIsIncludes(taskCode, 'stock_setted') ? 'block' : 'none'}}>
                                <Row>
                                    <Col className="col-7">
                                        库存设置
                                    </Col>
                                    <Col className="col-17">
                                        <span style={{color:  this.state.taskNumberTip['stock_setted'] == '未设置' ? 'red' : '#2db7f5'}}>
                                            {this.state.taskMaxTip['stock_setted']}
                                            {stock_setted_detail}
                                        </span>
                                    </Col>
                                </Row>
                            </Link>
                            <Link to={taskUrl['stock_saled_out'] ? taskUrl['stock_saled_out']: ''} style={{display: taskCode.length > 0 && this.taskCodeIsIncludes(taskCode, 'stock_saled_out') ? 'block' : 'none'}}>
                                <Row>
                                    <Col className="col-7">
                                        库存售罄告警
                                    </Col>
                                    <Col className="col-17">
                                        <span style={{color:  this.state.taskNumberTip['stock_saled_out'] > 0 ? 'red' : '#2db7f5'}}>
                                            {this.state.taskMaxTip['stock_saled_out'] }
                                            {stock_saled_out_detail}
                                        </span>
                                    </Col>
                                </Row>
                            </Link>
                        </Spin>
                    </div>
                </div>
            </Spin>
        );
    }
}

export default Notification;

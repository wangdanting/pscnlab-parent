import React from 'react';
import {Common, Request} from 'common';
import {message} from 'antd';
import { PubSubMsg } from 'framework';
let baseComponents = [];
class BaseComponent extends React.Component {
    index = '';
    setLoading = () => {
        if (!(this.state == null || this.state.loading == null)) {
            this.index = `baseComponent${baseComponents.length}`;

            PubSubMsg.subscribe(`updateLoading${baseComponents.length}`, (loading) => {
                this.setState({
                    loading,
                });
            });
            baseComponents.push(baseComponents.length);
        }
    };

    // 页面上多个请求同时进行，用来记录loading数量
    loadings = 0;
    startLoading = () => {
        this.setState({
            loading: true,
        });
        this.loadings++;
        baseComponents.forEach((value) => {
            PubSubMsg.publish(`updateLoading${value}`, true);
        });
    };
    endLoading = () => {
        this.loadings--;
        if (this.loadings === 0) {
            this.setState({
                loading: false,
            });
            baseComponents.forEach((value) => {
                PubSubMsg.publish(`updateLoading${value}`, false);
            });
        }
    };
    // 存放所有的请求句柄
    requests = [];
    request = () => {
        let self = this;
        return {
            url: null,
            withNoMchId: false,
            withNoStoreId: false,
            errorMsg: null,
            type: null,
            paramsData: {},
            withNoLoading: false,
            startCb: null,
            errorCb: null,
            successCb: null,
            isEnd: false,
            outTime: 10000 * 10,
            headers: {},
            get(url) {
                this.url = url;
                this.type = 'get';
                return this;
            },
            post(url) {
                this.url = url;
                this.type = 'post';
                return this;
            },
            put(url) {
                this.url = url;
                this.type = 'put';
                return this;
            },
            del(url) {
                this.url = url;
                this.type = 'delete';
                return this;
            },
            params(params) {
                this.paramsData = params;
                return this;
            },
            timeout(timeout) {
                this.outTime = timeout;
            },
            noMchId() {
                this.withNoMchId = true;
                return this;
            },
            noStoreId() {
                this.withNoStoreId = true;
                return this;
            },
            noLoading() {
                this.withNoLoading = true;
                return this;
            },
            setErrorMsg(errorMsg) {
                this.errorMsg = Common.messageContent[errorMsg];
                return this;
            },
            start(cb) {
                this.startCb = cb;
                return this;
            },
            error(cb) {
                this.errorCb = cb;
                return this;
            },
            success(cb) {
                this.successCb = cb;
                return this;
            },
            set(headers) {
                this.headers = headers;
                return this;
            },
            end(cb) {
                let url = this.url;
                if (!url) {
                    console.error('request need a url!');
                    return this;
                }
                if (!this.withNoMchId) { // 双重否定
                    // 判断当前是品牌还是门店， 自动拼接商户或门店id
                    const isMerchant = Common.currentPosition.isMerchant();
                    const isStore = Common.currentPosition.isStore();
                    const merchantId = Common.getMerchantID.byUrl();
                    const storeId = Common.getStoreID.byUrl();
                    if (isMerchant) {
                        url = `/api/m/${merchantId}${this.url}`;
                    }
                    if (isStore && !this.withNoStoreId) {
                        url = `/api/m/${merchantId}/s/${storeId}${this.url}`;
                    }
                }
                // ajax结束回调函数
                let endCb = (err, res) => {
                    if (!this.withNoLoading) {
                        self.endLoading();
                    }
                    this.isEnd = true;
                    if (err || !res.ok) {
                        // 断网错误
                        // FIXME 这个判断不靠谱，但是暂时可用
                        if (String(err).indexOf('the network is offline') > -1) {
                            // 所有处理完成之后的操作
                            if (cb) {
                                cb(err, res);
                            }
                            return message.error('网络异常，请检查您得网络！', 1);
                        }
                        // 如果有出错回调函数，调用出错回调
                        if (this.errorCb) {
                            this.errorCb(err, res);
                        } else {
                            // 没出错处理，尝试自动处理
                            message.error(this.errorMsg || res && res.body && res.body.message || '未知系统错误', 1);
                        }
                    } else {
                        // url可能不正确，后台返回的是html
                        if (res.type === 'text/html') {
                            // 所有处理完成之后的操作
                            if (cb) {
                                cb(err, res);
                            }
                            return console.error('The url maybe invalid!');
                        }
                        // 成功
                        let result;
                        let results;
                        if (res.body) {
                            results = res.body.results;
                            result = res.body.result;
                        }
                        let data;
                        if (result !== void 0) {
                            data = result;
                        } else if (results !== void 0) {
                            data = results;
                        } else {
                            data = res.body || res;
                        }

                        if (this.successCb) {
                            this.successCb(data, res);
                        }
                    }
                    // 所有处理完成之后的操作
                    if (cb) {
                        cb(err, res);
                    }
                };

                // ajax开始之前的一些自定义操作
                if (this.startCb) {
                    this.startCb();
                }

                if (!this.withNoLoading) {
                    self.startLoading();
                }
                this.isEnd = false;
                let request;
                setTimeout(() => {
                    if (!this.isEnd && request) {
                        let errorMassage = '请求超时，请检查您的网络';
                        let err = new Error('timeout');
                        let res = {
                            body: {
                                message: errorMassage,
                            },
                        };
                        endCb(err, res);
                        request.abort();
                    }
                }, this.outTime); // 超时时间
                if (this.type === 'get') {
                    request = Request
                        .get(url, true)
                        .set(this.headers)
                        .query(this.paramsData)
                        .end(endCb);
                } else if (this.type === 'put') {
                    request = Request
                        .put(url, true)
                        .set(this.headers)
                        .send(this.paramsData)
                        .end(endCb);
                } else if (this.type === 'delete') {
                    request = Request
                        .del(url, true)
                        .set(this.headers)
                        .send(this.paramsData)
                        .end(endCb);
                } else {
                    request = Request
                        .post(url, true)
                        .set(this.headers)
                        .send(this.paramsData)
                        .end(endCb);
                }
                self.requests.push(request);
                return this;
            },
        };
    };
    exportFile = (url, params) => {
        let urlParams = [];
        for (let p of Object.keys(params)) {
            let key = p;
            let value = params[p];
            if (value !== undefined && value !== null && value !== '') {
                urlParams.push({
                    key,
                    value,
                });
            }
        }
        let exportForm = document.createElement('form');
        exportForm.method = 'get';
        exportForm.action = url;
        urlParams.forEach((v) => {
            let input = document.createElement('input');
            input.type = 'text';
            input.name = v.key;
            input.value = v.value;
            exportForm.appendChild(input);
        });
        exportForm.submit();
    };

    componentWillUnmount() {
        // 组件卸载之后，打断所有未结束得请求，
        // 子类要是要使用componentWillUnmount，需要显示的调用super.componentWillUnmount();
        this.requests.forEach(r => {
            r.abort();
        });

        if (this.index) {
            PubSubMsg.unsubscribe(this.index);
        }
    }
}

export default BaseComponent;

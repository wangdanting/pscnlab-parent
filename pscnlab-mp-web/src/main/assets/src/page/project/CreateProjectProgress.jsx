import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Form, Input, Row, messag, DatePicker,Radio, message} from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';
import Panel from 'component/panel/Panel';
import moment from 'moment';
import {Common} from 'common';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class CreateProjectProgress extends BaseComponent {
    state = {
        isIgnoreIntercept: false, // 跳转页面时，是否忽略拦截
        isSubmitting: false,
        loading: true,
        isUpdateRole: false,  //是否是更新角色
    };

    // 判断用户是否输入了值
    isEnterSomeValue = () => {
        if (this.state.isIgnoreIntercept) {
            return false;
        }
        const {getFieldsValue} = this.props.form;
        let formData = getFieldsValue();
        let isEnterSomeValue = false;
        for (let key in formData) {
            if (!!formData[key]) {
                isEnterSomeValue = true;
                break;
            }
        }
        if (isEnterSomeValue) {
            return true;
        }
        return false;
    };

    componentDidMount() {
        // 判断是否是修改广告
        this.getRoleInfo();
        this.setState({
            loading: false
        });
    }

    //获取该角色信息 更新
    getRoleInfo = () => {
        let that = this;
        this.request()
            .get(`/project/id/${this.props.params.id}/mid/${Common.getMerchant().uuidMember}/infos.json`)
            .success((data) => {
                let results = data;
                console.log(data, '0003');
                that.setState({
                    loading: false,
                });
                let formvalue = {
                    progressInfo: results.progressInfo,
                    progress: results.progress,
                };

                that.props.form.setFieldsValue(formvalue);
            })
            .end();
    };

    // 提交
    handleSubmit = (e) => {
        e.preventDefault();

        // 构建需要校验字段
        let validateFields = this.createValidateFields();

        this.props.form.validateFieldsAndScroll(validateFields, (errors, values) => {
            // 只有validateFields中指定得字段，值才会包含到values中

            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }

            this.setState({
                isSubmitting: true,
            });

            // 构建需要提交的数据
            let submitData = this.createSubmitObj(values);
            // 发送数据
            this.handleSendData(submitData);
        });
    };

    // 构建需要校验的字段
    createValidateFields = () => {
        const {getFieldValue} = this.props.form;

        let validateFields = [
            'progressInfo',
            'progress',
        ];

        return validateFields;
    };

    // 构建需要提交的数据
    createSubmitObj = (values) => {
        let submitData = {};
        submitData.progress = values.progress;
        submitData.progressInfo = values.progressInfo;
        // 给 userLimit, userPerDayLimit 赋值
        return submitData;
    };

    // 发送数据，根据不同的类型
    handleSendData = (submitData) => {
        this.request()
            .post(`/project/id/${this.props.params.id}/mid/${Common.getMerchant().uuidMember}/updates.json?progressInfo=${submitData.progressInfo}&progress=${submitData.progress}`)
            .success(() => {
                message.success('操作成功', 1);
                this.setState({
                    isIgnoreIntercept: true,
                });
                setTimeout(this.handleGoBack(), 500);
            })
            .error((err, res) => {
                message.error(res && res.body && res.body.message || '未知系统错误', 1);
                this.setState({
                    isSubmitting: false,
                });
            })
            .end();

    };

    // 校验进度输入数字
    checkAccount = (rule, value, callback) => {
        if(value > 100 || value < 0) {
            callback(new Error('最多输入100'));
        }
        callback();
    };

    // 返回
    handleGoBack = () => {
        const {history} = this.props;
        history.push(`/project`);
    };

    render() {
        let commonTrigger = ['onBlur', 'onChange'];

        const { getFieldProps } = this.props.form;

        // 进度介绍
        const progressInfoProps = getFieldProps('progressInfo', {
            rules: [
                {required: true, message: '请输入完成情况'},
                {max: 1000, message: '最多1000个汉字'},
            ],
            trigger: commonTrigger,
        });
        // 进度
        const progressProps = getFieldProps('progress', {
            rules: [
                {required: true, message: '请输入进度'},
                {validator: this.checkAccount}
            ],
            trigger: commonTrigger,
        });

        const header = {
            back: { // 头部得返回按钮
                title: '返回列表页',
                // onClick: this.handleGoBack,
            },
            title: [
                {
                    text: '项目管理',
                    path: `/project`,
                }, {
                    text: '个人项目进度',
                },
            ],
            breadcrumbItems: 'auto',
        };

        let formTitle = {title: '个人项目进度'};

        return (
            <Page header={header} loading={this.state.loading}>
                <div className="coupon-add">
                    <Form horizontal form={this.props.form}>
                        <Panel header={formTitle} width="700px">
                            <div className="content" style={{width: '100%'}}>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">进度介绍：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...progressInfoProps} type="textarea" rows="5" placeholder="请输入进度介绍，1000字以内"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="8" className="help-label">
                                        简要说明您的进度情况，1000个字以内
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">完成比例：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...progressProps} placeholder="请输入中奖几率"/>
                                        </FormItem>
                                    </Col>

                                    <Col span="8" className="help-label">
                                        ％&nbsp;&nbsp;&nbsp;最多输入100
                                    </Col>
                                </Row>
                            </div>
                        </Panel>
                        <div className="btns">
                            <Button type="primary" size="large" loading={this.state.isSubmitting} onClick={this.handleSubmit}>保存</Button>
                            <Button type="ghost" size="large" onClick={this.handleGoBack}>取消</Button>
                        </div>
                    </Form>
                </div>
            </Page>
        );
    }
}
export default Form.create()(CreateProjectProgress);

import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Form, Input, Row, message, DatePicker,Radio, } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';
import Panel from 'component/panel/Panel';
import moment from 'moment';
import {Common} from 'common';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class CreateProject extends BaseComponent {
    state = {
        isIgnoreIntercept: false, // 跳转页面时，是否忽略拦截
        isSubmitting: false,
        loading: true,
        isProjectState: '未开始', //项目状态
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

    // 开始日期的禁用选项
    handleDisabledStartDate = (startTime) => {
        let startEnd = this.props.form.getFieldValue('startEnd');
        if (!startTime) {
            return false;
        }
        const disableBeforeNow = startTime.getTime() < (Date.now() - 24 * 60 * 360 * 1000);
        if (!startEnd) {
            return disableBeforeNow;
        }
        return disableBeforeNow || startTime.getTime() > startEnd.getTime();
    };

    // 结束日期的禁用选项
    handleDisabledEndDate = (startEnd) => {
        let startTime = this.props.form.getFieldValue('startTime');
        let limitDay = 60;
        if (!startEnd) {
            return false;
        }
        const disableBeforeNow = startEnd.getTime() < (Date.now() - 24 * 60 * 360 * 1000);
        if (!startTime) {
            return disableBeforeNow;
        }
        let offsetEndDate = moment(startTime).set('date', moment(startTime).get('date') + limitDay);
        return startEnd.getTime() < startTime.getTime() || startEnd.getTime() > offsetEndDate.toDate().getTime();
    };

    componentDidMount() {
        // 判断是否是修改项目
        let projectId = this.props.params.id;
        if(projectId) {
            this.getProjectInfo(projectId);
        }

        this.setState({
            loading: false
        });
    }

    //获取该项目信息 更新
    getProjectInfo = (projectId) => {
        const that = this;
        this.request()
            .get(`/project/id/${projectId}/infos.json?memberUUId=${Common.getMerchant().uuidMember}`)
            .success((response) => {
                let results = response;
                that.setState({
                    loading: false,
                });
                let formvalue = {
                    title: results.title,
                    responsiblePersonName: results.responsiblePersonName,
                    responsiblePersonTelephone: results.responsiblePersonTelephone,
                    startTime: results.startTime,
                    startEnd: results.startEnd,
                    demand: results.demand,
                    attention: results.attention,
                };
                that.setState({
                    state: results.state,
                });

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
            'title',
            'responsiblePersonName',
            'responsiblePersonTelephone',
            'startEnd',
            'startTime',
            'demand',
            'attention'
        ];

        return validateFields;
    };

    // 构建需要提交的数据
    createSubmitObj = (values) => {
        let submitData = {};
        submitData.uuid = null;
        submitData.title = values.title;
        submitData.responsiblePersonName = values.responsiblePersonName;
        submitData.responsiblePersonTelephone = values.responsiblePersonTelephone;
        submitData.startEnd = moment(values.startEnd).format('YYYY-MM-DD');
        submitData.startTime = moment(values.startTime).format('YYYY-MM-DD');
        submitData.demand = values.demand;
        submitData.attention = values.attention;
        submitData.state = this.state.isProjectState;

        // 给 userLimit, userPerDayLimit 赋值
        return submitData;
    };

    // 发送数据，根据不同的类型
    handleSendData = (submitData) => {
        let sendUrl;
        let projectId = this.props.params.id;
        if(projectId) { //更新
            sendUrl = `/project/id/${projectId}/updates.json`;
            this.request()
                .post(sendUrl)
                .params(submitData)
                .success(() => {
                    message.success('更新成功', 1);
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
        } else {   //创建
            sendUrl = '/project/news.json';
            this.request()
                .post(sendUrl)
                .params(submitData)
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
        }
    };

    //修改项目状态
    getProjectState = (e) => {
        this.setState({
            isProjectState: e.target.value
        });
    };

    // 返回
    handleGoBack = () => {
        const {history} = this.props;
        history.push(`/project`);
    };

    render() {
        let commonTrigger = ['onBlur', 'onChange'];

        const { getFieldProps } = this.props.form;

        // 项目名称
        const titleProps = getFieldProps('title', {
            rules: [
                {required: true, message: '请输入培训标题'},
                {max: 13, message: '最多13个汉字'},
            ],
            trigger: commonTrigger,
        });
        // 负责人姓名
        const responsiblePersonNameProps = getFieldProps('responsiblePersonName', {
            rules: [
                {required: true, message: '请输入负责人姓名'},
                {max: 13, message: '最多13个汉字'},
            ],
            trigger: commonTrigger,
        });
        // 负责人联系电话
        const responsiblePersonTelephoneProps = getFieldProps('responsiblePersonTelephone', {
            rules: [
                {required: true, message: '请输入负责人联系电话'},
                {max: 13, message: '最多11个数字'},
            ],
            trigger: commonTrigger,
        });
        //项目开始时间
        const startTimeProps = getFieldProps('startTime', {
            rules: [
                {required: true, type: 'date', message: '请选择项目开始时间'},
            ],
        });
        //项目介绍时间
        const startEndProps = getFieldProps('startEnd', {
            rules: [
                {required: true, type: 'date', message: '请选择项目结束时间'},
            ],
        });
        // 项目需求
        const demandProps = getFieldProps('demand', {
            rules: [
                {required: true, message: '请输入项目需求'},
                {max: 1000, message: '最多1000个汉字'},
            ],
            trigger: commonTrigger,
        });
        // 注意事项
        const attentionProps = getFieldProps('attention', {
            rules: [
                {required: true, message: '请输入注意事项'},
                {max: 1000, message: '最多1000个汉字'},
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
                    path: `/train`,
                }, {
                    text: '新建项目',
                },
            ],
            breadcrumbItems: 'auto',
        };

        let formTitle = {title: '新建项目'};

        return (
            <Page header={header} loading={this.state.loading}>
                <div className="coupon-add">
                    <Form horizontal form={this.props.form}>
                        <Panel header={formTitle} width="700px">
                            <div className="content" style={{width: '100%'}}>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">项目名称：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...titleProps} placeholder="请输入项目名称"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="8" className="help-label">
                                        最多13个汉字
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">项目状态：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <RadioGroup onChange={this.getProjectState} value={this.state.isProjectState}>
                                                <Radio key="未开始" value={ '未开始' } checked={true} defaultChecked={true}>未开始</Radio>
                                                <Radio key="执行中" value={'执行中' } defaultChecked={false}>执行中</Radio>
                                                <Radio key="已完成" value={ '已完成' } defaultChecked={false}>已完成</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">负责人姓名：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...responsiblePersonNameProps} placeholder="请输入负责人姓名"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">负责人联系电话：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...responsiblePersonTelephoneProps} placeholder="请输入负责人电话"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">执行时间：</Col>
                                    <Col span="5">
                                        <FormItem>
                                            <DatePicker
                                                disabledDate={this.handleDisabledStartDate}
                                                {...startTimeProps}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span="1" style={{padding: '6px 0 0 0'}}>
                                        <p className="ant-form-split">-</p>
                                    </Col>
                                    <Col span="5">
                                        <FormItem>
                                            <DatePicker
                                                disabledDate={this.handleDisabledEndDate}
                                                {...startEndProps}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span="8" className="help-label">
                                        执行时间最多360天
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">项目需求：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...demandProps} type="textarea" rows="5" placeholder="请输入项目需求，1000字以内"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">注意事项：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...attentionProps} type="textarea" rows="5" placeholder="请输入项目需求，1000字以内"/>
                                        </FormItem>
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
export default Form.create()(CreateProject);

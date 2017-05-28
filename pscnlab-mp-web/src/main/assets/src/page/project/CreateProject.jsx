import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Form, Input, Row, messag, DatePicker,Radio, } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';
import Panel from 'component/panel/Panel';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class CreateProject extends BaseComponent {
    state = {
        isIgnoreIntercept: false, // 跳转页面时，是否忽略拦截
        isSubmitting: false,
        loading: true,
        isUpdateRole: false,  //是否是更新角色
        isProjectState: 'noStart', //项目状态
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
    handleDisabledStartDate = (startDate) => {
        let endDate = this.props.form.getFieldValue('endDate');
        if (!startDate) {
            return false;
        }
        const disableBeforeNow = startDate.getTime() < (Date.now() - 24 * 60 * 360 * 1000);
        if (!endDate) {
            return disableBeforeNow;
        }
        return disableBeforeNow || startDate.getTime() > endDate.getTime();
    };

    // 结束日期的禁用选项
    handleDisabledEndDate = (endDate) => {
        let startDate = this.props.form.getFieldValue('startDate');
        let limitDay = 60;
        if (!endDate) {
            return false;
        }
        const disableBeforeNow = endDate.getTime() < (Date.now() - 24 * 60 * 360 * 1000);
        if (!startDate) {
            return disableBeforeNow;
        }
        let offsetEndDate = moment(startDate).set('date', moment(startDate).get('date') + limitDay);
        return endDate.getTime() < startDate.getTime() || endDate.getTime() > offsetEndDate.toDate().getTime();
    };

    componentDidMount() {
        // 判断是否是修改广告
        let projectId = this.props.params.id;
        if(projectId) {
            this.state.isUpdateRole = true;
            this.getRoleInfo(projectId);
        }
        // const {route} = this.props;
        // const {router} = this.context; // If contextTypes is not defined, then context will be an empty object.
        // router.setRouteLeaveHook(route, (/* nextLocation */) => {
        //     // 返回 false 会继续停留当前页面，
        //     // 否则，返回一个字符串，会显示给用户，让其自己决定
        //     if (this.isEnterSomeValue()) {
        //         return '您有未保存的内容，确认要离开？';
        //     }
        //     return true;
        // });

        this.setState({
            loading: false
        });
    }

    //获取该角色信息 更新
    getRoleInfo = (projectId) => {
        const that = this;
        this.request()
            .get(`/train/${projectId}.json`)
            .success((response) => {
                let results = response;
                that.setState({
                    loading: false,
                });
                let formvalue = {
                    title: results.title,
                    responseName: results.responseName,
                    responseTelephone: results.responseTelephone,
                    startDate: results.startDate,
                    endDate: results.endDate,
                    demand: results.demand,
                    attention: results.attention,
                    state: results.state,
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
            'title',
            'responseName',
            'responseTelephone',
            'startDate',
            'endDate',
            'demand',
            'attention'
        ];

        return validateFields;
    };

    // 构建需要提交的数据
    createSubmitObj = (values) => {
        let submitData = {};
        submitData.uuidTrain = null;
        submitData.title = values.title;
        submitData.responseName = values.responseName;
        submitData.responseTelephone = values.responseTelephone;
        submitData.startDate = moment(values.startDate).format('YYYY-MM-DD');
        submitData.endDate = moment(values.endDate).format('YYYY-MM-DD');
        submitData.demand = values.demand;
        submitData.attention = values.attention;
        submitData.state = this.state.isProjectState;

        // 给 userLimit, userPerDayLimit 赋值
        return submitData;
    };

    // 发送数据，根据不同的类型
    handleSendData = (submitData) => {
        let sendUrl;
        let roleId = this.props.params.id;
        if(roleId) { //更新
            sendUrl = `/role/update.json`;
            submitData.uuidRole = roleId;
            this.request()
                .put(sendUrl)
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
            sendUrl = '/role/new.json';
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
        const responseNameProps = getFieldProps('responseName', {
            rules: [
                {required: true, message: '请输入负责人姓名'},
                {max: 13, message: '最多13个汉字'},
            ],
            trigger: commonTrigger,
        });
        // 负责人联系电话
        const responseTelephoneProps = getFieldProps('responseTelephone', {
            rules: [
                {required: true, message: '请输入负责人联系电话'},
                {max: 13, message: '最多11个数字'},
            ],
            trigger: commonTrigger,
        });
        //项目开始时间
        const startDateProps = getFieldProps('startDate', {
            rules: [
                {required: true, type: 'date', message: '请选择项目开始时间'},
            ],
        });
        //项目介绍时间
        const endDateProps = getFieldProps('endDate', {
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
                                                <Radio key="noStart" value={ 'noStart' } checked={true} defaultChecked={true}>未开始</Radio>
                                                <Radio key="run" value={'run' } defaultChecked={false}>执行中</Radio>
                                                <Radio key="down" value={ 'down' } defaultChecked={false}>已完成</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">负责人姓名：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...responseNameProps} placeholder="请输入负责人姓名"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">负责人联系电话：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...responseTelephoneProps} placeholder="请输入负责人电话"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">执行时间：</Col>
                                    <Col span="5">
                                        <FormItem>
                                            <DatePicker
                                                disabledDate={this.handleDisabledStartDate}
                                                {...startDateProps}
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
                                                {...endDateProps}
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

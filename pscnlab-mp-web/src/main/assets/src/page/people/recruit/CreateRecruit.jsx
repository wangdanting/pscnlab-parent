import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Form, Input, Row, messag, DatePicker, Select, InputNumber} from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';
import Panel from 'component/panel/Panel';
import '../style.less';

const FormItem = Form.Item;

class CreateRecruit extends BaseComponent {
    state = {
        isIgnoreIntercept: false, // 跳转页面时，是否忽略拦截
        isSubmitting: false,
        loading: true,
        isUpdateRole: false,  //是否是更新角色
        post: '', //招聘岗位
        number: -1, //招聘人数
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
        // 判断是否是修改
        let recruitId = this.props.params.id;
        if(recruitId) {
            this.state.isUpdateRole = true;
            this.getRoleInfo(recruitId);
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
    getRoleInfo = (recruitId) => {
        const that = this;
        this.request()
            .get(`/train/${recruitId}.json`)
            .success((response) => {
                let results = response;
                that.setState({
                    loading: false,
                });
                let formvalue = {
                    post: results.title,
                    number: results.speaker,
                    condition: results.speakerTelphone,
                    responseName: results.time,
                    telephone: results.place,
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
            'condition',
            'responseName',
            'telephone',
        ];

        return validateFields;
    };

    // 构建需要提交的数据
    createSubmitObj = (values) => {
        let submitData = {};
        submitData.uuidTrain = null;
        submitData.post= this.state.post;
        submitData.number = this.state.number;
        submitData.condition = values.condition;
        submitData.responseName = values.responseName;
        submitData.telephone = values.telephone;

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

    //修改岗位
    postChange = (value) => {

    };
    //修改招聘人数
    numberChange = (value) => {

    };

    // 返回
    handleGoBack = () => {
        const {history} = this.props;
        history.push(`/recruit`);
    };

    render() {
        let commonTrigger = ['onBlur', 'onChange'];

        const { getFieldProps } = this.props.form;

        // 招聘条件
        const conditionProps = getFieldProps('condition', {
            rules: [
                {required: true, message: '请输入招聘条件'},
                {max: 1000, message: '最多1000个汉字'},
            ],
            trigger: commonTrigger,
        });
        // 负责人
        const responseNameProps = getFieldProps('responseName', {
            rules: [
                {required: true, message: '请输入负责人'},
                {max: 13, message: '最多13个汉字'},
            ],
            trigger: commonTrigger,
        });
        // 负责人联系电话
        const telephoneProps = getFieldProps('telephone', {
            rules: [
                {required: true, message: '请输入负责人联系电话'},
                {max: 13, message: '最多11个数字'},
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
                    text: '人员招聘',
                    path: `/train`,
                }, {
                    text: '新建招聘',
                },
            ],
            breadcrumbItems: 'auto',
        };

        let formTitle = {title: '新建招聘'};

        return (
            <Page header={header} loading={this.state.loading}>
                <div className="coupon-add">
                    <Form horizontal form={this.props.form}>
                        <Panel header={formTitle} width="700px">
                            <div className="content" style={{width: '100%'}}>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">招聘岗位：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Select defaultValue={'1'} style={{ width: 220, marginRight: 10 }} onChange={this.postChange}>
                                                <Option key={1}>每个用户最多可以参加次数</Option>
                                                <Option key={2}>每个用户每天最多可以参加次数</Option>
                                                <Option key={3}>不限制</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span="8" className="help-label">
                                        如果没有该岗位，请到新增该角色
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">招聘人数 ：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <InputNumber min={1} max={80} value={this.state.number} onChange={this.numberChange}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">招聘条件：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input type="textarea" row="5" {...conditionProps} placeholder="请输入主讲人联系电话"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">负责人：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...responseNameProps} placeholder="请输入负责人"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">负责人联系电话：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...telephoneProps} placeholder="请输入负责人联系电话"/>
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
export default Form.create()(CreateRecruit);

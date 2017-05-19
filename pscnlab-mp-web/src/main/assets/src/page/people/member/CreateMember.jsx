import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Form, Input, Row, Select, Radio, InputNumber} from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';
import Panel from 'component/panel/Panel';
import '../style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class CreateMember extends BaseComponent {
    state = {
        isIgnoreIntercept: false, // 跳转页面时，是否忽略拦截
        isSubmitting: false,
        loading: true,
        gender: 'boy',
        age: 18
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


    componentWillMount() {
        //判断是否是修改广告
        // let adId = this.props.params.id;
        // if(adId) {
        //     this.state.isUpdateAd = true;
        //     this.getAdInfo(adId);
        // }
        // this.request()
        //     .noMchId()
        //     .noStoreId()
        //     .get(`/api/advertisements/scopes.json`)
        //     .success((data) => {
        //         this.setState({
        //             scopes: data
        //         });
        //         if(!this.state.isUpdateAd) {
        //             this.setState({
        //                 loading: false
        //             });
        //         }
        //     })
        //     .end();

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
        // this.setState({
        //     activityType: this.props.activityType,
        // });

        this.setState({
            loading: false
        });
    }

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
            'role',
            'position',
        ];

        return validateFields;
    };

    // 构建需要提交的数据
    createSubmitObj = (values) => {
        let submitData = {};
        submitData.role = values.role;
        submitData.position = values.position;

        // 给 userLimit, userPerDayLimit 赋值
        return submitData;
    };

    // 发送数据，根据不同的类型
    handleSendData = (submitData) => {
        let sendUrl;
        // if(adId) { //更新
        //     sendUrl = `/advertisements/${adId}.json`;
        //     this.request()
        //         .put(sendUrl)
        //         .params(submitData)
        //         .success(() => {
        //             message.success('更新成功', 1);
        //             this.setState({
        //                 isIgnoreIntercept: true,
        //             });
        //             setTimeout(this.handleGoBack(), 500);
        //         })
        //         .error((err, res) => {
        //             message.error(res && res.body && res.body.message || '未知系统错误', 1);
        //             this.setState({
        //                 isSubmitting: false,
        //             });
        //         })
        //         .end();
        // } else {   //创建
        //     sendUrl = '/advertisements.json';
        //     this.request()
        //         .post(sendUrl)
        //         .params(submitData)
        //         .success(() => {
        //             message.success('操作成功', 1);
        //             this.setState({
        //                 isIgnoreIntercept: true,
        //             });
        //             setTimeout(this.handleGoBack(), 500);
        //         })
        //         .error((err, res) => {
        //             message.error(res && res.body && res.body.message || '未知系统错误', 1);
        //             this.setState({
        //                 isSubmitting: false,
        //             });
        //         })
        //         .end();
        // }
    };

    //选择角色
    handleRoleChange = (value) => {
        switch (value) {
            case '1':
            case '2':
                this.setState({
                    // timesDisabled: false,
                    // timesValue: 1,
                });
                break;
            default :
                this.setState({
                    // timesDisabled: true,
                    // timesValue: null,
                });
        }

        this.setState({
            // ruleValue: value,
        });
    };

    //修改性别
    genderChange = (e) => {
        this.setState({
            gender: e.target.value
        });
    };

    //年龄修改
    ageChange = (value) => {
        this.setState({
            age: value,
        });
    };

    // 返回
    handleGoBack = () => {
        const {history} = this.props;
        history.push(`/role`);
    };

    render() {
        let commonTrigger = ['onBlur', 'onChange'];

        const { getFieldProps } = this.props.form;

        // 成员名称
        const nameProps = getFieldProps('name', {
            rules: [
                {required: true, message: '请输入成员名字'},
                {max: 13, message: '最多13个汉字'},
            ],
            trigger: commonTrigger,
        });
        // 成员班级
        const gradeClassProps = getFieldProps('gradeClass', {
            rules: [
                {required: true, message: '请输入成员班级'},
                {max: 9, message: '最多9个数字'},
            ],
            trigger: commonTrigger,
        });
        // 成员联系电话
        const telephoneProps = getFieldProps('telephone', {
            rules: [
                {required: true, message: '请输入成员联系电话'},
                {max: 11, message: '请输入正确的电话'},
            ],
            trigger: commonTrigger,
        });
        // 成员爱好
        const hobbyProps = getFieldProps('hobby', {
            rules: [
                {required: true, message: '请输入成员爱好'},
                {max: 200, message: '最多200个汉字'},
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
                    text: '成员信息',
                    path: `/member`,
                }, {
                    text: '新增成员',
                },
            ],
            breadcrumbItems: 'auto',
        };

        let formTitle = {title: '新增成员'};

        return (
            <Page header={header} loading={this.state.loading}>
                <div className="coupon-add">
                    <Form horizontal form={this.props.form}>
                        <Panel header={formTitle} width="700px">
                            <div className="content" style={{width: '100%'}}>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">角色：</Col>
                                    <Col span="12">
                                        <FormItem>
                                            <Select defaultValue={'1'} style={{ width: 220, marginRight: 10 }} onChange={this.handleRoleChange}>
                                                <Option key={1}>老师(java开发)</Option>
                                                <Option key={2}>老师(前端开发)</Option>
                                                <Option key={3}>学生(前端开发)</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">成员名字：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...nameProps} placeholder="请输入成员名字"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="8" className="help-label">
                                        最多13个汉字
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">性别：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <RadioGroup onChange={this.genderChange} value={this.state.gender}>
                                                <Radio key="girl" value={ 'boy' } checked={true} defaultChecked={true}>男</Radio>
                                                <Radio key="boy" value={'girl' } defaultChecked={false}>女</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">年龄：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <InputNumber min={1} max={80} value={this.state.age} onChange={this.ageChange} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">班级：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...gradeClassProps} placeholder="请输入成员班级"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="8" className="help-label">
                                        例:113030701
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">联系电话：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...telephoneProps} placeholder="请输入成员联系电话"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">爱好：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input type="textarea" row="8" {...hobbyProps} placeholder="请输入成员爱好"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="8" className="help-label">
                                        最多200个汉字
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
export default Form.create()(CreateMember);

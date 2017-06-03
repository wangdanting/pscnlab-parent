import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Form, Input, Row, message, DatePicker,Radio, Select} from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';
import Panel from 'component/panel/Panel';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class CreateTable extends BaseComponent {
    state = {
        isIgnoreIntercept: false, // 跳转页面时，是否忽略拦截
        isSubmitting: false,
        loading: true,
        isUpdateRole: false,  //是否是更新角色
        isProjectState: '空闲', //项目状态
        MemberList: [],
        userName: ''
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
        let tableId = this.props.params.id;
        console.log(tableId, 'tableId');
        if(tableId) {
            this.getRoleInfo(tableId);
        }

        this.request()
            .noMchId()
            .noStoreId()
            .get('/role/lists.json')
            .success((data, res) => {
                this.setState({
                    roleList: data.map((item, index) => {
                        item.value = item.uuidRole;
                        item.label = `${item.role}(${item.position})`;
                        if(index == 0) {
                            item.checked = true;
                        }
                        return item;
                    })
                });
            })
            .end();

        this.setState({
            loading: false
        });
    }

    //获取该角色信息 更新
    getRoleInfo = (tableId) => {
        const that = this;
        this.request()
            .get(`/desk/id/${tableId}/infos.json`)
            .success((response) => {
                let results = response;

                let formvalue = {
                    num: results.num,
                };

                that.setState({
                    state: results.state,
                    userName: results.userName,
                    telephoneChooseNum: results.userTelephone,
                    isProjectState: results.state,
                    loading: false,
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
            'num',
        ];

        return validateFields;
    };

    // 构建需要提交的数据
    createSubmitObj = (values) => {
        let submitData = {};
        submitData.uuid = null;
        submitData.num = values.num;
        submitData.state = this.state.isProjectState;
        submitData.userName = this.state.userName;
        submitData.userTelephone = this.state.telephoneChooseNum;

        // 给 userLimit, userPerDayLimit 赋值
        return submitData;
    };

    // 发送数据，根据不同的类型
    handleSendData = (submitData) => {
        let sendUrl;
        let tableId = this.props.params.id;
        if(tableId) { //更新
            sendUrl = `/desk/update_desks.json`;
            submitData.uuid = tableId;
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
            sendUrl = '/desk/new_desks.json';
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
    stateChange = (e) => {
        this.setState({
            isProjectState: e.target.value
        });
        if(e.target.value === '空闲') {

            this.setState({
                userName : ''
            });
        }
    };

    // 返回
    handleGoBack = () => {
        const {history} = this.props;
        history.push(`/table`);
    };

    renderTelSelectOption = () => {
        const {MemberList} = this.state;
        return MemberList.map(member => <Option value={member.telephone} key={member.telephone || 'all'}>{member.telephone}</Option>)
    };

    handleTelephoneChange = (value) => {
        console.log(value, 'value');
        this.setState({
            uuidMember: value,
            telephoneChooseNum: value
        });
    };

    memberNameChange = (e) => {
        console.log(e.target.value, 'e.target.value');
        this.setState({
            userName: e.target.value,
        });
        this.request()
            .get(`/member/lists.json?memberName=${e.target.value}`)
            .success((data) => {
                this.setState({
                    MemberList: data,
                    isIgnoreIntercept: true,
                });
            })
            .error((err, res) => {
                message.error(res && res.body && res.body.message || '未知系统错误', 1);
            })
            .end();
    };

    render() {
        let commonTrigger = ['onBlur', 'onChange'];

        const { getFieldProps } = this.props.form;

        // 桌位序号
        const numProps = getFieldProps('num', {
            rules: [
                {required: true, message: '请输入桌位序号'},
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
                    text: '桌位管理',
                    path: `/table`,
                }, {
                    text: '新建桌位',
                },
            ],
            breadcrumbItems: 'auto',
        };

        let formTitle = {title: '新增桌位'};

        return (
            <Page header={header} loading={this.state.loading}>
                <div className="coupon-add">
                    <Form horizontal form={this.props.form}>
                        <Panel header={formTitle} width="700px">
                            <div className="content" style={{width: '100%'}}>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">桌位序号：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input {...numProps} placeholder="请输入桌位序号"/>
                                        </FormItem>
                                    </Col>
                                    <Col span="8" className="help-label">
                                        例如：五号桌
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">桌位使用状态：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <RadioGroup value={this.state.isProjectState} onChange={this.stateChange}>
                                                <Radio key="空闲" value={ '空闲' } checked={true} defaultChecked={true}>空闲</Radio>
                                                <Radio key="使用中" value={'使用中' } defaultChecked={false}>使用中</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label">使用人姓名：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Input  value={this.state.userName} onChange={this.memberNameChange} style={{marginTop: 1}} maxLength="10" placeholder="请输入成员姓名"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label">使用人联系电话：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <Select value={this.state.telephoneChooseNum} placeholder="请选择联系电话" style={{ width: 220, marginRight: 10 }} onChange={this.handleTelephoneChange}>
                                                {this.renderTelSelectOption()}
                                            </Select>
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
export default Form.create()(CreateTable);

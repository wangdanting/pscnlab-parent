import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Form, Input, Row, Select, Radio, InputNumber, message} from 'antd';
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
        uuidRole: -1,
        gender: '男',
        age: 0,
        manage: 1,
        isUpdateMember: false,  //是否是更新成员

        roleList: [],
        roleChooseNum: '', //角色选择
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
        let memberId = this.props.params.id;
        if(memberId) {
            this.state.isUpdateMembe = true;
            this.getMemberInfo(memberId);
        }
        //获取角色列表
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

    //获取该成员信息 更新
    getMemberInfo = (memberId) => {
        const that = this;
        this.request()
            .get(`/member/tel/${memberId}.json`)
            .success((response) => {
                let results = response;
                that.setState({
                    loading: false,
                });
                let formvalue = {
                    name: results.name,
                    gradeClass: results.gradeClass,
                    telephone: results.telephone,
                    hobby: results.hobby
                };
                this.setState({
                    uuidRole: results.uuidRole,
                    roleChooseNum: results.uuidRole,
                    gender: results.gender,
                    age: results.age,
                    manage: results.manage,
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
            'name',
            'gradeClass',
            'telephone',
            'hobby'
        ];

        return validateFields;
    };

    // 构建需要提交的数据
    createSubmitObj = (values) => {
        let submitData = {};
        submitData.uuidRole = this.state.uuidRole;
        submitData.name = values.name;
        submitData.gender = this.state.gender;
        submitData.age = this.state.age;
        submitData.gradeClass = values.gradeClass;
        submitData.telephone  = values.telephone;
        submitData.hobby = values.hobby;
        submitData.manage = this.state.manage;

        // 给 userLimit, userPerDayLimit 赋值
        return submitData;
    };

    // 发送数据，根据不同的类型
    handleSendData = (submitData) => {
        let sendUrl;
        let memberId = this.props.params.id;
        if(memberId) { //更新
            sendUrl = `/member/update.json`;
            submitData.uuidMember = memberId;
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
            sendUrl = '/member/new.json';
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

    //选择角色
    handleRoleChange = (value) => {
        console.log(value, '0009');
        this.setState({
            uuidRole: value,
            roleChooseNum: value,
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

    //是否是管理员修改
    manageChange = (e) => {
        this.setState({
            manage: e.target.value
        });
    };

    //渲染角色select option
    renderRoleSelectOption = () => {
        const {roleList} = this.state;
        return roleList.map(role => <Option value={role.value} key={role.value || 'all'}>{role.label}</Option>)
    };

    // 返回
    handleGoBack = () => {
        const {history} = this.props;
        history.push(`/member`);
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
                                            <Select value={this.state.roleChooseNum} placeholder="请选择角色" style={{ width: 220, marginRight: 10 }} onChange={this.handleRoleChange}>
                                                {this.renderRoleSelectOption()}
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
                                    <Col span="4" className="label ant-form-item-required">定位：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <RadioGroup onChange={this.manageChange} value={this.state.manage}>
                                                <Radio key={1} value={1} checked={true} defaultChecked={true}>非管理员</Radio>
                                                <Radio key={0} value={0} defaultChecked={false}>管理员</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" className="form-row">
                                    <Col span="4" className="label ant-form-item-required">性别：</Col>
                                    <Col span="11">
                                        <FormItem>
                                            <RadioGroup onChange={this.genderChange} value={this.state.gender}>
                                                <Radio key="男" value={ '男' } checked={true} defaultChecked={true}>男</Radio>
                                                <Radio key="女" value={'女' } defaultChecked={false}>女</Radio>
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

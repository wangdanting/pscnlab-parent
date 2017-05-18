import './style.less';
import React from 'react';
import request from '../../common/request/request.jsx';
import PubSubMsg from '../../framework/common/pubsubmsg';
import { Button, Form, Input, message } from 'antd';
const FormItem = Form.Item;
const createForm = Form.create;

import UserHeader from './UserHeader.jsx';

class ForgetPassword extends React.Component {
    getValidateStatus(field) {
        const { isFieldValidating, getFieldError, getFieldValue } = this.props.form;

        if (isFieldValidating(field)) {
            return 'validating';
        } else if (!!getFieldError(field)) {
            return 'error';
        } else if (getFieldValue(field)) {
            return 'success';
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            status: {
                email: {},
                name: {},
                password: {},
                rePassword: {},
            },
            formData: {
                email: this.props.sendEmail,
                name: undefined,
                password: undefined,
                rePassword: undefined,
                textarea: undefined,
                validationCode: undefined,
            },
            isEmailOver: false, // email 是否输入完毕
            emailValidateMethod: 'onBlur', // 用于改变 email 的验证方法
            invisibleSend: true, // 用于判断是否能在此发送验证码
            sendButtonShow: '重新发送', // 重新发送按钮显示内容
            needSecond: 60, // 发送验证码剩余的秒数
            isModifySuccess: false,
        };
    }

    componentDidMount() {
        let that = this;
        PubSubMsg.subscribeOnce('startCountForgetPassword', () => {
            that.state.needSecond = 60;
            const secondInterval = setInterval(() => {
                that.state.needSecond -= 1;
                that.setState({
                    needSecond: that.state.needSecond,
                });
                if (!that.state.needSecond) {
                    clearInterval(secondInterval);
                    that.setState({
                        invisibleSend: false,
                    });
                }
            }, 1000);
        });
    }

    handleEmailInputBlur() {
        this.setState({
            isEmailOver: true,
        });
    }

    handleEmailInputFocus() {
        if (this.state.isEmailOver) {
            this.setState({
                emailValidateMethod: 'onChange',
            });
        }
    }

    checkPass(rule, value, callback) {
        const form = this.props.form;
        const { getFieldValue } = this.props.form;

        if (form.getFieldValue('password') && form.getFieldValue('rePassword')) {
            form.validateFields(['rePassword'], { force: true });
        }
        callback();
    }

    returnLogin() { // 返回登录
        Common.goToLogin('忘记密码，返回登录');
    }

    checkRePass(rule, value, callback) {
        if (value && value !== this.props.form.getFieldValue('password')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    }

    submitModify(e) { // 提交新密码
        this.setState({
            isEmailOver: true,
        });
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('error');
            } else {
                if (!this.state.formData.validationCode || this.state.formData.validationCode.length !== 6) {
                    message.error('请输入长度为6位的验证码', 2);
                    return;
                }
                let that = this;
                const sendData = {
                    accountName: values.email,
                    newPassword: values.password,
                    validationCode: this.state.formData.validationCode,
                };
                request
                    .post('/api/forget/password.json', true)
                    .send(sendData)
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .end((err, res) => {
                        if (err || !res.ok) {
                            message.error(res.body.message, 2);
                        } else {
                            message.success('密码修改成功', 2);
                            that.setState({
                                isShowRegister: false,
                                isModifySuccess: true,
                            });
                        }
                    });
            }
        });
    }

    sendVerifyCode() { // 重新发送验证码
        let that = this;
        request
            .post('/api/users/send_reset_password_validation_code.json', true)
            .send({ accountName: that.props.sendAccount})
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end((err, res) => {
                if (err || !res.ok) {
                    message.error(res.body.message, 2);
                } else {
                    message.success('验证码发送成功', 2);
                    that.setState({
                        invisibleSend: true,
                        needSecond: 60,
                    });
                    const secondInterval = setInterval(() => {
                        that.setState({
                            needSecond: that.state.needSecond - 1,
                        });

                        if (!that.state.needSecond) {
                            clearInterval(secondInterval);
                            that.setState({
                                invisibleSend: false,
                            });
                        }
                    }, 1000);
                }
            });
    }

    setValidationCode(e) {
        if (e.target.value.length > 6) {
            return;
        }
        this.state.formData.validationCode = e.target.value;
        this.setState({
            formData: this.state.formData,
        });
    }

    render() {
        const that = this;
        const noop = false;
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;

        const emailProps = getFieldProps('email', {
            validate: [{
                rules: [
                    { required: true },
                ],
                trigger: 'onBlur',
            }, {
                rules: [
                    { /* type: 'email', */message: '请输入正确的邮箱地址', required: true },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
            initialValue: that.props.sendAccount,
        });

        const passwordProps = getFieldProps('password', {
            rules: [
                { required: true, whitespace: true, min: 6, max: 18, message: '请输入6~18位密码' },
                { validator: this::this.checkPass },
            ],
        });

        const rePasswordProps = getFieldProps('rePassword', {
            rules: [
                { required: true, min: 6, max: 18, whitespace: true, message: '请再次输入密码' },
                { validator: this::this.checkRePass },
            ],
        });

        return (
            <div className="full-screen-container admin-forget" style={{display: (this.props.isShowRegister ? 'none' : 'block')}}>
                <UserHeader userHeaderTitle="找回密码"/>
                <Form horizontal style={{width: 400}} form={this.props.form} className="admin-form-center admin-form-forget">
                    <FormItem
                        label=""
                        id="email"
                        labelCol={{span: 0}}
                        wrapperCol={{span: 24}}>
                        <h2 className="admin-form-center-title">重置密码</h2>
                    </FormItem>
                    <FormItem
                        label=""
                        id="email"
                        labelCol={{span: 0}}
                        wrapperCol={{span: 24}}
                        hasFeedback
                        help={isFieldValidating('email') ? '校验中...' : (getFieldError('email') || []).join(', ')}
                        required>
                        <Input {...emailProps} type="email" placeholder="请输入邮箱" onBlur={this::this.handleEmailInputBlur} onFocus={this::this.handleEmailInputFocus} disabled/>
                    </FormItem>
                    <FormItem
                        label=""
                        labelCol={{span: 0}}
                        wrapperCol={{span: 24}}
                        hasFeedback
                        help={isFieldValidating('password') ? '校验中...' : (getFieldError('password') || []).join(', ')}
                        required>
                        <Input {...passwordProps} maxLength="18" type="password" onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} autoComplete="off" placeholder="6-18位密码"/>
                    </FormItem>
                    <FormItem
                        label=""
                        id="rePassword"
                        labelCol={{span: 0}}
                        wrapperCol={{span: 24}}
                        hasFeedback
                        help={isFieldValidating('rePassword') ? '校验中...' : (getFieldError('rePassword') || []).join(', ')}
                        required>
                        <Input {...rePasswordProps} maxLength="18" type="password" onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} autoComplete="off" placeholder="两次输入密码保持一致"/>
                    </FormItem>
                    <FormItem
                        label=""
                        labelCol={{span: 0}}
                        wrapperCol={{span: 24}}
                        hasFeedback
                        required>
                        <div>
                            <Input name="validationCode" maxLength="6" id="validationCode" style={{width: 145}} value={this.state.formData.validationCode} placeholder="6位验证码" onChange={this::this.setValidationCode}/>
                            <Button size="large" type="primary" style={{marginLeft: 10, width: 125}} onClick={this::this.sendVerifyCode} disabled={this.state.invisibleSend}>{this.state.sendButtonShow} {this.state.needSecond ? `( ${this.state.needSecond} )` : ''}</Button>
                        </div>
                    </FormItem>
                    <Button type="primary" onClick={this::this.submitModify} style={{marginBottom: 15, width: 280}}>确认修改</Button>
                    <Button onClick={this.returnLogin} className="btn-register-back" style={{width: 280}}>返回登录</Button>
                </Form>
                <Form horizontal style={{display: (this.state.isModifySuccess ? 'block' : 'none'), width: 400}} form={this.props.form} className="admin-form-center admin-form-forget-success">
                    <FormItem
                        labelCol={{span: 0}}
                        wrapperCol={{span: 24}}
                        hasFeedback
                        required>
                        <img style={{width: 114, height: 114, display: 'block', margin: '0 auto'}} src={require('./forget-modify-success-ico.png')} alt="modify success" title="修改成功" />
                    </FormItem>
                    <FormItem
                        label="&nbsp;"
                        id="email"
                        labelCol={{span: 9}}
                        wrapperCol={{span: 15}}>
                        <h2 style={{marginTop: 10}}>设置成功</h2>
                    </FormItem>
                    <FormItem
                        labelCol={{span: 0}}
                        wrapperCol={{span: 24}}
                        hasFeedback
                        help={isFieldValidating('rePassword') ? '校验中...' : (getFieldError('rePassword') || []).join(', ')}
                        required>
                        <div style={{height: 1, width: '100%', backgroundColor: 'rgb(230, 230, 230)'}}></div>
                    </FormItem>
                    <FormItem
                        label="&nbsp;"
                        id="email"
                        labelCol={{span: 3}}
                        wrapperCol={{span: 21}}>
                        <span>
                            现在<a alt="登录商户平台" title="登录商户平台" style={{display: 'inline-block', margin: '0 4px'}} href="/sessions/new">登录商户平台</a>开始您的旅程吧!
                        </span>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

ForgetPassword = createForm()(ForgetPassword);

export default ForgetPassword;

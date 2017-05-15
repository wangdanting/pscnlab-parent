import './style.css';
import React from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
const FormItem = Form.Item;
const createForm = Form.create;
import ForgetPassword from './ForgetPassword';
import request from '../../common/request/request.jsx';
import PubSubMsg from '../../framework/common/pubsubmsg';
import Common from '../../common/common.jsx';

import UserHeader from './UserHeader.jsx';
import UserBackGroundParticles from './UserBackGroundParticles.jsx';

class FindPsw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                account: {},
            },
            formData: {
                account: undefined,
            },
            isAccountOver: false, // account 是否输入完毕
            accountValidateMethod: 'onBlur', // 用于改变 account 的验证方法,
            isShowRegister: true,
            isSendAccount: false,
        };
    }

    handleAccountInputBlur() {
        this.setState({
            isAccountOver: true,
        });
    }

    handleAccountInputFocus() {
        if (this.state.isAccountOver) {
            this.setState({
                accountValidateMethod: 'onChange',
            });
        }
    }

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

    returnLogin() { // 返回登录
        Common.goToLogin('找回密码，返回登录');
    }

    // 校验账号
    checkAccount = (rule, value, callback) => {
        if (!Common.formatValidation.email(value) && !Common.formatValidation.mobile(value)) {
            callback([new Error(Common.messageContent.accountIsInVisible)]);
        }
        callback();
    };

    getVerifyCode(e) {
        this.setState({
            isAccountOver: true,
        });
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('error');
            } else {
                this.setState({
                    isSendAccount: true,
                });
                let that = this;
                request
                    .post('/api/users/send_reset_password_validation_code.json', true)
                    .send({ accountName: values.account})
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .end((err, res) => {
                        if (err || !res.ok) {
                            message.error(res.body.message, 2);
                        } else {
                            message.success('验证码发送成功', 2);
                            that.setState({
                                isShowRegister: false,
                            });
                            PubSubMsg.publish('startCountForgetPassword');
                        }
                        that.setState({
                            isSendAccount: false,
                        });
                    });
            }
        });
    }

    render() {
        const that = this;
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const accountProps = getFieldProps('account', {
            validate: [{
                rules: [
                    { message: Common.messageContent.accountIsNull, required: true },
                    {validator: this.checkAccount},
                ],
                trigger: ['onBlur', 'onChange'],
            }],
            initialValue: that.state.formData.account,
        });

        return (
            <div className="full-screen-container admin-forget">
                <UserHeader userHeaderTitle="找回密码"/>
                <UserBackGroundParticles />
                <Form horizontal className="admin-form-center admin-form-register-send-email" form={this.props.form} style={{display: (this.state.isShowRegister ? 'block' : 'none'), width: 400}}>
                    <Spin spining={this.state.isSendAccount}>
                        <FormItem
                            label=""
                            labelCol={{span: 0}}
                            wrapperCol={{span: 24}}>
                            <h2 className="admin-form-center-title">填写账户</h2>
                        </FormItem>
                        <FormItem
                            labelCol={{span: 0}}
                            wrapperCol={{span: 24}}
                            hasFeedback
                            help={isFieldValidating('account') ? '校验中...' : (getFieldError('account') || []).join(', ')}
                            required>
                            <Input id="account" {...accountProps} placeholder="输入需要找回密码的手机号" onBlur={this::this.handleAccountInputBlur} onFocus={this::this.handleAccountInputFocus} disabled={this.state.AccountIsDisabled}/>
                        </FormItem>
                        <Button type="primary" onClick={this::this.getVerifyCode} style={{marginBottom: 15, width: 280}}>获取验证码</Button>
                        <Button onClick={this::this.returnLogin} style={{width: 280}}>返回登录</Button>
                    </Spin>
                </Form>
                <UserFooter />
                <ForgetPassword sendAccount={this.props.form.getFieldValue('account')} isShowRegister={this.state.isShowRegister}/>
            </div>
        );
    }
}

FindPsw = createForm()(FindPsw);

export default FindPsw;

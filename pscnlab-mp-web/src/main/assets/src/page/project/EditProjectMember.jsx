import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Form, Input, Row, Modal} from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {BaseComponent, PaginationComponent} from 'component';
import Panel from '../../component/panel/Panel';

const confirm = Modal.confirm;
const FormItem = Form.Item;

class EditProjectMember extends BaseComponent {
    state = {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,

        managerList: [{
            id: null,
            name: null,
            mobile: null,
            disabled: false,
            options: null,
        }],

        projectMemberData: [],
    };

    columns = [
        {
            title: '名字',
            dataIndex: 'memberName',
            key: 'memberName',
            width: 300,
        }, {
            title: '手机号码',
            dataIndex: 'telephone',
            key: 'telephone',
            width: 300,
        }, {
            title: '操作',
            dataIndex: 'uuidMember',
            key: 'uuidMember',
            width: 250,
            render(text) {
                return (
                    <a>
                        <span onClick={()=>this.showDeleteConfirm(text)}>删除成员</span>
                    </a>
                );
            },
        }
    ];

    //确认删除角色对话框
    showDeleteConfirm(id) {
        confirm({
            title: '你确定要删除该成员信息？',
            content: '小心，小心',
            onOk:() => {
                this.request()
                    .noStoreId()
                    .del(`/project/id/${this.state.projectId}/delete_members.json?memberUUId=${id}`)
                    .success((data, res) => {
                        message.success('删除成功', 1);
                        this.initTableData(params);
                    })
                    .end();
            },
            onCancel() {},
        })
    };

    componentDidMount() {
        this.setState({
            projectId: this.props.params.id
        });
        this.initTableData();
    }

    initTableData = () => {
        console.log(this.state.projectId, 'projectId');
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/project/id/${this.state.projectId}/members.json`)
            .success((data, res) => {
            console.log(data, 'iii');
                this.setState({
                    projectMemberData: data
                });
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
            'memberName',
            'telephone',
        ];

        return validateFields;
    };

    // 构建需要提交的数据
    createSubmitObj = (values) => {
        let submitData = {};
        submitData.uuidRole = this.state.uuidRole;
        submitData.name = values.name;


        // 给 userLimit, userPerDayLimit 赋值
        return submitData;
    };

    // 发送数据，根据不同的类型
    handleSendData = (submitData) => {
        let sendUrl = '/member/new.json';
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
    };

    render() {
        let {projectMemberData} = this.state;
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {span: '3'},
            wrapperCol: {span: '14'},
        };

        let memberNameProps = getFieldProps('memberName', {
            rules: [
                {required: true, message: '请输入成员姓名!'},
            ],
        });
        let telephoneProps = getFieldProps('telephone', {
            rules: [
                {required: false, message: '请选择正确的联系方式!'},
            ],
        });

        return (
            <Page header="auto" loading={this.state.loading}>
                <Form horizontal form={this.props.form}>
                    <Panel
                        header="邀请成员加入项目"
                        width="100%">
                        <div className="content">
                            <FormItem
                                label="成员信息："
                                {...formItemLayout}
                                labelCol={{span: '3'}}
                                wrapperCol={{span: '18'}}
                                style={{marginBottom: 4}}
                                required>
                                <Col span="5" style={{marginLeft: 10}}>
                                    <FormItem hasFeedback>
                                        <Input {...memberNameProps} style={{marginTop: 1}} maxLength="10" placeholder="请输入成员姓名"/>
                                    </FormItem>
                                </Col>
                                <Col span="5" style={{marginLeft: 10}}>
                                    <FormItem hasFeedback>
                                        <Input {...telephoneProps} style={{marginTop: 1}} placeholder="请输入联系电话"/>
                                    </FormItem>
                                </Col>
                            </FormItem>
                            <Button type="primary" style={{marginRight: 10}} loading={this.state.isSubmitting} onClick={this.handleSubmit}>添加</Button>
                            <Link to={`/project`}><Button type="ghost">取消</Button></Link>
                        </div>
                    </Panel>
                </Form>
                <Table
                    columns={this.columns}
                    dataSource={projectMemberData}
                    pagination={false} bordered={true}
                    style={{marginBottom: 15}}
                    rowKey={(record, index) => index}
                    loading={this.state.isLoading}/>
            </Page>
        );
    }
}
export default Form.create()(EditProjectMember) ;

import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Form, Input, Row, Modal, Select, message} from 'antd';
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
        isSubmitting: false,

        managerList: [{
            id: null,
            name: null,
            mobile: null,
            disabled: false,
            options: null,
        }],

        projectMemberData: [],
        MemberList: []
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
            render:(text) => {
                return (
                    <a>
                        <span onClick={()=>this.showDeleteConfirm(text)}>删除成员</span>
                    </a>
                );
            },
        }
    ];

    //确认删除成员对话框
    showDeleteConfirm(id) {
        console.log(id, 'id');
        confirm({
            title: '你确定要删除该成员信息？',
            content: '小心，小心',
            onOk:() => {
                this.request()
                    .noStoreId()
                    .del(`/project/id/${this.props.params.id}/delete_members.json?memberUUId=${id}`)
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
        this.initTableData();
    }

    initTableData = () => {
        let projectId = this.props.params.id;
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/project/id/${projectId}/members.json`)
            .success((data, res) => {
            console.log(data, 'iii');
                this.setState({
                    projectMemberData: data
                });
            })
            .end();
    };

    // 发送数据，根据不同的类型
    handleSubmit = () => {
        let sendUrl = `/project/id/${this.props.params.id}/add_members.json?memberUUId=${this.state.uuidMember}`;
        this.request()
            .post(sendUrl)
            .success(() => {
                message.success('操作成功', 1);
                this.setState({
                    isIgnoreIntercept: true,
                });
                this.initTableData();
            })
            .error((err, res) => {
                message.error(res && res.body && res.body.message || '未知系统错误', 1);
                this.setState({
                    isSubmitting: false,
                });
            })
            .end();
    };

    renderTelSelectOption = () => {
        const {MemberList} = this.state;
        return MemberList.map(member => <Option value={member.uuidMember} key={member.uuidMember || 'all'}>{member.telephone}</Option>)
    };

    handleTelephoneChange = (value) => {
        console.log(value, 'value');
        this.setState({
            uuidMember: value,
            telephoneChooseNum: value
        });
    };

    memberNameChange = (e) => {
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
        let {projectMemberData} = this.state;
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {span: '3'},
            wrapperCol: {span: '14'},
        };

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
                                        <Input onChange={this.memberNameChange} style={{marginTop: 1}} maxLength="10" placeholder="请输入成员姓名"/>
                                    </FormItem>
                                </Col>
                                <Col span="5" style={{marginLeft: 10}}>
                                    <FormItem hasFeedback>
                                        <Select value={this.state.telephoneChooseNum} placeholder="请选择联系电话" style={{ width: 220, marginRight: 10 }} onChange={this.handleTelephoneChange}>
                                            {this.renderTelSelectOption()}
                                        </Select>
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

import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Form, Input, Row} from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {BaseComponent} from 'component';
import Panel from '../../component/panel/Panel';

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
        delStaffs: [],
        projectMemberData: [
            {
                uuid_member: 1,
                name: '张三',
                telephone: '18875082742'
            }, {
                uuid_member: 2,
                name: '张三1',
                telephone: '18875082742'
            }, {
                uuid_member: 3,
                name: '张三2',
                telephone: '18875082742'
            }, {
                uuid_member: 4,
                name: '张三3',
                telephone: '18875082742'
            }
        ],
    };

    columns = [
        {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
            width: 300,
        }, {
            title: '手机号码',
            dataIndex: 'telephone',
            key: 'telephone',
            width: 300,
        }, {
            title: '操作',
            dataIndex: 'uuid_member',
            key: 'uuid_member',
            width: 250,
            render(text) {
                return (
                    <span>
                        <Button>删除成员</Button>
                    </span>
                );
            },
        }
    ];

    componentDidMount() {
        this.initTableData();
    }


    initTableData = () => {
        this.setState({
            totalCount: 16,
        });
        // this.request()
        //     .noMchId()
        //     .noStoreId()
        //     .get(`/api/dish/balances.json?size=${size}&offset=${offset}&mchId=${mchId}&storeId=${storeId}&dishName=${dishName}&isOnLined=${isOnLined}`)
        //     .success((data, res) => {
        //         this.getHandledData(data);
        //         this.setState({
        //             totalCount: res.body.totalCount,
        //         });
        //     })
        //     .end();
    };

    // 清楚校验仓库中的当前数据
    cleanManager(num, dateList) {
        let that = this;
        let arr = [];
        dateList.forEach((item, index) => {
            let manager = that.props.form.getFieldsValue([`name${index}`, `mobile${index}`]);
            arr.push({
                name: manager[`name${index}`],
                mobile: manager[`mobile${index}`],
            });
        });
        arr.splice(num, 1);
        arr.forEach((item, index) => {
            let manager = {};
            manager[`name${index}`] = item.name;
            manager[`mobile${index}`] = item.mobile;
            that.props.form.setFieldsValue(manager);
        });
    };

    deleteManager(num) {
        let that = this;
        let dateList = this.state.managerList;

        that.cleanManager(num, dateList);

        if (dateList[num].id) {
            let delStaffs = that.state.delStaffs;
            delStaffs.push(dateList[num]);
            that.setState({
                delStaffs,
            });
        }

        dateList.splice(num, 1);
        this.setState({
            managerList: dateList,
        });
    };

    addManager() {
        let dateList = this.state.managerList;

        let addManager = {
            id: null,
            name: undefined,
            mobile: undefined,
            isInvite: 'N', // 新加的店长是否邀请默认为N
            disabled: false,
        };

        dateList.push(addManager);
        this.setState({
            managerList: dateList,
        });
    };

    handleSubmit() {

    };

    render() {
        let {projectMemberData} = this.state;
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {span: '3'},
            wrapperCol: {span: '14'},
        };
        //成员
        const managerGroup = this.state.managerList.map((managerItem, index, arr) => {

            let managerNameProps = getFieldProps(`name${index}`, {
                rules: [
                    {required: true, message: '请输入成员姓名!'},
                ],
            });

            let managerTelProps = getFieldProps(`mobile${index}`, {
                rules: [
                    {required: false, message: '请选择正确的联系方式!'},
                ],
            });

            // let options = this.state.manager[`options${index}`];

            let disabled = managerItem.id ? true : this.state.managerList[index].disabled || false;

            return (
                <div key={`manager${index}`}>
                    <FormItem
                        label="成员信息："
                        {...formItemLayout}
                        labelCol={{span: '3'}}
                        wrapperCol={{span: '18'}}
                        style={{marginBottom: 4}}
                        required>
                        <Col span="5" style={{marginLeft: 10}}>
                            <FormItem hasFeedback>
                                <Input {...managerNameProps} style={{marginTop: 1}} maxLength="10" disabled={disabled} placeholder="请输入成员姓名"/>
                            </FormItem>
                        </Col>
                        <Col span="5" style={{marginLeft: 10}}>
                            <FormItem hasFeedback>
                                <Input {...managerTelProps} style={{marginTop: 1}} disabled={disabled} placeholder="请输入联系电话"/>
                            </FormItem>
                        </Col>
                        <Col span="5" style={{marginLeft: 10}}>
                            <a className={arr.length === 1 ? 'store-manage-hidden' : ''}>
                                <span onClick={() => this.deleteManager(index)} style={{marginLeft: 10}}>删除该成员</span>
                            </a>
                        </Col>
                    </FormItem>
                </div>
            );
        });

        return (
            <Page header="auto" loading={this.state.loading}>
                <Form horizontal form={this.props.form} onSubmit={this.handleSubmit}>
                    <Panel
                        header="邀请成员加入项目"
                        width="100%">
                        <div className="content">
                            {managerGroup}
                            <Row style={{marginBottom: 10}}>
                                <Col span={20} offset={3}>
                                    <a>
                                        <span onClick={this::this.addManager}>添加成员</span>
                                    </a>
                                </Col>
                            </Row>
                            <Button type="primary" style={{marginRight: 10}} htmlType="submit">保存</Button>
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

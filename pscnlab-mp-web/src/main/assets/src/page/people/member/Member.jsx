import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Modal, message } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';
import {Common} from 'common';

const confirm = Modal.confirm;
const manage = Common.getMerchant().manage;

class Member extends BaseComponent {
    state = {
        dataSource: [],
        roleList: [],

        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
    };

    columns = [
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '班级',
            dataIndex: 'gradeClass',
            key: 'gradeClass',
        },
        {
            title: '联系方式',
            dataIndex: 'telephone',
            key: 'telephone',
        },
        {
            title: '操作',
            dataIndex: 'uuidMember',
            key: 'uuidMember',
            render:(text) => {
                return (
                    <span>
                        <span style={{display: (manage?'none': 'block')}}>
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`member/modify-member/${text}`}>
                                编辑成员
                            </Link>｜
                            <a>
                                <span onClick={()=>this.showDeleteConfirm(text)}>删除成员</span>
                            </a>
                        </span>
                        <span style={{color: '#57c5f7', display: (manage?'block': 'none')}}>暂无</span>
                    </span>
                );
            }
        },
    ];

    //确认删除角色对话框
    showDeleteConfirm(id) {
        confirm({
            title: '你确定要删除该成员信息？',
            content: '小心，小心',
            onOk:() => {
                const {pageSize, currentPage} = this.state;
                const params = {
                    pageSize,
                    currentPage,
                };

                this.request()
                    .noStoreId()
                    .del(`/member/delete.json?id=${id}`)
                    .success((data, res) => {
                        message.success('删除成功', 1);
                        this.initTableData(params);
                    })
                    .end();
            },
            onCancel() {},
        })
    };

    componentWillMount() {
        const {pageSize, currentPage} = this.state;
        const params = {
            pageSize,
            currentPage,
        };
        this.initTableData(params);
    }


    initTableData = (params) => {
        const size = params.pageSize;
        const offset = (params.currentPage - 1) * size;
        const uuidRole = '';
        const gender = '';
        const name = '';
        const telephone = '';
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/member.json?uuidRole=${uuidRole}&gender=${gender}&name=${name}&telephone=${telephone}&size=${size}&offset=${offset}`)
            .success((data, res) => {
                this.setState({
                    dataSource: data.map((item) => {item.member.role = `${item.role.role}(${item.role.position})`; return item.member;}),
                    totalCount: res.body.totalCount,
                });
            })
            .end();
    };

    // 查询数据
    handleSearch(data, currentPage)  {

        let currentPagee = currentPage.currentPage;
        let pageSizee = this.state.pageSize;

        let offset = (currentPagee - 1) * (pageSizee);
        let size = pageSizee;

        this.request()
            .noStoreId()
            .get(`/member.json?uuidRole=${data.uuidRole}&gender=${data.gender}&name=${data.name}&telephone=${data.telephone}&size=${size}&offset=${offset}`)
            .success((data, res) => {
                this.setState({
                    dataSource: data.map((item) => {item.member.role = `${item.role.role}(${item.role.position})`; return item.member;}),
                    totalCount: res.body.totalCount,
                });
            })
            .end();
    }

    queryTermsOptions = {
        showSearchBtn: true,
        resultDateToString: true,
        getAllOptions: (callBack) => {
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

            setTimeout(() => {
                let allRoleOptions =  this.state.roleList;
                callBack({uuidRole: allRoleOptions});
            }, 1000);
        },
        onSubmit: (data) => {
            this.handleSearch(data, {currentPage: 1});
        },
        items: [
            {
                type: 'select',
                label: '角色',
                name: 'uuidRole',
                initialValue: '',
                searchOnChange: false,
                labelWidth: 40,
            }, {
                type: 'select',
                label: '性别',
                name: 'gender',
                initialValue: '',
                searchOnChange: false,
                labelWidth: 40,
                options: [
                    {
                        value: '男',
                        label: '男',
                        checked: true
                    }, {
                        value: '女',
                        label: '女'
                    }
                ]
            }, {
                type: 'input',
                label: '名字',
                name: 'name',
                labelWidth: 40,
                fieldWidth: '150px',
                searchOnChange: false
            }, {
                type: 'input',
                label: '电话',
                name: 'telephone',
                labelWidth: 40,
                fieldWidth: '150px',
                searchOnChange: false
            }
        ],
    };

    render() {
        let {
            pageSize,
            currentPage,
            totalCount,
            dataSource} = this.state;

        const paginationOptions = {
            showQuickJumper: false, // 默认true
            pageSize,
            currentPage,
            totalCount,
            onChange: (current, size) => {
                const state = this.state;
                const params = {
                    pageSize: size,
                    currentPage: current,
                    storeId: state.storeId,
                };
                this.initTableData(params);
                this.setState({
                    currentPage: current,
                    pageSize: size,
                });
            },
        };

        return (
            <Page header="auto" loading={this.state.loading}>
                <Link
                    style={{color: 'white', display: (manage?'none': 'block')}}
                    activeStyle={{color: 'red'}}
                    to={`/member/add-member`}>
                    <Button type="primary" size="large" style={{marginBottom: 16}}>新增成员</Button>
                </Link>
                <Col>
                    <QueryTerms options={this.queryTermsOptions}/>
                </Col>
                <Table columns={this.columns} rowKey={(record, index) => index} dataSource={dataSource} pagination={false}/>
                <PaginationComponent options={paginationOptions}/>
            </Page>
        );
    }
}
export default Member;

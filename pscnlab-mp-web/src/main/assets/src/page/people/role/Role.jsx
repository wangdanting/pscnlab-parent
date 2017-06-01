import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Modal, message } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

const confirm = Modal.confirm;

class Role extends BaseComponent {
    state = {
        dataSource: [],
        searchSource: [],

        //分页
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
            title: '角色职位',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: '操作',
            dataIndex: 'uuidRole',
            key: 'uuidRole',
            render:(text) =>  {
                return (
                    <span>
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`role/modify-role/${text}`}>
                                编辑角色
                            </Link>｜
                            <a>
                                <span onClick={()=>this.showDeleteConfirm(text)}>删除角色</span>
                            </a>
                    </span>
                );
            },
        },
    ];

    //确认删除角色对话框
    showDeleteConfirm(id) {
        confirm({
            title: '你确定要删除该角色信息？',
            content: '注意：如果有成员绑定改角色，该角色将删除失败！',
            onOk:() => {
                const {pageSize, currentPage} = this.state;
                const params = {
                    pageSize,
                    currentPage,
                };

                this.request()
                    .noStoreId()
                    .del(`/role/delete.json?id=${id}`)
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
        const role = '';
        const position = '';
        this.setState({
        });
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/role.json?size=${size}&offset=${offset}&role=${role}&position=${position}`)
            .success((data, res) => {
                console.log(data, 'data');
                this.setState({
                    dataSource: data,
                    searchSource: data,
                    totalCount: res.body.totalCount,
                });
            })
            .end();
    };

    // 查询数据
    handleSearch(data, currentPage) {
        this.setState({
            refundDataList: [],
            refundDataTotal: 0,
        });

        let currentPagee = currentPage.currentPage;
        let pageSizee = this.state.pageSize;

        let offset = (currentPagee - 1) * (pageSizee);
        let size = pageSizee;


        this.request()
            .noStoreId()
            .get(`/role.json?size=${size}&offset=${offset}&role=${data.role}&position=${data.position}`)
            .success((data, res) => {
                this.setState({
                    dataSource: data
                });
            })
            .end();
    }

    queryTermsOptions = {
        showSearchBtn: true,
        resultDateToString: true,
        getAllOptions: (callBack) => {
            setTimeout(() => {
                let allPostionOptions = this.state.searchSource.map((item, index) => ({
                    value: `${item.position}`,
                    label: `${item.position}`,
                }));
                console.log(allPostionOptions, 'allPostionOptions');
                callBack({position: allPostionOptions});
            }, 1000);

        },
        onSubmit: (data) => {
            console.log(data, 'onSubmit');
            this.handleSearch(data, {currentPage: 1});
        },
        items: [
            {
                type: 'select',
                label: '角色',
                name: 'role',
                initialValue: '',
                searchOnChange: false,
                labelWidth: 40,
                options: [
                    {
                        value: '老师',
                        label: '老师',
                        checked: true
                    }, {
                        value: '学生',
                        label: '学生'
                    }
                ]
            }, {
                type: 'select',
                label: '承担职位',
                name: 'position',
                initialValue: '',
                searchOnChange: false,
                labelWidth: 60,
            }
        ]
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
                const params = {
                    pageSize: size,
                    currentPage: current,
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
                    style={{color: 'white'}}
                    activeStyle={{color: 'red'}}
                    to={`/role/add-role`}>
                    <Button type="primary" size="large" style={{marginBottom: 16}}>新增角色</Button>
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
export default Role;

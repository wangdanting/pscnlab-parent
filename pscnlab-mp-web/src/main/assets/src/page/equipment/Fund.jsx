import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Modal, message } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

const confirm = Modal.confirm;

class Fund extends BaseComponent {
    state = {
        dataSource: [],

        //分页
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,

        hasMoney: 0
    };

    columns = [
        {
            title: '事件',
            dataIndex: 'event',
            key: 'event',
        },
        {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
        }, {
            title: '金额',
            dataIndex: 'money',
            key: 'money',
        },
        {
            title: '操作',
            dataIndex: 'uuidFund',
            key: 'uuidFund',
            render:(text) => {
                return (
                    <span>
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`fund/modify-fund/${text}`}>
                                编辑
                            </Link>｜
                            <a>
                                <span onClick={()=>this.showDeleteConfirm(text)}>删除</span>
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
                    .post(`fund/id/${id}/deletes.json`)
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
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/fund/lists.json?size=${size}&offset=${offset}`)
            .success((data, res) => {
                this.setState({
                    dataSource: data,
                    totalCount: res.body.totalCount,
                });
            })
            .end();

        this.request()
            .noMchId()
            .noStoreId()
            .get(`/fund/counts.json`)
            .success((data, res) => {
                this.setState({
                    hasMoney: data,
                });
            })
            .end();
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
                    to={`/fund/add-fund`}>
                    <Button type="primary" size="large" style={{marginBottom: 16}}>新增经费情况</Button>
                </Link>
                <div style={{float: 'right', marginRight: 100, }}><span style={{fontSize: 20, fontWeight: 600}}>剩余经费</span>:<span style={{fontSize: 25, fontWeight: 600, marginLeft: 10}}>¥ {this.state.hasMoney}</span></div>
                <Table columns={this.columns} rowKey={(record, index) => index} dataSource={dataSource} pagination={false}/>
                <PaginationComponent options={paginationOptions}/>
            </Page>
        );
    }
}
export default Fund;

import React, { Component } from 'react';
import { Tabs, Table, Col, Button } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

class Role extends BaseComponent {
    state = {
        dataSource: [
            {"role": "老师", "position": "java开发"},
            {"role": "老师", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            {"role": "学生", "position": "前端开发"},
            ],
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
            dataIndex: 'operate',
            render(text) {
                return (
                    <span>
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`/add-role`}>
                                编辑角色
                            </Link>｜
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`/add-role`}>
                                删除角色
                            </Link>
                        </span>
                );
            }
            },
    ];

    // 查询数据
    handleSearch(queryData = this.state.queryData) {
        this.setState({
            refundDataList: [],
            refundDataTotal: 0,
        });

        const currentPage = queryData.currentPage;
        const pageSize = queryData.pageSize;

        const sendData = {

            // auditStatus: queryData.status,
            // offset: (currentPage - 1) * (pageSize),
            // size: pageSize,
            // mchOrStore: this.handleCheckIsStore() ? 'store' : 'mch',
        };

        this.request()
            .noStoreId()
            .get('/refunds.json')
            .params(sendData)
            .success((data, res) => {
                this.setState({
                    refundDataList: res.body.results || [],
                    refundDataTotal: res.body.totalCount || 0,
                });
            })
            .end();
    }

    queryTermsOptions = {
        showSearchBtn: true,
        resultDateToString: true,
        getAllOptions: (callBack) => {
            this.request()
                .noStoreId()
                .get('/refunds/conditions.json')
                .success((data, res) => {
                    let resultsStores = res.body.result.stores;

                    let store = resultsStores.map((item) => ({
                        value: item.id,
                        label: item.name,
                    }));
                    store.unshift({value: '', label: '全部'});

                    let allOptions = {
                        store,
                    };
                    callBack(allOptions);
                })
                .end();
        },
        onSubmit: (data) => {
            let queryData = assign({}, this.state.queryData, data, {currentPage: 1});
            this.setState({
                queryData,
            });
            this.handleSearch(queryData);
        },
        onComplete: (data) => {
            let queryData = assign({}, this.state.queryData, data, {currentPage: 1});
            this.setState({
                queryData,
                loadFilter: false,
            });
            this.handleSearch(queryData);
        },
        items: this.renderStoreQueryTerms(),
    };

    renderStoreQueryTerms() {
        let storeQueryTerms = [
            [
                {
                    type: 'selectSearch',
                    label: '角色',
                    name: 'role',
                    initialValue: '',
                    searchOnChange: true,
                    labelWidth: 40,
                },
            ],
        ];
        return storeQueryTerms;
    }

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
        const dishName = params.dishName;
        const isOnLined = params.isOnLined;
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

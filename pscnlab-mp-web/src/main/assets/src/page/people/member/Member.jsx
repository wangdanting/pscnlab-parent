import React, { Component } from 'react';
import { Tabs, Table, Col, Button } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

class Member extends BaseComponent {
    state = {
        dataSource: [
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
            {"role": "老师(java开发)", "name": "倪伟", "gender": "男", "年龄": "18", "grade_class": "11303070124", "telephone": "18875082742"},
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
            dataIndex: 'grade_class',
            key: 'grade_class',
        },
        {
            title: '联系方式',
            dataIndex: 'telephone',
            key: 'telephone',
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
                                to={`/add-member`}>
                                编辑成员
                            </Link>｜
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`/add-member`}>
                                删除成员
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
                }, {
                    type: 'selectSearch',
                    label: '性别',
                    name: 'gender',
                    initialValue: '',
                    searchOnChange: true,
                    labelWidth: 40,
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

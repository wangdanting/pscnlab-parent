import React, { Component } from 'react';
import { Tabs, Table, Col, Button, DatePicker, TimePicker, } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

class Recruit extends BaseComponent {
    state = {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        recruitData: [
            {
                uuidTrain: 1,
                post: '学生(前端开发)',
                number: 1,
                condition: '1.长的好看；2.长的好看；2.长的好看；2.长的好看；2.长的好看；2.长的好看；2.长的好看；',
                responseName: '王丹婷',
                telephone: '18875082742',
            }, {
                uuidTrain: 2,
                post: '学生(java开发)',
                number: 1,
                condition: '1.长的好看；2.长的好看；2.长的好看；2.长的好看；2.长的好看；2.长的好看；2.长的好看；',
                responseName: '王丹婷',
                telephone: '18875082742',
            },
        ],
    };

    columns = [
        {
            title: '招聘岗位',
            dataIndex: 'post',
            key: 'post',
            width: 150,
        }, {
            title: '招聘人数',
            dataIndex: 'number',
            key: 'number',
            width: 100,
        }, {
            title: '招聘条件',
            dataIndex: 'condition',
            key: 'condition',
            width: 500,
        }, {
            title: '负责人',
            dataIndex: 'responseName',
            key: 'responseName',
            width: 100,
        }, {
            title: '联系电话',
            dataIndex: 'telephone',
            key: 'telephone',
            width: 150,
        }, {
            title: '操作',
            dataIndex: 'uuidTrain',
            key: 'uuidTrain',
            width: 200,
            render(text) {
                return (
                    <span>
                        <Link
                            style={{color: '#57c5f7'}}
                            activeStyle={{color: 'red'}}
                            to={`recruit/modify-recruit/${text}`}>
                            编辑
                        </Link>｜
                        <Button>删除</Button>
                    </span>
                );
            },
        }];

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
            recruitData} = this.state;

        const queryTermsOptions = {
            showSearchBtn: true,
            onSubmit: (data) => {
                let queryData = Object.assign({}, this.state.queryData, data, {currentPage: 1});
                this.setState({
                    queryData,
                });
                this.handleSearch(queryData);
            },
            onComplete: (data) => {
                let queryData = Object.assign({}, this.state.queryData, data, {currentPage: 1});
                this.setState({
                    queryData,
                    loadFilter: false,
                });
                this.handleSearch(queryData);
            },
            items: [
                [
                    {
                        type: 'selectSearch',
                        name: 'post',
                        format: 'yyyy-MM-dd',
                        fieldWidth: 300,
                        label: '岗位',
                        initialValue: '',
                        searchOnChange: true,
                        labelWidth: 40,
                    }
                ],
            ],
        };

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
                    to={`/recruit/add-recruit`}>
                    <Button type="primary" size="large" style={{marginBottom: 16}}>新增招聘</Button>
                </Link>
                <Col>
                    <QueryTerms options={queryTermsOptions}/>
                </Col>
                <Table
                    columns={this.columns}
                    dataSource={recruitData}
                    pagination={false} bordered={true}
                    style={{marginBottom: 15}}
                    rowKey={(record, index) => index}
                    loading={this.state.isLoading}/>
                <PaginationComponent options={paginationOptions}/>
            </Page>
        );
    }
}
export default Recruit;

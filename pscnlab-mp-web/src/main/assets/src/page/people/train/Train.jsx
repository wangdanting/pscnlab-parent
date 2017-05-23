import React, { Component } from 'react';
import { Tabs, Table, Col, Button, DatePicker, TimePicker, } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

class Train extends BaseComponent {
    state = {

        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        columns: [{
            title: '培训信息',
            dataIndex: 'train',
            width: 400,
            render(text) {
                return (
                    <div style={{maxWidth: 300}}>
                        <h3 style={{marginBottom: 10}}>{text.name}</h3>
                        <span>主讲人:&nbsp;&nbsp;{text.phone || '暂无'}</span><br/>
                        <span>联系电话:&nbsp;&nbsp;{text.showFullAddr || '暂无'}</span><br/>
                        <span>地址:&nbsp;&nbsp;{text.manager || '暂无'}</span><br/>
                        <span>时间:&nbsp;&nbsp;{text.createrName || '暂无'}&nbsp;&nbsp;{text.createDateTime || '暂无'}</span><br/>
                        <span>预计参加人数:&nbsp;&nbsp;{text.manager || '暂无'}</span><br/>
                    </div>

                );
            },
        }, {
            title: '业务平台',
            dataIndex: 'storeBusinesses',
            width: 800,
            render(text) {
                let businessCard = text.map((item, index) => {
                    return <BusinessCard business={item} key={index}/>;
                });
                return <div>{businessCard}</div>;
            },
        }, {
            title: '操作',
            dataIndex: 'operate',
            width: 100,
            render(text) {
                return (
                    <span>
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`/m/${Common.getMerchantID.byUrl()}/store-modify/${text.id}`}>
                                管理门店
                            </Link>
                        </span>
                );
            },
        }],
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
                        type: 'date',
                        name: 'date',
                        format: 'yyyy-MM-dd',
                        fieldWidth: 300,
                        label: '时间',
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
                    to={`/role/add-train`}>
                    <Button type="primary" size="large" style={{marginBottom: 16}}>新增项目</Button>
                </Link>
                <Col>
                    <QueryTerms options={queryTermsOptions}/>
                </Col>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    pagination={false} bordered={true}
                    showHeader={false}
                    style={{marginBottom: 15}}
                    loading={this.state.isLoading}/>
                <PaginationComponent options={paginationOptions}/>
            </Page>
        );
    }
}
export default Train;

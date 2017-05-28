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
        trainData: [
            {
                uuidTrain: 1,
                trainInfo: {
                    title: '牛逼的前端开发',
                    speaker: '王丹婷',
                    time: '2015-03-04 17:00',
                    place: '虎门硝烟',
                    number: 40,
                },
                trainPeople: [
                    {
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    }
                ],
            },{
                uuidTrain: 2,
                trainInfo: {
                    title: '牛逼的前端开发',
                    speaker: '王丹婷',
                    time: '2015-03-04 17:00',
                    place: '虎门硝烟',
                    number: 40,
                },
                trainPeople: [
                    {
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '李四',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '李四',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '李四',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },{
                        name: '张三',
                        telPhone: '18875082742'
                    },
                ],
            }
        ],
    };

    columns = [
        {
            title: '培训信息',
            dataIndex: 'trainInfo',
            key: 'trainInfo',
            width: 300,
            render(text) {
                return (
                    <div style={{maxWidth: 300}}>
                    <h3 style={{marginBottom: 10}}>{text.title}</h3>
                    <span>主讲人:&nbsp;&nbsp;{text.speaker || '暂无'}</span><br/>
                    <span>联系电话:&nbsp;&nbsp;{text.speaker_telPhone || '暂无'}</span><br/>
                    <span>地址:&nbsp;&nbsp;{text.place || '暂无'}</span><br/>
                    <span>时间:&nbsp;&nbsp;{text.time || '暂无'}</span><br/>
                    <span>预计参加人数:&nbsp;&nbsp;{text.number || '暂无'}</span><br/>
                    </div>

                );
            },
        }, {
            title: '参加人员',
            dataIndex: 'trainPeople',
            key: 'trainPeople',
            width: 700,
            render(text) {
                let trainPeople = text.map((item, index) => {
                    return (<span>{item.name}&nbsp;&nbsp;{item.telPhone}&nbsp;&nbsp;&nbsp;&nbsp;</span>);
                });
                return <div>{trainPeople}</div>;
            },
        }, {
            title: '操作',
            dataIndex: 'uuidTrain',
            key: 'uuidTrain',
            width: 300,
            render(text) {
                return (
                    <span>
                        <Link
                            style={{color: '#57c5f7'}}
                            activeStyle={{color: 'red'}}
                            to={`train/modify-train/${text}`}>
                            编辑培训
                        </Link>｜
                        <Button>参加培训</Button>｜
                        <Button>退出培训</Button>｜
                        <Button>删除培训</Button>
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
            trainData} = this.state;

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
                    to={`/train/add-train`}>
                    <Button type="primary" size="large" style={{marginBottom: 16}}>新增培训</Button>
                </Link>
                <Col>
                    <QueryTerms options={queryTermsOptions}/>
                </Col>
                <Table
                    columns={this.columns}
                    dataSource={trainData}
                    pagination={false} bordered={true}
                    showHeader={false}
                    style={{marginBottom: 15}}
                    rowKey={(record, index) => index}
                    loading={this.state.isLoading}/>
                <PaginationComponent options={paginationOptions}/>
            </Page>
        );
    }
}
export default Train;

import React, { Component } from 'react';
import { Tabs, Table, Col, Button, DatePicker, TimePicker, Modal, message} from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';
import {Common} from 'common';

const confirm = Modal.confirm;
const manage = Common.getMerchant().manage;

class Train extends BaseComponent {
    state = {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        trainData: [],

        isInTrianMember: false, //是否参加培训
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
                    <span>联系电话:&nbsp;&nbsp;{text.speakerTelPhone || '暂无'}</span><br/>
                    <span>地址:&nbsp;&nbsp;{text.place || '暂无'}</span><br/>
                    <span>时间:&nbsp;&nbsp;{text.time || '暂无'}</span><br/>
                    <span>预计参加人数:&nbsp;&nbsp;{text.number || '暂无'}</span><br/>
                    </div>

                );
            },
        }, {
            title: '参加人员',
            dataIndex: 'members',
            key: 'members',
            width: 700,
            render(text) {
                let trainPeople = text.map((item, index) => {
                    return (<span>{item.name}&nbsp;{item.telephone}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>);
                });
                return <div>{trainPeople}</div>;
            },
        }, {
            title: '操作',
            dataIndex: 'oprate1',
            key: 'oprate1',
            width: 300,
            render:(text) => {
                return (
                    <span>
                        <a style={{display: text.isInTrainMember? 'none' : 'inline'}}>
                            <span onClick={()=> this.joinTrain(text.uuidTrain)}>参加培训</span>
                        </a>
                        <a style={{display: text.isInTrainMember? 'inline' : 'none'}}>
                            <span onClick={()=> this.dropOutTrain(text.uuidTrain)}>退出培训</span>
                        </a>
                    </span>
                );
            },

        }, {
            title: '加入操作',
            dataIndex: 'oprate2',
            key: 'oprate2',
            width: 300,
            render:(text) => {
                return (
                    <span>
                        <span style={{display: (manage?'none': 'inline')}}>
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`train/modify-train/${text.uuidTrain}`}>
                                编辑培训
                            </Link>｜
                            <a>
                                <span onClick={()=> this.showDeleteConfirm(text.uuidTrain)}>删除培训</span>
                            </a>
                        </span>
                    </span>
                );
            },
        }];

    //确认删除角色对话框
    showDeleteConfirm(id) {
        confirm({
            title: '你确定要删除该培训信息？',
            content: '注意！注意',
            onOk:() => {
                const {pageSize, currentPage} = this.state;
                const params = {
                    pageSize,
                    currentPage,
                };

                this.request()
                    .noStoreId()
                    .del(`/train/id/${id}/deletes.json`)
                    .success((data, res) => {
                        message.success('删除成功', 1);
                        this.initTableData(params);
                    })
                    .end();
            },
            onCancel() {},
        })
    };

    //参加培训
    joinTrain(id) {
        const {pageSize, currentPage} = this.state;
        const params = {
            pageSize,
            currentPage,
        };

        this.request()
            .noStoreId()
            .post(`/train/id/${id}/add_members.json?memberUUId=${Common.getMerchant().uuidMember}`)
            .success((data, res) => {
                message.success('加入培训成功', 1);
                this.initTableData(params);
            })
            .end();
    };

    dropOutTrain(id) {
        const {pageSize, currentPage} = this.state;
        const params = {
            pageSize,
            currentPage,
        };

        this.request()
            .noStoreId()
            .post(`/train/id/${id}/delete_members.json?memberUUId=${Common.getMerchant().uuidMember}`)
            .success((data, res) => {
                message.success('退出培训成功', 1);
                this.initTableData(params);
            })
            .end();

    }


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
        const time = '';
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/train/lists.json?size=${size}&offset=${offset}&time=${time}&memberUUId=${Common.getMerchant().uuidMember}`)
            .success((data, res) => {
                console.log('成功了');
                console.log(data);
                this.setState({
                    trainData: data.map ((item) => {
                        item.trainInfo = {
                            title: item.train.title,
                            speaker: item.train.speaker,
                            telephone: item.train.telephone,
                            place: item.train.place,
                            time: item.train.time,
                            number: item.train.number,
                        };
                        item.oprate1 = {
                            uuidTrain: item.train.uuidTrain,
                            isInTrainMember: item.isInTrainMember
                        };
                        item.oprate2 = {
                            uuidTrain: item.train.uuidTrain,
                            isInTrainMember: item.isInTrainMember
                        };
                        return item;
                    }),
                    totalCount: res.body.totalCount,
                });

            })
            .end();
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
                    style={{color: 'white', display: (manage?'none': 'block')}}
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

import React, { Component } from 'react';
import { Tabs, Table, Col, Button, } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

class Project extends BaseComponent {
    state = {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        projectData: [
            {
                uuidProject: 1,
                projectInfo: {
                    title: '心理学网站',
                    state: '执行中',
                    responseName: '王丹婷',
                    responseTelephone: '18875082742',
                    time: '2017-03-03 － 2017-03-04'
                },
                demand: '1.skhkshgkshgkshgk; 2.sgshgsdsdhsjkdf',
                attention: '1.skhkshgkshgkshgk; 2.sgshgsdsdhsjkdf',
                member: [
                    {
                        position: '产品',
                        name: ['陈钊', '王五']
                    },{
                        position: '前端',
                        name: ['陈钊', '王五']
                    },
                ]
            }, {
                uuidProject: 2,
                projectInfo: {
                    title: '心理学网2',
                    state: '执行中',
                    responseName: '王丹婷',
                    responseTelephone: '18875082742',
                    time: '2017-03-03 － 2017-03-04'
                },
                demand: '1.skhkshgkshgkshgk; 2.sgshgsdsdhsjkdf',
                attention: '1.skhkshgkshgkshgk; 2.sgshgsdsdhsjkdf',
                member: [
                    {
                        position: '产品',
                        name: ['陈钊', '王五']
                    },{
                        position: '前端',
                        name: ['陈钊', '王五']
                    },
                ]
            }
        ],
    };

    columns = [
        {
            title: '项目信息',
            dataIndex: 'projectInfo',
            key: 'projectInfo',
            width: 300,
            render(text) {
                return (
                    <div style={{maxWidth: 300}}>
                        <h3 style={{marginBottom: 10}}>{text.title}</h3>
                        <span>状态:&nbsp;&nbsp;{text.state || '暂无'}</span><br/>
                        <span>负责人:&nbsp;&nbsp;{text.responseName || '暂无'}</span><br/>
                        <span>负责人联系电话:&nbsp;&nbsp;{text.responseTelephone || '暂无'}</span><br/>
                        <span>预计时间:&nbsp;&nbsp;{text.time || '暂无'}</span><br/>
                    </div>

                );
            },
        }, {
            title: '项目需求',
            dataIndex: 'demand',
            key: 'demand',
            width: 400,
        }, {
            title: '注意事项',
            dataIndex: 'attention',
            key: 'attention',
            width: 400,
        }, {
            title: '项目成员',
            dataIndex: 'member',
            key: 'member',
            width: 250,
            render(text) {
                let projectPeople = text.map((item, index) => {
                    return (<span>{item.position}&nbsp;&nbsp;{item.name}&nbsp;&nbsp;&nbsp;&nbsp;</span>);
                });
                return <div>{projectPeople}</div>;
            },
        }, {
            title: '操作',
            dataIndex: 'uuidProject',
            key: 'uuidProject',
            width: 250,
            render(text) {
                return (
                    <span>
                        <Link
                            style={{color: '#57c5f7'}}
                            activeStyle={{color: 'red'}}
                            to={`project/modify-project/${text}`}>
                            编辑项目
                        </Link>｜
                        <Link
                            style={{color: '#57c5f7'}}
                            activeStyle={{color: 'red'}}
                            to={`project/add-member/${text}`}>
                            编辑成员
                        </Link>｜
                        <Button>删除项目</Button>｜
                        <Button>编辑进度</Button>
                    </span>
                );
            },
        }
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
            projectData} = this.state;

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
                        name: '项目状态',
                        fieldWidth: 300,
                        label: '项目状态',
                        initialValue: '',
                        searchOnChange: true,
                        labelWidth: 70,
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
                    to={`/project/add-project`}>
                    <Button type="primary" size="large" style={{marginBottom: 16}}>新增项目</Button>
                </Link>
                <Col>
                    <QueryTerms options={queryTermsOptions}/>
                </Col>
                <Table
                    columns={this.columns}
                    dataSource={projectData}
                    pagination={false} bordered={true}
                    style={{marginBottom: 15}}
                    rowKey={(record, index) => index}
                    loading={this.state.isLoading}/>
                <PaginationComponent options={paginationOptions}/>
            </Page>
        );
    }
}
export default Project;

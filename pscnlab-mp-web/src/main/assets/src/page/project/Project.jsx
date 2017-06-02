import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Modal, message } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';
import {Common} from 'common';

const confirm = Modal.confirm;
const manage = Common.getMerchant().manage;

class Project extends BaseComponent {
    state = {
        //分页
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,

        projectData: [],
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
                        <span>负责人:&nbsp;&nbsp;{text.responsiblePersonName || '暂无'}</span><br/>
                        <span>负责人联系电话:&nbsp;&nbsp;{text.responsiblePersonTelephone || '暂无'}</span><br/>
                        <span>预计时间:&nbsp;&nbsp;{text.startTime}-{text.startEnd}</span><br/>
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
            dataIndex: 'projectPepoles',
            key: 'projectPepoles',
            width: 250,
            render(text) {
                let projectPeople = text.map((item, index) => {
                    return (<span>{item.position}&nbsp;&nbsp;{item.memberName}&nbsp;&nbsp;&nbsp;&nbsp;<br/></span>);
                });
                return <div>{projectPeople}</div>;
            },
        }, {
            title: '操作',
            dataIndex: 'uuid',
            key: 'uuid',
            width: 250,
            render:(text) => {
                return (
                    <span>
                        <span style={{display: (manage?'none': 'block')}}>
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
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`project/all-progress/${text}`}>
                                查看总进度
                            </Link>｜
                             <a>
                                 <span onClick={()=>this.showDeleteConfirm(text)}>删除项目</span>
                             </a>｜
                                <Link
                                    style={{color: '#57c5f7'}}
                                    activeStyle={{color: 'red'}}
                                    to={`project/one-progress/${text}`}>
                                    编辑进度
                                </Link>
                        </span>
                    </span>
                );
            },
        },
        // {
        //     title: '编辑进度',
        //     dataIndex: 'isInProject',
        //     key: 'isInProject',
        //     width: 250,
        //     render:(text) => {
        //         console.log(text, 'text');
        //         // {/*<span style={{display: (text?'block': 'none')}}>*/}
        //         return (
        //
        //         );
        //     },
        // }
    ];

    //确认删除角色对话框
    showDeleteConfirm(id) {
        confirm({
            title: '你确定要删除该项目信息？',
            content: '注意，注意啦',
            onOk:() => {
                const {pageSize, currentPage} = this.state;
                const params = {
                    pageSize,
                    currentPage,
                };
                this.request()
                    .noStoreId()
                    .del(`/project/id/${id}/deletes.json`)
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

        // this.request()
        //     .noMchId()
        //     .noStoreId()
        //     .get(`/project/lists.json?state=${state}&offset=${offset}&size=${size}`)
        //     .success((data, res) => {
        //         console.log("成功了");
        //         console.log(data, 'data33');
        //         this.setState({
        //
        //         });
        //     })
        //     .end();

    }


    initTableData = (params) => {
        const size = params.pageSize;
        const offset = (params.currentPage - 1) * size;
        const state = '';
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/project/lists.json?state=${state}&offset=${offset}&size=${size}`)
            .success((data, res) => {
            console.log("成功了");
            console.log(data, 'data33');
                this.setState({
                    projectData: data.map((item, index) => {
                        item.projectInfo = {
                            title: item.title,
                            state: item.state,
                            responsiblePersonName: item.responsiblePersonName,
                            responsiblePersonTelephone: item.responsiblePersonTelephone,
                            startEnd: item.startEnd,
                            startTime: item.startTime,
                        };
                        return item;
                    }),
                    totalCount: res.body.totalCount,
                });
            })
            .end();
    };

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

        // this.request()
        //     .noStoreId()
        //     .get('/refunds.json')
        //     .params(sendData)
        //     .success((data, res) => {
        //         this.setState({
        //             refundDataList: res.body.results || [],
        //             refundDataTotal: res.body.totalCount || 0,
        //         });
        //     })
        //     .end();
    }

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

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
        pageSize: 5,
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
                        <span>预计时间:&nbsp;&nbsp;{text.startTime} - {text.startEnd}</span><br/>
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
                if(text) {
                    let projectPeople = text.map((item, index) => {
                        return (<span>{item.position}&nbsp;&nbsp;{item.memberName}&nbsp;&nbsp;&nbsp;&nbsp;<br/></span>);
                    });
                    return <div>{projectPeople}</div>;
                }
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
                            <a>
                                 <span onClick={()=>this.showDeleteConfirm(text)}>删除项目</span>
                             </a>｜
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`project/add-member/${text}`}>
                                编辑成员
                            </Link>
                        </span>
                    </span>
                );
            },
        },
        {
            title: '进度',
            dataIndex: 'uuid2',
            key: 'uuid2',
            width: 250,
            render:(text) => {
                return (
                    <span>
                         <Link
                             style={{color: '#57c5f7'}}
                             activeStyle={{color: 'red'}}
                             to={`project/all-progress/${text}`}>
                                查看总进度
                            </Link>｜
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`project/one-progress/${text}`}>
                                编辑进度
                            </Link>
                    </span>
                );
            },
        }
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
                        item.uuid2 = item.uuid;
                        return item;
                    }),
                    totalCount: res.body.totalCount,
                });
            })
            .end();
    };

    // 查询数据
    handleSearch(data, currentPage) {

        let currentPagee = currentPage.currentPage;
        let pageSizee = this.state.pageSize;

        let offset = (currentPagee - 1) * (pageSizee);
        let size = pageSizee;

        this.request()
            .noStoreId()
            .get(`/project/lists.json?state=${data.project}&offset=${offset}&size=${size}`)
            .success((data, res) => {
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
                        item.uuid2 = item.uuid;
                        return item;
                    }),
                    totalCount: res.body.totalCount,
                });
            })
            .end();
    }

    queryTermsOptions = {
        showSearchBtn: true,
        resultDateToString: true,
        onSubmit: (data) => {
            this.handleSearch(data, {currentPage: 1});
        },
        items: [
            {
                type: 'select',
                label: '项目状态',
                name: 'project',
                initialValue: '',
                searchOnChange: false,
                labelWidth: 60,
                options: [
                    {
                        value: '未开始',
                        label: '未开始',
                        checked: true
                    }, {
                        value: '执行中',
                        label: '执行中'
                    }, {
                        value: '已完成',
                        label: '已完成'
                    }
                ]
            }
        ]
    };

    render() {
        let {
            pageSize,
            currentPage,
            totalCount,
            projectData} = this.state;

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
                    style={{color: 'white', display: (manage?'none': 'block')}}
                    activeStyle={{color: 'red'}}
                    to={`/project/add-project`}>
                    <Button type="primary" size="large" style={{marginBottom: 16}}>新增项目</Button>
                </Link>
                <Col>
                    <QueryTerms options={this.queryTermsOptions}/>
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

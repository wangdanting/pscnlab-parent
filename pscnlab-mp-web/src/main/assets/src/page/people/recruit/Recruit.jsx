import React, { Component } from 'react';
import { Tabs, Table, Col, Button, DatePicker, TimePicker, Modal, message} from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

const confirm = Modal.confirm;

class Recruit extends BaseComponent {
    state = {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        recruitData: [],
        roleList:[],
    };

    columns = [
        {
            title: '招聘岗位',
            dataIndex: 'position',
            key: 'position',
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
            dataIndex: 'responsePerson',
            key: 'responsePerson',
            width: 100,
        }, {
            title: '联系电话',
            dataIndex: 'telephone',
            key: 'telephone',
            width: 150,
        }, {
            title: '操作',
            dataIndex: 'uuid',
            key: 'uuid',
            width: 200,
            render:(text) => {
                return (
                    <span>
                        <Link
                            style={{color: '#57c5f7'}}
                            activeStyle={{color: 'red'}}
                            to={`recruit/modify-recruit/${text}`}>
                            编辑
                        </Link>｜
                        <a>
                            <span onClick={()=>this.showDeleteConfirm(text)}>删除角色</span>
                        </a>
                    </span>
                );
            },
        }];

    //确认删除角色对话框
    showDeleteConfirm(id) {
        confirm({
            title: '你确定要删除该招聘信息？',
            content: '注意！注意！',
            onOk:() => {
                const {pageSize, currentPage} = this.state;
                const params = {
                    pageSize,
                    currentPage,
                };

                this.request()
                    .noStoreId()
                    .post(`/recruit/id/${id}/deletes.json`)
                    .success((data, res) => {
                        message.success('删除成功', 1);
                        this.initTableData(params);
                    })
                    .end();
            },
            onCancel() {},
        })
    };

    // 查询数据
    handleSearch(data, currentPage)  {
        console.log(data, 'data');

        let currentPagee = currentPage.currentPage;
        let pageSizee = this.state.pageSize;

        let offset = (currentPagee - 1) * (pageSizee);
        let size = pageSizee;

        this.request()
            .noStoreId()
            .get(`/recruit/lists.json?position=${data.uuidRole}&size=${size}&offset=${offset}`)
            .success((data, res) => {
                this.setState({
                    recruitData: data,
                    totalCount: res.body.totalCount,
                });
            })
            .end();
    }

    queryTermsOptions = {
        showSearchBtn: true,
        resultDateToString: true,
        getAllOptions: (callBack) => {
            this.request()
                .noMchId()
                .noStoreId()
                .get('/role/lists.json')
                .success((data, res) => {
                    this.setState({
                        roleList: data.map((item, index) => {
                            item.value = `${item.role}(${item.position})`;
                            item.label = `${item.role}(${item.position})`;
                            if(index == 0) {
                                item.checked = true;
                            }
                            return item;
                        })
                    });
                })
                .end();

            setTimeout(() => {
                let allRoleOptions =  this.state.roleList;
                callBack({uuidRole: allRoleOptions});
            }, 1000);
        },
        onSubmit: (data) => {
            this.handleSearch(data, {currentPage: 1});
        },
        items: [
            {
                type: 'select',
                label: '角色',
                name: 'uuidRole',
                initialValue: '',
                searchOnChange: false,
                labelWidth: 40,
            },
        ],
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
        const position = '';

        this.request()
            .noMchId()
            .noStoreId()
            .get(`/recruit/lists.json?size=${size}&position=${position}&offset=${offset}`)
            .success((data, res) => {
                this.setState({
                    recruitData: data,
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
            recruitData} = this.state;

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
                    <QueryTerms options={this.queryTermsOptions}/>
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

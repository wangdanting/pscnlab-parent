import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Modal } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';

const confirm = Modal.confirm;

class Role extends BaseComponent {
    state = {
        dataSource: [],
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
            dataIndex: 'uuidRole',
            key: 'uuidRole',
            render(text) {
                return (
                    <span>
                            <Link
                                style={{color: '#57c5f7'}}
                                activeStyle={{color: 'red'}}
                                to={`role/modify-role/${text}`}>
                                编辑角色
                            </Link>｜
                            <Button onClick={this.showDeleteConfirm(text)}>删除角色</Button>
                    </span>
                );
            }
            },
    ];

    //确认删除角色对话框
    showDeleteConfirm(id) {
        confirm({
            title: '你确定要删除该角色信息？',
            content: '注意：如果有成员绑定改角色，该角色将删除失败！',
            onOk() {
                console.log('444');
                this.request()
                    .noStoreId()
                    .get('/role/delete.json')
                    .params({id: id})
                    .success((data, res) => {
                        console.log('dddd44');
                    })
                    .end();
            },
            onCancel() {},
        })
    };

    // 查询数据
    handleSearch(queryData = this.state.queryData) {
        this.setState({
            refundDataList: [],
            refundDataTotal: 0,
        });


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

    componentDidMount() {
        this.initTableData();
    }

    initTableData = () => {
        this.setState({
        });
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/role.json`)
            .success((data, res) => {
                console.log(data, 'data');
                this.setState({
                    dataSource: data,
                });
            })
            .end();
    };

    render() {
        let {dataSource} = this.state;

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
            </Page>
        );
    }
}
export default Role;

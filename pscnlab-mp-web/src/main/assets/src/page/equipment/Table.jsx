import React, { Component } from 'react';
import { Tabs, Table, Col, Button, Modal } from 'antd';
import {Link} from 'react-router';
import { Page } from 'framework';
import {QueryTerms, PaginationComponent, BaseComponent} from 'component';
import './style.less';
import defeatHeadImg from './defeat-head.jpg';

const confirm = Modal.confirm;

class Tablew extends BaseComponent {
    state = {
        //分页
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,

        table: [],
    };

    //确认删除角色对话框
    showDeleteConfirm(id) {
        confirm({
            title: '你确定要删除该桌位信息？',
            content: '注意：如果有成员绑定改角色，该角色将删除失败！',
            onOk:() => {
                console.log('444');
                this.request()
                    .noStoreId()
                    .post(`/desk/id/${id}/delete_desks.json`)
                    .success((data, res) => {
                        console.log('dddd44');
                        const {pageSize, currentPage} = this.state;
                        const params = {
                            pageSize,
                            currentPage,
                        };
                        this.initTableData(params);

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
                    label: '桌位号',
                    name: 'num',
                    initialValue: '',
                    searchOnChange: true,
                    labelWidth: 50,
                }, {
                    type: 'selectSearch',
                    label: '名字',
                    name: 'name',
                    initialValue: '',
                    searchOnChange: true,
                    labelWidth: 40,
            },
            ],
        ];
        return storeQueryTerms;
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
        const tableNum = '';
        const userName = '';
        const state = '';
        this.request()
            .noMchId()
            .noStoreId()
            .get(`/desk/lists.json?tableNum=${tableNum}&userName=${userName}&state=${state}&size=${size}&offset=${offset}`)
            .success((data, res) => {
            console.log(data, '999');
                this.setState({
                    table: data,
                    totalCount: res.body.totalCount,
                });
            })
            .end();
    };

    getTables = (tables = this.state.table) => {
        return tables.map((value, index) => {
            return (
                <div className="table-list">
                    <div className="table-title">{value.num}</div>
                    <div className="table-body">
                        <div className="user-image">
                            <img src={defeatHeadImg}/>
                        </div>
                        <div className="user-info">
                            <p>{value.userName}</p>
                            <p>{value.userTelephone}</p>
                        </div>
                    </div>
                    <div className="table-footer">
                        <Link
                            style={{color: '#57c5f7'}}
                            activeStyle={{color: 'red'}}
                            to={`table/modify-table/${value.uuid}`}>
                            编辑
                        </Link>｜
                        <a>
                            <span onClick={()=>this.showDeleteConfirm(value.uuid)}>删除</span>
                        </a>
                    </div>
                </div>
            );
        });
    };

    render() {
        let {
            pageSize,
            currentPage,
            totalCount} = this.state;

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
                    to={`/table/add-table`}>
                    <Button type="primary" size="large" style={{marginBottom: 16}}>新增桌位</Button>
                </Link>
                <Col>
                    <QueryTerms options={this.queryTermsOptions}/>
                </Col>
                <div className="table-list-container">
                    {this.getTables(this.state.table)}
                </div>
                <PaginationComponent options={paginationOptions}/>
            </Page>
        );
    }
}
export default Tablew;

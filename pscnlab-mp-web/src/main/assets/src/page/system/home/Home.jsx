import './style.css';
import React from 'react';
import { Breadcrumb } from 'antd'
import { ajax, Page } from 'framework';

class BasePageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: false};
    }

    componentWillUnmount() {
        if (this.initReq) this.initReq.abort();//组件被移除DMO,清除未完成的ajax
    }

    initPage(url, initSuccess) {

    }

    componentDidMount() {
        //alert(11);
    }

}

class Home extends BasePageComponent {
    constructor(props) {
        super(props);
        //子类会继承父类的this对象。
        console.log('this.state', this.state);
    }

    componentDidMount() {
        if(super.componentDidMount)super.componentDidMount();
    }

    render() {
        let pageHeader =
            <div>
                <h1 className="admin-page-header-title">首页</h1>
                <Breadcrumb>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                </Breadcrumb>
            </div>;
        return (
            <Page header={pageHeader} loading={this.state.loading}>
                <h5>首页内容尽请期待,请点击品牌或选择门店</h5>
            </Page>
        );
    }
}

export default Home;

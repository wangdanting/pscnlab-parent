import React from 'react';
import { Page } from 'framework';
class NewMail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            /*
             * 修改loading,并以props方式传给Page组件，页面即可切换loading非loading状态。
             * */
            loading: false
        }
    }
    componentDidMount() {
    }
    render() {
        const pageHeader = {
            title: '修改个人信息',
            breadcrumbItems: [
                {text: '修改个人信息'}
            ]
        };

        return (
            <Page header={pageHeader} loading={this.state.loading}>
                <h5>修改个人信息</h5>
            </Page>
        );
    }
}

export default NewMail;

import React from 'react';
import { Page } from 'framework';
class NewMail extends React.Component{
    constructor(props){
        super(props);
        return {
            /*
             * 修改loading,并以props方式传给Page组件，页面即可切换loading非loading状态。
             * */
            loading: false
        }
    }
    componentDidMount() {
    }
    render() {
        return (
            <Page header='auto' loading={this.state.loading}>
                <h5>新邮件</h5>
            </Page>
        );
    }
}

export default NewMail;

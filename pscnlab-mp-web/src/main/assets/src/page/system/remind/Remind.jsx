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
        return (
            <Page header='auto' loading={this.state.loading}>
                <h5>我的提醒</h5>
            </Page>
        );
    }
}

export default NewMail;

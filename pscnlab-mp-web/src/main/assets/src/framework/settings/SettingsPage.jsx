import React from 'react';
import Page from '../page/Page';
import { Form, Checkbox} from 'antd';
import Settings from './Settings'
const FormItem = Form.Item;

class SettingsPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showPageAnimate: Settings.pageAnimate(),
            sidebarMenuAlwaysOpen: Settings.sidebarMenuAlwaysOpen()
        }
    }
    handleShowPageAnimate(e) {
        this.setState({
            showPageAnimate: !this.state.showPageAnimate
        });
        Settings.pageAnimate(!this.state.showPageAnimate);
    }
    handleSidebarMenuAlwaysOpen(e){
        this.setState({
            sidebarMenuAlwaysOpen: !this.state.sidebarMenuAlwaysOpen
        });
        Settings.sidebarMenuAlwaysOpen(!this.state.sidebarMenuAlwaysOpen);
    }
    componentDidMount() {

    }
    render() {
        const pageHeader = {
            title: '系统设置',
            breadcrumbItems: [
                {text: '系统设置'}
            ]
        };
        return (
            <Page header={pageHeader}>
                <Form horizontal>
                    <FormItem wrapperCol={{span: 6, offset: 1}}>
                        <label className="ant-checkbox-vertical" style={{cursor:'pointer'}}>
                            <Checkbox checked={this.state.showPageAnimate} onChange={this.handleShowPageAnimate.bind(this)}/>
                            启用页面切换动画
                        </label>
                    </FormItem>
                    <FormItem wrapperCol={{span: 6, offset: 1}}>
                        <label className="ant-checkbox-vertical"  style={{cursor:'pointer'}}>
                            <Checkbox checked={this.state.sidebarMenuAlwaysOpen} onChange={this.handleSidebarMenuAlwaysOpen.bind(this)}/>
                            左侧菜单始终为展开状态
                        </label>
                    </FormItem>
                </Form>
            </Page>
        );
    }
}

export default SettingsPage;

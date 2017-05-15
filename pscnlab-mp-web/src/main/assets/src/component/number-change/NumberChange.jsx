import React from 'react';
import { Button, message, Icon} from 'antd';
import request from  '../../common/request/request.jsx';
const ButtonGroup = Button.Group;
class NumberChange extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            number: 0
        }
    }
    componentDidMount() {

    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    onChange(e) {
        var returnData = e.target.value;

        this.setState({
            selected: e.target.value
        });

        this.props.changeData(returnData);
    }
    plusNumber(value) {
        // var returnData = value;
        // this.setState({
        //     selected: returnData
        // });

        // this.props.changeData(returnData);
        console.log(this.state.number)
    }
    addNumber() {

    }
    render() {
        const _this=this;
        this.state.data = this.props.data;

        return (
            <div style={{display: 'inline-block'}}>
                <ButtonGroup>
                    <Button onClick={this.plusNumber.bind(_this)} style={{paddingLeft: '8px'}} type="ghost">
                        <Icon type="minus" />
                    </Button>
                    <Button type="ghost">{this.state.number}</Button>
                    <Button onClick={this.addNumber.bind(_this)} style={{paddingRight: '8px'}} type="ghost">
                        <Icon type="plus" />
                    </Button>
                </ButtonGroup>
            </div>
        );
    }
}

export default NumberChange;

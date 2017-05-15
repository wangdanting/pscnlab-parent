import './style.less';
import React from 'react';
import {Row, Col, Icon} from 'antd';
import moment from 'moment';
import couponTopImg from './coupon-top.png';
class CouponPreview extends React.Component {
    state = {
        roleOpened: 'opened',
    };
    static defaultProps = {
        width: '400px',
        height: '200px',
    };
    static propTypes = {};
    handleRoleClick = () => {
        let roleOpened = 'opened';
        if (this.state.roleOpened === 'opened') {
            roleOpened = '';
        }
        this.setState({
            roleOpened,
        });
    };
    componentDidMount = () => {
        console.log(this.props.isOpend);
        if (this.props.isOpend === true) {
            this.setState({
                roleOpened: 'opened',
            });
        } else if (this.props.isOpend === false) {
            this.setState({
                roleOpened: '',
            });
        }
    };

    render() {
        let {sourceData, height, width} = this.props;
        let endDate = sourceData.endDate;
        const validTime = sourceData.validTime || 0;
        const discountWeight = sourceData.discountWeight || 'N';
        let useFloor = sourceData.useFloor;
        if (useFloor === 0) {
            useFloor = '下单后直接使用';
        } else {
            useFloor = `满${sourceData.useFloor || 'n'}可用`;
        }
        const couponTitle = sourceData.couponTitle || 'XXXXXXXXXXXXX';
        let expirationDate = 'xxxx-xx-xx';
        if (endDate) {
            expirationDate = moment(endDate).set('date', moment(endDate).get('date') + validTime).format('YYYY-MM-DD');
        }
        return (
            <div className="coupon-pre-view" style={{height: height, width: width}}>
                <div className="coupon" style={{backgroundImage: `url(${couponTopImg})`}}>
                    <Row>
                        <Col span="8" style={{borderRight: '1px solid #d9d9d9'}}>
                            <div className="money">
                                <span className="money-icon">￥</span>
                                <span className="money-number">{discountWeight}</span>
                            </div>
                            <div className="use-role">
                                {useFloor}
                            </div>
                        </Col>
                        <Col span="16">
                            <div className="view-content">
                                <div className="title">
                                    {couponTitle}
                                    <span>同享</span>
                                </div>
                                <div className="expire">
                                    有效期至：{expirationDate}
                                </div>
                                <div onClick={this.handleRoleClick} className={`role ${this.state.roleOpened}`}>
                                    优惠券使用规则&nbsp;&nbsp;
                                    <Icon type="down"/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className={`role-list ${this.state.roleOpened}`}>
                    <ul>
                        {sourceData.roles.map((v, i) => <li key={i}>{v}</li>)}
                    </ul>
                </div>
            </div>
        );
    }
}
export default CouponPreview;

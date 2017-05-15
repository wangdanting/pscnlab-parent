import React from 'react';
import CouponPreview from './CouponPreview.jsx';

class Demo extends React.Component {
    render() {
        let sourceData = {
            couponTitle: '优惠大酬宾',
            endDate: '2016-06-015',
            discountWeight: 45,
            validTime: 15,
            useFloor: 150,
            roles: [
                '规则一',
                '规则二',
                '规则三',
            ],
        };
        return (
            <div>
                <CouponPreview sourceData={sourceData} height="200" width="400" isOpend={true} />
            </div>
        );
    }
}
export default Demo;

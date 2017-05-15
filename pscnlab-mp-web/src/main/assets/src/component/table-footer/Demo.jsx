import React from 'react';
import TableFooter from './TableFooter.jsx';
import TableFooterDefaultContent from './TableFooterDefaultContent.jsx';

class Demo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const visible = true;
        const text ={
            key: '订单总额:',
            value: 1000
        };
        const extraHtml = <span>11111</span>;

        return (
            <TableFooter visible={visible}>
                <TableFooterDefaultContent data={text} />
            </TableFooter>
        )
    }
}

export default Demo;


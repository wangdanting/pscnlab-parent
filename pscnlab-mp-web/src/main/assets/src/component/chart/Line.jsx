import React, {Component} from 'react';
import Lodash from 'lodash';
import G2 from 'g2';

export default class Chart extends Component {
    defaultProps = {
        data: [],
        defs: {},
        chartQuery: {},
    }
    static propTypes = {
        data: React.PropTypes.array,
        defs: React.PropTypes.object,
        chartQuery: React.PropTypes.object,
    }
    componentDidMount() {
        const data = this.props.data;
        const defs = this.props.defs;

        if (data && data.length) {
            this.initChart(data, defs);
        } else {
            this.container.innerHTML = '<div class="marginbottom15 margintop15 text-center">暂无数据</div>'
        }
    }

    shouldComponentUpdate(nextProps) {
        return !Lodash.isEqual(this.props.data, nextProps.data);
    }

    componentDidUpdate() {
        const data = this.props.data;
        const defs = this.props.defs;

        if (data && data.length) {
            this.container.innerHTML = '';
            this.initChart(data, defs);
        } else {
            return (
                this.container.innerHTML = '<div class="marginbottom15 margintop15 text-center">暂无数据</div>'
            );
        }
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    initChart(data, defs) {
        const container = this.container;
        this.chart = new G2.Chart({
            container,
            forceFit: true,
            height: this.props.chartQuery.height,
            plotCfg: {
                margin: [20, 60, 100, 60],
            },
        });
        this.chart.legend({
            position: 'bottom',
        });
        this.chart.axis(this.props.chartQuery.axia, {
            formatter: (dimValue) => {
                return parseFloat(dimValue) >= 0 && parseInt(dimValue) == dimValue ? parseFloat(dimValue) : '';
            },
        });
        this.chart.source(data, defs);
        this.chart
            .line()
            .position(this.props.chartQuery.position)
            .color(this.props.chartQuery.colorkey, this.props.chartQuery.color)
            .size(2);
            //.tooltip(this.props.chartQuery.tooltip);
        this.chart.render();
    }
    render() {
        return (
            <div style={{height: this.props.chartQuery.height}} ref={(view) => this.container = view}></div>
        );
    }
}

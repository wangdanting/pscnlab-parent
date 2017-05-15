import React, {Component} from 'react';
import Lodash from 'lodash';
import G2 from 'g2';
G2.Global.colors.default = ['#f39800', '#00a0e9'];

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
                this.container.innerHTML = '<div class="marginbottom15 margintop15">暂无数据</div>'
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
            spacingY: 12,
        });
        this.chart.axis(this.props.chartQuery.axia, {
            formatter: (dimValue) => {
                return parseFloat(dimValue) >= 0 && parseInt(dimValue) == dimValue ? parseFloat(dimValue) : '';
            },
        });
        this.chart.on('tooltipchange', (ev) => {
            const items = ev.items;
            items.length === 4 ? items.splice(1, 0, {
                color: items[0].color,
                marker: 'circle',
                name: items[1].name,
                value: items[1].value,
            }, {
                color: items[0].color,
                marker: 'circle',
                name: items[2].name,
                value: items[2].value,
            }) : items;
        });
        this.chart.source(data, defs);
        this.chart
            .line()
            .position(this.props.chartQuery.position)
            .color(this.props.chartQuery.color)
            .size(2)
            .tooltip(this.props.chartQuery.tooltip);
        this.chart.render();
    }
    render() {
        return (
            <div ref={(view) => this.container = view}></div>
        );
    }
}

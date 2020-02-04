import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractComponent from './abstract-component';
import moment from 'moment';

const ChartSettings = {
  BAR_MIN: 130,
  BAR_HEIGHT: 65,
  BAR_THICKNESS: 40,
  BAR_MIN_LENGTH: 50,
  PADDING: 0,
  PADDING_LEFT: 100,
  BAR_PERCENTAGE: 0.9,
  FONT_SIZE: 12,
  FONT_SIZE_TITLE: 19,
  FONT_SIZE_LABELS: 12,
  FONT_COLOR: `#000000`,
  BACKGROUND_COLOR: `#ffffff`
};

Chart.defaults.global.defaultFontSize = ChartSettings.FONT_SIZE;
Chart.defaults.global.defaultFontColor = ChartSettings.FONT_COLOR;
Chart.defaults.global.layout.padding = {
  left: ChartSettings.PADDING_LEFT,
  right: ChartSettings.PADDING,
  top: ChartSettings.PADDING,
  bottom: ChartSettings.PADDING
};
Chart.defaults.global.legend.display = false;
Chart.defaults.global.title.display = true;
Chart.defaults.global.title.position = `left`;
Chart.defaults.horizontalBar.tooltips.mode = false;
Chart.scaleService.updateScaleDefaults(`linear`, {
  ticks: {
    min: 0
  }
});

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const ELEMENTS_MIN_COUNT = 2;

const setChartHeight = (ctx, elements, container, type, className) => {
  ctx.height = elements.length < ELEMENTS_MIN_COUNT ? ChartSettings.BAR_MIN : ChartSettings.BAR_HEIGHT * elements.length;
  container.querySelector(`.statistics__item--${className}`).height = ctx.height;
};

const getTypes = (points) => {
  return points
    .map((point) => point.type)
    .filter(getUniqItems);
};

const chartsData = (points) => ({
  money() {
    const calculateStats = (items, type) => items.reduce((acc, current) => {
      return acc += current.type === type ? current.price : 0;
    }, 0);

    return getTypes(points).map((type) => {
      return ({
        type,
        value: calculateStats(points, type)
      });
    }).sort((a, b) => b.value - a.value);
  },
  transport() {
    const calculateStats = (items, type) => items.filter((item) => item.type === type).length;

    return getTypes(points).map((type) => {
      return ({
        type,
        value: calculateStats(points, type)
      });
    }).sort((a, b) => b.value - a.value);
  },
  time() {
    const calculateStats = (items, type) => items
      .filter((item) => item.type === type)
      .reduce((acc, item) => {
        const startDateMoment = moment(item.date.start);
        const endDateMoment = moment(item.date.end);
        const duration = moment.duration(endDateMoment.diff(startDateMoment));

        acc += duration.asDays();
        return acc;
      }, 0);

    return getTypes(points).map((type) => {
      return ({
        type,
        value: Math.round(calculateStats(points, type))
      });
    }).sort((a, b) => b.value - a.value);
  }
});

const renderChart = (chartCtx, chartData, container, chartType, formatter, className) => {
  setChartHeight(chartCtx, chartData, container, chartType, className);

  return new Chart(chartCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartData.map((item) => item.type),
      datasets: [{
        data: chartData.map((item) => item.value),
        backgroundColor: ChartSettings.BACKGROUND_COLOR,
        hoverBackgroundColor: ChartSettings.BACKGROUND_COLOR,
        minBarLength: ChartSettings.BAR_MIN_LENGTH,
        barThickness: ChartSettings.BAR_THICKNESS
      }]
    },
    options: {
      plugins: {
        datalabels: {
          labels: {
            title: {
              color: ChartSettings.FONT_COLOR,
              anchor: `end`,
              align: `start`
            }
          },
          font: {
            size: ChartSettings.FONT_SIZE_LABELS
          },
          formatter,
          color: ChartSettings.FONT_COLOR
        }
      },
      scales: {
        offset: false,
        yAxes: [{
          gridLines: {
            display: false,
          },
        }],
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            display: false
          }
        }]
      },
      title: {
        text: chartType.toUpperCase(),
        fontSize: ChartSettings.FONT_SIZE_TITLE,
        fontColor: ChartSettings.FONT_COLOR
      },
      tooltips: {
        callbacks: {
          title() {},
          label() {}
        }
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics visually-hidden">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractComponent {
  constructor(points) {
    super();

    this._points = points;

    this._moneyChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();
    const points = this._points.getPoints();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderChart(moneyCtx, chartsData(points).money(), this._element, `money`, (value) => {
      return `€ ${value}`;
    }, `money`);
    this._transportChart = renderChart(transportCtx, chartsData(points).transport(), this._element, `transport`, (value) => {
      return `${value}x`;
    }, `transport`);
    this._timeChart = renderChart(timeCtx, chartsData(points).time(), this._element, `time`, (value) => {
      return `${value}D`;
    }, `time-spend`);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }
    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}

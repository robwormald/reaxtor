import jsong from 'falcor-json-graph';

const $ref = jsong.ref;
const $atom = jsong.atom;
const $error = jsong.error;
const $pathValue = jsong.pathValue;
const $pathInvalidation = jsong.pathInvalidation;

export function ChartRoutes({ title, series }) {
    var chartTitle = title || "";
    const chartSeries = series || [];
    return [{
        route: `chart.title`,
        get() {
            return [
                $pathValue(['chart', 'title'], $atom(chartTitle))
            ];
        },
        set({ chart: { title }}) {
            chartTitle = title;
            return [
                $pathValue(['chart', 'title'], $atom(chartTitle))
            ];
        }
    }, {
        route: `chart.series.length`,
        get() {
            const series = chartSeries;
            return [
                $pathValue(['chart', 'series', 'length'], $atom(series.length))
            ];
        }
    }, {
        route: `chart.series[{integers:seriesIndexes}]`,
        get({seriesIndexes}) {
            const series = chartSeries;
            return seriesIndexes.map((seriesIndex) => {
                return $pathValue(['chart', 'series', seriesIndex], series[seriesIndex]);
            });
        }
    }, {
        route: `chart.series.add`,
        call(callPath, [seriesPath]) {
            const series = chartSeries;
            const sIndex = series.length;
            const length = series.push($ref(seriesPath));
            return [
                $pathValue(['chart', 'series', sIndex], series[sIndex]),
                $pathValue(['chart', 'series', 'length'], $atom(length))
            ];
        }
    }, {
        route: `chart.series.remove`,
        call(callPath, [seriesIndex]) {
            const series = chartSeries;
            if (seriesIndex >= series.length) {
                throw new Error('No series exists at index ' + seriesIndex);
            }
            series.splice(seriesIndex, 1);
            return [
                $pathInvalidation(['chart', 'series'])
            ];
        }
    }];
}

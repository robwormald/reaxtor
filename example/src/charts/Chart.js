/** @jsx hJSX */
import { hJSX, Component } from './../../../';
import { SeriesList } from './../series/SeriesList';

export class Chart extends Component {
    createChildren(changes) {
        return changes.combineLatest(
            new SeriesList(changes.deref('series')));
    }
    getPaths() {
        return [
            ['title'],
            ['series', 'length']
        ];
    }
    render([{ json: { title }}, seriesList]) {
        return (
            <div className="chart">{[
                <h3>{ title }</h3>,
                seriesList
            ]}</div>
        );
    }
}

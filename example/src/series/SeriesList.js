/** @jsx hJSX */
import { Observable } from 'rxjs/Observable';
import { hJSX, List } from './../../../';
import { SeriesItem } from './SeriesItem';

export class SeriesList extends List {
    getItemRenderer() {
        return SeriesItem;
    }
    getPaths() {
        return [
            ['title'], ['values']
        ];
    }
    render([{ json }, seriesItems]) {
        return (
            <div className="series">
                <ul className="series-list">{
                    seriesItems
                }</ul>
            </div>
        );
    }
}

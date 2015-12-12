/** @jsx hJSX */
import { Observable } from 'rxjs/Observable';
import { hJSX, Component } from './../../../';
import { SeriesList } from './../series/SeriesList';

export class SectionItem extends Component {
    createChildren(changes) {
        return changes.combineLatest(
            new SeriesList(changes.deref('series')));
    }
    getPaths() {
        return [
            ['title'], ['series', 'length']
        ];
    }
    render([{ json: { title }}, seriesList]) {
        return (
            <li className="section">{[
                <h3>Section: { title }</h3>,
                seriesList
            ]}</li>
        );
    }
}

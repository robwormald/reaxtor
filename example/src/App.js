/** @jsx hJSX */
import { hJSX, Component } from './../../';
import { Chart } from './charts/Chart';
import { SectionList } from './sections/SectionList';

export class App extends Component {
    createChildren(changes) {
        return changes.combineLatest(
            new Chart(changes.deref('chart')),
            new SectionList(changes.deref('sections'))
        );
    }
    getPaths() {
        return [
            ['chart', 'title'],
            ['chart', 'series', 'length'],
            ['sections', 'length']
        ];
    }
    render([{ json }, chartList, sectionList]) {
        return (
            <div className="application">{[
                chartList, sectionList,
                <div className="background-glass"/>
            ]}</div>
        );
    }
}

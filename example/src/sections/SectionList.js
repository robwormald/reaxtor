/** @jsx hJSX */
import { hJSX, List } from './../../../';
import { SectionItem } from './SectionItem';

export class SectionList extends List {
    getItemRenderer() {
        return SectionItem;
    }
    getPaths() {
        return [
            ['title'], ['series', 'length']
        ];
    }
    render([{ json }, sectionItems]) {
        return (
            <div className="sections">
                <h3>Sections</h3>
                <ul className="sections-list">{
                    sectionItems
                }</ul>
            </div>
        );
    }
}

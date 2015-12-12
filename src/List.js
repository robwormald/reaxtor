import { Component } from './Component';
import { Observable } from 'rxjs/Observable';

export class List extends Component {
    createChildren(changes) {
        return changes.combineLatest(
            observeListItems(changes, this.getItemRenderer()));
    }
    load(update) {
        const { model } = update;
        const suffixes = this.getPaths(update);
        if (suffixes.length === 0) {
            return Observable.empty();
        }
        return model.getValue(['length']).mergeMap((length) => {
            let paths = [['length']];
            if (length > 0) {
                paths = paths.concat(suffixes.map(x => [{length}].concat(x)));
            }
            return model.get(... paths);
        });
    }
    getItemRenderer() {
        return Component;
    }
}

function observeListItems(changes, ItemRenderer) {
    return groupListItems(changes)
        .mergeScan(renderListItems(ItemRenderer), [])
        .startWith([]);
}

function groupListItems(changes) {
    return changes
        .mergeMap(derefListItems)
        .groupBy(indexAsKey, identity,
            createDurationSelector(changes));
}

function renderListItems(itemRenderer) {
    return function renderListItem(children, group) {
        return new itemRenderer(group)
            .map((vdom) => {
                children[group.key] = vdom;
                return children;
            })
            .concat(Observable.defer(_ => {
                children.splice(group.key, 1);
                return Observable.of(children);
            }));
    }
}

function derefListItems({ model, json }) {
    let index = -1;
    const count = json.length;
    const items = new Array(count);
    while (++index < count) {
        const item = json[index];
        items[index] = {
            index, json: item,
            model: model.deref(item)
        };
    }
    return items;
}

function identity(x) {
    return x;
}

function indexAsKey({ index }) {
    return index;
}

function createDurationSelector(changes) {
    return function createGroupDuration(models) {
        return Observable.merge(
            models.first(invalidModel),
            models.switchMap(({ index }) =>
                changes.first(({ json: length }) =>
                    index >= length))
        );
    }
}

function invalidModel({ model }) {
    return !model._referenceContainer;
}

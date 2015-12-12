import { Changes } from './Changes';
import { tryCatch } from 'rxjs/util/tryCatch';
import { isPromise } from 'rxjs/util/isPromise';
import { SymbolShim } from 'rxjs/util/SymbolShim';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import { errorObject } from 'rxjs/util/errorObject';
import { ReplaySubject } from 'rxjs/subject/ReplaySubject';

import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';

const staticEmptyObs = Observable.empty();

export class Component extends Observable {
    constructor(subscribeOrUpdates) {
        if(isObservableIsh(subscribeOrUpdates)) {
            super();
            this.init(subscribeOrUpdates);
        } else {
            super(subscribeOrUpdates);
        }
    }
    init(updates) {
        const distinctUpdates = updates
            .distinctUntilChanged(
                (... args) => this.shouldComponentUpdate(... args),
                (... args) => this.componentKeySelector(... args)
            )
            .switchMap(
                (... args) => this.load(... args),
                (... args) => this.mapDataToState(... args)
            )
            .multicast(new ReplaySubject(1))
            .refCount();

        const vDOMs = this
            .createChildren(Changes.from(distinctUpdates))
            .map((...args) => this.render(...args))
            .switchMap(toObservable);

        this.source = vDOMs;
    }
    operator() { return this; }
    lift(operator) {
        const observable = new Component();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
    createChildren(changes) {
        return changes;
    }
    getPaths({ model }) {
        return [];
    }
    load(update) {
        const paths = this.getPaths(update);
        if (paths.length === 0) {
            return staticEmptyObs;
        }
        const { model } = update;
        return model.get(... paths);
    }
    render({ index, model, json }) {
        return staticEmptyObs;
    }
    mapDataToState({ model, index }, { json }) {
        return { model, index, json };
    }
    componentKeySelector({ model }) {
        return model.getVersion();
    }
    shouldComponentUpdate(curr, next) {
        return curr === next;
    }
    patchDOM(node, vdom) {
        return Observable.from(this.scan(scanAndPatchDOM, { node, vdom }));
    }
}

function isObservableIsh(ish) {
    if (ish && typeof ish === 'object') {
        return (
            ish instanceof Observable || (
            isPromise(ish)) || (
            typeof result[SymbolShim.observable] === 'function'));
    }
    return false;
}

function toObservable(result) {
    if (result && typeof result === "object") {
        if (result instanceof Observable) {
            return result;
        } else if (isPromise(result)) {
            return result;
        } else if (typeof result[SymbolShim.observable] === 'function') {
            return result[SymbolShim.observable]();
        }
    }
    return Observable.of(result);
}

function scanAndPatchDOM({ node, vdom }, tree) {
    return {
        vdom: tree,
        node: patch(node, diff(vdom || tree, tree))
    };
}

import { tryCatch } from 'rxjs/util/tryCatch';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import { errorObject } from 'rxjs/util/errorObject';

Observable.prototype.distinctUntilChanged = distinctUntilChanged;

export class Changes extends Observable {
    operator() { return this; }
    static from(source) {
        const observable = new Changes();
        observable.source = source;
        return observable;
    }
    lift(operator) {
        const observable = new Changes();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
    deref(key) {
        return this.map(function deref({ model, json }) {
            return { json: json[key], model: model.deref(json[key]) };
        });
    }
}

function distinctUntilChanged(compare, keySelector) {
    return this.lift(new DistinctUntilChangedOperator(compare, keySelector));
}

class DistinctUntilChangedOperator {
    constructor(compare, keySelector) {
        this.compare = compare;
        this.keySelector = keySelector;
    }
    call(subscriber) {
        return new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector);
    }
}
class DistinctUntilChangedSubscriber extends Subscriber {
    constructor(destination, compare, keySelector) {
        super(destination);
        this.keySelector = keySelector;
        this.hasKey = false;
        if (typeof compare === 'function') {
            this.compare = compare;
        }
    }
    compare(x, y) {
        return x === y;
    }
    _next(value) {
        const keySelector = this.keySelector;
        let key = value;
        if (keySelector) {
            key = tryCatch(this.keySelector)(value);
            if (key === errorObject) {
                return this.destination.error(errorObject.e);
            }
        }
        let result = false;
        if (this.hasKey) {
            result = tryCatch(this.compare)(this.key, key);
            if (result === errorObject) {
                return this.destination.error(errorObject.e);
            }
        }
        else {
            this.hasKey = true;
        }
        if (Boolean(result) === false) {
            this.key = key;
            this.destination.next(value);
        }
    }
}

import falcor from 'falcor';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

Subject.prototype.onNext = Subject.prototype.next;
Subject.prototype.onError = Subject.prototype.error;
Subject.prototype.onCompleted = Subject.prototype.complete;

Subscriber.prototype.onNext = Subscriber.prototype.next;
Subscriber.prototype.onError = Subscriber.prototype.error;
Subscriber.prototype.onCompleted = Subscriber.prototype.complete;

class ReaxtorModelResponse extends Observable {
    static defer(observableFactory) {
        return new ReaxtorModelResponse(o => observableFactory().subscribe(o));
    }
    lift(operator) {
        const response = new ReaxtorModelResponse();
        response.source = this;
        response.operator = operator;
        return response;
    }
    _toJSONG() {
        return ReaxtorModelResponse.defer(_ => super._toJSONG());
    }
    progressively() {
        return ReaxtorModelResponse.defer(_ => super.progressively());
    }
}

class ReaxtorModel extends falcor.Model {
    /* implement inspect method for node's inspect utility */
    inspect() {
        return '{' + this.getPath() + '}';
    }
    get() {
        return ReaxtorModelResponse.defer(_ => super.get.apply(this, arguments));
    }
    set() {
        return ReaxtorModelResponse.defer(_ => super.set.apply(this, arguments));
    }
    call() {
        return ReaxtorModelResponse.defer(_ => super.call.apply(this, arguments));
    }
    preload() {
        return ReaxtorModelResponse.defer(_ => super.preload.apply(this, arguments));
    }
    getValue() {
        return ReaxtorModelResponse.defer(_ => super.getValue.apply(this, arguments));
    }
    setValue() {
        return ReaxtorModelResponse.defer(_ => super.setValue.apply(this, arguments));
    }
    _clone(opts) {
        const clone = new ReaxtorModel(this);
        for (let key in opts) {
            const value = opts[key];
            if (value === "delete") {
                delete clone[key];
            } else {
                clone[key] = value;
            }
        }
        if (clone._path.length > 0) {
            clone.setCache = void 0;
        }
        return clone;
    }
}

export function Model(opts) {
    return new ReaxtorModel(opts);
}

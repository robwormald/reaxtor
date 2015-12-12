import { Subject } from 'rxjs/Subject';

export class Event extends Subject {
    constructor() {
        super();
        this.next = (... args) => super.next(... args);
        this.error = (... args) => super.error(... args);
        this.complete = (... args) => super.complete(... args);
    }
}

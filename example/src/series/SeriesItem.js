/** @jsx hJSX */
import { Observable } from 'rxjs/Observable';
import { hJSX, Component, Event } from './../../../';

export class SeriesItem extends Component {
    constructor(... args) {
        super(... args);
        this.clicks = new Event();
    }
    getPaths() {
        return [
            ['title'], ['color'], ['values']
        ];
    }
    render({ model, json: { title, color, values }}) {

        if (typeof color !== 'string') {
            color = 'black';
        }

        const clicks = this.clicks;

        return clicks
            .switchMap(() => {
                return model.set(
                    { path: ['title'], value: title + "!"},
                    { path: ['color'], value: color === 'black' ? 'red' : 'black' }
                );
            })
            .startWith(render(color));

        function render(color) {
            return (
                <div className='series'>
                    <h6 ev-click={clicks.next} style={{ color }}>
                        { title }: { values[0] } - { values[values.length - 1] }
                    </h6>
                </div>
            );
        }
    }
}


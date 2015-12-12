/** @jsx hJSX */
import FalcorRouter from 'falcor-router';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';
import { hJSX, Model, Delegator } from './../../';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/combineLatest-static';

import createElement from 'virtual-dom/create-element';

import { App } from './App';
import { ChartRoutes } from './charts/ChartRoutes';
import { SectionRoutes } from './sections/SectionRoutes';

const Router = FalcorRouter.createClass([]
    .concat(ChartRoutes({ title: 'Divisions' }))
    .concat(SectionRoutes())
);

const model = new Model({
        source: new Router(),
        onChange: function() {
            if (model && models) {
                models.next({ model });
            }
        }
    })
    .batch()
    ._materialize()
    .treatErrorsAsValues();

const del = Delegator();
const models = new BehaviorSubject({ model });

const tree = <div className="application"/>;
const root = document.body.appendChild(createElement(tree));

new App(models.throttleTime(16))
    .patchDOM(root, tree)
    .do(() => {},
        console.error.bind(console, "app root error:"),
        console.log.bind(console, "app root completed.")
    )
    .multicast(new Subject())
    .connect();

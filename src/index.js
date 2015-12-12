import h from 'virtual-dom/h'

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromArray';
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/empty';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/merge-static';
import 'rxjs/add/operator/extended/mergeScan';

import { List } from './List';
import { Model } from './Model';
import { Event } from './Event';
import { Component } from './Component';
import Delegator from 'dom-delegator';

export { hJSX, List, Model, Event, Component, Delegator };

function hJSX(tag, attrs, ...children) {
    return h(tag, attrs, children);
}

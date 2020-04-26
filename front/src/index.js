import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import {Menu} from './menu'
import {Quiz} from './quiz'

function App() {
    return (
        <main>
            <Switch>
                <Route path="/" component={Menu} exact />
                <Route path="/quiz/:artist" component={Quiz} />
            </Switch>
        </main>
    )
}

// index.js
ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import Movie from './Movie';
import history from './history';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
<Router history={history}>
    <Switch>
        <Route exact path="/">
            <App />
        </Route>
        <Route path="/movies/:id">
            <Movie/>
        </Route>
    </Switch>
</Router>
,
document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

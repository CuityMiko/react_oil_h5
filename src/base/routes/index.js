import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from '@/common/components/404/NotFound';
import Error from '@/common/components/error/Error';
import PayError from '@/common/components/error/PayError';
import App from '@/base/App.jsx';

export default () => (
    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/app/home" push />} />        
            <Route path="/app" component={App} />
            <Route path="/error" component={Error} />
            <Route path="/pay/error" component={PayError} />
            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
        </Switch>
    </Router>
)
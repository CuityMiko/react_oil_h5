
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import AllComponents from './modules';
import routesConfig from './route';
import queryString from 'query-string';

export default class CRouter extends Component {
    // 登录验证
    requireLogin = (component, permission) => {
        return component;
    };
    render() {
        const {onRouterChange} = this.props;
        return (
            <Switch>
                {
                    Object.keys(routesConfig).map(key => 
                        routesConfig[key].map(r => {
                            const route = r => {
                                const Component = AllComponents[r.component];
                                return (
                                    <Route
                                        key={r.route || r.key}
                                        exact
                                        path={r.route || r.key}
                                        render={props => {
                                            if (r.title) {
                                                document.title = r.title
                                            }
                                            Object.assign(props, {query: queryString.parse(props.location.search), params: props.match.params});
                                            // 回传route配置
                                            onRouterChange && onRouterChange(r);
                                            return r.login ? 
                                            <Component {...props} />
                                            : this.requireLogin(<Component {...props} />, r.auth)}
                                        }
                                    />
                                )
                            }
                            return r.component ? route(r) : r.subs.map(r => route(r));
                        })
                    )
                }

                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}
import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import * as serviceWorker from './serviceWorker';
import store from './redux/store'
import Page from './routes/index';
import 'lib-flexible'
import './style/lib/animate.css';
import './style/antd-mobile/index.less';
import './style/index.less';

// 增加react-hot-loader保持状态刷新操作
const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component store={store} />
            </Provider>
        </AppContainer>
        ,
        document.getElementById('root')
    );
};

render(Page);

// Webpack Hot Module Replacement API
if (module.hot) {
    const orgError = console.error; // eslint-disable-line no-console
    console.error = (...args) => { // eslint-disable-line no-console
        if (args && args.length === 1 && typeof args[0] === 'string' && args[0].indexOf('You cannot change <Router routes>;') > -1) {
            // React route changed
        } else {
            // Log the error as normally
            orgError.apply(console, args);
        }
    };
    module.hot.accept('./routes/index', () => {
        render(Page);
    })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
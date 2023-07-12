import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../src/redux/store';
import FormProvider from './components/form-provider';
import './_index.less';

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <ConfigProvider>
                <FormProvider>
                    <App />
                </FormProvider>
            </ConfigProvider>
        </Provider>
    </BrowserRouter>,
    document.getElementById('root'),
);

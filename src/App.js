import React, { Component } from 'react'
import router from './router/routerJson'
import RouterView from './router/routerView'
import { BrowserRouter} from 'react-router-dom'
// import store from './store/index'
import {ConfigProvider} from 'antd'
import 'antd/dist/antd'
import './App.css'
import './flexible/index'



//兼容IE
// import "react-app-polyfill/ie11"
// import "react-app-polyfill/ie9"
// import "react-app-polufill/stable"

export default class App extends Component {
  render() {
    return (
      <ConfigProvider>
        <BrowserRouter>
          <RouterView router={router}/>
        </BrowserRouter>
      </ConfigProvider>
    )
  }
}
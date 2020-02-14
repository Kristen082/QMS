import React, { Component } from 'react'
import {Switch,Redirect,Route} from 'react-router-dom'

export default class routerView extends Component {
  render() {
    let {router}=this.props
    let routerArr=router.filter(item=>!item.redirect)
    let redirectArr=router.filter(item=>item.redirect)
    return [
      <Switch key="1">
    {
      routerArr.map((item,index)=>{
       return <Route
                key={index}
                path={item.path}
                render={(props)=>{
                  return <item.component {...props} child={item.children}/>
                 }}
                ></Route>
            })
    }
    </Switch>,
      <Switch key="2">
       {
        redirectArr.map((item,index)=>{
        return <Redirect
                key={index}
                to={item.redirect}
              ></Redirect>
             })
       }
     </Switch>
    ]
  }
}

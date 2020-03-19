import React, { Component } from 'react'
import './index.css'
import background from "../../imgs/background.png"
import Sign from '../../imgs/loginBtn.png'
import { Modal } from 'antd';
import axios from "axios";


function warning() {
  Modal.warning({
    title: 'warning',
    content: 'Please enter your username and password',
  });
}

export default class Login extends Component {
  state={
    userName:null,
    userPwd:null
  }
  render() {
  return (
    <div className="wrapper">
        <img src={background} className="background" alt=""/>
        <div className='inps'>
          <div>
            <input className='UserName' onChange={this.change.bind(this)}/>
          </div>
          <div>
            <input className='PassWord' onChange={this.change.bind(this)}/>
          </div>
          <img alt='' src={Sign} className="Sign" onClick={this.btn.bind(this)}/>
        </div>
      </div>
    )
  }

  change=(e)=>{
    console.log(e.target,this.state)
    if(e.target.className==="UserName"){
      this.setState({
        userName:e.target.value,
      })
    }else{
      this.setState({
        userPwd:e.target.value
    })
    }
  }

  btn=()=>{
    let {userName,userPwd}=this.state
    console.log(this.state)
    this.props.history.push('/home/index') //跳转页面

    if(userName && userPwd){
      
    //登录用户
    axios.post(`/api/Login/Login?userName=${userName}&userPwd=${userPwd}`).then(res=>{
      console.log(res.data)
      if(res.data.success){
        localStorage.setItem('userID',res.data.data.userID)
        localStorage.setItem('orgID',res.data.data.orgID)
        localStorage.setItem('roleName',res.data.data.roleName)
        localStorage.setItem('realName',res.data.data.realName)
        //用户菜单显示
        // axios.post(`/api/Login/GetPrivilegeList?userId=${res.data.data.userID}`).then(res=>{
        //   console.log(res.data,'菜单login')
        // })

      }else{
        alert('Password or UserName Fail')
      }
    })
    }else{
      warning()
    }
    
  }

  //api获取天气
  // componentDidMount(){
  //   console.log(api.WeatherForecast())
    // api.WeatherForecast().then(res=>{
    //   console.log(res.data)
    // })
  // }
}


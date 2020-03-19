import React, { Component } from 'react'
import "antd/dist/antd.css"
//H+
import '../../H+/basic.css'
import '../../H+/style.min.css'
import '../../H+/summernote.css'
import '../../H+/webuploader.css'
import '../../H+/webuploader-demo.min.css'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './home.css'
import Title_img from "../../imgs/title_img.png"
import { Switch,Link } from "react-router-dom";
import RouterView from '../../router/routerView';
import '../../utils/drag'
import Left from '../../imgs/leftHide_icon.png'

const { SubMenu } = Menu;
const { Header, Content, Sider,Footer } = Layout;

export class home extends Component {
  state = {
    collapsed: false,
    collapsed: false,

    tab_list:['测试1','测试2','测试3','测试4','测试5','测试6','测试7','测试8'],
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  render() {
    let {child}=this.props;
    return (
      <Layout>
      <Header className="header">
      <div>
      <img alt="" src={Title_img} style={{height:"72%"}}/>
      </div>

        <div style={{color:'#fff'}}>
          <span><Icon type="key"/> 更改密码</span>
          <span> | </span>
          <span>注销</span>
        </div>  
      </Header>
    <Layout>
    <Sider trigger={null} collapsed={this.state.collapsed} collapsible onCollapse={this.state.onCollapse}>
      <div className="logo" />
      <div className="trigger" >
        Navigation
        <span>
        <img src={Left} 
          onClick={this.toggle} 
          type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} className="toggle_btn trigger"
        />
        </span>
      </div>
      <Menu mode="inline">
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="folder" />
              <span>
                Data Management
              </span>
            </span>
            }>
          <Menu.Item key="1">
            <Link to="/home/DepartmentManagement">
              <span>
              Department Management
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/home/ResourceManagement">
              <span>
              Resource Management
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/home/ItemManagement">
              <span>
              Item Management
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/home/CalendarManagement">
              <span>
              Calendar Management
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/home/HolidayManagement">
              <span>
              Holiday Management
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/home/employeemanagement">
              <span>
              employee management
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to="/home/LaborPlan">
              <span>
              Labor Plan
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="8">
            <Link to="/home/InventoryManagement">
              <span>
              Inventory Management
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="9">
            <Link to="/home/InventorylocationManagement">
              <span>
              Inventory Location Management
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="10">
            <Link to="/home/colorManagement">
              <span>
              Color Management
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="11">
            <Link to="/home/Specification">
              <span>
              Specification Management
              </span>
            </Link>
          </Menu.Item>
          {/* <Menu.Item key="6">
            <Link to="/home/LaborPlan">
              <span>
              Labor Plan
              </span>
            </Link>
          </Menu.Item> */}
        </SubMenu>
        {/* <SubMenu
          key="sub2"
          title={
            <span>
              <Icon type="folder" />
              <span>
                Work Order Management
              </span>
            </span>
            }>
          <Menu.Item key="6">
            <Link to="/home/DepartmentManagement">
              <span>
              Order Management
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to="/home/ResourceManagement">
              <span>
              History Order Management
              </span>
            </Link>
          </Menu.Item>
        </SubMenu> */}
      </Menu>
    </Sider>
    <Layout style={{ padding: '0 24px 24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>
        <div className="row content-tabs" >
					<button className="roll-nav roll-left J_tabLeft"><Icon type="vertical-right" /></button>
					<nav className="page-tabs J_menuTabs">
						<div className="page-tabs-content" >
							<a  className="J_menuTab" data-id="index_v1.html">首页</a>
              <a className="active J_menuTab">布局 <Icon type="close-circle" /></a>
              {
              this.state.tab_list.map((item,index)=>{
                return <a key={index} className="active J_menuTab">{item}<Icon type="close-circle" /></a>
              })
              }
            </div>
					</nav>
					<button className="roll-nav roll-right J_tabRight"><Icon type="vertical-left" /></button>
					<div className="btn-group roll-nav roll-right">
						<button className="dropdown J_tabClose" data-toggle="dropdown">关闭<span className="caret"></span></button>
						<ul role="menu" className="dropdown-menu dropdown-menu-right">
							<li className="J_tabShowActive">
								<span>定位当前选项卡</span>
							</li>
							<li className="divider"></li>
							<li className="J_tabCloseAll">
								<span>关闭全部选项卡</span>
							</li>
							<li className="J_tabCloseOther">
								<span>关闭其他选项卡</span>
							</li>
						</ul>
					</div>
					<a href="login.html" className="roll-nav roll-right J_tabExit"><i className="fa fa fa-sign-out"></i>退出</a>
				</div>

        </Breadcrumb.Item>
          
        </Breadcrumb>
        <Content
          style={{
            background: '#fff',
            color:'#000',
            padding: 24,
            margin: 0,
            // minHeight: 280,
          }}
        >
          {/* 路由显示 */}
          <Switch><RouterView router={child}/></Switch>
        </Content>
        <Footer>北京施达优技术有限公司 版权所有</Footer>
      </Layout>
    </Layout>

  </Layout>
    )
  }
}

export default home

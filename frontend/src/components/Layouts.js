import React, { Component, PropTypes } from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import HeaderDiv from './HeaderDiv';
import { Layout, Menu, Icon } from 'antd';
const { SubMenu }  = Menu;
const { Header,Sider, Content } = Layout;

class Layouts extends React.Component {
  state = {
    openKeys: '',
    collapsed: false,
  };
  rootSubmenuKeys = ['sub1', 'sub2', 'sub4','sub5','sub3', 'sub6'];
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };
  render() {
    const active = this.props.active;
    // const classname = (this.props, "classname", " ");
    return (
        <Layout className={`${ this.props.classname }`} >
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}  style={{ background: '#fff' }} className="sidebar-left"  onCollapse={this.onCollapse}>
          <div className="logo" />
              <Menu theme="light" mode="inline" defaultSelectedKeys={[active]}
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}  mode="vertical">
                <Menu.Item key="1">
                    <Link to="/list">
                      <div class>
                        <span> ALL TASK </span>
                      </div>
                    </Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/my_task">
                      <div class>
                        <span> MY TASK </span>
                      </div>
                    </Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/create_task">
                      <div class>
                        <span> CREATE TASK </span>
                      </div>
                    </Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link to="/upload">
                      <div class>
                        <span> UPLOAD </span>
                      </div>
                    </Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link to="/my_image">
                      <div class>
                        <span> MY IMAGE </span>
                      </div>
                    </Link>
                </Menu.Item>
              </Menu>
              <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
              />    
              </Sider>
              <Layout>
                <Header className="headerTop">
                    <HeaderDiv />
                </Header>
                <Content
                style={{
                padding: 24,
                minHeight: '100vh',
                }}
                className={this.state.collapsed ? "collapsed mainContnet " : "mainContnet"}
                >
               
                {this.props.children}
                </Content>
              </Layout>
        </Layout>

   
  );
  }
}
export default Layouts;
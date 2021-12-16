import * as React from 'react';
import logo from '../static/images/logo.png';
import avatar from '../static/images/flat-avatar.png';
import axios from 'axios'

import {Route, Link, BrowserRouter as Router} from 'react-router-dom';

import { Menu, Input, Avatar} from 'antd';

const SubMenu = Menu.SubMenu;

const Search = Input.Search;

class HeaderDiv extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      current: 'search',
      rtl: true,
    };
    this.sidebarToggle = this.sidebarToggle.bind (this);
  }
  sidebarToggle () {
    this.setState ({
      rtl: !this.state.rtl,
    });
    var body = document.body;
    body.classList.toggle ('rtl');
  }

  logoutClick = () => {
    console.log ('logout click');
              
    axios.get('http://localhost:8000/api/users/logout/', {withCredentials: true}).catch(
      e => console.log(e)
    );
  };

  render () {
    const classBox = `primaryBg box`;

    return (
      <Menu
        mode="horizontal"
        theme="dark"
        className="d-flex align-items-center custom-navigation"
      >

        <Menu.Item key="brand-logo" className="brand-logo">
          <Link to="/dashboard">
            <img src={logo} className="m-r-5" />
            <span>ZJULabel</span>
          </Link>
        </Menu.Item>

        <Menu.Item key="sidebar-toggle" onClick={this.sidebarToggle}>
          <span>LTR/RTR</span>
        </Menu.Item>

        <SubMenu
          key="profile"
          title={
            <span>
              <Avatar size={24} src={avatar} />
              <span> Profile</span>
            </span>
          }
          className=""
        >
          <Menu.Item key="profile-view">
            <Link to="/profile">Profile</Link>
          </Menu.Item>
          <Menu.Item key="logout"><Link to="/" onClick={this.logoutClick}>Logout</Link></Menu.Item>
        </SubMenu>

      </Menu>
    );
  }
}
export default HeaderDiv;

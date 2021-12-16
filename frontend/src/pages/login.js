import React from 'react';
import {Route, Link, Redirect, BrowserRouter as Router} from 'react-router-dom';
import logo from '../static/images/logo.png';
import LayoutLogin from '../components/LayoutLogin';
import {Form, Icon, Input, Button, Alert} from 'antd';
import axios from 'axios'

class Login extends React.Component {
  componentWillMount (){
    this.setState({wrong_msg: ''})
  }
  handleSubmit = e => {
    e.preventDefault ();
    this.props.form.validateFields ((err, values) => {
      if (!err) {
        console.log ('Login values: ', values);
        axios.post('http://localhost:8000/api/users/login/', values, {withCredentials: true}).then(res => {
          if (res.status == 200){
            if (res.data == 'login fail')
              this.setState({wrong_msg: 'Wrong password or user doesn\'t exist'});
            else
              this.props.history.push('/dashboard');
          }
        }).catch(err => {
          console.log(err);
          this.setState({wrong_msg: 'An error took place'})
        })
      }
    });
  };
  render () {
    const {getFieldDecorator} = this.props.form;
    let pass_msg;
    if (this.state.wrong_msg == '')
      pass_msg = <></>
    else
      pass_msg = <Alert message={this.state.wrong_msg} type="error" />
    return (
      <LayoutLogin title="login" classname="login">
        <div
          className="d-flex align-items-center justify-content-center flex-column"
          style={{maxWidth: '360px', margin: 'auto', height: '100vh'}}
        >
          <div className="text-center">
            <img src={logo} />
            <h1 className="m-b-30 m-t-15">ZJULabel</h1>
          </div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator ('username', {
                rules: [
                  {required: true, message: 'Please input your username!'},
                ],
              }) (
                <Input
                  prefix={
                    <Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />
                  }
                  placeholder="Username"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator ('password', {
                rules: [
                  {required: true, message: 'Please input your Password!'},
                ],
              }) (
                <Input
                  prefix={
                    <Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </Form.Item>
            <Form.Item>
              {pass_msg}
              <Button
                type="primary"
                htmlType="submit"
                className="btn-block m-t-15"
                size="large"
              >
                Log in
              </Button>
              <p>Need an account? <Link to="/register"><a>Signup</a></Link></p>
            </Form.Item>
          </Form>
        </div>
      </LayoutLogin>
    );
  }
}

const WrappedNormalLoginForm = Form.create ({name: 'normal_login'}) (Login);

export default WrappedNormalLoginForm;

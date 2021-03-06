import * as React from 'react';
import Layouts from '../components/Layouts';
import {Form, Input, Col, Row, Card, Button, DatePicker, message} from 'antd';
import TransferLoad from '../components/TranseferLoad';
import { Redirect } from 'react-router';
import axios from 'axios';
import getCookie from '../components/cookie_loader';

const { TextArea } = Input;

class PublishTask extends React.Component {
    state = {
        loggin: true,
    }

    csrftoken = getCookie("csrftoken");

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRFToken": this.csrftoken
                    },
                    withCredentials: true
                }
                const fmData = new FormData()
                fmData.append("name", values['name']);
                fmData.append("description", values['description']);
                console.log(values['images'].changedValue);
                let i, len;
                for ( i = 0, len = values['images'].changedValue.length; i < len; i++){   
                    fmData.append("images", values['images'].changedValue[i]);
                }
                console.log('Received values of form: ', values);
                axios.post('http://localhost:8000/api/tasks/publish/', fmData, config).then(res => {
                    if (res.status === 200){
                        console.log("publish success");
                        window.location.reload();
                        message.success("Successfullt published a task!");
                    }
                }).catch(err => {
                    if (err.response){
                        if (err.response.status === 403){
                            message.error('You have to login first!');
                            this.setState({loggin: false});
                        }
                        else{
                            message.error('An error took place!');
                        }
                        console.log(err.response)
                    }
                    console.log(err)
                })
            }
        });
    };

    getImageKeys = state => {
        console.log(state.targetKeys);
        return state.targetKeys;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        if (!this.state.loggin)
            return <Redirect to="/"></Redirect>
        return (
            <Layouts title="assets" classname="grid">
            <Card title="Create Tasks">
            <Row gutter={16}>
            <Col span={7}/>
            <Col span={10} >
            <Form layout="horizontal"  onSubmit={this.handleSubmit}>
                <Form.Item label={'Task Name:'}>
                    {getFieldDecorator('name', {
                        rules: [
                            {required: true, message: 'Please input task name!'},
                        ]
                    })(<Input placeholder="Task Name" />)}
                </Form.Item>
                <Form.Item label={'Discription:'}>
                    {getFieldDecorator('description')
                    (<TextArea rows={3} placeholder="Description" />)}
                </Form.Item>
                <Form.Item label={'Images:'}>
                    {getFieldDecorator('images', {
                        rules: [
                            {required: true, message: 'Please choose at least one image!'},
                        ],
                    })(<TransferLoad
                            url="http://localhost:8000/api/images/pre_list/" 
                            stateCallback={this.getImageKeys}
                        />)}
                </Form.Item>
                <Form.Item>
                    <br/>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        style={{
                            width: 100,
                            marginLeft: 160
                        }}
                    >
                        Submit
                    </Button>
            </Form.Item>
            </Form>
            </Col>
            <Col span={7}/>
            </Row>
            </Card>
            </Layouts>
        );
    }
}

const WrappedPublishForm = Form.create ({name: 'upload_form'}) (PublishTask);

export default WrappedPublishForm

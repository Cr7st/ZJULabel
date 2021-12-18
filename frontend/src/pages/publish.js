import * as React from 'react';
import Layouts from '../components/Layouts';
import {Form, Input, Col, Row, Card, Button, DatePicker, Transfer} from 'antd';

const { TextArea } = Input;

class PublishTask extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Layouts title="assets" classname="grid">
            <Card>
            <Row gutter={16}>
            <Col span={8}/>
            <Col span={8} >
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
                <Form.Item label={'End Date:'}>
                    {getFieldDecorator('end_date', {
                        rules: [
                            {required: true, message: 'Please input end date!'},
                        ]
                    })(<DatePicker />)}
                </Form.Item>
                <Form.Item label={'Images:'}>
                    {getFieldDecorator('images', {
                        rules: [
                            {required: true, message: 'Please choose at least one image!'},
                        ]
                    })(<Transfer
                            showSearch 
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
            <Col span={8}/>
            </Row>
            </Card>
            </Layouts>
        );
    }
}

const WrappedPublishForm = Form.create ({name: 'upload_form'}) (PublishTask);

export default WrappedPublishForm

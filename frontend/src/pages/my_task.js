import * as React from 'react';
import Layouts from '../components/Layouts';
import {Row, Col, Card, Button, Form} from 'antd';
import ListLoad from '../components/list/ListLoad';

class MyTask extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
  };
  render () {
    return (
      <Layouts title="assets" classname="grid">
        <Row gutter={16}>
            <Card
              bordered={false}
              title={<p>My Tasks</p>}
              bodyStyle={{padding: '0 20px 20px'}}
              className="m-t-15"
            >
              <ListLoad url={'http://localhost:8000/api/tasks/list_mine'}/>
            </Card>
        </Row>
      </Layouts>
    );
  }
}

export default MyTask;

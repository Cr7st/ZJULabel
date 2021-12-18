import * as React from 'react';
import Layouts from '../components/Layouts';
import {Row, Col, Card, Button, Form} from 'antd';
import Loadmore from '../components/list/Loadmore';

class List extends React.Component {
  
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
              title={<p>Label Tasks</p>}
              bodyStyle={{padding: '0 20px 20px'}}
              className="m-t-15"
            >
              <Loadmore url={'http://localhost:8000/api/tasks/'}/>
            </Card>
        </Row>
      </Layouts>
    );
  }
}

export default List;

import * as React from 'react';
import Layouts from '../components/Layouts';
import {Row, Col, Card, Button, Form} from 'antd';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import ListLoad from '../components/list/ListLoad';

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
              <ListLoad url={'http://localhost:8000/api/tasks/'} renderActionComp={(item) => {
                var action_comp;
                if (item.status === "FINISHED") return (<></>)
                action_comp = [<Link to={{pathname:"/annotate", state:{task: item}}} >accept</Link>]
                return action_comp;
              }}/>
            </Card>
        </Row>
      </Layouts>
    );
  }
}

export default List;

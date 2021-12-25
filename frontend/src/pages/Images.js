import * as React from 'react';
import Layouts from '../components/Layouts';
import {Row, Card, message, Col} from 'antd';
import axios from 'axios';
import { Redirect } from 'react-router';
const { Meta } = Card;

class Images extends React.Component {
  state = {
    images: [],
    loggin: true,
    loading: true,
  };
  componentDidMount = () => {
    console.log('componentDidMount')
    axios.get('http://localhost:8000/api/images', {withCredentials: true}).then( res => {
      console.log(res);
      this.setState({images: res.data, loading: false});
    }).catch( err => {
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

  render () {
    if (!this.state.loggin)
      return <Redirect to="/"></Redirect>
    
    let cardList = this.state.images.map((item, index) => {
      return (
        <Col span={4}>
          <Card
            hoverable
            style={{marginLeft: 20, marginRight: 20, marginTop: 15}}
            loading={this.state.loading}
            cover={<img alt={item.name} src={item.image} height={200} style={{objectFit: 'cover'}}/>}
          >
            <Meta title={item.name}/>
          </Card>
        </Col>
      )
    })

    let rowList = () => {
      const rows = [];
      for (let i = 0; i < cardList.length; i += 6){
        rows.push(
          (
            <Row type='flex' justify='left' align='middle'>
              {cardList.slice(i, i + 6)}
            </Row>
          )
        )
      }
      return rows;
    }

    return (
      <Layouts title="assets" classname="grid">
       {rowList()}
      </Layouts>
    );
  }
}

export default Images;

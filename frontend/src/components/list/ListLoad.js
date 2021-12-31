import * as React from 'react';
import {List, Button, Skeleton, Divider, Icon, message} from 'antd';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Annotation from '../../pages/Annotate';

class ListLoad extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    loggin: true,
  };

  componentDidMount () {
    this.getData (res => {
      this.setState ({
        initLoading: false,
        data: res.data,
        list: res.data,
      });
    });
  }

  getData = callback => {
    const config = this.props.csrftoken ? {withCredentials: true} : {
      withCredentials: true,
      headers: {
        "X-CSRFToken": this.csrftoken,
      }
    };
    axios.get(this.props.url, config).then( res =>{
      callback(res)
      console.log(res)
    }).catch(err => {
      if (err.response){
        if (err.response.status === 403)
          this.setState({loggin: false});
      }
      console.log(err)
    })
  };

  onLoadMore = () => {
    this.setState ({
      loading: true,
      list: this.state.list.map(() => ({loading: true, name: {}}))
    });
    this.getData (res => {
      const data = res.data;
      this.setState (
        {
          data,
          list: data,
          loading: false,
        },
        () => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent (new Event ('resize'));
        }
      );
    });
  };

  render () {
    if (!this.state.loggin)
      return <Redirect to="/"></Redirect>
    const {initLoading, loading, list} = this.state;
    const {renderActionComp} = this.props;
    const loadMore = !initLoading && !loading
      ? <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={this.onLoadMore}>refresh</Button>
        </div>
      : null;
    return (
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={item => {
          var action_comp = renderActionComp(item);
          console.log(action_comp)
          return (
            <List.Item>
              <Skeleton title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={item.name}
                  description={item.description}
                />
                {!initLoading && !loading
                ? <div>{item.images.length} images</div>
                : null}
                <Divider type='vertical'/>
                <div style={{marginRight: 20}}>
                  {action_comp}
                </div>
              </Skeleton>
            </List.Item>
          )
        }}
      />
    );
  }
}
export default ListLoad;

import * as React from 'react';
import {List, Button, Skeleton} from 'antd';
import axios from 'axios';
import { Redirect } from 'react-router';

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
    axios.get(this.props.url, {withCredentials: true}).then( res =>{
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
        renderItem={item => (
          <List.Item actions={[<a>accept</a>]}>
            <Skeleton title={false} loading={item.loading} active>
              <List.Item.Meta
                title={item.name}
                description={item.description}
              />
              {!initLoading && !loading
              ? <div>{item.images.length} Images.  Due {item.end_date}</div>
              : null}
            </Skeleton>
          </List.Item>
        )}
      />
    );
  }
}
export default ListLoad;

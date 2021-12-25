import * as React from 'react';
import {Transfer, Spin} from 'antd';
import axios from 'axios';
import { Redirect } from 'react-router';

class ListLoad extends React.Component {
  state = {
    initLoading: true,
    data: [],
    list: [],
    loggin: true,
    targetKeys: [],
  };

  handleChange = async targetKeys => {
    await this.setState({targetKeys});
    console.log(this.state.targetKeys);
    this.triggerChange(this.state.targetKeys);
  }

  triggerChange = changedValue => {
      const {onChange, value} = this.props;
      console.log(this.props)
      if (onChange) {
          onChange({
              ...value,
              changedValue,
          })
      }
  }

  filterOption = (inputValue, option) => option.name.indexOf(inputValue) > -1;

  componentDidMount () {
    this.getData (res => {
        const source = [];
        for (let i = 0; i < res.data.length; i++){
            const data = {
                key: res.data[i].id,
                name: res.data[i].name,
                chosen: false,
            }
            source.push(data);
        }
      this.setState ({
        initLoading: false,
        targetKeys: [],
        data: res.data,
        list: source,
      });
    });
  }

  getData = callback => {
    axios.get(this.props.url, {withCredentials: true}).then( res =>{
        console.log(res)
        callback(res)
    }).catch(err => {
      if (err.response){
        if (err.response.status === 403)
          this.setState({loggin: false});
      }
      console.log(err)
    })
  };

  render () {
    if (!this.state.loggin)
      return <Redirect to="/"></Redirect>
    const {initLoading, list} = this.state;

    if (initLoading)
        return <Spin/>

    return (
      <Transfer
        dataSource={list}
        targetKeys={this.state.targetKeys}
        onChange={this.handleChange}
        showSearch
        filterOption={this.filterOption}
        render={item => item.name}
      />
    );
  }
}
export default ListLoad;

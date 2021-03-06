import * as React from 'react';
import Layouts from '../components/Layouts';
import {Row, Icon, Card, Button, Divider, Tabs, message } from 'antd';
import ListLoad from '../components/list/ListLoad';
import getCookie from '../components/cookie_loader';
import axios from 'axios';

const {TabPane} = Tabs;

class MyTask extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    files: []
  };

  getFile = async (data) => {
    const files = []
    for (var item of data) {
      var url = "http://localhost:8000"+item.url
      var res = await axios.get(url, {responseType: 'blob', withCredentials: true})
      files.push(res.data)
    }
    console.log(files);
    return files;
  }

  csrftoken = getCookie("csrftoken");

  renderActionComp = (item) => {
    var action_comp;
  }

  render () {
    return (
      <Layouts title="assets" classname="grid">
        <Tabs defaultActiveKey="1">
          <TabPane tab="MY TASKS" key="1">
            <Row gutter={16}>
              <Card
                bordered={false}
                title={<p>My Tasks</p>}
                bodyStyle={{padding: '0 20px 20px'}}
                className="m-t-15"
              >
                <ListLoad url={'http://localhost:8000/api/tasks/list_mine'} csrftoken={this.csrftoken} renderActionComp={(item) => {
                  var action_comp;
                  if (item.status === 'RUNNING')
                    action_comp = [
                      <div style={{display:'inline', marginRight:5}}><Icon type="edit" theme="twoTone" /></div>, 
                      <div style={{display:'inline'}}><b><font color='#0099ff'>{item.status}</font></b></div>
                    ]
                  else 
                    action_comp = [
                      <div style={{display:'inline', marginRight:5}}><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/></div>, 
                      <div style={{display:'inline'}}><b><font color='#00cc00'>{item.status}</font></b></div>
                    ]
                  return action_comp;
                }}/>
              </Card>
            </Row>
          </TabPane>
          <TabPane tab="FINISHED TASKS" key="2">
            <Row gutter={16}>
              <Card
                bordered={false}
                title={<p>Finished Tasks</p>}
                bodyStyle={{padding: '0 20px 20px'}}
                className="m-t-15"
              >
                <ListLoad url={'http://localhost:8000/api/tasks/list_finished'} csrftoken={this.csrftoken} renderActionComp={(item) => {
                  var action_comp;
                  var clickDownloadVOC = (event) => {
                    var JSZip = require("jszip"); 
                    var FileSaver = require('file-saver');
                    let url = "http://localhost:8000/api/datasets/VOC/download/?task=" + item.id
                    axios.get(url, {
                      withCredentials: true, 
                    }).then(
                      res => {
                        if (res.status === 200) {
                          this.getFile(res.data).then(files => {
                            const zip = new JSZip();
                            for (var i = 0; i < files.length; i++) {
                              zip.file(res.data[i].id + '_VOC.xml', files[i]);
                            }
                            var fileName = item.name + "_VOC.zip"
                            zip.generateAsync({
                              type: "blob",
                              compression: "DEFLATE",  // STORE?????????????????? DEFLATE???????????????
                              compressionOptions: {
                                level: 9               // ????????????1~9    1?????????????????????9??????????????????
                              }
                            }).then((res) => {
                              console.log(res)
                              message.success('???????????????');
                              FileSaver.saveAs(res, fileName) // ??????file-saver????????????
                            })
                          })
                        }
                        else {
                          message.error(res.data.msg)
                          console.log(res)
                        }
                      }
                    ).catch((err) =>{
                      message.error('????????????');
                      console.log(err)
                    })
                  }

                  var clickDownloadCOCO = (event) => {
                    axios.get('http://localhost:8000/api/datasets/COCO/download/?task=' + item.id, {
                      withCredentials: true, 
                      responseType: 'blob'
                    },).then( res => {
                      console.log(res);
                      const url = window.URL.createObjectURL(new Blob([res.data]));
                      const link = document.createElement('a');
                      link.href = url;
                      console.log(res.headers)
                      const filename = res.headers['content-disposition'].split(';')[1].replace('filename=', '').replaceAll('\"', '');
                      console.log(filename);
                      link.setAttribute('download', filename);
                      document.body.appendChild(link);
                      link.click();
                      message.success('???????????????');
                    }).catch(err => {
                      console.log(err);
                      message.error('????????????');
                    })
                  }
                  action_comp = (
                    <div>
                      <Button type="primary" shape="round" icon="download" size='default' onClick={clickDownloadVOC}>
                        VOC
                      </Button>
                      <Divider type='vertical'/>
                      <Button type="primary" shape="round" icon="download" size='default' onClick={clickDownloadCOCO}>
                        COCO
                      </Button>
                      <Divider type='vertical'/>
                      <Button type="primary" shape="round" danger={true} size='default' onClick={event => {
                        message.warning("????????????????????????");
                      }}>
                        REPUBLISH
                      </Button>
                    </div>
                  )
                  return action_comp
                }}/>
              </Card>
            </Row>
          </TabPane>
        </Tabs>
      </Layouts>
    );
  }
}

export default MyTask;

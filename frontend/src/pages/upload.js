import * as React from 'react';
import Layouts from '../components/Layouts';
import {Card, Upload, message, Icon} from 'antd';
import { Redirect } from 'react-router';
import axios from "axios";
import getCookie from '../components/cookie_loader';

const { Dragger } = Upload;

class UploadPage extends React.Component {
    state = {
        loggin: true
    };
    csrftoken = getCookie("csrftoken");

    imageTypeCheck = (file, fileList) => {
        if (!file.type.startsWith('image')){
            message.error("请上传图片格式文件");
            return false;
        } else return true;
    }

    videoTypeCheck = (file, fileList) => {
        if (!file.type.startsWith('video')){
            message.error("请上传视频格式文件");
            return false;
        } else return true;
    }
    
    uploadFile(options){
        const {onSuccess, onError, file, onProgress, headers, data} = options;
        const fmData = new FormData();
        const config = {
            headers: headers,
            onUploadProgress: event => {
                onProgress({percent: (event.loaded / event.total) * 100});
            },
            withCredentials: true
        }
        fmData.append("file", file);
        fmData.append("type", data.type);
        fmData.append("name", file.name)
        axios.post("http://localhost:8000/api/images/upload/", fmData, config).then(res => {
            if (res.status === 200){
                onSuccess("OK");
                //message.success(res.data['msg']);
                console.log("server res: ", res);
            }
        }).catch(err => {
            if (err.response){
                if (err.response.status === 403){
                    message.error(`You have to login first!`);
                    this.setState({loggin: false});
                }else {
                    message.error(err.response.data['msg']);
                }
            }
            console.log(err);
            onError({err});
        })
    };

    render() {
        if (!this.state.loggin)
            return <Redirect to="/"></Redirect>
        const img_props = {
            data:{type:"IMAGE"},
            multiple: true,
            customRequest: this.uploadFile,
            beforeUpload: this.imageTypeCheck,
            accept: "image/*",
            headers: {
                "Content-Type": "multipart/form-data",
                "X-CSRFToken": this.csrftoken
            },
            onChange(info) {
                const { status } = info.file;
                if (status !== 'uploading') {
                  console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                  message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                  message.error(`${info.file.name} file upload failed.`);
                }
            },
        }
        const video_props = {
            data:{type:"VIDEO"},
            multiple: true,
            customRequest: this.uploadFile,
            beforeUpload: this.videoTypeCheck,
            accept: "video/*",
            headers: {
                "Content-Type": "multipart/form-data",
                "X-CSRFToken": this.csrftoken
            },
            onChange(info) {
                const { status } = info.file;
                if (status !== 'uploading') {
                  console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                  message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                  message.error(`${info.file.name} file upload failed.`);
                }
            },
        }
        return (
            <Layouts title="assets" classname="grid">
            <Card style={{marginLeft:'auto', marginRight: 'auto', width: 1000}} title="UPLOAD IMAGE">
                <Dragger {...img_props} style={{marginLeft:'auto', marginRight:'auto', width:600 }}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="file-image" theme="twoTone" />
                    </p>
                    <p className="ant-upload-text">Click or drag image to this area to upload</p>
                    <p className="ant-upload-hint">
                        Only accept image file.
                    </p>
                </Dragger>
            </Card>
            <Card style={{marginLeft:'auto', marginRight: 'auto', width: 1000, marginTop: 40}} title="UPLOAD VIDEO">
                <Dragger {...video_props} style={{marginLeft:'auto', marginRight:'auto', width:600 }}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="video-camera" theme="twoTone" />
                    </p>
                    <p className="ant-upload-text">Click or drag video to this area to upload</p>
                    <p className="ant-upload-hint">
                        Only accept video file.
                    </p>
                </Dragger>
            </Card>
            </Layouts>
        );
    }
}

export default UploadPage

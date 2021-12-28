import * as React from 'react';
import ReactImageAnnotate from 'react-image-annotate';
import axios from 'axios';
import Layouts from '../components/Layouts';
import { message } from "antd";
import "../styles/annotation.css";

const categories = [
  {'supercategory': 'human', 'id': 1, 'name': 'man'},
  {'supercategory': 'human', 'id': 2, 'name': 'woman'},
  {'supercategory': 'animal', 'id': 3, 'name': 'cat'},
  {'supercategory': 'animal', 'id': 4, 'name': 'dog'},
  {'supercategory': 'object', 'id': 5, 'name': 'ball'},
  {'supercategory': 'object', 'id': 6, 'name': 'mouse'},
  {'supercategory': 'ovehicle', 'id': 7, 'name': 'bicycle'},
  {'supercategory': 'ovehicle', 'id': 8, 'name': 'car'},
  {'supercategory': 'ovehicle', 'id': 9, 'name': 'boat'},
]

class Annotate extends React.Component {
  state = {
    loading: true,
    task_id: '',
    name: '',
    description: '',
    images: [{src: "", name: "", regions: [], id: null}],
    selectedImage: 0,
    viewedAll: false,
  }

  getData = async (imagesID) => {
      const images = [];
      for (let i = 0; i < imagesID.length; i++){
        let item = await axios.get("http://localhost:8000/api/images/" + imagesID[i], {withCredentials: true});
        images.push({src: item.data.image, name: item.data.name, regions: [], id: item.data.id});
      };
      return images;
  }

  handleNext = () => {
    let i = this.state.selectedImage;
    let viewedAll = false;
    if (i === this.state.images.length - 1) {
      viewedAll = true
      message.warning('已经是最后一页了！');
    } else {
      i++;
      if (i === this.state.images.length - 1)
        viewedAll = true
    }
    this.setState({selectedImage: i, viewedAll: viewedAll});
    console.log(this.state);
  }

  handlePrev = () => {
    let i = this.state.selectedImage;
    if (i === 0) {
      message.warning('已经是第一页了！');
    } else {
      i--;
    }
    this.setState({selectedImage: i});
  }

  componentDidMount = () => {
    const {name, description, images} = this.props.task;
    this.getData(images).then(res => {
      this.setState({name: name, description: description, images: res, loading: false});
    }).catch( err=>{
      console.log(err);
    })
  }

  getAnnotations = (MainLayoutState) => {
    let annotations = [];
    for (let i = 0; i < MainLayoutState.images.length; i++){
      for (let j = 0; j < MainLayoutState.images[i].regions.length; j++){
        if (MainLayoutState.images[i].regions[j].type === 'polygon'){
          let segmentations = [];
          for (let k = 0; k < MainLayoutState.images[i].regions[j].points.length; k++){
            segmentations.push(MainLayoutState.images[i].regions[j].points[k][0]);
            segmentations.push(MainLayoutState.images[i].regions[j].points[k][1]);
          }
          annotations.push({
            'segmentation': [segmentations],
            'area': null,
            'iscrowd': 0,
            'image_id': MainLayoutState.images[i].id,
            'bbox': null,
            'category_id': categories.find(item => {
              return item.name === MainLayoutState.images[i].regions[j].cls;
            }).id,
            'id': parseInt(MainLayoutState.images[i].regions[j].id)
          })
        }
        else if (MainLayoutState.images[i].regions[j].type === 'box'){
          let bbox = [
            MainLayoutState.images[i].regions[j].x,
            MainLayoutState.images[i].regions[j].y,
            MainLayoutState.images[i].regions[j].w,
            MainLayoutState.images[i].regions[j].h,
          ];
          annotations.push({
            'segmentation': null,
            'area': null,
            'iscrowd': 0,
            'image_id': MainLayoutState.images[i].id,
            'bbox': bbox,
            'category_id': categories.find(item => {
              return item.name === MainLayoutState.images[i].regions[j].cls;
            }).id,
            'id': parseInt(MainLayoutState.images[i].regions[j].id)
          })
        }
      }
    }
    return annotations;
  }

  handleExit = (MainLayoutState) => {
    if (!this.state.viewedAll){
      message.error('您尚有未浏览的图片！');
      return;
    }
    let date = new Date();
    let dataset = {};
    dataset['info'] = {
      'description': this.state.name, 
      'url': '', 
      'version': '1.0',
      'year': date.getFullYear().toString(),
      'contributor': '',
      'date_created': date.toLocaleString(),
    };
    dataset['license'] = [
      {
        "url": "http://creativecommons.org/licenses/by-nc-sa/2.0/", 
        "id": 1, 
        "name": "Attribution-NonCommercial-ShareAlike License"
      },
    ];
    dataset['images'] = MainLayoutState.images.map(item => {
      return {
        'license': 1,
        'file_name': item.name,
        'coco_url': item.src,
        'height': item.pixelSize.h,
        'width': item.pixelSize.w,
        'date_captured': null,
        'flickr_url': '',
        'id': item.id
      }
    });
    dataset['categories'] = categories;
    dataset['annotations'] = this.getAnnotations(MainLayoutState);
    console.log(dataset);
    console.log(MainLayoutState); 
  }

  render(){
    const {images, loading, selectedImage, description} = this.state;
    if (loading)
      return <div></div>
    else
      return(
        <div>
          <ReactImageAnnotate
            labelImages
            regionClsList={categories.map(item => {return item.name})}
            images={images}
            taskDescription={description}
            // hideClone
            // hideSettings
            // hideFullScreen
            selectedImage={selectedImage}
            enabledTools={['select', 'create-box', 'create-polygon']}
            onExit={this.handleExit}
            onNextImage={this.handleNext}
            onPrevImage={this.handlePrev}
          /> 
        </div>
    )
  }
};

export default Annotate;
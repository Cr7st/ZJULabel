import * as React from 'react';
import ReactImageAnnotate from 'react-image-annotate';
import axios from 'axios';
import Layouts from '../components/Layouts';
import { message } from "antd";
import "../styles/annotation.css";
import getCookie from '../components/cookie_loader';

const categories = [
  {'supercategory': 'Person', 'id': 1, 'name': 'Person'},
  {'supercategory': 'Animal', 'id': 2, 'name': 'Bird'},
  {'supercategory': 'Animal', 'id': 3, 'name': 'Cat'},
  {'supercategory': 'Animal', 'id': 4, 'name': 'Cow'},
  {'supercategory': 'Animal', 'id': 5, 'name': 'Dog'},
  {'supercategory': 'Animal', 'id': 6, 'name': 'Horse'},
  {'supercategory': 'Animal', 'id': 7, 'name': 'Sheep'},
  {'supercategory': 'Vehicle', 'id': 8, 'name': 'Aeroplane'},
  {'supercategory': 'Vehicle', 'id': 9, 'name': 'Bicycle'},
  {'supercategory': 'Vehicle', 'id': 10, 'name': 'Boat'},
  {'supercategory': 'Vehicle', 'id': 11, 'name': 'Bus'},
  {'supercategory': 'Vehicle', 'id': 12, 'name': 'Car'},
  {'supercategory': 'Vehicle', 'id': 13, 'name': 'Motorbike'},
  {'supercategory': 'Vehicle', 'id': 14, 'name': 'Train'},
  {'supercategory': 'Indoor', 'id': 15, 'name': 'Bottle'},
  {'supercategory': 'Indoor', 'id': 16, 'name': 'Chair'},
  {'supercategory': 'Indoor', 'id': 17, 'name': 'Dining table'},
  {'supercategory': 'Indoor', 'id': 18, 'name': 'Potted plant'},
  {'supercategory': 'Indoor', 'id': 19, 'name': 'Sofa'},
  {'supercategory': 'Indoor', 'id': 20, 'name': 'TV'},
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
    submitted: false,
  }
  
  csrftoken = getCookie("csrftoken");

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
    const {name, description, images, id} = this.props.task;
    this.getData(images).then(res => {
      this.setState({task_id: id, name: name, description: description, images: res, loading: false});
    }).catch( err=>{
      console.log(err);
    })
  }

  extractCOCOAnnotations = (MainLayoutState) => {
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
            })['id'],
            'id': parseInt(MainLayoutState.images[i].regions[j].id)
          })
        }
      }
    }
    return annotations;
  }

  submitAnnotation = (dataset, type) => {
    const fmData = new FormData();
    fmData.append('task', this.state.task_id);
    if (type === 'COCO'){
      fmData.append('json_data', dataset);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": this.csrftoken
        },
        withCredentials: true
      }
      axios.post('http://localhost:8000/api/datasets/COCO/', fmData, config).then(res => {
        if (res.status === 200){
          message.success("COCO格式成功提交！");
          this.setState({submitted: true});
          return true;
        } else {
          message.error(res.data.msg)
        }
      }).catch(err => {
        message.error("COCO格式提交发生错误！");
        console.log(err);
        return false;
      })
    }
    else if (type === 'VOC'){
      const data = {
        "images": this.state.images.map(item => {
          return item.id;
        }),
        "annotations": dataset,
        "task": this.state.task_id
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": this.csrftoken
        },
        withCredentials: true
      }
      axios.post('http://localhost:8000/api/datasets/VOC/', data, config).then(
        res => {
          if (res.status === 200) {
            message.success("VOC格式成功提交！");
            this.setState({submitted: true});
          }
          else {
            message.error("VOC格式提交发生错误！");
            console.log(res)
          }
        }
      ).catch((err) =>{
          console.log(err)
      })
    }
  }

  extractVOCAnnotations = (MainLayoutState) => {
    var annotations = []
    MainLayoutState.images.forEach((image) => {
      var annotation = {}
      annotation["folder"] = "ImageSets"
      annotation["file_name"] = image.name
      annotation["size"] = {
        "height": image.pixelSize.h,
        "width": image.pixelSize.w,
        "depth": 3,
      }
      annotation["segmented"] = 0
      var objects = []
      image.regions.forEach((region) => {
        var object = {}
        object["name"] = region.cls
        object["bndbox"] = {
          "xmin": region.x,
          "xmax": region.x+region.w,
          "ymin": region.y,
          "ymax": region.y+region.h,
        }
        object["truncated"] = 0
        object["difficult"] = 0
        if (region.tags) {
          for (var tag of region.tags) {
            if (tag === "truncated") object["truncated"] = 1
            if (tag === "difficult") object["difficult"] = 1
          }
        }
        // console.log(object)
        objects.push(object)
      })
      annotation["object"] = objects
      annotations.push({"annotation": annotation})
    })
    return annotations;
  }

  handleExit = (MainLayoutState) => {
    if (!this.state.viewedAll){
      message.error('您尚有未浏览的图片！');
      return;
    } else if (this.state.submitted){
      message.error('您已经提交过了，请直接退出');
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
    dataset['annotations'] = this.extractCOCOAnnotations(MainLayoutState);
    this.submitAnnotation(JSON.stringify(dataset), 'COCO');
    this.submitAnnotation(this.extractVOCAnnotations(MainLayoutState), 'VOC');
  }

  render(){
    const {images, loading, selectedImage, description} = this.state;
    if (loading)
      return (
        <Layouts title="assets" classname="grid">
          <div></div>
        </Layouts>
      )
    else
      return(
        <Layouts title="assets" classname="grid">
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
        </Layouts>
    )
  }
};

export default Annotate;
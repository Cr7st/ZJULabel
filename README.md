# ZJULabel

**请使用 Chrome 或火狐浏览器**

## How to run

*  **Front End:**
  * `cd frontend` to go into the frontend workspace.
  * `npm install` to install all the dependencies. 
  * `npm start` to run the frontend on **localhost:3000**
* **Back End:**
  * `cd backend` to go into the backend workspace.
  * Please install the required python packages yourself. These packages are needed:
    * django
    * django-rest-framework
    * cv2
    * xmltodict
  * `python manage.py runserver` to run the backend on **localhost:8000**
* Notice: 
  * The address of the backend is hardcoded in the frontend, so don't change the port of the backend.
  * We recommend you to re-create a Django project instead of running this straightly if you just cloned this project from GitHub. Because there is already a lot of data in the database from current test. The data includes static resource like images, which is git-ignored. So these static resource will not be loaded correctly.

## Documentation

所有文档放在 `document` 文件夹中，包括设计报告、用户手册、测试报告、开发体会和小结。

All the documents are placed in `document` directory, including Design Report, Test Report, Manual, Development Experience and Summary.

Documents do not necessarily conform to software engineering standard since this project was just the course design of B/S System Software Design in Zhejiang University. lol.



## Knowing Bug

* 第一次进入标注界面时，标注界面的前端样式可能会出现问题，点击后退并重新进入后就会恢复正常，不影响正常使用。

  There might be some problem with the front-end style of the annotation page. It will return to normal by clicking Back end re-enter. This problem does not affect normal use.
  
* 使用 Edge 浏览器进入 MY TASK 界面时会有跨域问题无法加载，**请使用 Chrome 或 火狐浏览器！**

  There will be CORS issues causing loading error in MY TASK page when using Microsoft Edge. **Please use Chrome or Firefox!**

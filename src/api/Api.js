 import Env from '../conf/env';
 import * as API from './AxiosConf'
 
 let serverURL = Env.serverURL;
 export default {
    flvURL: `${serverURL}`,
    login: (params) => {
        return API.POST(`/system/login`,params)
    },
    cameraList: (params) => {
        return API.GET(`/camera/list`,params)
    },
    cameraEdit: (params) => {
        return API.POST(`/camera/edit`,params)
    },
    cameraDelete: (params) => {
        return API.POST(`/camera/delete/${params.id}`,params)
    },
    cameraEnabled: (params) => {
        return API.POST(`/camera/enabled`,params)
    },
 }
 
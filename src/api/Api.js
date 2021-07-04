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
    cameraDetail: (params) => {
        return API.GET(`/camera/detail`,params)
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
    cameraSaveVideoChange: (params) => {
        return API.POST(`/camera/savevideochange`,params)
    },
    cameraLiveChange: (params) => {
        return API.POST(`/camera/livechange`,params)
    },
    cameraPlayAuthcodeReset: (params) => {
        return API.POST(`/camera/playauthcodereset`,params)
    },
    cameraShareList: (params) => {
        return API.GET(`/camerashare/list`,params)
    },
    cameraShareEdit: (params) => {
        return API.POST(`/camerashare/edit`,params)
    },
    cameraShareDelete: (params) => {
        return API.POST(`/camerashare/delete/${params.id}`,params)
    },
    cameraShareEnabled: (params) => {
        return API.POST(`/camerashare/enabled`,params)
    },
 }
 
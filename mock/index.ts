import {MockMethod} from 'vite-plugin-mock'

const Mock = require('mockjs')
let dataList = [
    {
        text: '有没有猫砂推荐mock',
        match: 'EQ',
        id: '1',
        like: 0.6,
        useLike: true,
        listen: false,
        send: false,
        sendMessage: ''
    },
    {
        text: '有没有',
        match: 'EQ',
        id: '2',
        like: 0.6,
        useLike: true,
        listen: false,
        send: true,
        sendMessage: '你问一下群主'
    }, {
        text: 'hello',
        match: 'IN',
        id: '3',
        like: 0.6,
        useLike: true,
        listen: false,
        send: false,
        sendMessage: ''
    }, {
        text: '在吗',
        match: 'IN',
        id: '4',
        like: 0.6,
        useLike: true,
        listen: false,
        send: false,
        sendMessage: ''
    }
];
const appList = [
    {
        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fc4d767a9a0598e09eaf8f39f52f414545fead976156b4-7DLs5Q_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1674185257&t=d59112425a243f4a5f93fbb662d3ed2c',
        name: '微信',
        appid: '1',
        bundleId: 'com.tecent.xin',
        size: '230 MB',
        des: '社交软件12341advbasdfasfd1243214123412341243',
        latestVersion: '8.0.31'
    }, {

        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.99ppt.com%2Fpic%2F7dee1c28-8d5e-43a7-b8e7-496568acd30b.jpg&refer=http%3A%2F%2Fimg.99ppt.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1674185738&t=6706c9439e9779cc18f8e9ae4c73a14c',
        name: 'QQ',
        appid: '2',
        bundleId: 'com.tecent.imqq',
        size: '230 MB',
        des: '社交软件',
        latestVersion: '8.0.31'
    }
];
export default [
    {
        "url": '/version/ranks',
        "method": 'get',
        "response": () => {
            return {
                "status": "ok",
                "data": appList
            }
        },
    },
    {
        "url": '/search',
        "method": 'get',
        "response": ({query: {key}}) => {
            return {
                "status": "ok",
                "data": appList
            }
        },
    },
    {
        "url": '/versions/:appid',
        "method": 'get',
        "response": ({query: {appid}}) => {
            return {
                "status": "ok",
                "data": {
                    info: {
                        name: '微信',
                        appid: '',
                        bundleId: 'com.tecent.xin',
                        icon: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fc4d767a9a0598e09eaf8f39f52f414545fead976156b4-7DLs5Q_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1674185257&t=d59112425a243f4a5f93fbb662d3ed2c',
                    },
                    versions: [
                        {
                            name: '8.0.31',
                            des: '重大bug',
                            size: '230 MB',
                            url: ''
                        }, {

                            name: '8.0.31',
                            des: 'callkit',
                            size: '230 MB',
                            url: ''
                        }
                    ]
                }
            }
        },
    },
    {
        "url": '/api/info/:id',
        "method": 'get',
        "response": ({query: {id}}) => {
            return {
                "status": "ok",
                "data": dataList.find(function (item) {
                    return item.id === id;
                })
            }
        },
    },
    {
        "url": '/api/info/:id',
        "method": 'post',
        "response": ({body, query: {id}}) => {
            dataList = dataList.map(function (item) {
                if (item.id === id) {
                    return body;
                } else {
                    return item;
                }
            })
            return {
                "status": "ok"
            }
        },
    },
    {
        "url": '/api/info/:id',
        "method": 'delete',
        "response": ({query: {id}}) => {
            dataList = dataList.filter(function (item) {
                return item.id !== id
            });
            return {
                "status": "ok"
            }
        },
    },
    {
        url: '/api/infos',
        method: 'get',
        response: () => {
            return {
                status: "ok",
                data: {
                    listen: true,
                    list: dataList
                },
            }
        },
    },
] as MockMethod[]
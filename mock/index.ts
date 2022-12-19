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
export default [
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
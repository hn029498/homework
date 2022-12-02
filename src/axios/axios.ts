import axios from "axios";
const service = axios.create({
    timeout: 20000, // 请求超时时间
    // crossDomain: true, //设置cross跨域
    withCredentials: true, //设置cross跨域 并设置访问权限 允许跨域携带cookie信息
    headers: {
        "Content-Type": "application/json"
    }
});

export default service;

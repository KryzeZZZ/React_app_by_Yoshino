import { Input } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';
import { Button, SplitButtonGroup } from '@douyinfe/semi-ui';
import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    let navigate = useNavigate();
    const loginAction = () => {
        const reqLogin = new Promise((resolve, reject) => {
            let state = Math.random();
            if (state >= 0.5) {
                setLoginState(true)
                navigate('/callroll');
                resolve("login success");
            } else {
                setLoginState(false)
                reject("login error");
            }
        }).then().catch();
    }
    const {Text, Title} = Typography;
    const [psw, setPsw] = useState();
    const [acc, setAcc] = useState();
    const [loginState, setLoginState] = useState();
    return(
        <>
            <Title>欢迎</Title>
            <Input placeholder={"请输入账号"} value={acc} onChange={value => setAcc()}></Input>
            <Input placeholder={"请输入密码"} mode={"password"} value={psw} onChange={value => setPsw()}></Input>
            {!loginState && <Text type={"danger"}>{'登陆失败'}</Text>}
            <Button disabled={!acc || !psw} onClick={loginAction}>{'登录'}</Button>
            <Text>{'注册'}</Text>
        </>
    )
}

export default Login;

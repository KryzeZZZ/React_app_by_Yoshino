import { Input } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';
import { Button, SplitButtonGroup } from '@douyinfe/semi-ui';
import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss'
import { Divider } from '@douyinfe/semi-ui';

function Login() {
    let navigate = useNavigate();
    const [account, setAccount] = useState();
    const [passwd, setPasswd] = useState();
    const [loginState, setLoginState] = useState(true);
    const inputAccountRef = useRef(null);
    useEffect(() => {
        inputAccountRef.current.focus();
    }, [])
    return (
        <div className={styles.root}>
            <div className={"Logo"}><img className={"logo_img"} src="login_page/logo.svg"/></div>
            <div className={"Content"}>
                <div className={"login_title"}>
                    <Typography.Title className={"title_text"} heading={2}>欢迎登录教师点名系统</Typography.Title>
                    <Input ref={inputAccountRef} placeholder={'请输入账号'} onChange={account => {
                        setAccount(account)
                    }}></Input>
                    <Input placeholder={'请输入密码'} mode="password" onChange={passwd => {
                        setPasswd(passwd)
                    }}></Input>
                    {loginState === false && <div><Typography.Text type={"danger"}>登录失败</Typography.Text></div>}
                </div>
                <div className={"login_button_footer"}>
                    <div><Button onClick={state => {
                        const loginAction = new Promise((resolve, reject) => {
                            let state = Math.random();
                            if (state >= 0.5) {
                                setLoginState(true)
                                navigate('/callroll');
                                resolve("login success");
                            } else {
                                setLoginState(false)
                                reject("login error");
                            }
                        })
                        loginAction.then(stateCode => {
                            console.log(stateCode)
                        }).catch(stateCode => {
                            console.log(stateCode)
                        });
                    }
                    } disabled={!account || !passwd}>登录</Button></div>
                    <div><Typography.Text>如果没有账号点击这里注册</Typography.Text></div>
                </div>
                <Divider className="line"/>
            </div>
        </div>
    );
}

export default Login;

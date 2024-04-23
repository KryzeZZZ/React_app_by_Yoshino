import React, {useEffect, useState} from 'react';
import {Button, SplitButtonGroup, Typography} from '@douyinfe/semi-ui';
import { Layout } from '@douyinfe/semi-ui';
import { List, Descriptions, ButtonGroup, Rating } from '@douyinfe/semi-ui';
import axios from 'axios';

function CallRoll() {
    const [data, setData] = useState([]);
    const [chooseList, setChooseList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:4000/Students')
            .then(response => {
                console.log(response.data);
                setData(response.data)
                setChooseList(response.data)
            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    function CallrollAction(StuList) {
        let chooseState = Math.random();
        setChooseList(StuList.filter((content, index) => index != parseInt(chooseState / (1 / StuList.length))))
        return StuList[parseInt(chooseState / (1 / StuList.length))].name;
    }
    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
    };
    let [chosenOne, setChosenOne] = useState("None");
    const { Header, Footer, Sider, Content } = Layout;
    return (
        <Layout>
            <Header>Callroll System</Header>
            <Layout>
                <Sider>
                    <div>
                        <List
                            grid={{
                                gutter: 12,
                                span: 6,
                            }}
                            dataSource={data}
                            renderItem={item => (
                                <List.Item style={style}>
                                    <div>
                                        <h3 style={{
                                            color: 'var(--semi-color-text-0)',
                                            fontWeight: 500
                                        }}>{item.name}</h3>
                                        <Descriptions
                                            align="center"
                                            size="small"
                                            row
                                            data={[
                                                {key: '分数', value: item.points},
                                            ]}
                                        />
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                </Sider>
                <Content>
                    <div>
                        <Button onClick={() => {
                            setChosenOne(CallrollAction(chooseList))
                        }}>点名</Button>
                    </div>
                    <Typography.Text>{chosenOne}</Typography.Text>
                </Content>
            </Layout>
        </Layout>

    )

}

export default CallRoll
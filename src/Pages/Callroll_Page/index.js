import React, {useEffect, useState} from 'react';
import {Button, SplitButtonGroup, Typography} from '@douyinfe/semi-ui';
import { Layout } from '@douyinfe/semi-ui';
import { List, Descriptions, ButtonGroup, Rating, Modal } from '@douyinfe/semi-ui';
import axios from 'axios';

function CallRoll() {
    const [visible, setVisible] = useState(false);
    const showDialog = () => {
        setVisible(true);
    };
    const handleOk = () => {
        setVisible(false);
        console.log('Ok button clicked');
    };
    const handleCancel = () => {
        setVisible(false);
        console.log('Cancel button clicked');
    };
    const handleAfterClose = () => {
        console.log('After Close callback executed');
    };
    const [data, setData] = useState([]);
    const {Text, Title} = Typography;
    const [chooseList, setChooseList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:3000/Students')
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
        const outputName = new Promise((resolve, reject) => {
            if(!StuList || StuList.length === 0) reject("None")
            else {
                showDialog()
                resolve(StuList[parseInt(chooseState / (1 / StuList.length))].name)
            }
        })
            .then(name => setChosenOne(name)).catch(name => setChosenOne(name))
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
        <Layout className="components-layout-demo">
            <Header>CallRoll System</Header>
            <Content style={{height: 300, lineHeight: '300px'}}>
                <List
                    grid={{
                        gutter: 12,
                        span: 6,
                    }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item style={style}>
                            <div>
                                <h3 style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{item.name}</h3>
                                <Descriptions
                                    align="center"
                                    size="small"
                                    row
                                    data={[
                                        { key: '分数', value: item.points },
                                    ]}
                                />
                            </div>
                        </List.Item>
                    )}
                />
                <Button onClick={() => {CallrollAction(chooseList)}}>点名</Button>
                <Modal
                    title="抽取成功"
                    visible={visible}
                    onOk={handleOk}
                    afterClose={handleAfterClose} //>=1.16.0
                    onCancel={handleCancel}
                    closeOnEsc={true}
                >
                    {chosenOne}
                </Modal>
            </Content>
        </Layout>
    )

}

export default CallRoll
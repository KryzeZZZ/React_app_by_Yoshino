import React, {useEffect, useState} from 'react';
import {Button, SplitButtonGroup, Typography, Spin} from '@douyinfe/semi-ui';
import { Layout } from '@douyinfe/semi-ui';
import { List, Descriptions, ButtonGroup, Rating, Modal } from '@douyinfe/semi-ui';
import axios from 'axios';
import useSWR from 'swr';

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
    // const [data, setData] = useState([]);
    const {Text, Title} = Typography;
    const [chooseList, setChooseList] = useState([]);
    let [chosenOne, setChosenOne] = useState("None");
    const [shownData, setShownData] = useState([]);
    const {data, error, isLoading} = useSWR('http://localhost:3000/Students', () => axios.get('http://localhost:3000/Students').then(response => response.data));
    useEffect(() => {
        if (!chooseList || chooseList.length === 0) {
            console.log('ChooseList is empty');
            if (data) {
                const resetData = data.map(item => ({
                    ...item,
                    chooseAble: true
                }));
                setShownData(resetData);
                setChooseList(resetData);
            }
        }
    }, [data, chooseList]);
    if(error) return <div>loading failed</div>;
    if(isLoading) return <Spin></Spin>;
    function CallrollAction(StuList) {
        let chooseState = Math.random();
        let index_num = parseInt(chooseState / (1 / StuList.length));
        let target_name = chooseList[index_num].name;
        const newChooseList = StuList.filter((content, index) => index !== index_num);
        setChooseList(newChooseList);
        const newShownData = shownData.map(item => {
            if (item.name === target_name) {
                return { ...item, chooseAble: false };
            } else {
                return item;
            }
        });
        setShownData(newShownData);
        const outputName = new Promise((resolve, reject) => {
            if (!StuList || StuList.length === 0) {
                reject("None");
            } else {
                showDialog();
                resolve(StuList[index_num].name);
            }
        }).then(name => setChosenOne(name)).catch(name => setChosenOne(name));
    }
    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
    };
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
                    dataSource={shownData}
                    renderItem={item => (
                        <List.Item style={style}>
                            <div>
                                <h3 style={{color: item.chooseAble ? 'black' : 'grey'}}>{item.name}</h3>
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
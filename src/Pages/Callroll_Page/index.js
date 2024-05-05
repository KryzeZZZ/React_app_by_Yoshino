import React, { useEffect, useState } from 'react';
import {Button, Typography, Spin, Modal, Layout, List, Descriptions, Space, Tabs, TabPane, Input} from '@douyinfe/semi-ui';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import Text from "@douyinfe/semi-ui/lib/es/typography/text";

function StudentLabel(stuDetail) {
    return (
        <List.Item style={{ border: '1px solid var(--semi-color-border)', backgroundColor: 'var(--semi-color-bg-2)', borderRadius: '3px', paddingLeft: '20px' }}>
            <Space vertical><h3 style={{ color: stuDetail.chooseAble ? 'black' : 'grey' }}>{stuDetail.name}</h3>
                <div>
                    <Descriptions align="center" size="small"  data={[{ key: '分数', value: stuDetail.points }]} />
                </div>
            </Space>
        </List.Item>
    )
}
function CallRoll() {
    const locationState = useLocation();
    const [visible, setVisible] = useState(false);
    const [chosenOne, setChosenOne] = useState("None");
    const [chooseList, setChooseList] = useState([]);
    const [shownData, setShownData] = useState([]);
    const [groups, setGroups] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [groupSize, setGroupSize] = useState(0);
    const { data, error, isLoading } = useSWR('http://localhost:3000/account', () =>
        axios.get('http://localhost:3000/account').then(res => res.data)
    );
    useEffect(() => {
        if (!chooseList.length && data) {
            const lessonData = data[locationState.state.state.id]["lessons"][locationState.state.state.lessonId]["Students"];
            const formattedData = lessonData.map(student => ({
                ...student,
                chooseAble: true
            }));
            setRawData(formattedData);
            setShownData(formattedData);
            setChooseList(formattedData);
        }
    }, [data, chooseList, groups]);

    if (error) return <div>Loading failed</div>;
    if (isLoading) return <Spin />;
    const divideGroup = (groupSize) => {
        const copyArray = rawData;
        const groups = [];
        while (copyArray.length > 0) {
            const group = [];
            for (let i = 0; i < groupSize && copyArray.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * copyArray.length);
                group.push(copyArray.splice(randomIndex, 1)[0]);
            }
            groups.push(group);
        }

        setGroups(groups)
    }
    const handleCorrect = () => {
        const studentToUpdate = shownData.findIndex(student => student.name === chosenOne);
        let update_data = shownData;
        let temp_data = data;
        temp_data[locationState.state.state.id]["lessons"][locationState.state.state.lessonId]["Students"][studentToUpdate].points ++;
        update_data.account = temp_data
        // console.log(update_data)
        update_data[studentToUpdate].points ++;
        // console.log(update_data);
        setShownData(update_data)
        // axios.put("http://localhost:3000/", update_data).then(response => {
        //     console.log('Score updated successfully', response);
            setVisible(false);
        // }).catch(error => {
        //     console.error('Failed to update score', error);
        // });
    };

    const handleWrong = () => {
        setVisible(false);
        console.log('Wrong button clicked');
    };


    const handleAfterClose = () => {
        console.log('After Close callback executed');
    };

    const callRollAction = () => {
        const randomIndex = Math.floor(Math.random() * chooseList.length);
        const selectedStudent = chooseList[randomIndex];

        setChosenOne(selectedStudent.name);
        setChooseList(chooseList.filter((_, index) => index !== randomIndex));
        setShownData(shownData.map(student =>
            student.name === selectedStudent.name ? { ...student, chooseAble: false } : student
        ));
        setVisible(true);
    };

    const { Header, Content } = Layout;

    return (
        <Layout className="components-layout-demo">
            <Header>Call Roll System</Header>
            <Tabs>
                <TabPane tab={"单人"} itemKey={1}>
                    <Content style={{ height: 300, lineHeight: '300px' }}>
                        <List
                            grid={{ gutter: 12, span: 6 }}
                            dataSource={shownData}
                            renderItem={item => (
                                StudentLabel(item)
                            )}
                        />
                    </Content>
                    <Button onClick={callRollAction}>点名</Button>
                </TabPane>
                <TabPane tab={"分组"} itemKey={2}>
                    <Content style={{ height: 300, lineHeight: '300px' }}>
                        <List
                            grid={{ gutter: 12, span: 6 }}
                            dataSource={shownData}
                            renderItem={item => (
                                StudentLabel(item)
                            )}
                        />
                    </Content>
                    <Text>每组分成 <Input onChange={value => setGroupSize(value)}/> 人</Text>
                    <Button onClick={() => {divideGroup(groupSize)}} disabled={!(groupSize)}>随机分组</Button>
                    <List
                        grid={{ gutter: 1, column: 5}}
                        dataSource={groups}
                        renderItem={(group, index) => (
                            <div>
                                <Typography.Title level={1}>
                                    Group {index + 1}
                                </Typography.Title>
                                {group.map(student => (
                                    StudentLabel(student)
                                ))}
                            </div>
                        )}
                    />
                </TabPane>
                <Modal
                    title="抽取成功"
                    visible={visible}
                    onOk={handleCorrect}
                    onCancel={handleWrong}
                    okText="正确"
                    cancelText="错误"
                    afterClose={handleAfterClose}
                    closeOnEsc={true}
                >
                    {chosenOne}
                </Modal>
            </Tabs>

        </Layout>
    );
}

export default CallRoll

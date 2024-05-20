import React, { useEffect, useState } from 'react';
import { Button, Typography, Spin, Modal, Layout, List, Descriptions, Space, Tabs, Input, Form, Notification, TabPane } from '@douyinfe/semi-ui';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import styles from './index.module.scss';
import { IconArrowLeft } from "@douyinfe/semi-icons";

const addScoreRecord = async (courseId, studentId, scoreData, token) => {
    try {
        const response = await axios.post(`http://localhost:5050/courses/${courseId}/students/${studentId}/scores`, scoreData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding score record:', error);
        throw error;
    }
};

function StudentLabel(stuDetail) {
    return (
        <List.Item style={{ border: '1px solid var(--semi-color-border)', backgroundColor: 'var(--semi-color-bg-2)', borderRadius: '3px', paddingLeft: '20px' }}>
            <Space vertical><h3 style={{ color: stuDetail.chooseAble ? 'black' : 'grey' }}>{stuDetail.name}</h3>
                <div>
                    <Descriptions align="center" size="small" data={[{ key: '分数', value: stuDetail.points }]} />
                </div>
            </Space>
        </List.Item>
    );
}

function CallRoll() {
    const token = localStorage.getItem('token');
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [chosenOne, setChosenOne] = useState("None");
    const [chooseList, setChooseList] = useState([]);
    const [shownData, setShownData] = useState([]);
    const [originData, setOriginData] = useState([]);
    const [groups, setGroups] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [groupSize, setGroupSize] = useState(0);
    const [date, setDate] = useState('');
    const [session, setSession] = useState(0);
    const [score, setScore] = useState(0);
    const { Text, Title } = Typography;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const { data, error, isLoading } = useSWR(`http://localhost:5050/courses/${courseId}/students`, () =>
        axios.get(`http://localhost:5050/courses/${courseId}/students`, { headers }).then(res => res.data)
    );

    function goBack() {
        navigate(-1);  // 返回上一页
    }

    useEffect(() => {
        console.log(data);
        if (data) {
            setRawData(data);
            let tempData = [...data];
            console.log(tempData);
            tempData.forEach((item) => {
                if (!item.attendance) item.chooseAble = true;
                if (!item.scores || item.scores.length === 0) item.points = 0;
                else item.points = item.scores[0].score;
            });
            setOriginData(tempData);
            setShownData(tempData);
            localStorage.setItem('stuState', JSON.stringify(tempData));
        }
    }, [data]);

    useEffect(() => {
        if (shownData) {
            let tempData = [];
            shownData.forEach(value => {
                if (value.chooseAble) {
                    tempData.push(value);
                }
            });
            setChooseList(tempData);
        }
    }, [shownData]);

    useEffect(() => {
        if (chooseList.length === 0) {
            setShownData(originData);
            if (originData) {
                let tempData = [];
                originData.forEach(value => {
                    if (value.chooseAble) {
                        tempData.push(value);
                    }
                });
                setChooseList(tempData);
            }
        }
    }, [chooseList, originData]);

    if (error) return <div>Loading failed</div>;
    if (isLoading) return <Spin />;

    const divideGroup = (groupSize) => {
        const copyArray = [...rawData];
        const groups = [];
        while (copyArray.length > 0) {
            const group = [];
            for (let i = 0; i < groupSize && copyArray.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * copyArray.length);
                group.push(copyArray.splice(randomIndex, 1)[0]);
            }
            groups.push(group);
        }
        setGroups(groups);
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleCorrect = async () => {
        const studentToUpdate = shownData.findIndex(student => student.name === chosenOne);
        let update_data = [...shownData];
        update_data[studentToUpdate].points++;
        setShownData(update_data);
        setVisible(false);

        const currentDate = getCurrentDateTime();  // 获取当前日期和时间字符串
        setDate(currentDate);

        try {
            await addScoreRecord(courseId, shownData[studentToUpdate].id, { date: currentDate, session, score: update_data[studentToUpdate].points }, token);
            Notification.success({
                title: 'Success',
                content: 'Score record added successfully!',
            });
        } catch (error) {
            Notification.error({
                title: 'Error',
                content: 'Failed to add score record',
            });
        }
    };

    const handleWrong = () => {
        setVisible(false);
    };

    const handleAfterClose = () => {
        // 你可以在这里添加任何需要在模态框关闭后执行的代码
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
        <div className={styles.root}>
            <Button theme='light' type='tertiary' icon={<IconArrowLeft />} className={"backButton"} onClick={goBack}></Button>
            <div className={"header_container"}>
                <Title heading={1}>Call Roll System</Title>
            </div>
            <Tabs className={"tabs"}>
                <TabPane tab={"单人"} itemKey={1}>
                    <Content style={{ height: 300, lineHeight: '300px' }}>
                        <List
                            grid={{ gutter: 12, span: 6 }}
                            dataSource={shownData}
                            renderItem={item => (
                                <StudentLabel key={item.id} {...item} />
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
                                <StudentLabel key={item.id} {...item} />
                            )}
                        />
                    </Content>
                    <Text>每组分成 <Input onChange={e => setGroupSize(e)} /> 人</Text>
                    <Button onClick={() => { divideGroup(groupSize) }} disabled={!(groupSize)}>随机分组</Button>
                    <List
                        grid={{ gutter: 1, column: 5 }}
                        dataSource={groups}
                        renderItem={(group, index) => (
                            <div key={index}>
                                <Typography.Title level={1}>
                                    Group {index + 1}
                                </Typography.Title>
                                {group.map(student => (
                                    <StudentLabel key={student.id} {...student} />
                                ))}
                            </div>
                        )}
                    />
                </TabPane>
                <TabPane tab={"添加分数记录"} itemKey={3}>
                    <Form>
                        <Form.Input
                            field="date"
                            label="Date"
                            placeholder="YYYY-MM-DD HH:MM:SS"
                            value={date}
                            disabled
                        />
                        <Form.Input
                            field="session"
                            label="Session"
                            placeholder="0 for morning, 1 for afternoon"
                            onChange={(value) => setSession(Number(value))}
                            value={session}
                        />
                        <Form.Input
                            field="score"
                            label="Score"
                            placeholder="Enter score"
                            onChange={(e) => setScore(Number(e))}
                            value={score}
                        />
                        <Button type="primary" onClick={handleCorrect}>
                            Add Score
                        </Button>
                    </Form>
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
        </div>
    );
}

export default CallRoll;

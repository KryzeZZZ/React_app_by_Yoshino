import React, { useEffect, useState } from 'react';
import { Button, Typography, Spin, Modal, Layout, List, Input, Notification, Tabs, TabPane } from '@douyinfe/semi-ui';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import styles from './index.module.scss';
import { IconArrowLeft, IconPlus } from "@douyinfe/semi-icons";
import Text from "@douyinfe/semi-ui/lib/es/typography/text";

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
        <Button block
                theme='solid'
                type='primary'
                className={"studentButton"}
        >
            <Text type={stuDetail.chooseAble ? 'black' : 'tertiary'}>{stuDetail.name} {stuDetail.points}</Text>
        </Button>
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
    const fetcherWithHeaders = (url) => axios.get(url, { headers }).then(response => response.data).catch(error => console.log(error));
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
                if (!item.attendances) item.chooseAble = true;
                else {
                    if(item.attendances[0].status === 1) item.chooseAble = true;
                    else item.chooseAble = false;
                }
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
            mutate(`http://localhost:5050/courses/${courseId}/students`, fetcherWithHeaders).catch();
            setShownData(data);
            if (data) {
                let tempData = [];
                data.forEach(value => {
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
        return now.toLocaleString('zh-CN', { timeZone: 'Asia/Beijing' });
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
            <div className={"headContainer"}>
                <Button theme='light' type='tertiary' icon={<IconArrowLeft />} className={"backButton"} onClick={goBack}></Button>
                <div className={"funcContainer"}>
                    <Button  className={"addButton"} theme='light' type='tertiary' icon={<IconPlus />} iconPosition={"left"}>手动改分</Button>
                    <Button  className={"addButton"} theme='light' type='tertiary' icon={<IconPlus />} iconPosition={"left"}>修改考勤</Button>
                </div>
            </div>
            <div className={"header_container"}>
                <Title heading={1}>上课</Title>
            </div>
            <Tabs className={"tabs"}>
                <TabPane tab={"单人"} itemKey={1} className={"Single"}>
                    <List
                        dataSource={shownData}
                        className={"LabelContainer"}
                        renderItem={item => (
                            <Button block
                                    theme='solid'
                                    type='primary'
                                    className={"studentButton"}
                            >
                                <Text type={item.chooseAble ? 'black' : 'tertiary'}>{item.name} {item.points}</Text>
                            </Button>
                        )}
                    />
                    <div className={"CallrollContainer"}>
                        <Button theme='solid' type='primary' className={"CallrollButton"} onClick={callRollAction}>
                            <Title heading={3} style={{color: "white"}}>回答问题</Title>
                        </Button>
                    </div>
                </TabPane>
                <TabPane tab={"分组"} itemKey={2} className={"Group"}>
                    <List
                        dataSource={shownData}
                        className={"LabelContainer"}
                        renderItem={item => (
                            <Button block
                                    theme='solid'
                                    type='primary'
                                    className={"studentButton"}
                            >
                                <Text type={item.chooseAble ? 'black' : 'tertiary'}>{item.name} {item.points}</Text>
                            </Button>
                        )}
                    />
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
            <img src={"/lesson_page/moonIcon.svg"} className={"moonshotIcon"} alt="Moon icon"/>
        </div>
    );
}

export default CallRoll;

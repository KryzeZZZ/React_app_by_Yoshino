import React, { useEffect, useState } from 'react';
import { Modal, Button, List, Typography, Spin, Popconfirm, Card, Layout, Input, Notification, Table } from '@douyinfe/semi-ui';
import { IconArrowLeft, IconPlus, IconClose, IconCalendar } from '@douyinfe/semi-icons';
import styles from './index.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import AttendanceModal from '../../Components/AttendanceModal';

const { Text, Title } = Typography;
const { Content, Sider } = Layout;

function CustomTag({ iconPath, title, buttonText, bgColor, btnColor, btnTextColor, titleColor, navigateFunc }) {
    return (
        <Card style={{ zIndex: 2, backgroundColor: bgColor, width: 324, height: 324, textAlign: 'center', border: 'none', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ margin: '20px 0' }}>
                <img src={iconPath} alt="Icon" style={{ width: 144, height: 144 }} />
            </div>
            <div className={"cardContainer"}>
                <Title heading={1} style={{ color: titleColor }}>{title}</Title>
                <Button
                    theme="solid"
                    type="primary"
                    style={{ backgroundColor: btnColor, borderColor: btnColor, color: btnTextColor }}
                    onClick={navigateFunc}
                >
                    <Title heading={5} style={{ color: btnTextColor }}>{buttonText}</Title>
                </Button>
            </div>
        </Card>
    );
}

function StudentChoose() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [modalVisible, setModalVisible] = useState(false);
    const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
    const [students, setStudents] = useState([]);
    const [newStudentName, setNewStudentName] = useState("");
    const [hoveredStudent, setHoveredStudent] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showTable, setShowTable] = useState(false);

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const fetcherWithHeaders = (url) => axios.get(url, { headers }).then(response => response.data).catch(error => console.log(error));

    const { data, error, isLoading } = useSWR(`http://localhost:5050/courses/${courseId}/students`, () =>
        axios.get(`http://localhost:5050/courses/${courseId}/students`, { headers }).then(res => res.data)
    );

    const addStudent = (studentName) => {
        const body = { studentName: studentName };
        axios.post(`http://localhost:5050/courses/${courseId}/students`, body, { headers })
            .then(res => {
                console.log("Student added:", res.data);
                mutate(`http://localhost:5050/courses/${courseId}/students`, fetcherWithHeaders).catch();
                setModalVisible(false);
            })
            .catch(err => {
                console.error("Error adding student:", err);
            });
    };

    const deleteStudent = (studentId) => {
        const body = { studentId: studentId };
        axios.post('http://localhost:5050/students/delete', body, { headers })
            .then(res => {
                console.log("Student deleted:", res.data);
                mutate(`http://localhost:5050/courses/${courseId}/students`, fetcherWithHeaders).catch()
            })
            .catch(err => {
                console.error("Error deleting student:", err);
            });
    };

    const showModal = () => {
        setModalVisible(true);
    };

    const handleOk = () => {
        addStudent(newStudentName);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleAttendanceCancel = () => {
        setAttendanceModalVisible(false);
    };

    const handleAttendanceConfirm = async (attendanceRecords) => {
        try {
            const requests = attendanceRecords.map(record =>
                axios.post(`http://localhost:5050/courses/${courseId}/students/${record.id}/attendances`, {
                    class_time: record.class_time,
                    date: record.date,
                    session: record.session,
                    status: record.status
                }, { headers })
            );
            await Promise.all(requests);
            Notification.success({
                title: 'Success',
                content: 'Attendance records added successfully!',
            });
            mutate(`http://localhost:5050/courses/${courseId}/students`, fetcherWithHeaders).catch();
        } catch (error) {
            console.error('Error adding attendance records:', error);
            Notification.error({
                title: 'Error',
                content: 'Failed to add attendance records',
            });
        }
        setAttendanceModalVisible(false);
    };

    const formatDate = (dateString) => {
        return dateString.split('T')[0];
    };

    const groupAttendancesByDateAndSession = (students) => {
        const groupedAttendances = {};

        students.forEach(student => {
            student.attendances.forEach(attendance => {
                const key = `${attendance.date}*${attendance.session}`;
                if (!groupedAttendances[key]) {
                    groupedAttendances[key] = [];
                }
                groupedAttendances[key].push({
                    name: student.name,
                    status: attendance.status,
                    note: attendance.note
                });
            });
        });

        return groupedAttendances;
    };

    useEffect(() => {
        if (data !== undefined) {
            console.log(data);
            setStudents(data);
        }
    }, [data]);

    if (error) return <div>Loading failed</div>;
    if (isLoading) return <Spin />;

    const attendancesGrouped = groupAttendancesByDateAndSession(students);

    function goBack() {
        navigate(-1);
    }

    function EmptyContent() {
        return (
            <div className={"EmptyContent"}>
                <Button theme='light' type='tertiary' icon={<IconArrowLeft />} className={"backButton"} onClick={goBack}></Button>
                <div className={"titleContent"}>
                    <Title heading={1}>请选择您的学生</Title>
                </div>
                <div className={"NoticeContent"}>
                    <img src={"/lesson_page/Notfind.svg"} alt="No students found" />
                    <Title heading={2}>您还没有添加任何学生</Title>
                    <Text>点击下面的按钮添加学生，您最多可添加n个学生</Text>
                    <Button onClick={showModal} theme='solid' type='primary' className={"emptyCreate"}>添加学生</Button>
                </div>
            </div>
        );
    }

    function chooseStudent(studentId) {
        // navigate(`/callroll/${studentId}`)
    }

    function NonEmptyContent() {
        return (
            <div className={"nonEmptyContent"}>
                <Button theme='light' type='tertiary' icon={<IconArrowLeft />} className={"backButton"} onClick={goBack}></Button>
                <div className={"titleContent"}>
                    <Title heading={1}>请选择您的学生</Title>
                    <Button className={"addButton"} onClick={showModal} theme='light' type='tertiary' icon={<IconPlus />} iconPosition={"left"}>添加学生</Button>
                </div>
                <List className={"classList"}
                      dataSource={students}
                      renderItem={item => (
                          <div className={"listItem"}>
                              <div className={"listLabelBox"} onMouseEnter={() => setHoveredStudent(item.id)} onMouseLeave={() => setHoveredStudent(null)}>
                                  <Button block theme='solid' type='primary' className={"studentButton"} onClick={() => { chooseStudent(item.id) }}>
                                      {item.name}
                                  </Button>
                                  {hoveredStudent === item.id && (
                                      <Popconfirm title="确定要删除这个学生吗?" onConfirm={() => deleteStudent(item.id)} okText="是" cancelText="否" position="bottom" arrowPointAtCenter>
                                          <IconClose className={"deleteIcon"} />
                                      </Popconfirm>
                                  )}
                              </div>
                          </div>
                      )}
                />
                <div className={"buttonsContainer"}>
                    <CustomTag
                        iconPath={"/student_page/icon1.svg"}
                        title="上课"
                        buttonText="进入"
                        bgColor="#FFF6E5"
                        btnColor="#FF8C00"
                        btnTextColor="#FFFFFF"
                        titleColor="#8B572A"
                        navigateFunc={() => navigate(`/callroll/${courseId}`)}
                    />
                    <CustomTag
                        iconPath={"/student_page/icon2.svg"}
                        title="考勤"
                        buttonText="进入"
                        bgColor="#E5F7FF"
                        btnColor="#2F80ED"
                        btnTextColor="#FFFFFF"
                        titleColor="#2F80ED"
                        navigateFunc={() => setShowSidebar(true)}
                    />
                    <CustomTag
                        iconPath={"/student_page/icon3.svg"}
                        title="统计"
                        buttonText="查看"
                        bgColor="#E6F4EA"
                        btnColor="#6FCF97"
                        btnTextColor="#FFFFFF"
                        titleColor="#6FCF97"
                        navigateFunc={() => setShowTable(true)}
                    />
                </div>
            </div>
        );
    }

    const columns = [
        {
            title: '学生姓名',
            dataIndex: 'name',
            key: 'name',
        },
    ];

    const dates = [...new Set(students.flatMap(student => student.scores.map(score => score.date.split('T')[0])))];
    dates.forEach(date => {
        columns.push(
            {
                title: `${date} 上午`,
                dataIndex: `${date}-0`,
                key: `${date}-0`,
                render: (text) => text ?? '-',
            },
            {
                title: `${date} 下午`,
                dataIndex: `${date}-1`,
                key: `${date}-1`,
                render: (text) => text ?? '-',
            }
        );
    });

    columns.push({
        title: '总统计',
        dataIndex: 'totalScore',
        key: 'totalScore',
    });

    const dataSource = students.map(student => {
        const scores = {};
        dates.forEach(date => {
            const morningScore = student.scores
                .filter(score => new Date(score.date).toISOString().split('T')[0] === date && new Date(score.date).getUTCHours() < 12)
                .reduce((latest, score) => (new Date(score.date) > new Date(latest.date) ? score : latest), { date: '1970-01-01T00:00:00.000Z', score: '-' });
            const afternoonScore = student.scores
                .filter(score => new Date(score.date).toISOString().split('T')[0] === date && new Date(score.date).getUTCHours() >= 12)
                .reduce((latest, score) => (new Date(score.date) > new Date(latest.date) ? score : latest), { date: '1970-01-01T00:00:00.000Z', score: '-' });

            scores[`${date}-0`] = morningScore.score;
            scores[`${date}-1`] = afternoonScore.score;
        });
        return {
            name: student.name,
            ...scores,
            totalScore: student.scores.reduce((total, score) => total + score.score, 0),
        };
    });


    return (
        <Layout>
            <Content>
                <div className={styles.root}>
                    <Modal
                        title={<Title heading={5}>输入你添加的学生姓名</Title>}
                        visible={modalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        closeOnEsc={true}
                        centered={true}
                        width={700}
                    >
                        <Input placeholder={"请输入学生姓名"} onChange={e => setNewStudentName(e)}></Input>
                    </Modal>
                    {!students.length ? <EmptyContent /> : <NonEmptyContent />}
                    <img src={"/lesson_page/moonIcon.svg"} className={"moonshotIcon"} alt="Moon icon" />
                </div>
            </Content>
            {showSidebar && (
                <Sider className={styles.sider}>
                    <div className={"content"}>
                        <div className={"headContainer"}>
                            <Title heading={1}>考勤</Title>
                            <Button
                                theme='borderless'
                                type='tertiary'
                                icon={<IconClose />}
                                className={"backButton"}
                                onClick={() => setShowSidebar(false)}
                            ></Button>
                        </div>

                        <Button
                            theme='light'
                            type='tertiary'
                            icon={<IconCalendar />}
                            className={styles.addButton}
                            onClick={() => setAttendanceModalVisible(true)}
                        >
                            添加考勤
                        </Button>
                    </div>
                    <List
                        dataSource={Object.entries(attendancesGrouped)}
                        renderItem={([key, value]) => (
                            <List.Item
                                className={styles.listItem}
                            >
                                <Text>{key.split('*')[0]} {key.split('*')[1] === '0' ? '上午' : '下午'}</Text>
                                <Text>
                                    {value.map(item => item.status !== 1 ? `${item.name} (${item.note || '无'})` : '').filter(Boolean).join(', ')}
                                </Text>
                            </List.Item>
                        )}
                    />
                </Sider>
            )}
            {showTable && (
                <Sider className={styles.sider}>
                    <div className={styles.tableContainer}>
                        <div className={"headContainer"}>
                            <Title heading={1}>统计</Title>
                            <Button
                                theme='borderless'
                                type='tertiary'
                                icon={<IconClose />}
                                className={"backButton"}
                                onClick={() => setShowTable(false)}
                            ></Button>
                        </div>
                        <Table columns={columns} dataSource={dataSource} pagination={false} />
                    </div>
                </Sider>
            )}
            <AttendanceModal
                visible={attendanceModalVisible}
                onCancel={handleAttendanceCancel}
                onConfirm={handleAttendanceConfirm}
                students={students}
            />
        </Layout>
    );
}

export default StudentChoose;

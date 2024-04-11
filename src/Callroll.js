import React from 'react';
import { Button, SplitButtonGroup } from '@douyinfe/semi-ui';
import { Layout } from '@douyinfe/semi-ui';
import { List } from '@douyinfe/semi-ui';

function CallRoll() {
    const StuList = ['1', '2', '3'];
    const { Header, Footer, Sider, Content } = Layout;
    return (
        <Layout>
            <Header>Callroll System</Header>
            <Layout>
                <Sider>
                    <List  dataSource={StuList} renderItem={item => <List.Item>{item}</List.Item>} />
                </Sider>
                <Content>
                    <Button>点名</Button>
                </Content>
            </Layout>
        </Layout>

    )

}

export default CallRoll
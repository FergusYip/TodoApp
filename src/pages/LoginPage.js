import React, { useEffect } from 'react';
import { Form, Input, Button, message, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { signIn } from '../store/actions/authActions';
import { connect } from 'react-redux';

function LoginPage({ signIn, authError }) {
  const onFinish = (values) => {
    console.log('Success:', values);
    signIn(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (authError) {
      message.error(authError, 3);
    }
  }, [authError]);

  return (
    <AuthCard title="Login">
      <Form
        layout="vertical"
        name="login"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={false}
        validateTrigger="onFinished"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Please input a valid email!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Space>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
      <Typography.Text>Don't have an account? </Typography.Text>
      <Link to="/register" component={Typography.Link}>
        Register here!
      </Link>
    </AuthCard>
  );
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (creds) => dispatch(signIn(creds)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

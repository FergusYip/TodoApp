import React from 'react';
import { List, ConfigProvider, Layout, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

import TodoItem from './TodoItem';
import CompletedList from './CompletedList';
import TodoMenu from '../TodoMenu/index';
import { deleteList } from '../../store/actions/listActions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectTodo, deselectTodo } from '../../store/actions/selectionAction';
import Loading from '../Loading';
const { Content } = Layout;

/*
Todo:
id
title
isComplete
isImportant
steps: [...]
Remind me
Due date
Repeat
Files: [...]
Note
*/

/*
Step:
id
title
isComplete
*/

const customizeEmptyTodo = () => (
  <Result
    icon={<SmileOutlined />}
    title="Nothing todo"
    // extra={<Button type="primary">Next</Button>}
  />
);

function TodoList({ todos, selectTodo, deselectTodo, showCompleted }) {
  return todos ? (
    <Layout>
      <Content
      // style={{ padding: 24, display: 'flex', flexDirection: 'column',  }}
      >
        <ConfigProvider renderEmpty={customizeEmptyTodo}>
          <List
            bordered
            dataSource={todos.filter((todo) => !todo.isComplete)}
            rowKey={(todo) => todo.id}
            renderItem={(todo) => <TodoItem todo={todo} onClick={selectTodo} />}
          />
        </ConfigProvider>
        {showCompleted && <CompletedList todos={todos} onClick={selectTodo} />}
      </Content>
      <TodoMenu onClose={deselectTodo} />
    </Layout>
  ) : (
    <Loading />
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteList: (list) => dispatch(deleteList(list)),
    selectTodo: (todo) => dispatch(selectTodo(todo)),
    deselectTodo: () => dispatch(deselectTodo()),
  };
};

export default compose(connect(null, mapDispatchToProps))(TodoList);

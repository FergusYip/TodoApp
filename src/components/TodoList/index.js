import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { List, ConfigProvider, Layout, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

import TodoItem from './TodoItem';
import CompletedList from './CompletedList';
import TodoMenu from '../TodoMenu/index';

import { selectTodo, deselectTodo } from '../../store/actions/selectionAction';
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

function TodoList({
  todos,
  selectTodo,
  deselectTodo,
  showCompleted,
  isLoading,
}) {
  const [visibleTodoMenu, setVisibleTodoMenu] = useState(false);

  function handleOnClick(todo) {
    selectTodo(todo);
    setVisibleTodoMenu(true);
  }

  function handleCloseMenu() {
    setVisibleTodoMenu(false);
    deselectTodo();
  }

  return (
    <Layout
      style={{
        minHeight: 'calc(100vh - 85px - 64px)',
        maxHeight: 'calc(100vh - 85px - 64px)',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Content
        style={{
          width: '95%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <ConfigProvider renderEmpty={customizeEmptyTodo}>
          <List
            loading={isLoading}
            dataSource={todos && todos.filter((todo) => !todo.isComplete)}
            rowKey={(todo) => todo.id}
            renderItem={(todo) => (
              <TodoItem todo={todo} onClick={handleOnClick} />
            )}
          />
        </ConfigProvider>
        {showCompleted && (
          <CompletedList todos={todos} onClick={handleOnClick} />
        )}
      </Content>
      <TodoMenu onClose={handleCloseMenu} visible={visibleTodoMenu} />
    </Layout>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectTodo: (todo) => dispatch(selectTodo(todo)),
    deselectTodo: () => dispatch(deselectTodo()),
  };
};

export default compose(connect(null, mapDispatchToProps))(TodoList);

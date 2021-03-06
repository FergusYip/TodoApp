import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import TodoList from '../components/TodoList';
import ContentHeader from '../components/ContentHeader';
import { message, Button, Dropdown, Menu, Modal } from 'antd';
import {
  ShareAltOutlined,
  EllipsisOutlined,
  EditOutlined,
  SortAscendingOutlined,
  BgColorsOutlined,
  PrinterOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { updateList } from '../store/actions/listActions';
import { deleteList } from '../store/actions/listActions/deleteListAction';

import AddTodo from '../components/TodoList/AddTodo';
import { Redirect } from 'react-router-dom';

const { confirm } = Modal;

/*
Print list
List name
Completion
Title
notes
Due date
Importance
*/

export const ListPage = ({
  list,
  todos,
  deleteList,
  updateList,
  isLoading,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);

  const updateShowCompleted = () => {
    list && updateList({ ...list, showCompleted: !list.showCompleted });
  };

  const optionsDropdown = list && (
    <Menu>
      <Menu.Item icon={<EditOutlined />} onClick={handleRename}>
        Rename List
      </Menu.Item>
      <Menu.Item disabled icon={<SortAscendingOutlined />}>
        Sort
      </Menu.Item>
      <Menu.Item disabled icon={<BgColorsOutlined />}>
        Change Theme
      </Menu.Item>
      <Menu.Item disabled icon={<PrinterOutlined />}>
        Print List
      </Menu.Item>
      <Menu.Item
        icon={list.showCompleted ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        onClick={updateShowCompleted}
      >
        {`${list.showCompleted ? 'Hide' : 'Show'} Completed Tasks`}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item icon={<DeleteOutlined />} onClick={showDeleteConfirm}>
        Delete List
      </Menu.Item>
    </Menu>
  );

  function showDeleteConfirm() {
    confirm({
      title: `“${list.title}” will be permanently deleted.`,
      icon: <ExclamationCircleOutlined />,
      content: "You won't be able to undo this action",
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteList(list);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  useEffect(() => {
    if (isRenaming) {
      message.success({
        content: `List has been renamed to "${list.title}"`,
        duration: 1.5,
      });
    }
    setIsRenaming(false);
  }, [list]);

  function handleRename() {
    setIsRenaming(true);
  }

  function onRenamed(newTitle) {
    const newTitleCleaned = newTitle.trim().replace(/\s+/, ' ');
    if (newTitleCleaned.length && newTitleCleaned !== list.title) {
      updateList({ ...list, title: newTitleCleaned });
    }
  }

  function onRenameCancel() {
    setIsRenaming(false);
  }

  return !list ? (
    <Redirect to="/myday" />
  ) : (
    <div>
      <ContentHeader
        title={list && list.title}
        isRenaming={isRenaming}
        onRenamed={onRenamed}
        onCancel={onRenameCancel}
      >
        <Button key="share" shape="circle">
          <ShareAltOutlined />
        </Button>
        <Dropdown
          overlay={optionsDropdown}
          placement="bottomRight"
          trigger={['click']}
          key="more"
        >
          <Button shape="circle">
            <EllipsisOutlined />
          </Button>
        </Dropdown>
      </ContentHeader>
      <TodoList todos={todos} showCompleted={list && list.showCompleted} />
      <AddTodo listID={list && list.id} />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const { isLoading } = state.list.listReducer;
  const { lists, todos } = state.firestore.data;
  return {
    isLoading,
    list: lists && lists[id],
    todos: todos
      ? Object.values(todos).filter((todo) => todo && todo.listID === id)
      : [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateList: (list) => dispatch(updateList(list)),
    deleteList: (list) => dispatch(deleteList(list)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListPage);

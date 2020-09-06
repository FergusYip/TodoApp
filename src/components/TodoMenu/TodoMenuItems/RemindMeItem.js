import React, { useState } from 'react';
import {
  List,
  Dropdown,
  Menu,
  TimePicker,
  DatePicker,
  Typography,
  Row,
  Col,
} from 'antd';
import { BellOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'react-redux';
import { updateTodo } from '../../../store/actions/todoActions';

const TIME_FORMAT = 'ddd h:mma';

function RemindMeItem({ todo, updateTodo }) {
  const [selectingDate, setSelectingDate] = useState(false);
  const [reminderToday, setReminderToday] = useState(null);
  const [reminderTomorrow, setReminderTomorrow] = useState(null);
  const [reminderNextWeek, setReminderNextWeek] = useState(null);

  const id = 'remind_me_item';

  function onChange(value, dateString) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    setSelectingDate(false);
  }

  function getReminderToday() {
    const reminder = moment()
      .add(30, 'minutes')
      .startOf('hour')
      .add(3, 'hours');
    const twelveAmNextDay = moment()
      .add(1, 'days')
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    if (reminder.isSameOrAfter(twelveAmNextDay)) {
      return null;
    }
    return reminder;
  }

  function getReminderTomorrow() {
    return moment()
      .add(1, 'days')
      .set({ hour: 9, minute: 0, seconds: 0, millisecond: 0 });
  }

  function getReminderNextWeek() {
    return moment().set({
      day: 7,
      hour: 9,
      minute: 0,
      seconds: 0,
      millisecond: 0,
    });
  }

  function setReminderTimes() {
    setReminderToday(getReminderToday());
    setReminderTomorrow(getReminderTomorrow());
    setReminderNextWeek(getReminderNextWeek());
  }

  function selectToday() {
    updateTodo({ ...todo, remindMe: reminderToday.toDate() });
  }
  function selectTomorrow() {
    updateTodo({ ...todo, remindMe: reminderTomorrow.toDate() });
  }
  function selectNextWeek() {
    updateTodo({ ...todo, remindMe: reminderNextWeek.toDate() });
  }

  function getReminderTitle(remindMe) {
    if (!remindMe) return 'Remind Me';

    const reminder = moment.unix(remindMe.seconds);
    const now = moment();

    const dateDiff = Math.round(moment.duration(now.diff(reminder)).asDays());
    return (
      <>
        <Typography.Text>
          Remind me at {reminder.format('h:mm a')}
        </Typography.Text>
        <br />
        <Typography.Text>
          {Math.abs(dateDiff) > 1
            ? reminder.format('ddd, D MMMM')
            : dateDiff === 0
            ? 'Today'
            : dateDiff === -1
            ? 'Tomorrow'
            : 'Yesterday'}
        </Typography.Text>
      </>
    );
  }

  const menu = (
    <Menu>
      <Menu.Item disabled={!reminderToday} onClick={selectToday}>
        <Row>
          <Col flex="auto">
            <Typography.Text disabled={!reminderToday}>
              Later Today
            </Typography.Text>
          </Col>
          <Col flex={0}>
            <Typography.Text type="secondary" style={{ textAlign: 'right' }}>
              {reminderToday && reminderToday.format(TIME_FORMAT)}
            </Typography.Text>
          </Col>
        </Row>
      </Menu.Item>
      <Menu.Item onClick={selectTomorrow}>
        <Row>
          <Col flex="auto">
            <Typography.Text>Tomorrow</Typography.Text>
          </Col>
          <Col flex={0}>
            <Typography.Text type="secondary" style={{ textAlign: 'right' }}>
              {reminderTomorrow && reminderTomorrow.format(TIME_FORMAT)}
            </Typography.Text>
          </Col>
        </Row>
      </Menu.Item>
      <Menu.Item onClick={selectNextWeek}>
        <Row>
          <Col flex="auto">
            <Typography.Text>Next Week</Typography.Text>
          </Col>
          <Col flex={0}>
            <Typography.Text type="secondary" style={{ textAlign: 'right' }}>
              {reminderNextWeek && reminderNextWeek.format(TIME_FORMAT)}
            </Typography.Text>
          </Col>
        </Row>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={() => setSelectingDate(true)}>
        Pick a Date & Time
      </Menu.Item>
    </Menu>
  );

  const timePicker = () => {
    return (
      <TimePicker use12Hours format="h:mm a" onChange={onChange} open={false} />
    );
  };

  const getRoot = () => {
    return document.getElementById(id);
  };

  return (
    <List.Item id={id}>
      <Dropdown
        overlay={menu}
        placement="bottomLeft"
        arrow
        trigger={['click']}
        getPopupContainer={getRoot}
        onVisibleChange={setReminderTimes}
      >
        {selectingDate ? (
          <DatePicker
            placeholder="Pick a Date & Time"
            bordered={false}
            suffixIcon={null}
            onChange={onChange}
            open={selectingDate}
            getPopupContainer={getRoot}
            renderExtraFooter={timePicker}
            onBlur={() => setSelectingDate(false)}
          />
        ) : (
          <List.Item.Meta
            avatar={<BellOutlined />}
            title={todo ? getReminderTitle(todo.remindMe) : ''}
          />
        )}
      </Dropdown>
    </List.Item>
  );
}

const mapStateToProps = (state) => {
  const todoID = state.selectedTodoDetails && state.selectedTodoDetails.todoID;
  if (!todoID) return {};
  const todo = state.firestore.data.todos && state.firestore.data.todos[todoID];
  return { todo };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTodo: (todo) => dispatch(updateTodo(todo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemindMeItem);

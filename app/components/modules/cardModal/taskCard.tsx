import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useSpace } from '../../../../pages/tribe/[id]/space/[bid]';
import useMoralisFunction from '../../../hooks/useMoralisFunction';
import Editor from '../editor';
import { notify } from '../settingsTab';
import CardTypePopover from './popovers/cardTypePopover';
import ColumnPopover from './popovers/columnPopover';
import DatePopover from './popovers/datePopover';
import LabelPopover from './popovers/labelPopover';
import CardMemberPopover from './popovers/cardMemberPopover';
import RewardPopover from './popovers/rewardPopover';
import OptionsPopover from './popovers/optionsPopover';
import TabularDetails from './tabularDetails';
import { Task, Block } from '../../../types';
import { uid } from '../../../utils/utils';
import { useCardDynamism } from '../../../hooks/useCardDynamism';
import AssignToMe from './buttons/assignToMe';

type Props = {
  task: Task;
  setTask: (task: Task) => void;
  handleClose: () => void;
};

const TaskModalTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TaskModalBodyContainer = styled.div`
  margin-top: 2px;
  color: #eaeaea;
  font-size: 0.85rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

function TaskCard({ task, setTask, handleClose }: Props) {
  const { space, setSpace } = useSpace();
  const { runMoralisFunction } = useMoralisFunction();
  const { editAbleComponents, viewableComponents } = useCardDynamism(task);

  const syncBlocksToMoralis = (blocks: Block[]) => {
    // console.log({ blocks });
    runMoralisFunction('updateCard', {
      updates: {
        taskId: task.taskId,
        description: blocks,
      },
    })
      .then((res) => {
        setSpace(res.space);
        setTask(res.task);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const [title, setTitle] = useState(task.title);

  const handleSave = () => {
    if (task.access.creator || task.access.reviewer) {
      const prevTask = { ...task };
      const temp = { ...task };
      temp.title = title;
      setTask(temp);
      runMoralisFunction('updateCard', {
        updates: {
          title,
          taskId: task.taskId,
        },
      })
        .then((res: any) => {
          setSpace(res.space);
          setTask(res.task);
        })
        .catch((err: any) => {
          setTask(prevTask);
          notify(`${err.message}`, 'error');
        });
    }
  };

  useEffect(() => {
    setTitle(task.title);
  }, [task]);

  return (
    <Container>
      <TaskModalTitleContainer>
        <InputBase
          placeholder="Add Card Title..."
          sx={{
            fontSize: '20px',
            ml: 1,
          }}
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          readOnly={!(task?.access?.creator || task?.access?.reviewer)}
        />
        <Box sx={{ flex: '1 1 auto' }} />
        <AssignToMe task={task} setTask={setTask} />

        {viewableComponents.optionPopover && (
          <OptionsPopover task={task} setTask={setTask} />
        )}
        <IconButton sx={{ m: 0, px: 2 }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </TaskModalTitleContainer>
      <Box sx={{ width: 'fit-content', display: 'flex', flexWrap: 'wrap' }}>
        <CardTypePopover task={task} setTask={setTask} />
        <ColumnPopover
          task={task}
          setTask={setTask}
          column={space.columns[task.columnId]}
        />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: '16px' }}>
        <CardMemberPopover type="reviewer" task={task} setTask={setTask} />
        <CardMemberPopover type="assignee" task={task} setTask={setTask} />
        <RewardPopover task={task} setTask={setTask} />
        <DatePopover task={task} setTask={setTask} />
        <LabelPopover task={task} setTask={setTask} />
      </Box>

      <TaskModalBodyContainer>
        <Editor
          syncBlocksToMoralis={syncBlocksToMoralis}
          initialBlock={
            task.description
              ? task.description
              : [
                  {
                    id: uid(),
                    html: '',
                    tag: 'p',
                    type: '',
                    imageUrl: '',
                    embedUrl: '',
                  },
                ]
          }
          placeholderText={
            editAbleComponents.description
              ? `Add details, press "/" for commands`
              : `No details provided yet`
          }
          readonly={!editAbleComponents.description}
        />

        <Box sx={{ marginBottom: '16px' }}>
          <TabularDetails task={task} setTask={setTask} />
        </Box>
      </TaskModalBodyContainer>
    </Container>
  );
}

export default TaskCard;

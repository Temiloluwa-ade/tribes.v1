import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, InputBase } from "@mui/material";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useSpace } from "../../../../pages/tribe/[id]/space/[bid]";
import { useMoralisFunction } from "../../../hooks/useMoralisFunction";
import { Column, Task } from "../../../types";
import Editor from "../editor";
import { notify } from "../settingsTab";
import CardTypePopover from "./cardTypePopover";
import ColumnPopover from "./columnPopover";
import DatePopover from "./datePopover";
import LabelPopover from "./labelPopover";
import MarkdownEditor from "./markdownEditor";
import MemberPopover from "./memberPopover";
import RewardPopover from "./rewardPopover";
import OptionsPopover from "./optionsPopover";
import TabularDetails from "./tabularDetails";
import { Block } from "../../../types";
import { uid } from "../../../utils/utils";

type Props = {
  task: Task;
  setTask: (task: Task) => void;
  handleClose: () => void;
  submissionPR: any;
  column: Column;
};

function doShowPayButton(user: any, task: Task) {
  if (user?.get("distributorApproved")) {
    return (
      task.token?.address === "0x0" ||
      (task.chain?.chainId in user?.get("distributorApproved") &&
        user
          ?.get("distributorApproved")
          [task.chain?.chainId].includes(task.token?.address))
    );
  } else {
    return false;
  }
}

const TaskCard = ({ task, setTask, handleClose, column }: Props) => {
  const { space, setSpace } = useSpace();
  const { user } = useMoralis();
  const [open, setOpen] = useState({} as any);
  const { runMoralisFunction } = useMoralisFunction();

  const syncBlocksToMoralis = (blocks: Block[]) => {
    // console.log({ blocks });
    runMoralisFunction("updateCard", {
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
  const handleClosePopover = (field: string) => {
    setOpen({ [field]: false });
  };
  const isSpaceMember = () => {
    return space.members.indexOf(user?.id as string) !== -1;
  };

  const [title, setTitle] = useState(task.title);
  const [isLoadingTask, setIsLoadingTask] = useState(false);

  const handleSave = () => {
    if (task.access.creator || task.access.reviewer) {
      const prevTask = Object.assign({}, task);
      const temp = Object.assign({}, task);
      temp.title = title;
      setTask(temp);
      runMoralisFunction("updateCard", {
        updates: {
          title: title,
          taskId: task.taskId,
        },
      })
        .then((res: any) => {
          console.log(res);
          setSpace(res.space);
          setTask(res.task);
        })
        .catch((err: any) => {
          setTask(prevTask);
          notify(`${err.message}`, "error");
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
          placeholder="Add Task Title..."
          sx={{
            fontSize: "20px",
          }}
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          readOnly={!(task?.access?.creator || task?.access?.reviewer)}
        />
        <Box sx={{ flex: "1 1 auto" }} />
        <OptionsPopover task={task} setTask={setTask} />
        <IconButton sx={{ m: 0, px: 2 }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </TaskModalTitleContainer>
      <Box sx={{ width: "fit-content", display: "flex", flexWrap: "wrap" }}>
        <CardTypePopover task={task} setTask={setTask} />
        <ColumnPopover task={task} setTask={setTask} column={column} />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", marginBottom: "16px" }}>
        <MemberPopover type={"reviewer"} task={task} setTask={setTask} />
        <MemberPopover type={"assignee"} task={task} setTask={setTask} />
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
                    html: "",
                    tag: "p",
                    type: "",
                    imageUrl: "",
                    embedUrl: "",
                  },
                ]
          }
        />

        <Box sx={{ marginBottom: "16px" }}>
          <TabularDetails task={task} setTask={setTask} />
        </Box>
      </TaskModalBodyContainer>
    </Container>
  );
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

export default TaskCard;

import {
  Autocomplete,
  Box,
  ListItem,
  Grid,
  TextField,
  Avatar,
  ListItemText,
  InputBase,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import styled from "@emotion/styled";
import Divider from "@mui/material/Divider";
import {
  FieldContainer,
  PrimaryButton,
  TaskButton,
} from "../../elements/styledComponents";
import CloseIcon from "@mui/icons-material/Close";
import { BoardData, Column, Task } from "../../../types";
import { formatTime, getMD5String } from "../../../utils/utils";
import {
  assignToMe,
  closeTask,
  updateTaskDescription,
  updateTaskTitle,
} from "../../../adapters/moralis";
import { useMoralis } from "react-moralis";
import { useBoard } from "../taskBoard";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { labelsMapping, statusMapping } from "../../../constants";
import { actionMap, monthMap } from "../../../constants";
import { distributeEther } from "../../../adapters/contract";
import DoneIcon from "@mui/icons-material/Done";
import DatePopover from "./datePopover";
import LabelPopover from "./labelPopover";
import MemberPopover from "./memberPopover";
import RewardPopover from "./rewardPopover";
import SubmissionPopover from "./submissionPopover";
import MovePopover from "./movePopover";
import { LinkPreview } from "@dhaiwat10/react-link-preview";

type Props = {
  task: Task;
  setTask: (task: Task) => void;
  handleClose: () => void;
  submissionPR: any;
  column: Column;
};
const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const EditTask = ({
  task,
  setTask,
  handleClose,
  submissionPR,
  column,
}: Props) => {
  const { data, setData } = useBoard();
  const { Moralis, user } = useMoralis();
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState({} as any);
  const [description, setDescription] = useState(task.description);
  const handleClick =
    (field: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen({ [field]: true });
    };
  const handleClosePopover = (field: string) => {
    setOpen({ [field]: false });
  };
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [title, setTitle] = useState(task.title);
  useEffect(() => {
    if (!(task.access.creator || task.access.reviewer)) {
      setSelectedTab("preview");
    }
    console.log(task);
  }, []);

  return (
    <Container>
      <TaskModalTitleContainer>
        <InputBase
          placeholder="Add Title"
          sx={{
            fontSize: "20px",
          }}
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (task.access.creator || task.access.reviewer) {
              updateTaskTitle(Moralis, title, task.taskId).then(
                (res: BoardData) => {
                  setData(res);
                }
              );
            }
          }}
          readOnly={!(task.access.creator || task.access.reviewer)}
        />
        <Box sx={{ flex: "1 1 auto" }} />
        <IconButton sx={{ m: 0, px: 2 }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </TaskModalTitleContainer>
      <TaskModalInfoContainer>
        {task.deadline && (
          <Info>
            <Typography sx={{ color: "rgb(153, 204, 255)", fontSize: 12 }}>
              Due Date
            </Typography>
            <InnerInfo>
              <Typography sx={{ fontSize: 14 }} color="primary">
                {task.deadline?.getDate()}{" "}
                {monthMap[task.deadline?.getMonth() as keyof typeof monthMap]}{" "}
                {task.deadline && formatTime(task.deadline)}
              </Typography>
            </InnerInfo>
          </Info>
        )}
        {task.tags && (
          <Info>
            <Typography sx={{ color: "rgb(153, 204, 255)", fontSize: 12 }}>
              Labels
            </Typography>
            <InnerInfo>
              {task.tags?.map((tag, index) => (
                <LabelChip
                  color={labelsMapping[tag as keyof typeof labelsMapping]}
                  key={index}
                >
                  {tag}
                </LabelChip>
              ))}
            </InnerInfo>
          </Info>
        )}
        {task.reviewer.length && (
          <Info>
            <Typography sx={{ color: "rgb(153, 204, 255)", fontSize: 12 }}>
              Reviewer
            </Typography>
            <InnerInfo>
              <Tooltip title={task.reviewer[0]?.username}>
                <Avatar
                  sx={{ height: 28, width: 28 }}
                  src={
                    task.reviewer[0]?.profilePicture
                      ? task.reviewer[0].profilePicture._url
                      : `https://www.gravatar.com/avatar/${getMD5String(
                          task.reviewer[0].objectId
                        )}?d=identicon&s=32`
                  }
                />
              </Tooltip>
            </InnerInfo>
          </Info>
        )}

        {task.assignee.length > 0 && (
          <Info>
            <Typography sx={{ color: "rgb(153, 204, 255)", fontSize: 12 }}>
              Assignee
            </Typography>

            <InnerInfo>
              <Tooltip title={task.assignee[0]?.username}>
                <Avatar
                  sx={{ height: 32, width: 32 }}
                  src={
                    task.assignee[0]?.profilePicture
                      ? task.assignee[0].profilePicture._url
                      : `https://www.gravatar.com/avatar/${getMD5String(
                          task.assignee[0].objectId
                        )}?d=identicon&s=32`
                  }
                />
              </Tooltip>
            </InnerInfo>
          </Info>
        )}
        {task.value && (
          <Info>
            <Typography sx={{ color: "rgb(153, 204, 255)", fontSize: 12 }}>
              Reward
            </Typography>
            <InnerInfo>
              <Typography sx={{ fontSize: 14 }} color="primary">
                {task.value} {task.token.symbol}
              </Typography>
            </InnerInfo>
          </Info>
        )}
      </TaskModalInfoContainer>
      <Grid container spacing={0}>
        <Grid item xs={9}>
          <TaskModalBodyContainer>
            <Divider textAlign="left" color="text.secondary" sx={{ mr: 3 }}>
              Description
            </Divider>{" "}
            <Box sx={{ color: "#eaeaea", height: "auto", mr: 3 }}>
              <ReactMde
                value={description}
                onChange={(value) => setDescription(value)}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(converter.makeHtml(markdown))
                }
                childProps={{
                  writeButton: {
                    tabIndex: -1,
                  },
                }}
                readOnly={!(task.access.creator || task.access.reviewer)}
              />
              {(task.access.creator || task.access.reviewer) && (
                <PrimaryButton
                  variant="outlined"
                  sx={{ mt: 4 }}
                  loading={isLoading}
                  onClick={() => {
                    setIsLoading(true);
                    updateTaskDescription(
                      Moralis,
                      description,
                      task.taskId
                    ).then((res: BoardData) => {
                      console.log(res);
                      setData(res);
                      setIsLoading(false);
                    });
                  }}
                >
                  Save
                </PrimaryButton>
              )}
            </Box>
          </TaskModalBodyContainer>
          {task.submission?.link && (
            <ActivityContainer>
              <Divider
                textAlign="left"
                color="text.secondary"
                sx={{ mr: 3, mb: 1 }}
              >
                Submissions
              </Divider>{" "}
              <LinkPreview
                url={task.submission.link}
                width="40rem"
                imageHeight={"0rem"}
                backgroundColor={"transparent"}
                primaryTextColor={"#eaeaea"}
                borderColor="#5a6972"
              />
            </ActivityContainer>
          )}

          <ActivityContainer>
            <Divider textAlign="left" color="text.secondary" sx={{ mr: 3 }}>
              Activity
            </Divider>{" "}
            {task.activity?.map((act: any) => (
              <ListItem key={`${act.timestamp}`}>
                <Avatar
                  sx={{ width: 24, height: 24, mr: 2 }}
                  src={
                    act.profilePicture
                      ? act.profilePicture._url
                      : `https://www.gravatar.com/avatar/${getMD5String(
                          act.username
                        )}?d=identicon&s=32`
                  }
                />
                <ListItemText
                  primary={`${act.username} set status to "${
                    statusMapping[act.action as keyof typeof statusMapping]
                  }" on ${act.timestamp.getDate()}  ${
                    // @ts-ignore
                    monthMap[act.timestamp.getMonth() as number]
                  }`}
                />
              </ListItem>
            ))}
          </ActivityContainer>
        </Grid>
        <Grid item xs={3} sx={{ borderLeft: "1px solid #5a6972" }}>
          <Box ml={2}>
            <TaskModalBodyContainer>
              <Divider textAlign="left" color="text.secondary">
                Add to Task
              </Divider>{" "}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mt: 2,
                  mx: 1,
                }}
              >
                {(task.access.reviewer ||
                  task.access.creator ||
                  task.access.assignee) && (
                  <TaskButton
                    variant="outlined"
                    color="primary"
                    onClick={handleClick("date")}
                  >
                    Due Date
                  </TaskButton>
                )}
                {open["date"] && (
                  <DatePopover
                    open={open["date"]}
                    anchorEl={anchorEl}
                    handleClose={handleClosePopover}
                    task={task}
                  />
                )}
                <TaskButton
                  variant="outlined"
                  color="primary"
                  onClick={handleClick("label")}
                >
                  Labels
                </TaskButton>
                {open["label"] && (
                  <LabelPopover
                    open={open["label"]}
                    anchorEl={anchorEl}
                    handleClose={handleClosePopover}
                    task={task}
                  />
                )}
                {(task.access.reviewer || task.access.creator) && (
                  <TaskButton
                    variant="outlined"
                    color="primary"
                    onClick={handleClick("reviewer")}
                  >
                    Reviewer
                  </TaskButton>
                )}
                {open["reviewer"] && (
                  <MemberPopover
                    open={open["reviewer"]}
                    anchorEl={anchorEl}
                    handleClose={handleClosePopover}
                    type="reviewer"
                    task={task}
                  />
                )}
                {(task.access.reviewer || task.access.creator) && (
                  <TaskButton
                    variant="outlined"
                    color="primary"
                    onClick={handleClick("assignee")}
                  >
                    Assignee
                  </TaskButton>
                )}
                {open["assignee"] && (
                  <MemberPopover
                    open={open["assignee"]}
                    anchorEl={anchorEl}
                    handleClose={handleClosePopover}
                    type="assignee"
                    task={task}
                  />
                )}
                {task.access.creator && (
                  <TaskButton
                    variant="outlined"
                    color="primary"
                    onClick={handleClick("reward")}
                  >
                    Reward
                  </TaskButton>
                )}
                {open["reward"] && (
                  <RewardPopover
                    open={open["reward"]}
                    anchorEl={anchorEl}
                    handleClose={handleClosePopover}
                    task={task}
                  />
                )}
                {task.access.assignee && (
                  <TaskButton
                    variant="outlined"
                    color="primary"
                    onClick={handleClick("submission")}
                  >
                    Submission
                  </TaskButton>
                )}
                {open["submission"] && (
                  <SubmissionPopover
                    open={open["submission"]}
                    anchorEl={anchorEl}
                    handleClose={handleClosePopover}
                    task={task}
                  />
                )}
              </Box>
              <Divider textAlign="left" color="text.secondary">
                Actions
              </Divider>{" "}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mt: 2,
                  mx: 1,
                }}
              >
                {(task.access.creator ||
                  task.access.reviewer ||
                  task.access.assignee) && (
                  <TaskButton
                    variant="outlined"
                    color="primary"
                    onClick={handleClick("move")}
                  >
                    Move
                  </TaskButton>
                )}
                {open["move"] && (
                  <MovePopover
                    open={open["move"]}
                    anchorEl={anchorEl}
                    handleClose={handleClosePopover}
                    column={column}
                    task={task}
                  />
                )}
                {task.access.creator && (
                  <TaskButton variant="outlined" color="primary">
                    Pay
                  </TaskButton>
                )}
                {!task.access.creator && (
                  <TaskButton variant="outlined" color="primary">
                    Vote
                  </TaskButton>
                )}
                {!task.assignee.length && (
                  <TaskButton
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      assignToMe(Moralis, task.taskId).then(
                        (res: BoardData) => {
                          setData(res);
                        }
                      );
                    }}
                  >
                    Assign to me
                  </TaskButton>
                )}
              </Box>
              {task.status === 200 && (
                <FieldContainer>
                  <PrimaryButton
                    variant="contained"
                    color="primary"
                    endIcon={<DoneIcon />}
                    onClick={() =>
                      closeTask(Moralis, task.taskId).then((res: any) => {
                        setData(res);
                      })
                    }
                    hidden={!task.access.creator}
                  >
                    Close
                  </PrimaryButton>
                </FieldContainer>
              )}
              {task.status === 205 && (
                <FieldContainer>
                  <PrimaryButton
                    variant="contained"
                    color="primary"
                    endIcon={<MonetizationOnIcon />}
                    onClick={() =>
                      distributeEther(
                        [task.assignee[0].ethAddress],
                        [task.value],
                        task.taskId
                      )
                    }
                    hidden={!task.access.creator}
                  >
                    Pay
                  </PrimaryButton>
                </FieldContainer>
              )}
            </TaskModalBodyContainer>
          </Box>
        </Grid>
        {/* <PrimaryButton
          variant="outlined"
          fullWidth
          sx={{ width: "30%" }}
          type="submit"
          loading={loading}
          disabled={!isDirty}
        >
          Save
        </PrimaryButton> */}
      </Grid>
    </Container>
  );
};

const TaskModalTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const TaskModalBodyContainer = styled.div`
  margin-top: 2px;
  color: #99ccff;
  font-size: 0.85rem;
`;

const ActivityContainer = styled.div`
  margin-top: 2px;
  color: #99ccff;
  font-size: 0.85rem;
  max-height: 10rem;
  overflow-y: auto;
`;

const TaskModalInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
`;

const InnerInfo = styled.div`
  display: flex;
  align-items: center;
`;

const LabelChip = styled.div`
  background-color: ${(props: any) => props.color};
  font-size: 14px;
  font-weight: 600;
  color: #eaeaea;
  padding: 4px 6px;
  border-radius: 4px;
  margin-right: 4px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 70rem;
  height: 35rem;
`;

export default EditTask;

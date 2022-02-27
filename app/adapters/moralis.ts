import { Team, Epoch, Member, Chain, Token } from "../types/index";

export function getOrCreateUser(Moralis: any) {
  return Moralis.Cloud.run("getOrCreateUser");
}

export function createTribe(Moralis: any, name: string) {
  const params = {
    name: name,
  };
  return Moralis.Cloud.run("createTeam", params);
}

export function updateTribe(Moralis: any, team: Team, teamId: number) {
  const params = {
    teamId: teamId,
    name: team.name,
    description: team.description,
    isPublic: team.isPublic,
    discord: team.discord,
    twitter: team.twitter,
    github: team.github,
    logo: team.logo,
  };
  return Moralis.Cloud.run("updateTeam", params);
}

export function initBoard(Moralis: any, name: string, teamId: number) {
  const params = {
    name: name,
    teamId: teamId,
  };
  return Moralis.Cloud.run("initBoard", params);
}

export function getBoards(Moralis: any, teamId: number) {
  const params = {
    teamId: teamId,
  };
  return Moralis.Cloud.run("getBoards", params);
}

export function getBoard(Moralis: any, boardId: string) {
  const params = {
    boardId: boardId,
  };
  return Moralis.Cloud.run("getBoard", params);
}

export function updateColumnName(
  Moralis: any,
  boardId: string,
  columnId: string,
  newName: string
) {
  const params = {
    boardId: boardId,
    columnId: columnId,
    newName: newName,
  };
  return Moralis.Cloud.run("updateColumnName", params);
}

export function updateColumnOrder(
  Moralis: any,
  boardId: string,
  newColumnOrder: any
) {
  const params = {
    boardId: boardId,
    newColumnOrder: newColumnOrder,
  };
  return Moralis.Cloud.run("updateColumnOrder", params);
}

export function updateColumnTasks(
  Moralis: any,
  boardId: string,
  sourceId: string,
  destinationId: string,
  source: any,
  destination: any
) {
  const params = {
    boardId: boardId,
    sourceId: sourceId,
    destinationId: destinationId,
    source: source,
    destination: destination,
  };
  return Moralis.Cloud.run("updateColumnTasks", params);
}
export function addColumn(Moralis: any, boardId: string) {
  const params = {
    boardId: boardId,
  };
  return Moralis.Cloud.run("addColumn", params);
}

export function removeColumn(Moralis: any, boardId: string, columnId: string) {
  const params = {
    boardId: boardId,
    columnId: columnId,
  };
  return Moralis.Cloud.run("removeColumn", params);
}

export function addTask(
  Moralis: any,
  boardId: string,
  columnId: string,
  title: string,
  value: number,
  description: string,
  issueLink: string
) {
  const params = {
    boardId: boardId,
    columnId: columnId,
    title: title,
    value: value,
    description: description,
    issueLink: issueLink,
  };
  return Moralis.Cloud.run("addTask", params);
}

export function getTask(Moralis: any, taskId: string) {
  const params = {
    taskId: taskId,
  };
  return Moralis.Cloud.run("getTask", params);
}

export function startEpoch(Moralis: any, epoch: any) {
  const params = {
    startTime: epoch.startTime,
    duration: epoch.duration,
    members: epoch.members,
    type: epoch.type,
    strategy: epoch.strategy,
    budget: epoch.budget,
    teamId: epoch.teamId,
  };
  return Moralis.Cloud.run("startEpoch", params);
}

export function updateMembers(Moralis: any, updatePayload: any) {
  const params = {
    members: updatePayload.members,
    teamId: updatePayload.teamId,
  };
  return Moralis.Cloud.run("updateMembers", params);
}

export function getTeam(Moralis: any, teamId: number) {
  const params = {
    teamId: teamId,
  };
  return Moralis.Cloud.run("getTeam", params);
}

export function getPublicTeams(Moralis: any) {
  return Moralis.Cloud.run("getPublicTeams");
}

export function getEpoch(Moralis: any, epochId: string) {
  const params = {
    epochId: epochId,
  };
  return Moralis.Cloud.run("getEpoch", params);
}

export function getGithubToken(Moralis: any, code: string) {
  const params = {
    code: code,
  };
  return Moralis.Cloud.run("getGithubToken", params);
}

export function getInvitations(Moralis: any, ethAddress: string) {
  const params = {
    ethAddress: ethAddress,
  };
  return Moralis.Cloud.run("getMyInvites", params);
}

export function acceptInvitations(
  Moralis: any,
  ethAddress: string,
  teamId: number
) {
  const params = {
    ethAddress: ethAddress,
    teamId: teamId,
  };
  return Moralis.Cloud.run("acceptInvite", params);
}

export function sendInvitations(
  Moralis: any,
  ethAddress: string,
  teamId: number,
  userId: string
) {
  const params = {
    ethAddress: ethAddress,
    teamId: teamId,
    invitedBy: userId,
  };
  return Moralis.Cloud.run("sendInvite", params);
}

export function giftContributors(
  Moralis: any,
  epochId: string,
  votes: object,
  ethAddress: string
) {
  const params = {
    epochId: epochId,
    votes: votes,
    ethAddress: ethAddress,
  };
  return Moralis.Cloud.run("giftContributors", params);
}

export function endEpoch(Moralis: any, epochId: string) {
  const params = {
    epochId: epochId,
  };
  return Moralis.Cloud.run("endEpoch", params);
}

export function createTasks(
  Moralis: any,
  epochId: string,
  newTasks: any,
  taskSource: string
) {
  const params = {
    epochId: epochId,
    newTasks: newTasks,
    taskSource: taskSource,
  };
  return Moralis.Cloud.run("createTasks", params);
}

// Also includes tasks in that epoch
export function getTaskEpoch(Moralis: any, epochId: string) {
  const params = {
    epochId: epochId,
  };
  return Moralis.Cloud.run("getTaskEpoch", params);
}

export function updateTask(Moralis: any, task: any, columnId: string) {
  console.log(task);
  const params = {
    task: task,
    columnId: columnId,
  };
  return Moralis.Cloud.run("updateTask", params);
}

export function updateTaskDeadline(
  Moralis: any,
  deadline: string,
  taskId: string
) {
  const params = {
    deadline: deadline,
    taskId: taskId,
  };
  return Moralis.Cloud.run("updateTaskDeadline", params);
}

export function updateTaskLabels(Moralis: any, tags: string[], taskId: string) {
  const params = {
    tags: tags,
    taskId: taskId,
  };
  return Moralis.Cloud.run("updateTaskLabels", params);
}

export function updateTaskMember(
  Moralis: any,
  member: Member,
  type: string,
  taskId: string
) {
  const params = {
    member: member,
    type: type,
    taskId: taskId,
  };
  return Moralis.Cloud.run("updateTaskMember", params);
}

export function updateTaskReward(
  Moralis: any,
  chain: Chain,
  token: Token,
  value: number,
  taskId: string
) {
  const params = {
    chain: chain,
    token: token,
    value: value,
    taskId: taskId,
  };
  return Moralis.Cloud.run("updateTaskReward", params);
}

export function updateTaskSubmission(
  Moralis: any,
  link: string,
  name: string,
  taskId: string
) {
  const params = {
    submissionLink: link,
    submissionName: name,
    taskId: taskId,
  };
  return Moralis.Cloud.run("updateTaskSubmission", params);
}

export function updateTaskDescription(
  Moralis: any,
  description: string,
  taskId: string
) {
  const params = {
    description: description,
    taskId: taskId,
  };
  return Moralis.Cloud.run("updateTaskDescription", params);
}

export function updateTaskTitle(Moralis: any, title: string, taskId: string) {
  const params = {
    title: title,
    taskId: taskId,
  };
  return Moralis.Cloud.run("updateTaskTitle", params);
}

export function updateTaskStatus(
  Moralis: any,
  boardId: string,
  taskId: string,
  status: string,
  columnId: string
) {
  const params = {
    boardId: boardId,
    taskId: taskId,
    status: status,
    columnId: columnId,
  };
  return Moralis.Cloud.run("updateTaskStatus", params);
}

export function assignToMe(Moralis: any, taskId: string) {
  const params = {
    taskId: taskId,
  };
  return Moralis.Cloud.run("assignToMe", params);
}

export function closeTask(Moralis: any, taskId: string) {
  const params = {
    taskId: taskId,
  };
  return Moralis.Cloud.run("closeTask", params);
}

export function voteOnTasks(
  Moralis: any,
  epochId: string,
  voteAllocation: any
) {
  const params = {
    epochId: epochId,
    votes: voteAllocation,
  };
  return Moralis.Cloud.run("voteOnTasks", params);
}

export function checkMemberInTeam(
  Moralis: any,
  teamId: number,
  userId: string
) {
  const params = {
    teamId: teamId,
    userId: userId,
  };

  return Moralis.Cloud.run("checkMemberInTeam", params);
}
export function updateBoard(
  Moralis: any,
  boardId: string,
  name: string,
  columns: any,
  statusList: string[]
) {
  const params = {
    boardId: boardId,
    name: name,
    columns: columns,
    statusList: statusList,
  };
  return Moralis.Cloud.run("updateBoard", params);
}

export function deleteBoard(Moralis: any, boardId: string) {
  const params = {
    boardId: boardId,
  };
  return Moralis.Cloud.run("deleteBoard", params);
}

export function addMemberToTribe(
  Moralis: any,
  teamId: number,
  userId: string,
  userType: string,
  adminId: string
) {
  const params = {
    teamId: teamId,
    userId: userId,
    userType: userType,
    adminId: adminId,
  };
  console.log("params", params);
  return Moralis.Cloud.run("addMemberToTribe", params);
}
export function getBatchPayAmount(Moralis: any, boardId: string) {
  const params = {
    boardId: boardId,
  };
  return Moralis.Cloud.run("getBatchPayAmount", params);
}

export function getRegistry(Moralis: any) {
  return Moralis.Cloud.run("getRegistry");
}

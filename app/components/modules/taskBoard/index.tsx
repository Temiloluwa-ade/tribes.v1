import React, { createContext, useContext, useEffect, useState } from "react";
import { Fade, Grow, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { getBoard } from "../../../adapters/moralis";
import { useMoralis } from "react-moralis";
import Heading from "./heading";
import SkeletonLoader from "./skeletonLoader";
import { BoardData, Column, Task } from "../../../types";
import Board from "./board";
import EpochList from "../epoch";
import Analytics from "../analytics";
import {
  setNavbarLogo,
  setNavbarTitle,
  useGlobal,
} from "../../../context/globalContext";
import Members from "../members";
import { notifyError } from "../settingsTab";
import { Toaster } from "react-hot-toast";
import NoAccess from "../epoch/noAccess";

type Props = {};

interface BoardContextType {
  data: BoardData;
  setData: (data: BoardData) => void;
  tab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const BoardContext = createContext<BoardContextType>({} as BoardContextType);

const TaskBoard = (props: Props) => {
  const context = useProviderBoard();
  const router = useRouter();
  const { Moralis, isInitialized, user } = useMoralis();
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useGlobal();
  const [panelExpanded, setPanelExpanded] = useState<string | false>("board");
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setPanelExpanded(newExpanded ? panel : false);
    };

  const tab = context.tab;

  const { bid } = router.query;
  useEffect(() => {
    setIsLoading(true);

    if (isInitialized && bid) {
      getBoard(Moralis, bid as string)
        .then((res: BoardData) => {
          console.log(`res`);

          console.log(res);
          setNavbarLogo(dispatch, res.team[0].logo);
          setNavbarTitle(dispatch, res.team[0].name);
          context.setData(res);
          setIsLoading(false);
        })
        .catch((err: any) => {
          notifyError("Sorry! There was an error while getting space.");
        });
    }
  }, [isInitialized, bid]);

  if (isLoading) {
    return <SkeletonLoader />;
  }
  return (
    <Fade in={!isLoading} timeout={500}>
      <div>
        <BoardContext.Provider value={context}>
          <Heading />
          {tab === 0 && (
            <Grow in={tab === 0} timeout={500}>
              <div>
                <Board
                  expanded={panelExpanded === "board"}
                  handleChange={handleChange}
                />
              </div>
            </Grow>
          )}
          {tab === 1 && (
            <Grow in={tab === 1} timeout={500}>
              <div>
                {user && user?.id in context.data.roles ? (
                  <EpochList
                    expanded={panelExpanded === "epoch"}
                    handleChange={handleChange}
                  />
                ) : (
                  <NoAccess />
                )}
              </div>
            </Grow>
          )}
          {tab === 2 && (
            <Grow in={tab === 2} timeout={500}>
              <div>
                <Members />
              </div>
            </Grow>
          )}
        </BoardContext.Provider>
      </div>
    </Fade>
  );
};

function useProviderBoard() {
  const [data, setData] = useState<BoardData>({} as BoardData);
  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  return {
    data,
    setData,
    tab,
    handleTabChange,
  };
}

export const useBoard = () => useContext(BoardContext);

export default TaskBoard;

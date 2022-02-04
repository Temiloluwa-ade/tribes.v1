import React from "react";
import { useTribe } from "../../../../pages/tribe/[id]";
import TribeHeading from "../../modules/tribeHeading";

type Props = {};

const TribeTemplate = (props: Props) => {
  const { tab } = useTribe();
  return (
    <div>
      <TribeHeading />
      {tab == 0 && <div>Overview</div>}
      {tab == 1 && <div>Contributors</div>}
      {tab == 2 && <div>Board</div>}
      {tab == 3 && <div>Settings</div>}
    </div>
  );
};

export default TribeTemplate;
import styled from "@emotion/styled";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const OuterDiv = styled.div`
  position: relative;
  min-height: 100vh;
  background-color: #000f29;
  width: 100%;
  letter-spacing: 0.025em;
  line-height: 1.5;
  color: #eaeaea;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex-grow: 1;
`;

const Layout = ({ children }: Props) => {
  return (
    <OuterDiv>
      <Main>{children}</Main>
    </OuterDiv>
  );
};

export default Layout;
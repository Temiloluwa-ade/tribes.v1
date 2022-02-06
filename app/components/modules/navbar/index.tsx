/* eslint-disable @next/next/no-html-link-for-pages */
import { LoadingButton } from "@mui/lab";
import { Avatar, Box, ButtonProps, styled, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useMoralis } from "react-moralis";
import Logo from "../../../images/tribesLogo.png";
import { smartTrim } from "../../../utils/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getOrCreateUser } from "../../../adapters/moralis";

type Props = {};

const StyledNav = styled("nav")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: "5rem",
  width: "100%",
  paddingTop: "1rem",
}));

const NavbarAvatar = styled(Avatar)(({ theme }) => ({
  height: 37,
  width: 37,
  objectFit: "cover",
  borderWidth: 2,
  border: "1px solid #0066FF",
}));

const NavbarButton = styled(LoadingButton)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText("#000f29"),
  borderRadius: "22.5px",
  textTransform: "none",
  border: "2px solid #0066FF",
  width: "178px",
  height: "45px",
}));

const Navbar = (props: Props) => {
  const {
    isAuthenticated,
    isAuthenticating,
    authenticate,
    logout,
    user,
    Moralis,
  } = useMoralis();
  return (
    <StyledNav>
      <Box sx={{ pt: 1, mx: 8 }}>
        <a href="/">
          <Image src={Logo} alt="logo" height="70" width="140" />
        </a>
      </Box>
      <Box sx={{ flex: "1 1 auto" }} />
      <Box sx={{ mx: 12 }}>
        {!isAuthenticated ? (
          <NavbarButton
            variant="outlined"
            loading={isAuthenticating}
            onClick={() =>
              authenticate().then(() => {
                getOrCreateUser(Moralis).then((res: any) => console.log(res));
              })
            }
          >
            <Typography sx={{ mx: 2, fontSize: 15 }}>Connect Wallet</Typography>
          </NavbarButton>
        ) : (
          <NavbarButton
            variant="outlined"
            endIcon={<ExpandMoreIcon color="primary" />}
            onClick={() => {
              logout();
            }}
          >
            <NavbarAvatar />
            <Typography sx={{ ml: 1, fontSize: 15 }}>
              {smartTrim(user?.get("ethAddress"), 10)}
            </Typography>
          </NavbarButton>
        )}
      </Box>
    </StyledNav>
  );
};

export default Navbar;
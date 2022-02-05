import {
  Backdrop,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Fade,
  Modal,
  Step,
  StepButton,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import { useForm } from "react-hook-form";
import EpochForm from "../epochForm";

type Props = {};

export const PrimaryButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText("#000f29"),
  borderRadius: "20px",
  textTransform: "none",
}));

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30rem",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

const steps = ["Epoch Details", "Import Tasks"];

const EpochModal = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [activeStep, setActiveStep] = useState(0);
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  const [loaderText, setLoaderText] = useState("Updating metadata");
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <PrimaryButton
        variant="outlined"
        size="large"
        type="submit"
        endIcon={<TimelapseIcon />}
        onClick={() => setIsOpen(true)}
        sx={{ ml: 4 }}
      >
        Create Epoch
      </PrimaryButton>
      <Modal open={isOpen} onClose={handleClose} closeAfterTransition>
        <Fade in={isOpen} timeout={500}>
          <Box sx={modalStyle}>
            <Stepper nonLinear alternativeLabel activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepButton color="inherit" onClick={handleStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                );
              })}
            </Stepper>
            <Backdrop
              sx={{
                color: "#eaeaea",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={loading}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress color="inherit" />
                <Typography sx={{ mt: 2, mb: 1, color: "#eaeaea" }}>
                  {loaderText}
                </Typography>
              </Box>
            </Backdrop>
            <EpochForm />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default EpochModal;
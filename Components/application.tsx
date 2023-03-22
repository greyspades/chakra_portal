import React, { useState, useEffect, FC, useContext } from "react";
import Axios from "axios";
import { Formik } from "formik";
import {
  Button,
  Input,
  InputAdornment,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
  Step,
  Stepper,
  StepLabel
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Role } from "../types/roles";
import { Fields } from "../types/roles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MainContext } from "../context";
import { useRouter } from "next/router";
import { CvUpload } from "./applicationStages/cvUpload";
import { PersonalInfo } from "./applicationStages/personalInfo";

export const Application: FC<Role> = (
  { deadline, experience, unit, salary, name, id }: Role,
  { goBack }: any
) => {
  const [info, setInfo] = useState<{
    firstName: string;
    lastName: string;
    dob: Date;
    email: string;
    password: string;
    phone: string;
    roleId: string;
  }>();
  const [file, setFile] = useState<File>();

  const [loading, setLoading] = useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);
  const [stage, setStage] = useState<number>(0);

  const { candidate, setCandidate, role, setRole } = useContext(
    MainContext
  ) as any;

  const router = useRouter();

  const changeStage = (val: number) => {
    setStage(val)
  }

  const renderStage = () => {
    switch (stage) {
      case 0:
        return <CvUpload changeStage={changeStage} />;
      case 1:
        return <PersonalInfo changeStage={changeStage} />;

      default:
        return <CvUpload />;
    }
  };

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
            <div className="mb-4">
      <Stepper activeStep={stage} alternativeLabel sx={{
            "& .MuiStepLabel-root .Mui-active": { color: "green" },
            "& .MuiStepLabel-root .Mui-completed": { color: "green" },
            // "& .Mui-disabled .MuiStepIcon-root": { color: "green" }
          }}>
            <Step>
              <StepLabel
              >Documents Submission</StepLabel>
            </Step>
            <Step>
              <StepLabel>Personal Info Submission</StepLabel>
            </Step>
            <Step>
              <StepLabel>Interview</StepLabel>
            </Step>
          </Stepper>
      </div>
      {renderStage()}
    </div>
  );
};

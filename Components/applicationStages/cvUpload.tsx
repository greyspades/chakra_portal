import React, { useState, useEffect, useContext } from "react";
import Formik from "formik";
import Axios, { AxiosError, AxiosResponse } from "axios";
import {
  Button,
  Input,
  InputAdornment,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
//   import { Role } from "../types/roles";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MainContext } from "../../context";
import { useRouter } from "next/router";
import CheckIcon from "@mui/icons-material/Check";

export const CvUpload = ({changeStage}: any) => {
  const [file, setFile] = useState<File>();

  const [loading, setLoading] = useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);
  const [stage, setStage] = useState<number>(0);
  const [error, setError] = useState<string>();


  const { candidate, setCandidate, role, setRole, cvData, setCvData, cvMeta, setCvMeta } =
    useContext(MainContext) as any;

  const router = useRouter();

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const uploadCv = () => {
    if(file) {
        setError('');
        setLoading(true);
        Axios.post("http://localhost:5048/upload", { cv:file }, {headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "multipart/form-data",
          },}).then(
      (res: AxiosResponse) => {
        setLoading(false);
        console.log(res.data);
        if(res.data.code == 200) {
            setCvData(res.data.data)
            setCvMeta(res.data.cvMeta)
            changeStage(1)
        }
      }
    )
    .catch((err: AxiosError) => {
        console.log(err.message);
        setLoading(false)
    });
    }
    else {
        setError("Please select a file")
    }
  };

  return (
    <div>
      <Paper className="flex flex-col justify-items-center md:h-[300px] bg-slate-100 ">
        <p className="mt-4 text-center font-bold text-lg">
          Please Submit your CV
        </p>
        <p className="text-center mb-2">
            pdf/docx
        </p>
        <div className="flex justify-center">
          <Input
            placeholder="Your Resume"
            type="file"
            required
            onChange={handleFileChange}
            className="bg-white rounded-md h-[40px] w-[250px] p-4 m-3"
          />
        </div>
        {cvData && (
          <div className="flex justify-center">
            <CheckIcon className="text-green-700 w-[40px] h-[40px]" />
          </div>
        )}
        {error && (
            <p className="flex justify-center text-center text-red-600">
                {error}
            </p>
        )}
        <div className="flex justify-center mt-6">
          <Button onClick={uploadCv} className="bg-green-700 text-white">
            {loading ? <CircularProgress  /> : <p>Submit</p>}
          </Button>
        </div>
      </Paper>
    </div>
  );
};

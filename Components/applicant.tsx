import React, { useEffect, useState } from "react";
import { Candidate } from "../types/candidate";
import {
  Divider,
  Button,
  CircularProgress,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Axios, { AxiosResponse } from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import Modal from "@mui/material/Modal";
import CircleIcon from "@mui/icons-material/Circle";
import PrintIcon from "@mui/icons-material/Print";
import SchoolIcon from "@mui/icons-material/School";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import BookIcon from "@mui/icons-material/Book";
import CloseIcon from '@mui/icons-material/Close';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type ApplicantProps = {
  data: Candidate;
  close: () => void;
  role: string;
};
export const Applicant = ({ data, close, role }: ApplicantProps) => {
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const [cvData, setCvData] = useState();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [skills, setSkills] = useState<string[]>();
  const [education, setEducation] = useState<{ [key: string]: string }[]>();

  const openModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
    console.log(numPages);
    if (numPages > 1) {
      setTimeout(() => {
        setPage(2);
      }, 0);
    }
  };

  useEffect(() => {
    const edu = JSON.parse(data.education);
    console.log(edu)
    setEducation(edu);
  }, []);

  const handleStatusChange = (code: number) => {
    setStatusCode(code);
    setTimeout(() => setStatusCode(0), 4000);
  };

  const moveToNextStage = () => {
    setLoading(true);
    const body = {
      id: data.id,
      stage: "2",
    };
    Axios.post("http://localhost:5048/stage", body).then(
      (res: AxiosResponse) => {
        setLoading(false);
        console.log(res.data);
        handleStatusChange(res.data.code);
      }
    );
  };

  useEffect(() => {
    Axios.get(`http://localhost:5048/api/Candidate/skills/${data.id}`).then(
      (res: AxiosResponse) => {
        // res.data.pop()
        setSkills(res.data);
      }
    );

    return;
  }, [data.id]);

  const displayMessage = (code: number) => {
    switch (code) {
      case 200:
        return (
          <Alert
            className="h-[40px] p-1 pb-0 w-[350px]"
            variant="filled"
            severity="success"
          >
            <AlertTitle>Success</AlertTitle>
            Successfull
          </Alert>
        );
      case 400:
        return (
          <Alert
            className="h-[70px] p-1 pb-0 w-[350px]"
            variant="outlined"
            severity="error"
          >
            <AlertTitle>Error</AlertTitle>
            An Error Occured Processing your Request
          </Alert>
        );
      default:
        return <div></div>;
    }
  };

  const fields: { [key: string]: any }[] = [
    {
      name: "First Name",
      value: data.firstName,
    },
    {
      name: "Last Name",
      value: data.lastName,
    },
    {
      name: "Gender",
      value: data.gender,
    },
    {
      name: "Date of Birth",
      value: data.dob,
    },
    {
      name: "Application Date",
      value: data.applDate,
    },
    {
      name: "Job Role Applied",
      value: role,
    },
    {
      name: "Phone Number",
      value: data.phone,
    },
    {
      name: "Application Stage",
      value: data.stage,
    },
    {
      name: "Application Status",
      value: data.status,
    },
  ];


  const printResume = () => {
    if (document.getElementById("GFG")) {
      var divContents = document.getElementById("cv")?.innerHTML;
      var a = window.open("", "", "height=500, width=500");
      a?.document.write("<html>");
      a?.document.write("<body > <h1>Div contents are <br>");
      a?.document.write(divContents!);
      a?.document.write("</body></html>");
      a?.document.close();
      a?.print();
    }
  };

  const renderEducation = () => {
    return education?.map((item: {[key:string]:string}, idx) => (
      <div key={idx} className="flex flex-row gap-3">
        <div>
          <p className="text-[11px]">
          School Attended
          </p>
        <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
          <SchoolIcon className="text-green-700" />
          <p className="mx-2">
          {item.school}
          </p>
        </div>
        </div>
        <div>
          <p className="text-[11px]">
            Course of Study
          </p>
        <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
          <SchoolIcon className="text-green-700" />
          <p className="mx-2">
          {item.course}
          </p>
        </div>
        </div>
       <div>
        <p className="text-[11px]">
          Certificate
        </p>
       <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
          <SchoolIcon className="text-green-700" />
          <p className="mx-2">
          {item.degree}
          </p>
        </div>
       </div>
        <div>
          <p className="text-[11px]">
            Graduation Date
          </p>
        <div className="flex flex-row bg-white p-1 rounded-md place-items-center">
          <SchoolIcon className="text-green-700" />
          <p className="mx-2">
          {item.graduationDate}
          </p>
        </div>
        </div>
      </div>
    ))
  }

  const renderInfo = () => {
    return fields?.map((item: { [key: string]: string }, idx: number) => (
      <div
        key={idx}
        className="flex flex-row gap-2 bg-white p-1 rounded-md overflow-x-hidden h-[35px]"
      >
        <p>{item.name}:</p>
        <p className="text-green-700 font-semibold">{item.value}</p>
      </div>
    ));
  };

  const renderSkills = () => {
    return skills?.map((item: string, idx: number) => (
      <div
        className="bg-white p-1 flex place-items-center flex-row justify-items-center rounded-md overflow-x-hidden m-2 ml-0 w-[150px] h-[35px]"
        key={idx}
      >
        <CircleIcon className="h-[10px] text-green-700" />
        {item}
      </div>
    ));
  };

  return (
    <div className="">
      <div className="flex justify-between">
        <p className="text-xl font-bold text-green-700">
          Applicant Information
        </p>
        <IconButton onClick={close}>
          <ArrowBackIcon className="text-green-700" />
        </IconButton>
      </div>

      <div className="grid grid-cols-5 gap-4 mt-4">
        <div className="grid col-span-4">
          <div className="">
            <p className="text-xl font-semibold">Personal Info</p>
          </div>
          <div className="grid grid-cols-2 h-[70%] gap-2">{renderInfo()}</div>
        </div>

        <div className="grid grid-rows-4 h-[250px] col-span-1">
          <div id="cv" className="flex justify-end row-span-3">
            <Document
              className=""
              onLoadError={(e) => console.log(e)}
              file={`http://localhost:5048/resume/${data.id}`}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={page} height={200} />
            </Document>
          </div>

          <div className="grid justify-end row-span-1 mt-6">
            <div className="grid grid-cols-2 gap-8">
              <IconButton
                className="bg-green-700 rounded-md h-[30px] w-[60px]"
                onClick={openModal}
              >
                <FindInPageIcon className="text-white" />
                <p className="text-[12px] text-white">View</p>
              </IconButton>

              <IconButton
                className="bg-green-700 rounded-md h-[30px] w-[60px]"
                onClick={printResume}
              >
                <PrintIcon className="text-white" />
                <p className="text-[12px] text-white">Print</p>
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-1" />
      {/* skills */}
      <div className="mt-[20px]">
        <p className="text-xl font-semibold">Skills</p>
        <div className="flex flex-row">{renderSkills()}</div>
      </div>
      <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-1" />
      {/* education */}
      <div className="py-6">
        {renderEducation()}
      </div>
      <Divider variant="fullWidth" className="bg-green-700 h-[2px] mt-1" />

      

      <div className="flex flex-row mt-4 justify-end gap-4">
        <Button className="bg-gray-400 text-white w-[200px]">
          {loading ? (
            <CircularProgress
              thickness={7}
              className="text-white w-[10px] h-[10px] p-1"
            />
          ) : (
            <p>Cancel Application</p>
          )}
        </Button>
        <Button
          className="bg-green-700 text-white w-[200px]"
          onClick={moveToNextStage}
        >
          {loading ? (
            <CircularProgress
              thickness={7}
              className="text-white w-[10px] h-[10px] p-1"
            />
          ) : (
            <p>Move to next Stage</p>
          )}
        </Button>
      </div>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        className="flex justify-center"
      >
        <div className="w-[600px] h-[700px] flex justify-center overflow-scroll">
          <Document
            className="h-[200px]"
            onLoadError={(e) => console.log(e)}
            onSourceError={(e) => console.log(e)}
            file={`http://localhost:5048/resume/${data.id}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={page} height={800} />
          </Document>
        </div>
      </Modal>
    </div>
  );
};

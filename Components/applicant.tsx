import React, { useEffect, useState } from "react";
import { Candidate } from "../types/candidate";
import { Divider, Button, CircularProgress, IconButton, Alert, AlertTitle } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import  Axios, { AxiosResponse }  from "axios";
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/TextLayer.css";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import Modal from "@mui/material/Modal";

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

  const openModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
    console.log("got the data")
  }

  // useEffect(() => {
  //   Axios.get('http://localhost:5048/resume')
  //   .then((res: AxiosResponse) => {
  //     setCvData(res.data);
  //   })
  // }, []);

const handleStatusChange = (code: number) => {
    setStatusCode(code);
    setTimeout(() => setStatusCode(0), 4000);
  };

const moveToNextStage = () => {
    setLoading(true)
    const body = {
        id:data.id,
        stage: '2'
    };
    Axios.post('http://localhost:5048/stage',body)
    .then((res: AxiosResponse) => {
        setLoading(false);
        console.log(res.data);
        handleStatusChange(res.data.code);
    })
}

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

  const printResume = () => {
    if(document.getElementById("GFG")) {
      var divContents = document.getElementById("cv")?.innerHTML;
            var a = window.open('', '', 'height=500, width=500');
            a?.document.write('<html>');
            a?.document.write('<body > <h1>Div contents are <br>');
            a?.document.write(divContents!);
            a?.document.write('</body></html>');
            a?.document.close();
            a?.print();
    }
  }

  return (
    <div>
       <div className="flex justify-end">
       <IconButton onClick={close}>
          <ArrowBackIcon className='text-green-700' />
        </IconButton>
       </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid col-span-1 h-[70%] gap-4 mt-[-50px]">
          <div className="flex flex-row gap-4 text-green-700 font-semibold text-2xl">
            <p>{data.firstName}</p>
            <p>{data.lastName}</p>
          </div>
          <div className="flex flex-row gap-2 bg-white p-1 rounded-md w-[300px] overflow-x-hidden h-[35px]">
            <p>First name:</p>
            <p className="text-green-700 font-semibold">{data.firstName}</p>
          </div>
          <div className="flex flex-row gap-2 bg-white p-1 rounded-md w-[300px] overflow-x-hidden h-[35px]">
            <p>Last name:</p>
            <p className="text-green-700 font-semibold">{data.lastName}</p>
          </div>
          <div className="flex flex-row gap-2 bg-white p-1 rounded-md w-[300px] overflow-x-hidden h-[35px]">
            <p className="flex">Date of Birth:</p>
            <p className="text-green-700 font-semibold">
              {data.dob.split("T")[0]}
            </p>
          </div>
          <div className="flex flex-row gap-2 bg-white p-1 rounded-md w-[300px] overflow-x-hidden h-[35px]">
            <p>Phone Number:</p>
            <p className="text-green-700 font-semibold">{data.phone}</p>
          </div>
          <div className="flex flex-row gap-2 bg-white p-1 rounded-md w-[300px] overflow-x-hidden h-[35px]">
            <p className="flex">Email Address:</p>
            <p className="text-green-700 font-semibold flex">{data.email}</p>
          </div>
          <div className="flex flex-row gap-2 bg-white p-1 rounded-md w-[300px] overflow-x-hidden h-[35px]">
            <p className="flex">Application Date:</p>
            <p className="text-green-700 font-semibold flex">
              {data.applicationDate?.split('T')[0]}
            </p>
          </div>
          <div className="flex flex-row gap-2 bg-white p-1 rounded-md w-[300px] overflow-x-hidden h-[35px]">
            <p className="flex">Application Stage:</p>
            <p className="text-green-700 font-semibold">{data.stage}</p>
          </div>
          <div className="flex flex-row gap-2 bg-white p-1 rounded-md w-[300px] overflow-x-hidden h-[35px]">
            <p className="flex">Application Status:</p>
            <p className="text-green-700 font-semibold flex">{data.status}</p>
          </div>
          <div className="flex flex-row gap-2 bg-white p-1 rounded-md w-[300px] overflow-x-hidden h-[35px]">
            <p className="flex">Role applied:</p>
            <p className="text-green-700 font-semibold flex">{role}</p>
          </div>
        </div>

        <div className="grid col-span-2">
          {/* <div className="flex flex-row justify-items-center justify-between">
            <p className="text-green-700 font-semibold text-2xl">
            Resume
            </p>
            <IconButton onClick={close}>
          <ArrowBackIcon className='text-green-700' />
        </IconButton>
            {statusCode != 0 && (
                <div>
                    {displayMessage(statusCode as number)}
                </div>
            )}
          </div> */}
          <div id="cv" className="flex justify-end">
          <Document className="h-[200px]" onLoadError={(e) => console.log(e)} file="http://localhost:5048/resume" onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={1} height={400} />
      </Document>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end mt-[-40px]">
          <IconButton onClick={openModal}>
            <FindInPageIcon />
            view resume
          </IconButton>

          <IconButton onClick={printResume}>
            <FindInPageIcon />
            print
          </IconButton>
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
        <Button className="bg-green-700 text-white w-[200px]" onClick={moveToNextStage}>
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
      className='flex justify-center'
      >
        <div className="w-[600px] h-[700px] flex justify-center overflow-scroll">
        <Document className="h-[200px]" onLoadError={(e) => console.log(e)} file="http://localhost:5048/resume" onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={1} height={800} />
      </Document>
        </div>
      </Modal>
    </div>
  );
};

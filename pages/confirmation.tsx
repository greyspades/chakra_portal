import React, { useContext } from "react";
import { Navbar } from "../components/navbar";
import { MainContext } from "../context";
import { Paper } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import Footer from "../components/footer";

const Confirmation = () => {
  const { candidate, role } = useContext( MainContext ) as any;

  return (
    <div className="grid w-[100%] bg-slate-100 h-[100vh]">
      <Navbar />
      <div className="grid justify-center md:w-[100%] md:mt-[100px] mt-[80px]">
        <Paper className="flex flex-row justify-center md:h-[300px] md:w-[400px] bg-white p-4">
          <div className="flex flex-col justify-items-center">
            <div className="flex justify-center">
              <VerifiedIcon className="text-green-700 w-[80px] h-[80px]" />
            </div>
            <p className="font-bold text-xl text-green-700 text-center">
              Congratulations {candidate?.firstName}!
            </p>
            <p className="text-center mt-3 font-semibold">
              You have successfully applied for the role of {role?.name}, if
              your staging is successful you will be contacted by HR
            </p>
          </div>
        </Paper>
      </div>
      <div className='mt-[60px]'>
        <Footer />
      </div>
    </div>
  );
};

export default Confirmation;

import type { NextApiRequest, NextApiResponse } from "next";
import Axios from "axios";
import CryptoJS from "crypto-js";

type Data = {
  name: string;
};

type Req = {
  head: string;
  body: string;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { pid } = req.query

//   console.log(pid)

  const response = await Axios({
    url: `${process.env.GET_RESUME}/${pid}`,
    method: 'GET',
    responseType: 'arraybuffer', // This is important to handle binary data
  })
    .then(response => {
      // Process the file data here
      const fileData = response.data;
      // For example, you can create a Blob from the data
    //   const blob = new Blob([fileData], { type: 'application/pdf' });
      
    //   return blob
        return fileData
    })
    .catch(error => {
      console.error('Error fetching the file:', error);
    });


//   const response = await Axios.get(`${process.env.GET_RESUME}/${pid}`, {responseType: 'arraybuffer'})
//     .then((res) => {
//       return res.data;
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });

  res.status(200).send(response);
}

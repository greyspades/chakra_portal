import type { NextApiRequest, NextApiResponse } from "next";
import Axios from "axios";
import CryptoJS from "crypto-js";
import { NextResponse } from "next/server";
import { decryptRequest } from "../../../helpers/encryption";
// import formidable from 'express-formidable';

  var key = CryptoJS.enc.Utf8.parse(process.env.AES_KEY as string);
  var iv = CryptoJS.enc.Utf8.parse(process.env.AES_IV as string);

  let reqToken = CryptoJS.AES.encrypt(
    process.env.AUTH_TOKEN as string,
    key,
    {
      iv: iv,
    }
  ).toString();

// export const config = {
//   api: {
//     bodyParser: false,
//     // runtime: 'experimental-edge'
//   },
// };

export async function POST(request) {
  //   return NextResponse.json({ data: "working fine" })
  const formData:FormData = await request.formData()

  var tempFormData: FormData = formData;

  try {
    // console.log(formData)
    // console.log(await request.json())
    // tempFormData.forEach((val, key) => {
    //   if(key!= "cv") {
    //     val = decryptRequest(val.toString())
    //     // val = decryptRequest(val.toString())
    //   }
    // })
    // console.log(tempFormData)

    const response = await fetch(process.env.CREATE_APPLICATION, {
      method: 'POST',
      body: formData,
      
      headers: {
        Auth: reqToken
      },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data))
    // return NextResponse.json({})
  } catch (error) {
    console.log(error)
  }
}
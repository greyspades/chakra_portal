import React from "react";
import axios, { AxiosResponse } from "axios";
import CryptoJs from "crypto-js";
import { lowerKey, lowerKeyArray } from "./formating";

interface ConnectionProps {
  url: string;
  body: { [key: string]: any };
}

var key = CryptoJs.enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_KEY);
var iv = CryptoJs.enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_IV);

export const getContent = async (url: string) => {
  let response = await axios
    .get(url, {
      headers: {
        "Content-Type": "application/x-payload",
        Auth: CryptoJs.AES.encrypt(process.env.NEXT_PUBLIC_TOKEN, key, {
          iv: iv,
        }).toString(),
      },
    })
    .then((res: AxiosResponse) => res.data);

  if (response.data) {
    let bytes = CryptoJs.AES.decrypt(response.data, key, { iv: iv });
    let resData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
    response.data = resData;
  }
  return response;
};

export const postContent = (
  url: string,
  body: { [key: string]: any }
): Promise<AxiosResponse> => {
  let encrypted = CryptoJs.AES.encrypt(JSON.stringify(body), key, {
    iv: iv,
  }).toString();
  return axios.post(url, encrypted, {
    headers: {
      "Content-Type": "application/x-payload",
    },
  });
};

export const postAsync = async (url: string, body: { [key: string]: any }) => {
  let encrypted = CryptoJs.AES.encrypt(JSON.stringify(body), key, {
    iv: iv,
  }).toString();
  let response = await axios
    .post(url, encrypted, {
      headers: {
        "Content-Type": "application/x-payload",
        Auth: CryptoJs.AES.encrypt(process.env.NEXT_PUBLIC_TOKEN, key, {
          iv: iv,
        }).toString(),
      },
    })
    .then((res: AxiosResponse) => res.data);
  if (response.data) {
    let bytes = CryptoJs.AES.decrypt(response.data, key, { iv: iv });
    let resData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
    if (Array.isArray(resData)) {
      response.data = lowerKeyArray(resData);
    } else if (typeof resData === "object" && resData !== null) {
      response.data = lowerKey(resData);
    } else {
      response.data = resData;
    }
    return response;
  } else {
    return response;
  }
};

export const postCustom = async (
  url: string,
  body: { [key: string]: any },
  header: { [key: string]: any }
) => {
  let encrypted = CryptoJs.AES.encrypt(JSON.stringify(body), key, {
    iv: iv,
  }).toString();
  let response = await axios
    .post(url, encrypted, { headers: header })
    .then((res: AxiosResponse) => res.data);
  if (response.data) {
    // console.log(res.data)
    let bytes = CryptoJs.AES.decrypt(response.data, key, { iv: iv });
    let resData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
    // response.data = resData
    if (Array.isArray(resData)) {
      response.data = lowerKeyArray(resData);
    } else if (typeof resData === "object" && resData !== null) {
      response.data = lowerKey(resData);
    } else {
      response.data = resData;
    }
    return response;
  } else {
    return response;
  }
};

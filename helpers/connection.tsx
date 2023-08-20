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
  let reqHeader = CryptoJs.AES.encrypt(process.env.NEXT_PUBLIC_TOKEN, key, {
    iv: iv,
  }).toString();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      head: reqHeader,
      // body: reqBody,
      url: url,
      method: "GET"
    }),
  };
  var response = await fetch("/api/connect", options);
  var jsonRes = await response.json();

  if (jsonRes) {
    let bytes = CryptoJs.AES.decrypt(jsonRes.data, key, { iv: iv });
    let resData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
    jsonRes.data = resData;
  }
  return jsonRes;
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
  let reqBody = CryptoJs.AES.encrypt(JSON.stringify(body), key, {
    iv: iv,
  }).toString();
  let reqHeader = CryptoJs.AES.encrypt(process.env.NEXT_PUBLIC_TOKEN, key, {
    iv: iv,
  }).toString();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      head: reqHeader,
      body: reqBody,
      url: url,
      method: "POST"
    }),
  };
  var response = await fetch("/api/connect", options);
  var jsonRes = await response.json();
  if (jsonRes?.data) {
    let bytes = CryptoJs.AES.decrypt(jsonRes.data, key, { iv: iv });
    let resData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
    if (Array.isArray(resData)) {
      jsonRes.data = lowerKeyArray(resData);
    } else if (typeof resData === "object" && resData !== null) {
      jsonRes.data = lowerKey(resData);
    } else {
      jsonRes.data = resData;
    }
    return jsonRes;
  } else {
    return jsonRes;
  }
};

export const postCustom = async (
  url: string,
  body: { [key: string]: any },
  // header: { [key: string]: any }
) => {
  let encrypted = CryptoJs.AES.encrypt(JSON.stringify(body), key, {
    iv: iv,
  }).toString();
  let response = await axios
    .post(url, encrypted, { headers: {Auth: CryptoJs.AES.encrypt(process.env.NEXT_PUBLIC_TOKEN, key, {
      iv: iv,
    }).toString()} })
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

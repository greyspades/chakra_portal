import CryptoJS from "crypto-js";

var key = CryptoJS.enc.Utf8.parse(process.env.AES_KEY as string);
var iv = CryptoJS.enc.Utf8.parse(process.env.AES_IV as string);

export const decryptRequest = (req: string) => {
    // console.log(req)
    let bytes = CryptoJS.AES.decrypt(req, key, { iv: iv });
    // let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    let decryptedData = bytes.toString(CryptoJS.enc.Utf8)
    // console.log(decryptedData)
    return decryptedData;
    // return req
}
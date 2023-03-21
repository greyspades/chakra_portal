import React from 'react'

export const validate = (body: {[key: string]: string}, type: string) => {
  switch(type) {
    case "status":
      if(body["email"] && body["password"] && body["email"].includes("@") && body["email"].includes(".") ) {
        return true;
      }
      else return false;

    default :
    return false;
  }
}

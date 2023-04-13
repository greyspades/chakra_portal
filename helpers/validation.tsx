import React from 'react'
import * as Yup from "yup";

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

export const CandidateValidation = Yup.object().shape({
  email: Yup.string()
    .email('The email is invalid')
    .required('This field is required'),
  password: Yup.string()
    .min(3, 'The password is too short')
    .max(12, 'The password is too long')
    .required('This field is required'),
  firstName: Yup.string()
  .required('this field is required'),
  lastName: Yup.string()
  .required('this field is required'),
  otherName: Yup.string(),
  dob: Yup.date().required('this field is required'),
  phone: Yup.string().required('this field is required').min(11, "Must be at least 11 digits").max(11, 'Must not be more than 11 digits'),
});

export const SignInValidation = Yup.object().shape({
  email: Yup.string()
  .email('The email is invalid')
  .required('This field is required'),
  password: Yup.string()
  .required('This field is required')
})

export const InterviewForm = Yup.object().shape({
  day: Yup.date().required('this field is required'),
  time: Yup.date().required('this field is required')
})

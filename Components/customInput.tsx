import React, { useState, useRef } from "react";
import {
  Button,
  Input,
  InputAdornment,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Radio,
  OutlinedInput,
  createStyles,
  createMuiTheme,
} from "@mui/material";
import { error } from "console";
import { FormikErrors } from "formik";

interface CustomInputProps {
  value?: string;
  onChange: (e?: string) => void;
  adornment?: any;
  placeHolder?: string;
  type?: string;
  classes?: string;
  icon?: any;
  component: "text" | "select" | "field";
  selValues?: string[];
  rows?: number;
  readonly?: true;
  error?: any;
  errorText?: string;
  helper?: string;
  disabled?: boolean;
  fitWidth?: true;
  required?: true;
  endAdornment?: true;
}

export const CustomInput = ({
  value,
  onChange,
  adornment,
  placeHolder,
  type,
  icon,
  classes,
  component,
  selValues,
  rows,
  readonly,
  error,
  errorText,
  helper,
  disabled,
  fitWidth,
  required,
  endAdornment,
}: CustomInputProps) => {
  const [focussed, setFocussed] = useState<boolean>(false);

  const changeFocus = () => {
    setFocussed((focuss: boolean) => !focuss);
  };

  return (
    <FormControl className={!fitWidth ? "w-[100%]" : null}>
      <InputLabel className="flex flex-row" shrink={true}>
        {(value || type == "date") && <>{placeHolder}</>}{" "}
        <span className="mr-2 text-red-700 text-[13px] ml-6">{helper}</span>
        {required && (
          <div className="flex justify-items-center gap-2 flex-row md:ml-[-30px]">
            <span className="text-[20px] text-red-500">*</span>
            {/* <p className="text-[16px]">{placeHolder}</p>m */}
          </div>
        )}
      </InputLabel>
      {component == "text" && (
        <Input
          disabled={disabled ?? false}
          value={value}
          placeholder={placeHolder}
          onChange={(e: any) => onChange(e)}
          className={classes}
          type={type ?? "text"}
          readOnly={readonly ? true : false}
          style={{
            border: focussed ? "solid" : "none",
            borderColor: focussed ? "green" : "grey",
          }}
          disableUnderline
          onFocus={changeFocus}
          onBlur={changeFocus}
          //    className="h-[40px] md:w-[100%] w-[320px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
          startAdornment={
            icon &&
            !endAdornment && (
              <InputAdornment position="end">{icon}</InputAdornment>
            )
          }
          endAdornment={
            icon &&
            endAdornment && (
              <InputAdornment position="end">{icon}</InputAdornment>
            )
          }
        />
      )}
      {component == "field" && (
        <TextField
          variant="filled"
          value={value}
          onChange={(e: any) => onChange(e)}
          className={classes}
          inputProps={{
            disableUnderline: true,
            underline: {
              "&&&:before": {
                borderBottom: "none",
              },
              "&&:after": {
                borderBottom: "none",
              },
            },
          }}
          type={type ?? "text"}
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: "#F3F4F6",
            },
            "& .MuiInputLabel-root": { color: "green", border: "none" },
          }}
          style={{
            border: focussed ? "solid" : "none",
            borderColor: focussed ? "green" : "grey",
            width: "100%",
          }}
          onFocus={changeFocus}
          onBlur={changeFocus}
          multiline
          rows={rows}
        />
      )}
      {component == "select" && (
        <Select
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#F3F4F6",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "green",
            },
          }}
          className={classes}
          value={value}
          onChange={(e: any) => onChange(e)}
          style={{
            border: focussed ? "solid" : "none",
            borderColor: focussed ? "green" : "grey",
          }}
          size="small"
          readOnly={readonly ? true : false}
        >
          {selValues?.map((item: string, idx: number) => (
            <MenuItem key={idx} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      )}
      {/* <div className="md:mt-[-10px] md:ml-[-10px]">
              {error && (
                <div className="text-red-600 text-[10px] ml-4">
                  {errorText}
                </div>
              )}
            </div> */}
      <div className="text-red-600 text-[10px] ml-4">{error}</div>
    </FormControl>
  );
};

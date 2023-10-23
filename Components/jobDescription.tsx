import React, { useState, useEffect } from "react";
import { stateFromHTML } from "draft-js-import-html";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import { convertToHTML, stateToText } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

export const JobDescription = ({ desc }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  
  useEffect(() => {
    var contentState = stateFromHTML(desc);
    var html = EditorState.createWithContent(contentState);
    setEditorState(html)
  },[])

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        // wrapperClassName="h-[200px]"
        readOnly={true}
        toolbarHidden={true}
        editorClassName="bg-white p-4"
        toolbarClassName="toolbar-class"

      />
    </div>
  );
};

/*
 * @Author: Kanata You 
 * @Date: 2021-02-12 23:16:04 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-02-13 00:21:24
 */

import React, { useEffect, useState } from "react";
import Page from "./Page";
import { NoteData } from "../note/Note";
import GraphRendering from "../note/GraphRendering";


export interface EditorProps {
  data: NoteData;
};

export interface EditorState {
  data: NoteData;
  mode: "note" | "graph";
};

const Editor: React.FC<EditorProps> = props => {
  const [state, setState] = useState<EditorState>({
    data: props.data,
    mode: "graph"
  });
  
  useEffect(() => {
    document.getElementsByTagName("title")[0].innerText = (
      `Inkacy : ${ props.data.name }`
    );
  }, []);
  
  return (
    <Page>
      <GraphRendering { ...state.data } />
    </Page>
  );
};


export default Editor;

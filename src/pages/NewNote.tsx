/*
 * @Author: Kanata You 
 * @Date: 2021-02-12 23:15:30 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-02-12 23:15:51
 */

import React from "react";
import Page from "./Page";


const NewNote: React.FC = () => {
  return (
    <Page>
      <article
        style={{
          padding:  "50px 5rem",
          width:    "calc(100vw - 10rem - 16px)",
          height:   "calc(100vh - 100px - 16px)",
          display:  "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-around"
        }} >
      </article>
    </Page>
  );
};


export default NewNote;

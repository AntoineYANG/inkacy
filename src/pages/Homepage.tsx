/*
 * @Author: Kanata You 
 * @Date: 2021-02-12 19:45:48 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-02-12 23:09:28
 */

import React from "react";
import Page from "./Page";
import { createStyle, useStyleWrapper } from "reacss";
import { Link } from "react-router-dom";


const Homepage: React.FC = () => {
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
          <MainBtn key="new" path="/new" >
            NEW
          </MainBtn>
          <MainBtn key="open" path="/open" >
            OPEN
          </MainBtn>
      </article>
    </Page>
  );
};

const MainBtnStyle = createStyle({
  "label": {
    padding:      "1rem",
    width:        "calc(8vw + 80px)",
    height:       "calc(5vh + 40px)",
    display:      "flex",
    alignItems:   "center",
    justifyContent:  "center",
    fontSize:     "140%",
    userSelect:   "none",
    border:       "2px solid",
    borderColor:  "rgba(0,0,0,0)",
    textShadow:   "1px 1px 0.8em rgba(252,250,251,0.1)",
    transition:   "border-color 0.9s, text-shadow 1.2s",
    cursor:       "pointer"
  },
  "label:hover, label:focus": {
    borderColor:  "inherit",
    transition:   "border-color 1.8s, text-shadow 2.4s",
    textShadow:   "1px 1px 2em rgba(252,250,251,0.9)"
  }
});

const MainBtn: React.FC<{ children: string; path: string; }> = props => {
  const StyleWrapper = useStyleWrapper(MainBtnStyle);

  return (
    <Link to={ props.path }
      style={{
        color:  "inherit",
        textDecoration: "none"
      }} >
        <StyleWrapper>
          <label>
            { props.children.split("").join(" ") }
          </label>
        </StyleWrapper>
    </Link>
  );
};


export default Homepage;

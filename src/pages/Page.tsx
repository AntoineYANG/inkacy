/*
 * @Author: Kanata You 
 * @Date: 2021-02-12 20:37:19 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-02-12 21:31:31
 */

import React from "react";
import { createStyle, useStyleWrapper } from "reacss";


const PageStyle = createStyle({
  "div": {
    width:      "max-content",
    height:     "max-content"
  },
  "div>section": {
    minWidth:   "calc(100vw - 16px)",
    minHeight:  "calc(100vh - 16px)",
    display:    "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center"
  }
});

const Page: React.FC = props => {
  const StyleWrapper = useStyleWrapper(PageStyle);

  return (
    <StyleWrapper>
      <div>
        <section>
          { props.children }
        </section>
      </div>
    </StyleWrapper>
  );
};


export default Page;

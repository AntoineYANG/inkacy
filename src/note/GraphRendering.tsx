/*
 * @Author: Kanata You 
 * @Date: 2021-02-12 23:52:12 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-02-13 01:37:20
 */

import React, { useState, useEffect } from "react";
import { NoteData, NoteGraphNode } from "./Note";
import { createStyle, useStyleWrapper } from "reacss";


export interface GraphNode extends NoteGraphNode {
  id: string;
  x:  number;
  y:  number;
  w:  number;
  h:  number;
};

const GraphNodeStyle = createStyle({
  "svg rect": {
    fill:   "rgba(0,0,0,0)",
    stroke: "rgb(252,250,251)",
    strokeWidth:  1.2,
    cursor: "text"
  },
  "svg text": {
    fill:   "rgb(252,250,251)",
    pointerEvents:  "none"
  }
});

interface GraphRenderingState {
  loaded: boolean;
  nodes:  GraphNode[];
  w:      number;
  h:      number;
};

const GraphRendering: React.FC<NoteData> = data => {
  const StyleWrapper = useStyleWrapper(GraphNodeStyle);

  let width: number = 300;
  let height: number = 300;
  const nodes: GraphNode[] = [];

  const graphData = data.graph.map(node => Object.assign({}, node));

  const searchChildren = (node: NoteGraphNode, id: string, x: number, y: number) => {
    node.children.forEach((n, i) => {
      const _id = id + "," + i;
      const _x = x + 120;
      const _y = y + 25 * (i - (node.children.length - 1) / 2) / node.children.length;
      nodes.push({
        ...n,
        id: _id,
        x:  _x,
        y:  _y,
        w:  0,
        h:  0
      });
      searchChildren(n, _id, _x, _y);
    });
  };

  graphData.forEach(node => {
    if (node.parent === null) {
      const id = nodes.length + "";
      nodes.push({
        ...node,
        id,
        x:  0,
        y:  0,
        w:  0,
        h:  0
      });
    }
  });
  nodes.forEach((node, i) => {
    const x = 0;
    const y = 50 * (i - (nodes.length - 1) / 2) / nodes.length;
    searchChildren(node, node.id, x, y);
  });

  const [state, setState] = useState<GraphRenderingState>({
    loaded: false,
    nodes,
    w:      300,
    h:      300
  });

  const div = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if (div.current) {
      const list = div.current!.querySelectorAll("label");
      for (let i = 0; i < list.length; i++) {
        nodes[i].w = list[i].clientWidth;
        nodes[i].h = list[i].clientHeight;
      }
      setState({
        ...state,
        nodes:  [...nodes],
        loaded: true
      });
    }
  }, [div.current]);

  return state.loaded ? (
    <StyleWrapper>
      <svg width={ width } height={ height }
        style={{
          background: "rgb(24,24,25)",
          boxShadow:  "3px 4px 6px rgba(0,0,0,0.5)"
        }} >
          <g
            style={{
              transform:  `translate(${ width / 2 }px,${ height / 2 }px)`
            }} >
              {
                state.nodes.map(node => {
                  return (
                    <g key={ node.id } >
                      <rect x={ node.x - node.w / 2 } y={ node.y - node.h / 2 }
                        width={ node.w } height={ node.h }
                        rx={ 10 } ry={ 10 } />
                      {
                        node.text.includes("\n") ? node.text.split("\n").map((t, i) => {
                          return (
                            <text key={ i }
                              x={ node.x - node.w / 2 } y={ node.y }
                              dx="0.6em" dy={ `${ i * 1.3 - 0.3 }em` } >
                                { t }
                            </text>
                          );
                        }) : (
                          <text
                            x={ node.x - node.w / 2 } y={ node.y }
                            dx="0.6em" dy="0.3em" >
                             { node.text }
                          </text>
                        )
                      }
                    </g>
                  );
                })
              }
          </g>
      </svg>
    </StyleWrapper>
  ) : (
    <div ref={ div }
      style={{
        // width:  0,
        // height: 0,
        overflow: "hidden"
      }} >
        {
          state.nodes.map(node => {
            return (
              <label key={ node.id }
                style={{
                  padding:    "6px 0.6em",
                  whiteSpace: "pre",
                  display:    "block"
                }} >
                  { node.text }
              </label>
            );
          })
        }
    </div>
  );
};


export default GraphRendering;

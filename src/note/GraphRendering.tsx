/*
 * @Author: Kanata You 
 * @Date: 2021-02-12 23:52:12 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-02-13 01:37:20
 */

import React, { useEffect, useState } from "react";
import { NoteData, NoteGraphNode } from "./Note";
import { createStyle, useStyleWrapper } from "reacss";


export interface GraphNode extends NoteGraphNode {
  type: "node" | "new";
  key:  string;
  n:    number;
};

const GraphNodeStyle = createStyle({
  "* *": {
    transition:     "all 0.3s"
  },
  "* table": {
    zIndex:         20,
    borderCollapse: "collapse",
    padding:        "2em",
    display:        "block"
  },
  "* td": {
    background:     "rgba(0,0,0,0)",
    padding:        "0.8em 30px"
  },
  "* label": {
    display:        "inline-block",
    border:         "1.4px solid",
    borderRadius:   "1px",
    padding:        "5px 0.6em",
    whiteSpace:     "pre",
    cursor:         "pointer",
    boxShadow:      "0 0 4px",
    textShadow:     "0 0 1px",
    userSelect:     "none",
    transition:     "text-shadow 0.4s, box-shadow 0.4s",
  },
  "* label.unselected:hover": {
    boxShadow:      "0 0 0.6em"
  },
  "* label.selected": {
    boxShadow:      "0 0 1.6em",
    textShadow:     "1px 1px 0.6em"
  },
  "* label.btn": {
    border:         "none",
    textShadow:     "none",
    boxShadow:      "0 0 0.6em",
    opacity:        0.7
  },
  "* svg": {
    zIndex:         100,
    pointerEvents:  "none"
  },
  "* svg path": {
    fill:           "none",
    stroke:         "rgb(195,226,246)",
    strokeWidth:    "1"
  },
  "* svg path.btn": {
    opacity:        0.8
  }
});

type GraphLinks = {
  source: NoteGraphNode & { key: string; type: "node" | "new"; };
  target: NoteGraphNode & { key: string; type: "node" | "new"; };
};

interface GraphRenderingState {
  nodes:  (NoteGraphNode & { type: "node" | "new"; key: string; })[];
  width:  number;
  height: number;
  links:  GraphLinks[] | null;
  nodeMap: {[key: string]: [number, number, number, number];};
  selected: string | null;
};

let selected: string | null = null;

const GraphRendering: React.FC<NoteData> = data => {
  const StyleWrapper = useStyleWrapper(GraphNodeStyle);

  let nodes: (NoteGraphNode & { type: "node" | "new"; key: string; })[] = [];
  
  data.graph.forEach((node, i) => {
    const key = i + "";
    (node as any).key = key;
    eachNode(node, (n, j) => {
      if (n.level > 0) {
        (n as any).key = (n.parent as any).key + "," + j;
      }
    });
    eachNode(node, n => {
      const newChild: (NoteGraphNode & {
          type: "node" | "new";
          key: string;
      }) = {
        type: "new",
        children: [],
        key: (n as any).key + ":new",
        level: n.level + 1,
        parent: n,
        text: "new"
      };
      nodes.push({
        ...(n as NoteGraphNode & { key: string; }),
        type: (n as { type?: "new" | "node"; }).type ?? "node",
        children: (n as { type?: "new" | "node"; }).type === "new" ? [] : (
          n.children.concat([newChild])
        )
      });
      nodes.push(newChild);
    });
  });
  
  nodes.push({
    type: "new",
    children: [],
    key: ":new",
    level: 0,
    parent: null,
    text: "new"
  });

  const [state, setState] = useState<GraphRenderingState>({
    width:  0,
    height: 0,
    links:  null,
    nodeMap:  {},
    selected,
    nodes
  });
  
  const table: (GraphNode | null)[][] = [];
  const used: number[] = [];

  const maxDepth = Math.max(...state.nodes.map(node => node.level)) + 1;

  for (let i = 0; i < maxDepth; i++) {
    used.push(0);
  }
  
  for (let r = 0; r < state.nodes.filter(node => node.children.length === 0).length; r++) {
    const tr: (GraphNode | null)[] = [];
    for (let i = 0; i < maxDepth; i++) {
      tr.push(null);
    }
    table.push(tr);
  }

  state.nodes.forEach(node => {
    let n: number = 0;
    eachNode(node, child => {
      if (child.children.length === 0) {
        n += 1;
      }
    });
    // console.log(table, used[node.level], node.level);
    if (used[node.level] >= table.length) {
      return;
    }
    table[used[node.level]][node.level] = {
      ...node,
      type: node.type ?? "node",
      key:  node.key,
      n
    };
    used[node.level] += n;
    if (node.children.length === 0) {
      for (let x = node.level + 1; x < maxDepth; x++) {
        used[x] += n;
      }
    }
  });

  const tableRef = React.createRef<HTMLTableElement>();
  
  useEffect(() => {
    if (tableRef.current) {
      const nodeMap: {[key: string]: [number, number, number, number];} = {};

      const outerBounds = tableRef.current.getBoundingClientRect();
      
      table.forEach((tr, y) => {
        const row = tableRef.current!.children[0].children[y];
        let x = 0;
        tr.forEach(td => {
          if (td) {
            const label = row.children[x].children[0] as HTMLLabelElement;
            const bounds = label.getBoundingClientRect();
            
            nodeMap[td.key] = [
              bounds.x - outerBounds.x,
              bounds.y - outerBounds.y,
              bounds.width,
              bounds.height
            ];
            x += 1;
          }
        });
      });

      const links: GraphLinks[] = [];

      state.nodes.forEach(node => {
        node.children.forEach(child => {
          links.push({
            source: node,
            target: {
              ...child,
              type: (child as any).type ?? "node"
            } as NoteGraphNode & { key: string; type: "node" | "new"; }
          });
        });
      });

      setState({
        width:  tableRef.current.clientWidth,
        height: tableRef.current.clientHeight,
        links,
        nodeMap,
        nodes,
        selected: null
      });
    }
  }, [tableRef.current, state.selected, selected]);

  return (
    <StyleWrapper>
      <div
        style={{
          height:   state.height,
          overflow: "hidden"
        }} 
        onClick={
          () => {
            if (selected !== null) {
              selected = null;
              state.nodes.forEach(node => {
                eachNode(node, n => {
                  n.children = n.children.filter(
                    c => (c as any).type === "node"
                  );
                });
              });
              state.nodes = nodes.filter(node => node.level === 0 || node.type === "node");
              nodes = state.nodes;
              setState({
                ...state,
                nodes,
                selected
              });
            }
          }
        }>
          <table ref={ tableRef } >
            <tbody>
              {
                table.map((tr, y) => {
                  return (
                    <tr key={ y } >
                      {
                        tr.filter(td => td).map((td, x) => {
                          const isBtn = td!.type !== "node";

                          return (
                            <td key={ x } rowSpan={ td!.n === 1 ? undefined : td!.n } >
                              <label
                                className={
                                  isBtn ? "btn" : (
                                    selected === td!.key ? "selected" : "unselected"
                                  ) }
                                onClick={
                                  e => {
                                    e.stopPropagation();
                                    if (td!.type === "node") {
                                      if (selected !== td!.key) {
                                        selected = td!.key;
                                        setState({
                                          ...state,
                                          selected,
                                          nodes
                                        });
                                      }
                                    }
                                  }
                                } >
                                  { td!.text }
                              </label>
                            </td>
                          );
                        })
                      }
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          <svg width={ state.width } height={ state.height }
            style={{
              position: "relative",
              top:      `-${state.height}px`
            }} >
              {
                state.links && state.links.map(link => {
                  const s = state.nodeMap[link.source.key];
                  const t = state.nodeMap[link.target.key];

                  const path = `M${s[0]+s[2]},${s[1]+s[3]/2}`
                    + ` Q${s[0]+s[2]+24},${t[1]+t[3]/2}`
                    + ` ${t[0]},${t[1]+t[3]/2}`;

                  const isBtn = link.target.type !== "node";

                  return (
                    <path key={ link.source.key + ":" + link.target.key }
                      strokeDasharray={ isBtn ? "3,3" : void 0 }
                      className={ isNaN ? "btn" : void 0 }
                      d={ path } />
                  );
                })
              }
          </svg>
      </div>
    </StyleWrapper>
  );
};

const eachNode = (root: NoteGraphNode, callback: (node: NoteGraphNode, i: number) => void, idx: number=0): void => {
  callback(root, idx);
  root.children.forEach((child, i) => eachNode(child, callback, i));
};


export default GraphRendering;

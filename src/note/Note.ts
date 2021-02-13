/*
 * @Author: Kanata You 
 * @Date: 2021-02-12 23:27:27 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-02-13 01:19:15
 */


export type NoteGraphNode = {
  text:     string;
  level:    number;
  parent:   NoteGraphNode | null;
  children: NoteGraphNode[];
};

export type NoteData = {
  name:   string;
  graph:  NoteGraphNode[];
};


export const createNote = (name: string): NoteData => {
  const note: NoteData = {
    name,
    graph: [{
      text:     name,
      parent:   null,
      level:    0,
      children: [{
        text: "line1\nline2",
        parent: null,
        level:  1,
        children: []
      }, {
        text: "section 2",
        parent: null,
        level:  1,
        children: []
      }]
    }, {
      text:     name + "2",
      parent:   null,
      level:    0,
      children: [{
        text: "line1\nline2",
        parent: null,
        level:  1,
        children: []
      }, {
        text: "section 2",
        parent: null,
        level:  1,
        children: [{
          text: "line1\nline2",
          parent: null,
          level:  2,
          children: []
        }]
      }]
    }]
  };

  note.graph[0].children[0].parent = note.graph[0];
  note.graph[0].children[1].parent = note.graph[0];
  note.graph[1].children[0].parent = note.graph[1];
  note.graph[1].children[1].parent = note.graph[1];
  note.graph[1].children[1].children[0].parent = note.graph[1].children[1];

  return note;
};

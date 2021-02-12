/*
 * @Author: Kanata You 
 * @Date: 2021-02-12 23:27:27 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2021-02-13 01:19:15
 */


export type NoteGraphNode = {
  text:     string;
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
      children: [{
        text: "line1\nline2",
        parent: null,
        children: []
      }]
    }]
  };

  note.graph[0].children[0].parent = note.graph[0];

  return note;
};

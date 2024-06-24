import React, { useState } from "react";
import "./App.css";
import Tree from "react-d3-tree";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  const [nodes, setNodes] = useState([
    {
      id: "SLBXH67K",
      name: "Admin",
      children: [
        { id: "XX4PMLZ2", name: "John Doe", children: [] },
        { id: "F0OZWQIJ", name: "Jane Smith", children: [] },
      ],
    },
  ]);
  const [refId, setRefId] = useState("");
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");

  const GenerateID = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    setNewId(result);
  };

  const handleAddchildren = () => {
    const newchildren = {
      id: newId,
      name: newName,
      children: [],
    };

    const addNodechildren = (node) => {
      if (node.id !== refId) {
        toast.error("Reference id not found");
      }

      if (node.id === refId) {
        return {
          ...node,
          children: [...node.children, newchildren],
        };
      } else if (node.children.length > 0) {
        return {
          ...node,
          children: node.children.map(addNodechildren),
        };
      }
      return node;
    };

    const updatedNodes = nodes.map(addNodechildren);

    setNodes(updatedNodes);
    setRefId("");
    setNewId("");
    setNewName("");
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <h1 style={{}}>MLM Project</h1>
      <p>Note : Data temporary stored in Array</p>
      <div className="container">
        <div>
          <label>
            Reference ID:
            <input
              type="text"
              value={refId}
              onChange={(e) => setRefId(e.target.value)}
              placeholder="Enter reference ID"
            />
          </label>
        </div>
        <div>
          <label>
            New children ID:
            <input
              type="text"
              value={newId}
              placeholder="new children ID"
              readOnly
              disabled
            />
            <button onClick={GenerateID}>Generate new id</button>
          </label>
        </div>
        <div>
          <label>
            New children Name:
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new children name"
            />
          </label>
        </div>
        <button onClick={handleAddchildren}>Add children</button>
        <pre>{JSON.stringify(nodes, null, 2)}</pre>
      </div>
      <div
        style={{
          margin: "auto",
          width: "90%",
          height: "100vh",
          border: "1px solid black",
        }}
      >
        <Tree data={nodes} orientation="vertical" />
      </div>
    </>
  );
};

export default App;

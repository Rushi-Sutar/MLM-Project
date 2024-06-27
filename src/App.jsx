import React, { useState } from "react";
import "./App.css";
import Tree from "react-d3-tree";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  const [nodes, setNodes] = useState([
    {
      attributes: { id: "SLBXH67K" },
      name: "Admin",
      children: [
        {
          childno: 1,
          attributes: { id: "XX4PMLZ2" },
          name: "John Doe",
          children: [
            { childno: 1, attributes: { id: "C1CHILD1" }, name: "John's Child 1", children: [] },
            { childno: 2, attributes: { id: "C1CHILD2" }, name: "John's Child 2", children: [] },
            { childno: 3, attributes: { id: "C1CHILD3" }, name: "John's Child 3", children: [] },
          ],
        },
        {
          childno: 2,
          attributes: { id: "F0OZWQIJ" },
          name: "Jane Smith",
          children: [
            { childno: 1, attributes: { id: "C2CHILD1" }, name: "Jane's Child 1", children: [] },
            { childno: 2, attributes: { id: "C2CHILD2" }, name: "Jane's Child 2", children: [] },
            { childno: 3, attributes: { id: "C2CHILD3" }, name: "Jane's Child 3", children: [] },
          ],
        },
        {
          childno: 3,
          attributes: { id: "HLEWJADJ" },
          name: "Steve Smith",
          children: [
            { childno: 1, attributes: { id: "C3CHILD1" }, name: "Steve's Child 1", children: [] },
          ],
        },
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
    const addNodechildren = (node) => {
      if (node.attributes.id === refId) {
        const nextChildNo = node.children.length + 1; // Determine the next childno
        if (node.childno === 3) {
          if (node.children.length > 0) {
            toast.error("The third node can only have 1 child.");
            return node;
          }
        } else {
          if (node.children.length >= 3) {
            toast.error("A node can have a maximum of 3 children.");
            return node;
          }
        }
        const newchildren = {
          childno: nextChildNo,
          attributes: { id: newId },
          name: newName,
          children: [],
        };
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


  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    toast.success(`Copied ${id} to clipboard!`);
  };

  const renderNodesTable = (nodes) => {
    const rows = [];

    const renderNodes = (node) => {
      rows.push(
        <tr key={node.attributes.id}>
          <td>{node.name}</td>
          <td>{node.attributes.id}</td>
          <td>
            <button onClick={() => copyToClipboard(node.attributes.id)}>Copy ID</button>
          </td>
        </tr>
      );

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          renderNodes(child);
        });
      }
    };

    nodes.forEach((node) => {
      renderNodes(node);
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  };

  const customPathFunc = (linkData, orientation) => {
    const { source, target } = linkData;
    const stepFactor = 10; // Adjust this as per your preference
  
    if (orientation === 'vertical') {
      return `
        M${source.x},${source.y}
        L${source.x},${(source.y + target.y) / 2}
        L${target.x},${(source.y + target.y) / 2}
        L${target.x},${target.y}
      `;
    } else {
      return `
        M${source.x},${source.y}
        L${(source.x + target.x) / 2},${source.y}
        L${(source.x + target.x) / 2},${target.y}
        L${target.x},${target.y}
      `;
    }
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
       
      </div>
      
      <div
        style={{
          margin: "auto",
          width: "90%",
          height: "100vh",
          border: "1px solid black",
        }}
      >
        <Tree data={nodes} orientation="vertical" pathFunc={customPathFunc}/>
      </div>
      <div className="container">
        {renderNodesTable(nodes)}
      </div>
    </>
  );
};

export default App;

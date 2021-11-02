import React from "react";
import { render } from "react-dom";
import { Post } from "Models/Post";
import json from "Assets/json.json";
import xml from "Assets/data.xml";
import csv from "Assets/data.csv";
import WebpackLogo from "Assets/webpackLogo.png";
import "Src/babel";
import "Styles/styles.css";
import "Styles/less.less";
import "Styles/scss.scss";

const post = new Post("Webpack post title", WebpackLogo);

console.log("Post to string", post.toString());

console.group("View type files");
console.log("JSON:", json);
console.log("XML:", xml);
console.log("CSV:", csv);
console.groupEnd();

const App = () => (
  <section className="container">
    <h1>Webpack course 2020</h1>

    <hr />

    <div className="logo" />
    <hr />
    <pre className="code">{post.toString()}</pre>

    <div className="box">
      <h2>less</h2>
    </div>

    <div className="card">
      <h2>scss</h2>
    </div>
  </section>
);

render(<App />, document.getElementById("root"));

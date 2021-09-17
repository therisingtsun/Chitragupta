import React, { Component } from "react";

import marked from "marked";
import DOMPurify from "dompurify";

import hljs from "highlight.js/lib/common";
import "highlight.js/styles/github-dark-dimmed.css";

import "./index.scss";

class Marked extends Component {
  render() {
    const converted = DOMPurify.sanitize(
      marked(this.props.value, {
        highlight: function (code, lang) {
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          return hljs.highlight(code, { language }).value;
        },
        langPrefix: "hljs language-",
      })
    );
    return (
      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: converted }}
      />
    );
  }
}

export default Marked;

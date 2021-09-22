import React from "react";

import marked from "marked";
import DOMPurify from "dompurify";

import hljs from "highlight.js/lib/common";
import "highlight.js/styles/github-dark-dimmed.css";

import "./index.scss";

import Merit from "../MarkdownChitragupta";

marked.use({
	extensions: [
		Merit
	]
});

function Marked({ value }) {
	const converted = DOMPurify.sanitize(
		marked(
			value,
			{
				highlight: function (code, lang) {
					const language = hljs.getLanguage(lang) ? lang : 'plaintext';
					return hljs.highlight(code, { language }).value;
				},
				langPrefix: 'hljs language-',
			}
		)
	);
	return (
		<div className="markdown-preview" dangerouslySetInnerHTML={{ __html: converted }} />
	);
}

export default Marked;
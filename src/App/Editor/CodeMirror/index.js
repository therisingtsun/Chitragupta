import CodeMirror from "codemirror";
import "codemirror/addon/mode/overlay";
import "codemirror/addon/mode/simple";
import "codemirror/mode/markdown/markdown";
import "codemirror/addon/selection/active-line";
import "codemirror/keymap/sublime";
import "./base.css";
import "./theme-dark.css";

CodeMirror.defineSimpleMode("markdown-chitragupta-overlay", {
	start: [
		{
			regex: /\(\+\)/,
			token: "merit",
			sol: true,
		},
		{
			regex: /\(-\)/,
			token: "demerit",
			sol: true,
		}
	],
});

CodeMirror.defineMode("markdown-chitragupta", function(config, parserConfig) {
	return CodeMirror.overlayMode(
		CodeMirror.getMode(config, "markdown"),
		CodeMirror.getMode(config, "markdown-chitragupta-overlay")
	);
});
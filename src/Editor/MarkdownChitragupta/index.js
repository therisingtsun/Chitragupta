import CodeMirror from "codemirror";
import "codemirror/addon/mode/overlay";
import "codemirror/addon/mode/simple";
import "codemirror/mode/markdown/markdown";

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


const Rules = {
	base: {
		start: "^\\((__TYPE__)\\)",
		body: "((?:.|\\r?\\n)*?(?:\\r?\\n{2,}|(?=\\(__NEGTYPE__\\))|$))"
	},
	baseStart() {
		return this.base.start.replace("^", "\\n").replace("__TYPE__", "\\+|-");
	},
	merit() {
		return this.base.start.replace("__TYPE__", "\\+") + this.base.body.replace("__NEGTYPE__", "-");
	},
	demerit() {
		return this.base.start.replace("__TYPE__", "-") + this.base.body.replace("__NEGTYPE__", "\\+");
	},
	cleaner() {
		return new RegExp(this.baseStart(), "g");
	},
	breaker() {
		return new RegExp(" {2,}|\t", "g");
	}
};

export default {
	name: "meritBlock",
	level: "block",
	start: src => src.match(new RegExp(Rules.baseStart()))?.index,
	tokenizer(src) {
		const m = new RegExp(Rules.merit());
		const d = new RegExp(Rules.demerit());

		let match;
		
		if (match = m.exec(src) || (match = d.exec(src))) {
			const token = {
				className: match[1] === "+" ? "merit" : "demerit",
				raw: match[0],
				text: match[2]
					.replace(Rules.breaker(), "\n\n")
					.replace(Rules.cleaner(), " ")
					.trim(),
				tokens: [],
				type: "meritBlock",
			};
			this.lexer.blockTokens(token.text, token.tokens);
			return token;
		}
	},
	renderer(token) {
		return `<blockquote class="merit-block ${token.className}">${this.parser.parse(token.tokens)}\n</blockquote>`;
	}
};
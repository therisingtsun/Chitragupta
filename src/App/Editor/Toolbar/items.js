import ClipboardJS from "clipboard";

import { lineTransformer, wordTransformer } from "./transformer-methods";

import { toast } from "react-toastify";

function CMCommandRunner(editor, fn) {
	fn(editor);
}

export default [
	{
		title: "Bold", icon: "format_bold", runner: wordTransformer,
		action(text) {
			const boldRule = /(\*\*)((?:.|\r?\n)*?)\1/;
			const transformed = boldRule.test(text)
				? text.replace(boldRule, "$2")
				: `**${text}**`;
			const cursor = 2;
			return { transformed, cursor };
		}
	},
	{
		title: "Italic", icon: "format_italic", runner: wordTransformer,
		action(text) {
			const italicRule = /(_)((?:.|\r?\n)*?)\1/;
			const transformed = italicRule.test(text)
				? text.replace(italicRule, "$2")
				: `_${text}_`;
			const cursor = 1;
			return { transformed, cursor };
		} 
	},
	{
		title: "Strikethrough", icon: "format_strikethrough", runner: wordTransformer,
		action(text) {
			const strikeRule = /~~((?:.|\r?\n)*?)~~/;
			const transformed = strikeRule.test(text)
				? text.replace(strikeRule, "$1")
				: `~~${text}~~`;
			const cursor = 2;
			return { transformed, cursor };
		}
	},
	{
		title: "Code", icon: "code", runner: wordTransformer,
		action(text) {
			const codeRule = /```((?:.|\r?\n)*?)```/;
			const transformed = codeRule.test(text)
				? text.replace(codeRule, "$1")
				: `\`${text}\``;
			const cursor = codeRule.test(text) ? 3 : 1;
			return { transformed, cursor };
		}
	},
	{
		title: "Link", icon: "link", runner: wordTransformer,
		action(text) {
			const transformed = `[${text}](url-here)`;
			const cursor = text.length ? 1 : transformed.length - 1;
			return { transformed, cursor };
		}
	},
	{
		title: "Image Embed", icon: "insert_photo", runner: wordTransformer,
		action(text) {
			const transformed = `![${text}](image-url-here)`;
			const cursor = text.length ? 2 : transformed.length - 2;
			return { transformed, cursor };
		}
	},

	{
		title: "Heading", icon: "title", runner: lineTransformer,
		action(line) {
			const noHeadingRule = /^(?:([^#]+)|$)/;
			const headingRule = /^(#{1,5})\s(.*)/;
			const removeHeadingRule = /^#{6}\s(.*)/;
			return noHeadingRule.test(line)
				? `# ${line}`
				: headingRule.test(line)
					? line.replace(headingRule, "$1# $2")
					: line.replace(removeHeadingRule, "$1");
		}
	},
	{
		title: "List", icon: "format_list_bulleted", runner: lineTransformer,
		action(line) {
			const listRule = /^(\s*)-\s(.*)/;
			return listRule.test(line)
				? line.replace(listRule, "$1$2")
				: `- ${line}`;
		}
	},
	{
		title: "Quote", icon: "format_quote", runner: lineTransformer,
		action(line) {
			const quoteRule = /^(\s*)>\s?(.*)/;
			return quoteRule.test(line)
				? line.replace(quoteRule, "$1$2")
				: `> ${line}`;
		}
	},
	{
		title: "Merit", icon: "add_circle_outline", runner: lineTransformer,
		action(line) {
			const meritRule = /^\((\+|-)\)\s?(.*)/;
			const match = meritRule.exec(line);
			return match
				? match[1] === "+"
					? line.replace(meritRule, "$2")
					: line.replace(meritRule, "(+) $2")
				: `(+) ${line}`;
		}
	},
	{
		title: "Demerit", icon: "remove_circle_outline", runner: lineTransformer,
		action(line) {
			const demeritRule = /^\((\+|-)\)\s?(.*)/;
			const match = demeritRule.exec(line);
			return match
				? match[1] === "-"
					? line.replace(demeritRule, "$2")
					: line.replace(demeritRule, "(-) $2")
				: `(-) ${line}`;
		}
	},

	{
		title: "Undo", icon: "undo", runner: CMCommandRunner,
		action(editor) {
			editor.execCommand("undo");
		}
	},
	{
		title: "Redo", icon: "redo", runner: CMCommandRunner,
		action(editor) {
			editor.execCommand("redo");
		}
	},

	{
		title: "Share Note", icon: "share", runner: (_, fn) => fn(),
		action() {
			const b = document.createElement("button");
			new ClipboardJS(b, {
				text: () => window.location.href
			});
			b.click();
			toast.success("Share URL copied to clipboard!");
		}
	},
];

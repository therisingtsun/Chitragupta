export const toggleItalics = {
	transform(text) {
		const italicsRegex = /^_((?:.|\r?\n)*?)_$/;
		return italicsRegex.test(text)
			? text.replace(italicsRegex, "$1")
			: `_${text}_`;
	},
	postTransformCursorPos: 1,
};

export const toggleBold = {
	transform(text) {
		const boldRegex = /^\*\*((?:.|\r?\n)*?)\*\*$/;
		return boldRegex.test(text)
			? text.replace(boldRegex, "$1")
			: `\*\*${text}\*\*`;
	},
	postTransformCursorPos: 2,
};

export const toggleStrikethrough = {
	transform(text) {
		const boldRegex = /^~~((?:.|\r?\n)*?)~~$/;
		return boldRegex.test(text)
			? text.replace(boldRegex, "$1")
			: `~~${text}~~`;
	},
	postTransformCursorPos: 2,
};

export const toggleheading = {
	transform(text) {
		const noHeadingRegex = /^([^#]+)/;
		const headingRegex = /^(#{1,5})\s(.*)/;
		return noHeadingRegex.test(text)
			? `# ${text}`
			: headingRegex.test(text)
			? text.replace(headingRegex, "$1# $2")
			: text;
	},
};

export const toggleMerit = {
	transform(text) {
		const meritRegex = /^\((\+|-)\)(.*)/;
		const match = meritRegex.exec(text);
		return match
			? match[1] === "+"
				? text.replace(meritRegex, "$2")
				: text.replace(meritRegex, "(+)$2")
			: `(+)${text}`;
	},
};

export const toggleDemerit = {
	transform(text) {
		const demeritRegex = /^\((\+|-)\)(.*)/;
		const match = demeritRegex.exec(text);
		return match
			? match[1] === "-"
				? text.replace(demeritRegex, "$2")
				: text.replace(demeritRegex, "(-)$2")
			: `(-)${text}`;
	},
};

import {
	toggleBold,
	toggleStrikethrough,
	toggleItalics,
	toggleheading,
	toggleMerit,
	toggleDemerit,
} from "./toolbarVariables";

export const checkEmptySpaceSelection = (editor) => {
	const cursorPosition = editor.getCursor();
	const check = editor.findWordAt(cursorPosition);

	let nullCheck;
	if (!editor.somethingSelected()) {
		nullCheck =
			cursorPosition.ch === check.anchor.ch ||
			cursorPosition.ch === check.head.ch;
	}
	return nullCheck;
};

export const selectEnclosingWords = (editor) => {
	const listSelections = editor.listSelections();
	let selections = [];
	listSelections.forEach((element) => {
		if (element.anchor.ch === element.head.ch) {
			const pos = editor.findWordAt(element.anchor);
			const getLineOfCursor = editor.getCursor();
			const lineOfCursor = editor.getLine(getLineOfCursor.line);

			let startIndex = pos.anchor.ch;
			let endIndex = pos.head.ch;

			while (startIndex > 0) {
				if (/\s/.test(lineOfCursor[startIndex - 1])) break;
				else startIndex--;
			}

			while (endIndex < lineOfCursor.length) {
				if (/\s/.test(lineOfCursor[endIndex])) break;
				else endIndex++;
			}

			selections.push({
				anchor: {
					ch: startIndex,
					line: pos.anchor.line,
				},
				head: {
					ch: endIndex,
					line: pos.head.line,
				},
			});
		}
		selections.push(element);
	});
	return selections;
};

export const checkIfFormatted = (prevLen, postLen) => {
	return prevLen < postLen;
};

export const modifyPostTransformCursorPos = (config, formatted) => {
	return formatted
		? config.postTransformCursorPos
		: -config.postTransformCursorPos;
};

export const cursorPlacementForWordTransform = (
	editor,
	nullCheck,
	cursorPosition,
	shiftOfCursor
) => {
	if (nullCheck) {
		const currentPos = editor.getCursor();

		editor.setCursor(currentPos.line, currentPos.ch - shiftOfCursor);
	} else {
		let cursorPositions = [];
		cursorPosition.forEach((element) => {
			cursorPositions.push({
				anchor: {
					line: element.anchor.line,
					ch: element.anchor.ch + shiftOfCursor,
				},
				head: {
					line: element.anchor.line,
					ch: element.anchor.ch + shiftOfCursor,
				},
			});
		});
		editor.setSelections(cursorPositions);
	}
};

export const getLengthDifference = (prevLen, postLen) => {
	return prevLen - postLen;
};

export const cursorPlacementForLineTransform = (
	editor,
	lengthDifference,
	positionOfCursor
) => {
	editor.setCursor(
		positionOfCursor.line,
		positionOfCursor.ch - lengthDifference
	);
};

export const setFocusOnEditor = (editor) => {
	if (!editor.hasFocus()) editor.focus();
};

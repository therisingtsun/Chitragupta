import React, { useRef, useEffect, useImperativeHandle, useState, useMemo } from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/meta";
import "./base.css";

const defaultOptions = {
	tabSize: 4,
	autoCloseBrackets: true,
	matchBrackets: true,
	showCursorWhenSelecting: true,
	lineNumbers: true,
	fullScreen: true,
}

function ReactCodeMirror(props = {}, ref) {
	const { options = {}, value = "" } = props;
	const [editor, setEditor] = useState();
	const textareaRef = useRef();
	const lastestProps = useRef(props);

	useImperativeHandle(ref, () => ({ editor }), [editor]);
	lastestProps.current = props;

	function getEventHandleFromProps() {
		const propNames = Object.keys(props);
		const eventHandle = propNames.filter((keyName) => {
			return /^on+/.test(keyName);
		});

		const eventDict = {};
		eventHandle.forEach((ele) => {
			const name = ele.slice(2);
			if (name && name[0]) {
				eventDict[ele] = name.replace(name[0], name[0].toLowerCase());
			}
		});

		return eventDict;
	}

	function setOptions(instance, opt = {}) {
		if (typeof opt === "object" && window) {
			const mode = CodeMirror.findModeByName(opt.mode || "");
			if (mode) {
				opt.mode = mode.mime;
			}
			Object.keys(opt).forEach((name) => {
				if ((opt[name] || opt[name] === false) && JSON.stringify(opt[name])) {
					instance.setOption(name, opt[name]);
				}
			});
		}
	}

	useEffect(() => {
		if (!editor && window) {
			const instance = CodeMirror.fromTextArea(textareaRef.current, { ...defaultOptions, ...options });
			const eventDict = getEventHandleFromProps();
			Object.keys(eventDict).forEach((event) => {
				instance.on(eventDict[event], (...params) => lastestProps.current[event](...params));
			});
			instance.setValue(value || "");

			setEditor(instance);
			setOptions(instance, { ...defaultOptions, ...options });
		}
		return () => {
			if (editor && window) {
				editor.toTextArea();
				setEditor(undefined);
			}
		}
	}, []);

	useMemo(() => {
		if (!editor || !window) return;
		const val = editor.getValue();
		if (value !== undefined && value !== val) {
			editor.setValue(value);
		}
	}, [value]);

	useMemo(() => {
		if (!editor || !window) return;
		setOptions(editor, { ...defaultOptions, ...options });
	}, [editor, options]);

	return (
		<textarea ref={textareaRef} />
	);
}

export default React.forwardRef(ReactCodeMirror);

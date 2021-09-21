import React, { useState, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBold,
	faItalic,
	faStrikethrough,
	faHeading,
	faListUl,
	faImage,
	faQuoteLeft,
	faPlusCircle,
	faMinusCircle,
	faCode,
	faUndo,
	faRedo,
	faPrint,
	faShareAlt,
	faUnlockAlt,
	faEye,
} from "@fortawesome/free-solid-svg-icons";
import "./toolbar.css";
import {
	toggleItalics,
	toggleBold,
	toggleStrikethrough,
	toggleheading,
	toggleDemerit,
	toggleMerit,
} from "./toolbarVariables";

const Toolbar = (props) => {
	const { wordTransformer, lineTransformer, preview, editor } = props;

	const togglePreview = () => {
		preview.current.classList.toggle("--hidden");
	};
	return (
		<div className="toolbar-box">
			<button
				className={"bold"}
				onClick={() => {
					wordTransformer(toggleBold);
				}}
			>
				<FontAwesomeIcon icon={faBold} className={"toolbar-icon"} />
			</button>

			<button
				className={"italic"}
				onClick={() => {
					wordTransformer(toggleItalics);
				}}
			>
				<FontAwesomeIcon icon={faItalic} className={"toolbar-icon"} />
			</button>

			<button
				className={"strikethrough"}
				onClick={() => {
					wordTransformer(toggleStrikethrough);
				}}
			>
				<FontAwesomeIcon
					icon={faStrikethrough}
					className={"toolbar-icon"}
				/>
			</button>

			<button
				className={"heading"}
				onClick={() => {
					lineTransformer(toggleheading);
				}}
			>
				<FontAwesomeIcon icon={faHeading} className={"toolbar-icon"} />
			</button>

			<button
				className={"list"}
				onClick={() => {
					lineTransformer(toggleList);
				}}
			>
				<FontAwesomeIcon icon={faListUl} className={"toolbar-icon"} />
			</button>

			<button
				className={"embbedimage"}
				onClick={() => {
					toggleImage;
				}}
			>
				<FontAwesomeIcon icon={faImage} className={"toolbar-icon"} />
			</button>

			<button
				className={"quote"}
				onClick={() => {
					lineTransformer(toggleQuote);
				}}
			>
				<FontAwesomeIcon
					icon={faQuoteLeft}
					className={"toolbar-icon"}
				/>
			</button>

			<button
				className={"merit"}
				onClick={() => {
					lineTransformer(toggleMerit);
				}}
			>
				<FontAwesomeIcon
					icon={faPlusCircle}
					className={"toolbar-icon"}
				/>
			</button>

			<button
				className={"demerit"}
				onClick={() => {
					lineTransformer(toggleDemerit);
				}}
			>
				<FontAwesomeIcon
					icon={faMinusCircle}
					className={"toolbar-icon"}
				/>
			</button>

			<button
				className={"code"}
				onClick={() => {
					lineTransformer(toggleCode);
				}}
			>
				<FontAwesomeIcon icon={faCode} className={"toolbar-icon"} />
			</button>
			<button
				className={"undo"}
				onClick={() => {
					actionHandler(toggleUndo);
				}}
			>
				<FontAwesomeIcon icon={faUndo} className={"toolbar-icon"} />
			</button>
			<button
				className={"redo"}
				onClick={() => {
					actionHandler(toggleRedo);
				}}
			>
				<FontAwesomeIcon icon={faRedo} className={"toolbar-icon"} />
			</button>
			<button
				className={"print"}
				onClick={() => {
					actionHandler(togglePrint);
				}}
			>
				<FontAwesomeIcon icon={faPrint} className={"toolbar-icon"} />
			</button>
			<button
				className={"share"}
				onClick={() => {
					actionHandler(toggleShare);
				}}
			>
				<FontAwesomeIcon icon={faShareAlt} className={"toolbar-icon"} />
			</button>
			<button
				className={"chooseaccess"}
				onClick={() => {
					actionHandler(toggleAccess);
				}}
			>
				<FontAwesomeIcon
					icon={faUnlockAlt}
					className={"toolbar-icon"}
				/>
			</button>
			<button
				className={"preview"}
				onClick={() => {
					togglePreview();
				}}
			>
				<FontAwesomeIcon icon={faEye} className={"toolbar-icon"} />
			</button>
		</div>
	);
};

export default Toolbar;

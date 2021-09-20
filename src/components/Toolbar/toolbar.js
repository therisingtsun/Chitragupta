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
	const { wordTransformer, lineTransformer } = props;
	return (
		<div className="toolbar-box">
			<button
				className={"bold"}
				onClick={() => {
					wordTransformer(toggleBold);
				}}
			>
				<FontAwesomeIcon icon={faBold} className={"toolbar-icon"} />

				{/* <i class="fas fa-bold"></i> */}
			</button>

			<button
				className={"italic"}
				onClick={() => {
					wordTransformer(toggleItalics);
				}}
			>
				<FontAwesomeIcon icon={faItalic} className={"toolbar-icon"} />

				{/* <i class="fas fa-italic"></i> */}
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

				{/* <i class="fas fa-strikethrough"></i> */}
			</button>

			<button
				className={"heading"}
				onClick={() => {
					lineTransformer(toggleheading);
				}}
			>
				<FontAwesomeIcon icon={faHeading} className={"toolbar-icon"} />

				{/* <i class="fas fa-heading"></i> */}
			</button>

			<button
				className={"list"}
				onClick={() => {
					lineTransformer(toggleList);
				}}
			>
				<FontAwesomeIcon icon={faListUl} className={"toolbar-icon"} />

				{/* <i class="fas fa-list-ul"></i> */}
			</button>

			<button
				className={"embbedimage"}
				onClick={() => {
					toggleImage;
				}}
			>
				<FontAwesomeIcon icon={faImage} className={"toolbar-icon"} />

				{/* <i class="fas fa-image"></i> */}
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

				{/* <i class="fas fa-quote-left"></i> */}
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

				{/* <i class="fas fa-plus-circle"></i> */}
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

				{/* <i class="fas fa-minus-circle"></i> */}
			</button>

			<button
				className={"code"}
				onClick={() => {
					lineTransformer(toggleCode);
				}}
			>
				<FontAwesomeIcon icon={faCode} className={"toolbar-icon"} />

				{/* <i class="fas fa-code"></i> */}
			</button>
			<button
				className={"undo"}
				onClick={() => {
					actionHandler(toggleUndo);
				}}
			>
				<FontAwesomeIcon icon={faUndo} className={"toolbar-icon"} />

				{/* <i class="fas fa-undo"></i> */}
			</button>
			<button
				className={"redo"}
				onClick={() => {
					actionHandler(toggleRedo);
				}}
			>
				<FontAwesomeIcon icon={faRedo} className={"toolbar-icon"} />

				{/* <i class="fas fa-redo"></i> */}
			</button>
			<button
				className={"print"}
				onClick={() => {
					actionHandler(togglePrint);
				}}
			>
				<FontAwesomeIcon icon={faPrint} className={"toolbar-icon"} />

				{/* <i class="fas fa-print"></i> */}
			</button>
			<button
				className={"share"}
				onClick={() => {
					actionHandler(toggleShare);
				}}
			>
				<FontAwesomeIcon icon={faShareAlt} className={"toolbar-icon"} />

				{/* <i class="fas fa-share-alt"></i> */}
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

				{/* <i class="fas fa-unlock-alt"></i> */}
			</button>
			<button
				className={"preview"}
				onClick={() => {
					actionHandler(togglePreview);
				}}
			>
				<FontAwesomeIcon icon={faEye} className={"toolbar-icon"} />

				{/* <i class="fas fa-eye"></i> */}
			</button>
		</div>
	);
};

export default Toolbar;

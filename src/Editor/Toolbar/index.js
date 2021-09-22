import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faLock,
	faUnlockAlt
} from "@fortawesome/free-solid-svg-icons";

import ToolbarItems from "./items";
import { modifyNoteMetadata } from "../../Firebase/firebase-operations";

import "./index.scss";

const Toolbar = ({ user, noteID, note, previewReference: [pVisible, setPVisible], editorReference }) => {
	const [publicAccess, setPublicAccess] = useState(note.publicAccess);

	const togglePublic = () => {
		const toggledPublicAccess = !note.publicAccess;
		setPublicAccess(toggledPublicAccess);
		modifyNoteMetadata(user, noteID, { publicAccess: toggledPublicAccess });
	};
	const togglePreview = () => {
		setPVisible(!pVisible);
	};
	return (
		<div className="toolbar-box">
			{ToolbarItems.map((item, i) => {
				const icon = item.icon;

				const clickHandler = () => {
					item.runner(editorReference.current.editor, item.action);
				};
			
				return (
					<button key={i} onClick={clickHandler} title={item.title}>
						<FontAwesomeIcon icon={icon} />
					</button>
				)
			})}
			<button title="Toggle Public Access" onClick={togglePublic}>
				<FontAwesomeIcon icon={publicAccess ? faUnlockAlt : faLock} />
			</button>
			<button title="Toggle Preview" onClick={togglePreview}>
				<FontAwesomeIcon icon={faEye} />
			</button>
		</div>
	);
};

export default Toolbar;

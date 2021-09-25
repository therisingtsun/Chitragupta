import React, { useState } from "react";

import {
	useAuth,
	useFirestore,
	useStorage,
} from "reactfire";

import ToolbarItems from "./items";
import { modifyNoteMetadata } from "../../Firebase/firebase-operations";

import MI from "../../Utils/MaterialIcons";

import "./index.scss";

const Toolbar = ({ noteID, note, previewVisibility: [pVisible, setPVisible], editorReference, editAccess }) => {
	const auth = useAuth();
	const db = useFirestore();
	const storage = useStorage();
	
	const [publicAccess, setPublicAccess] = useState(note.publicAccess);

	const togglePublic = () => {
		const toggledPublicAccess = !note.publicAccess;
		setPublicAccess(toggledPublicAccess);
		modifyNoteMetadata(auth, db, storage, noteID, { publicAccess: toggledPublicAccess });
	};
	const togglePreview = () => {
		setPVisible(!pVisible);
	};
	return (
		<div className="toolbar-box">
			{editAccess
				? <>
					{ToolbarItems.map((item, i) => {
						const clickHandler = () => {
							item.runner(editorReference.current.editor, item.action);
						};
					
						return (
							<button key={i} onClick={clickHandler} title={item.title}>
								<MI icon={item.icon} />
							</button>
						)
					})}
					<button title="Toggle Public Access" onClick={togglePublic}>
						<MI icon={publicAccess ? "lock_open" : "lock"} />
					</button>
				</>
				: <div className="read-only">
					<MI className="--mr" icon="lock" /> READ ONLY
				</div>
			}
			<button title="Toggle Preview" onClick={togglePreview}>
				<MI icon={pVisible ? "visibility_off" : "visibility"} />
			</button>
		</div>
	);
};

export default Toolbar;

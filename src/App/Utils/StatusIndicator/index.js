import React, { useState, createContext, useContext } from "react";
import { v4 } from "uuid";

import "./index.scss";

const StatusContext = createContext({
	tasks: {},
	setTasks: () => {},
	add: (task) => {},
	synced: () => {}
});

export function useStatus() {
	return useContext(StatusContext);
}

export function Status() {
	const synced = useStatus().synced();

	return (
		<div className="status-indicator">
			<div className="status-text">
				{synced ? "Synced" : "Working…"}
			</div>
			<div className={`status-circle ${synced ? "" : "--working"}`}></div>
		</div>
	);
}

export default function StatusProvider({ children }) {
	const [tasks, setTasks] = useState({});

	const SM = {
		tasks,
		add(task) {
			let id = v4();
			const _t = this.tasks;
			while (_t.hasOwnProperty(id)) id = v4();
			_t[id] = new Promise((r, j) => {
				task.then(() => {
					delete _t[id];
					setTasks({..._t});
				});
			});
			setTasks({..._t});
		},
		synced() {
			return Object.values(this.tasks).length === 0;
		}
	}
	
	return (
		<StatusContext.Provider value={SM}>
			{ children }
			<Status />
		</StatusContext.Provider>
	);
}
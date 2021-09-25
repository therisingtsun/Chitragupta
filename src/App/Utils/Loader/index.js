import React from "react";

import "./index.scss";

export default function Loader() {
	return (
		<div className="fullscreen-loader">
			<div className="loader-circle">
				<div className="loader-spinner"></div>
			</div>
			<div className="loader-text">Loading…</div>
		</div>
	);
}
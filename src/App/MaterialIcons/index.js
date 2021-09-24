import React from "react";

import "./index.scss";

export default function MI({ className, icon }) {
	return <i className={`${className} material-icons`}>{icon}</i>;
}
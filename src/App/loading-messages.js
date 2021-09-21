export const Messages = [
	"Reorganizing shelves… again…",
	"Refilling inkpots because *someone* forgot to >.<",
	"Running errands for Yama…",
	"Fetching records of past lives…",
	"Counting good intentions…",
	"Calculating hell dweller index…",
	"Mimicking Devarshi Narada…",
	"Reading Puranas… Because why not?",
];

export default function () {
	return Messages[Math.random() * Messages.length | 0];
}
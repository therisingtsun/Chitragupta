export default function GettingStarted(name) {
	return [
		`# Welcome to Chitragupta`,
		`Hello ${name}! Welcome to your new note taking app.`,
		[
			`![office-kitty](https://images.unsplash.com/photo-1536759917239-8bb1165a44dd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80)`,
			`[Source](https://unsplash.com/photos/jXqvVxrtmdg)`
		].join("\n"),
		`Chitragupta uses [markdown](https://guides.github.com/features/mastering-markdown/), an easy to use syntax that's pretty useful to write ideas down. It's the least amount of friction from having ideas in one's head to turning them into text. Here's a small demonstration:`,
		`> This is a quote. I can speak in _italics,_ **bold,** ~~struck through,~~ or even \`code\`! No one can stop me!`,
		[
			`Time for some lists:`,
			`- Lists are cool.`,
			`- They let you list things.`,
				`\t- And sometimes nested too.`,
					`\t\t- Oh how amazing are lists…`,
			`- No?`,
			`- Yes. 😛`
		].join("\n"),
		`Let's write some code now… How about JavaScript?`,
		[
			`\`\`\`js`,
			`function greet(name) {`,
				`\treturn \`Hello \${name}!\`;`,
			`}`,
			`console.log(greet("${name}")); // logs \`Hello ${name}!\``,
			`\`\`\``
		].join("\n"),
		[
			`| Table | Time |`,
			`| ----- | ---- |`,
			`|  One  | Two  |`,
			`| Three | Four |`
		].join("\n"),
		`That is all fun, but Chitragupta wouldn't be complete without a way to keep track of merits, would it?`,
		`(+) Introducing Merits. Add a \`(+)\` at the start of a line to begin with a merit. Add positive points about something in these sections.`,
		`(-) And \`(-)\` to begin with a demerit. The point of these are to just give easy-to-notice regions in the entire document.`,
		`And… that's about it! Go write your own notes now!`
	].join("\n\n");
}
const template = document.createElement("template");
template.innerHTML = `
<style>
	textarea {
		margin: 0;
		padding: 0;
		outline: 0;
		border: 0;
	}

	.komentar-wrapper {
		max-width: 750px;
		margin: 0 auto;
		padding: 8px;

		border: solid black;
	}

	.komentar-info {
		height: 32px;
		/* background-color: #444444; */
	}

	.komentar-editor {
		height: 120px;
		background-color: #666666;
		/*     
		display: flex;
		flex-direction: column; */
	}

	.komentar-editor__komentar-new {
		margin: 4px;
		padding: 8px;
	}

	.komentar-editor__komentar-new > * {
		display: block;
	}

	.komentar-editor__komentar-new__komentar-new-text {
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		-ms-box-sizing: border-box;
		box-sizing: border-box;

		width: 100%;
		
		margin-bottom: 8px;
	}

	.komentar-editor__komentar-new > section {
		display: flex;
		justify-content: space-between;
	}

	.komentar-editor__komentar-new__komentar-new-name {
	}

	.komentar-editor__komentar-new__komentar-new-submit {
	}

	.komentar-box {
		background-color: #888888;
		min-height: 100px;
	}

	.komentar-list {
		
	}
</style>
<section class="komentar-wrapper">
	<section class="komentar-info">
		Komentar Info
	</section>
	<section class="komentar-editor">
		<form id="komentar-new" class="komentar-editor__komentar-new">
			<textarea id="komentar-new-text" class="komentar-editor__komentar-new__komentar-new-text" rows="3" cols="5" name="komentar-new-text" placeholder="Comment" required></textarea>
			<section>
				<input id="komentar-new-name" class="komentar-editor__komentar-new__komentar-new-name" type="text" name="komentar-new-name" placeholder="Name" required>
				<button id="komentar-new-submit" class="komentar-editor__komentar-new__komentar-new-submit" type="submit">Submit</button>
			</section>
		</form>
	</section>
	<section class="komentar-box">
		Be the first to comment
	</section>
</section>
`;

class KomentarApp extends HTMLElement {
	constructor() {
		super();

		// data
		this.komentars = [];

		// set comment api host
		this.baseUrl = this.getAttribute("host") || "http://localhost:3000";

		// attach shadow DOM to the parent element.
		// save the shadowRoot in a property because
		// if you create your shadow DOM in closed mode,
		// you have no access from outside
		const shadowRoot = this.attachShadow({ mode: "open" });

		// clone template content nodes to the shadow DOM
		shadowRoot.appendChild(template.content.cloneNode(true));

		// set styles // comment for production
		const link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("href", "./styles.css");
		shadowRoot.appendChild(link);
	}

	connectedCallback() {
		console.log("Komentar app is added to DOM");
		console.log(`comment api host at ${this.baseUrl}`);

		// fetch komentar list
		this.fetchKomentar();

		// install event listener
	}

	adoptedCallback() {
		console.log("Komentar app was moved into a new DOM");
	}

	disconnectedCallback() {
		console.log("Komentar app removed from DOM");

		// uninstall event listener
	}

	fetchKomentar() {
		const currentUrl = location.host + location.pathname;
		const targetUrl = `${this.baseUrl}/comments?url=${currentUrl}&host=${location.host}&slug=${location.pathname}`;
		fetch(targetUrl, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			method: "GET",
		})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	renderKomentarList() {}
}

window.customElements.define("komentar-app", KomentarApp);

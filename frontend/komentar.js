const KOMENTAR_TAG = "komentar-app";

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
		/* not implemented yet */
	}

	.komentar-editor__komentar-new__komentar-new-submit {
		/* not implemented yet */
	}

	.komentar-box {
		background-color: #888888;
		min-height: 100px;
	}

	.komentar-list {
		/* not implemented yet */
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
				<button id="komentar-new-submit" class="komentar-editor__komentar-new__komentar-new-submit">Submit</button>
			</section>
		</form>
	</section>
	<section class="komentar-box">
		<section id="komentar-list" class="komentar-list"></section>
	</section>
</section>
`;

class Helper {
	static status(response) {
		if (response.status >= 200 && response.status < 300) {
			return Promise.resolve(response);
		} else {
			return Promise.reject(new Error(response.statusText));
		}
	}

	static json(response) {
		return response.json();
	}

	static request(requestUrl, requestOptions) {
		return new Promise((resolve, reject) => {
			fetch(requestUrl, requestOptions)
				.then(Helper.status)
				.then(Helper.json)
				.then((data) => {
					resolve(data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}
}

class KomentarApp extends HTMLElement {
	constructor() {
		super();

		// data
		this.state = {
			// set comment api host
			baseUrl: this.getAttribute("host") || "http://localhost:3000",
			komentars: [],
			activeReplyId: 0,
		};

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
		console.log(`comment api host at ${this.state.baseUrl}`);

		// fetch komentar list
		this.fetchKomentar();

		// install event listener
		// create comment listener
		this.shadowRoot
			.getElementById("komentar-new-submit")
			.addEventListener("click", () => this.createCommentHandler(this));

		// create click reply listener
		const replyButtonElements = this.shadowRoot.querySelector("section").getElementsByClassName("create-reply");
		console.log(replyButtonElements);
		Array.from(replyButtonElements).forEach((element) => {
			console.log("add event listener", element);
			element.addEventListener("click", () => this.clickReplyHandler(this));
		});

		// create submit reply listener
		const submitReplyElements = this.shadowRoot.querySelector("section").getElementsByClassName("reply-submit");
		Array.from(submitReplyElements).forEach((element) => {
			element.addEventListener("click", () => this.createReplyHandler(this));
		});
	}

	adoptedCallback() {
		console.log("Komentar app was moved into a new DOM");
	}

	disconnectedCallback() {
		console.log("Komentar app removed from DOM");

		// uninstall event listener
		// create comment listener
		this.shadowRoot
			.getElementById("komentar-new-submit")
			.removeEventListener("click", () => this.createCommentHandler(this));

		// create reply listener
		const replyButtonElements = this.shadowRoot.querySelector("section").getElementsByClassName("create-reply");
		Array.from(replyButtonElements).forEach((element) => {
			element.removeEventListener("click", () => this.clickReplyHandler(this));
		});

		// create submit reply listener
		const submitReplyElements = this.shadowRoot.querySelector("section").getElementsByClassName("reply-submit");
		Array.from(submitReplyElements).forEach((element) => {
			element.removeEventListener("click", () => this.createReplyHandler(this));
		});
	}

	setState(newState) {
		this.state = Object.assign({}, this.state, newState);

		this.render();
	}

	render() {
		this.renderKomentarList();
	}

	getAuthor() {
		// const author = parent.shadowRoot.getElementById("komentar-new-name").value;
		// console.log(author);
		return document.querySelector(KOMENTAR_TAG).shadowRoot.getElementById("komentar-new-name").value;
	}

	createCommentHandler(parent) {
		// get author
		const author = this.getAuthor();

		// get content
		const content = document.querySelector(KOMENTAR_TAG).shadowRoot.getElementById("komentar-new-text").value;
		// const content = parent.shadowRoot.getElementById("komentar-new-text");
		// console.log(content);

		// get url
		const currentUrl = location.host + location.pathname;

		// prep data
		console.log(parent);
		const requestUrl = `${parent.state.baseUrl}/comments`;
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				author: author,
				content: content,
				url: currentUrl,
			}),
		};

		// submit data
		Helper.request(requestUrl, requestOptions)
			.then(() => {
				console.log(`Comment submitted.`);
				this.fetchKomentar();
			})
			.catch((error) => {
				console.log(`Comment failed to submit`, error);
			});
	}

	clickReplyHandler(parent) {
		// get id
		const elementId = this.id.split("-");
		const id = elementId[elementId.length - 1];

		parent.setState({ activeReplyId: parseInt(id) });
	}

	createReplyHandler(parent) {
		// // get id
		// const elementId = this.id.split("-");
		// const id = elementId[elementId.length - 1];
		const id = this.state.activeReplyId;

		// get author
		const author = this.getAuthor();

		// get reply content
		const content = document.querySelector(KOMENTAR_TAG).shadowRoot.getElementById(`input-reply-${id}`).value;

		// get url
		const currentUrl = location.host + location.pathname;

		// prep data
		console.log(parent);
		const requestUrl = `${parent.state.baseUrl}/comments/${id}/replies`;
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				author: author,
				content: content,
				url: currentUrl,
			}),
		};

		// submit data
		Helper.request(requestUrl, requestOptions)
			.then(() => {
				console.log(`Reply submitted.`);
				this.fetchKomentar();
			})
			.catch((error) => {
				console.log(`Reply failed to submit`, error);
			});
	}

	fetchKomentar() {
		const currentUrl = location.host + location.pathname;
		const requestUrl = `${this.state.baseUrl}/comments?url=${currentUrl}&host=${location.host}&slug=${location.pathname}`;
		const requestOptions = {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		};

		Helper.request(requestUrl, requestOptions)
			.then((data) => {
				// console.log("Request succeeded with JSON response", data);
				this.setState({ komentars: data.payload });
			})
			.catch((error) => {
				console.log("Request failed", error);
			});
	}

	renderReplyBox(id) {
		const isReplyBoxHidden = id != this.state.activeReplyId;
		console.log("replyboxhidden", id, this.state.activeReplyId, isReplyBoxHidden);
		return isReplyBoxHidden
			? `<section id="${id}" class="create-reply">Reply</section>`
			: `
				<section id="reply-${id}">
					<input id="reply-input-${id}" type="text" name="komentar-reply-content" placeholder="Reply..." required>
					<section id="reply-cancel-${id}">Cancel</section>
					<section id="reply-submit-${id}" class="reply-submit">Reply</section>
				</section>
			`;
	}

	renderKomentarList() {
		const isKomentarExist = this.state.komentars.length > 0;

		const element = this.shadowRoot.getElementById("komentar-list");

		if (!isKomentarExist) {
			element.innerHTML = `Be the first to comment`;
		} else {
			const mappedInnerHTML = this.state.komentars.map((komentar) => {
				const { id, author, content, date } = komentar;
				return `
					<section id="komentar-${id}" class="komentar-list__komentar-detail">
						<span><b>${author}</b> on ${new Date(date).toDateString()}</span>
						<p>${content}</p>
						${this.renderReplyBox(id)}
					</section>
				`;
			});
			element.innerHTML = mappedInnerHTML.join("");
		}
	}
}

window.customElements.define(KOMENTAR_TAG, KomentarApp);

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
		<section class="komentar-info__title">Comment</section>
		<section id="komentar-error" class="komentar-info__error"></section>
	</section>
	<section class="komentar-editor">
		<form id="komentar-new" class="komentar-editor__komentar-new">
			<textarea id="komentar-new-text" class="komentar-editor__komentar-new__komentar-new-text" rows="3" cols="5" name="komentar-new-text" placeholder="Have any thought? I'd like to hear that." required></textarea>
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
			// return Promise.reject(new Error(response.statusText));
			return Promise.reject(response);
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
				.catch(Helper.json)
				.then(reject);
			// .catch((error) => {
			// 	reject(error);
			// });
		});
	}
}

class KomentarApp extends HTMLElement {
	static get observedAttributes() {
		return ["host", "komentars", "reply_comment_id", "error"];
	}

	constructor() {
		super();

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
		console.log("Komentar APP is added to DOM");
		console.log(`Komentar API host at ${this.getBaseUrl()}`);

		// fetch komentar list
		this.fetchKomentar();

		// create comment listener
		this.shadowRoot.getElementById("komentar-new-submit").addEventListener("click", (e) => {
			return this.createCommentHandler(e, this);
		});
	}

	adoptedCallback() {
		console.log("Komentar app was moved into a new DOM");
	}

	disconnectedCallback() {
		console.log("Komentar app removed from DOM");

		// uninstall event listener
		// remove comment listener
		this.shadowRoot.getElementById("komentar-new-submit").removeEventListener("click", (e) => {
			return this.createCommentHandler(e, this);
		});
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;

		console.log("------------------------------------");
		console.log(`The attribute "${name}" has changed.`);
		console.log("Old Value: ", oldValue);
		console.log("New Value: ", newValue);
		console.log("------------------------------------");

		this.render();

		// !!! Add listener here only for element that being added up by javascript
		// create click reply listener
		const replyButtonElements = this.shadowRoot.querySelector("section").getElementsByClassName("create-reply");
		Array.from(replyButtonElements).forEach((element) => {
			const elementId = element.getAttribute("id");
			element.addEventListener("click", (e) => this.clickReplyHandler(e, this, elementId));
		});

		// create submit reply listener
		const submitReplyElements = this.shadowRoot.querySelector("section").getElementsByClassName("reply-submit");
		Array.from(submitReplyElements).forEach((element) => {
			element.addEventListener("click", (e) => this.createReplyHandler(e, this));
		});

		// create cancel reply listener
		const cancelReplyElements = this.shadowRoot.querySelector("section").getElementsByClassName("reply-cancel");
		Array.from(cancelReplyElements).forEach((element) => {
			element.addEventListener("click", (e) => this.cancelReplyHandler(e, this));
		});
	}

	render() {
		this.renderError();
		this.renderKomentarList();
	}

	getBaseUrl() {
		return this.getAttribute("host");
	}

	getKomentars() {
		let komentars = this.getAttribute("komentars");
		if (!komentars) return [];

		komentars = JSON.parse(komentars);
		return Array.isArray(komentars) ? komentars : [];
	}

	setKomentars(newKomentars) {
		this.setAttribute("komentars", JSON.stringify(newKomentars));
	}

	getReplyCommentId() {
		return this.getAttribute("reply_comment_id");
	}

	setReplyCommentId(newReplyCommentId) {
		this.setAttribute("reply_comment_id", newReplyCommentId);
	}

	getError() {
		return this.getAttribute("error");
	}

	setError(newError) {
		this.setAttribute("error", newError);
	}

	getAuthor() {
		// const author = parent.shadowRoot.getElementById("komentar-new-name").value;
		// console.log(author);
		return document.querySelector(KOMENTAR_TAG).shadowRoot.getElementById("komentar-new-name").value;
	}

	createCommentHandler(event, parent) {
		// get author
		const author = parent.getAuthor();

		// get content
		const content = document.querySelector(KOMENTAR_TAG).shadowRoot.getElementById("komentar-new-text").value;
		// const content = this.shadowRoot.getElementById("komentar-new-text");
		// console.log(content);

		// get url
		const currentUrl = location.host + location.pathname;

		// prep data
		const baseUrl = parent.getBaseUrl();
		const requestUrl = `${baseUrl}/comments`;
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
				parent.fetchKomentar();
			})
			.catch((error) => {
				console.log(`Comment failed to submit`, JSON.stringify(error));
				parent.setError(error.message);
			});
	}

	clickReplyHandler(event, parent, newReplyCommentId) {
		parent.setReplyCommentId(newReplyCommentId);
	}

	createReplyHandler(event, parent) {
		const id = parent.getReplyCommentId();

		// get author
		const author = parent.getAuthor();

		// get reply content
		const content = document.querySelector(KOMENTAR_TAG).shadowRoot.getElementById(`reply-input-${id}`).value;

		// get url
		const currentUrl = location.host + location.pathname;

		// prep data
		const baseUrl = parent.getBaseUrl();
		const requestUrl = `${baseUrl}/comments/${id}/replies`;
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
				parent.fetchKomentar();
			})
			.catch((error) => {
				console.log(`Reply failed to submit`, error);
				parent.setError(error.message);
			});
	}

	cancelReplyHandler(event, parent) {
		parent.setReplyCommentId("0");
	}

	fetchKomentar() {
		const baseUrl = this.getBaseUrl();
		const currentUrl = location.host + location.pathname;
		const requestUrl = `${baseUrl}/comments?url=${currentUrl}&host=${location.host}&slug=${location.pathname}`;
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
				this.setKomentars(data.payload);
			})
			.catch((error) => {
				console.log("Request failed", error);
				this.setError(error.message);
			});
	}

	renderError() {
		const errorMessage = this.getError();

		const element = this.shadowRoot.getElementById("komentar-error");
		element.innerHTML = errorMessage;
	}

	renderReplyBox(id) {
		const replyCommentId = this.getReplyCommentId();
		const isReplyBoxHidden = id != replyCommentId;
		return isReplyBoxHidden
			? `<section id="${id}" class="create-reply">Reply</section>`
			: `
				<section id="reply-${id}" class="komentar-reply">
					<section class="komentar-reply__input">
						<!--<textarea id="reply-input-${id}" rows="1" cols="5" name="komentar-reply-content" placeholder="Reply..." required></textarea>-->
						<input id="reply-input-${id}" type="text" name="komentar-reply-content" placeholder="Reply..." required>
					</section>
					<section class="komentar-reply__button">
						<section id="reply-cancel-${id}" class="reply-cancel">Cancel</section>
						<section id="reply-submit-${id}" class="reply-submit">Reply</section>
					</section>
				</section>
			`;
	}

	renderKomentarList() {
		const komentars = this.getKomentars();
		const isKomentarExist = komentars.length > 0;

		const element = this.shadowRoot.getElementById("komentar-list");

		if (!isKomentarExist) {
			element.innerHTML = `Be the first to comment`;
		} else {
			const mappedInnerHTML = komentars.map((komentar) => {
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

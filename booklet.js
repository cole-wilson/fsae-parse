class BookletWindow {
	el;
	tabs = [];
	content;
	activetab;

	constructor(oid, opts) {
		this.id = 'booklet-' + btoa((new Date()).getTime());

		this.el = document.createElement("div");
			this.el.classList.add("booklet-window");
			this.el.id = this.id;
			this.el.style.top = (50+opts.y+"px") || (Math.random() * 80) + "vh";
			this.el.style.left = (opts.x+"px") || (Math.random() * 100) + "vh";
			this.el.style.width = opts.w + "px";
			this.el.style.height = opts.h + "px";
			this.el.tabIndex = 0;

		let topbarEl = document.createElement("div");
			topbarEl.classList.add("booklet-window-topbar");
			topbarEl.onmousedown = (e0) => {
				let initialPosition = this.el.getBoundingClientRect();
				let xOffset = e0.clientX - initialPosition.left;
				let yOffset = e0.clientY - initialPosition.top;

				window.onmousemove = (e) => {
					this.el.style.left = e.clientX - xOffset + "px";
					this.el.style.top = Math.min(Math.max(e.clientY - yOffset, 50), window.innerHeight - 70) + "px";
				}
				window.onmouseup = () => {
					window.onmousemove = null;
					window.onmouseup = null;
				}
			}

		if (opts.closable) {
		let closebutton = document.createElement("button");
			closebutton.innerHTML = "&times;";
			closebutton.onclick = () => {this.close()}
			topbarEl.appendChild(closebutton)
		}

		let maximizebutton = document.createElement("button");
			maximizebutton.innerHTML = "+";
			maximizebutton.onclick = () => {this.maximize()};
			// this.el.ondblclick = () => {this.maximize()};
			topbarEl.appendChild(maximizebutton)


		let minimizebutton = document.createElement("button");
			minimizebutton.innerHTML = "-";
			minimizebutton.onclick = () => {this.minimize()};
			topbarEl.appendChild(minimizebutton)
		if (opts.minimized) this.minimize();

		this.nameEl = document.createElement("span");
		this.nameEl.innerText = opts.title;
		topbarEl.appendChild(this.nameEl)


		this.el.appendChild(topbarEl);


		this.content = document.createElement("div");
		this.content.classList.add("booklet-content");
		this.el.appendChild(this.content);

		this.content.appendChild(document.querySelector(oid))

		// booklet.windows[this.id] = this
		document.body.appendChild(this.el);
	}

	getID() {
		return this.el;
	}

	close() {
		// delete booklet.windows[this.id];
		this.el.remove();
	}

	minimize() {
this.el.classList.toggle("minimized");
		if (this.el.classList.contains("minimized")) {
			this.el.classList.remove("maximized")
			// minimizebutton.innerHTML = "+";
		} else {
			// minimizebutton.innerHTML = "-";
		}
	}

	maximize() {
		this.el.classList.toggle("maximized");
		if (this.el.classList.contains("maximized")) {
			this.el.classList.remove("minimized");
		}
		this.el.focus();
	}

	get name() {return this.nameEl.innerText;}

	set name(n) {this.nameEl.innerText = n;}

}

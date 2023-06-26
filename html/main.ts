let current_request = 0
let pressedKeys: { [key: string]: boolean } = {};

let input_focused = false;
let textarea_focused = false;

interface Size {
	main_h: string;
	main_w: string;
	label_h: string;
	label_w: string;
	text_box_h: string;
	text_box_w: string;
}

let sizes: Size[] = [
	{
		// type: text
		main_h: "20%",
		main_w: "40%",
		label_h: "8%",
		label_w: "98%",
		text_box_h: "86%",
		text_box_w: "98%"
	},
	{
		// type: small_text
		main_h: "6%",
		main_w: "40%",
		label_h: "35%",
		label_w: "98%",
		text_box_h: "53%",
		text_box_w: "98%"
	},
	{
		// type: number
		main_h: "6%",
		main_w: "10%",
		label_h: "35%",
		label_w: "94%",
		text_box_h: "53%",
		text_box_w: "91%"
	}
];
let types: { [key: string]: number } = {
	"text": 0,
	"small_text": 1,
	"number": 2,
}
let current_type: string;

interface InputProperties {
	show: boolean;
	request: number;
	title: string;
	type: string;
	minlength?: number;
	maxlength?: number;
	min?: number;
	max?: number;
	pattern?: string;
	placeholder?: string;
	value?: string;
	secret?: boolean;
}

$(function () {
	window.onkeyup = function (e: _KeyboardEvent) { pressedKeys[e.code] = false; };
	window.onkeydown = function (e: _KeyboardEvent) { pressedKeys[e.code] = true; };

	window.addEventListener("message", function (event: MessageEvent) {
		let item: InputProperties = event.data;

		if (item.show) {
			current_request = item.request;
			let _main_input = $(item.type == "number" ? "#number_input" : "#text_input");

			_main_input.attr("maxlength", item.maxlength || 100);
			_main_input.attr("minlength", item.minlength || 0);
			_main_input.attr("min", item.min || 0);
			_main_input.attr("max", item.max || 999999);
			_main_input.attr("pattern", item.pattern || ".*");
			_main_input.attr("placeholder", item.placeholder || "");
			_main_input.val(item.value || "");

			SetSize(types[item.type] ?? 0);

			$("#title_").html(item.title);
			$(".main").fadeIn("swing");

			input_focused = false;
			textarea_focused = false;
			current_type = item.type;
			_main_input.trigger("focus");

			if (item.secret) {
				_main_input.css("-webkit-text-security", "disc")
				// _main_input.attr("-moz-webkit-text-security", "disc")
				// _main_input.attr("-ms-webkit-text-security", "disc")
				// _main_input.attr("-o-webkit-text-security", "disc")
			} else {
				_main_input.css("-webkit-text-security", "none")
			}
		} else {
			$(".main").fadeOut(0);
		}
	});

	$("input").on("focusin", function () {
		// console.log('focus in')
		input_focused = true;
		PostReq(`https://FloInput/allowmove`, {
			allowmove: "false"
		});
	});

	$("input").on("focusout", function () {
		// console.log('focus out')
		input_focused = false;
		if (input_focused == false && textarea_focused == false) {
			PostReq(`https://FloInput/allowmove`, {
				allowmove: "true"
			});
		}
	});

	$("textarea").on("focusin", function () {
		// console.log('focus in text')
		textarea_focused = true;
		PostReq(`https://FloInput/allowmove`, {
			allowmove: "false"
		});
	});

	$("textarea").on("focusout", function () {
		// console.log('focus out text')
		textarea_focused = false;
		if (input_focused == false && textarea_focused == false) {
			PostReq(`https://FloInput/allowmove`, {
				allowmove: "true"
			});
		}
	});

	jQuery(document).on("keydown", function (evt) {
		if (evt.code == "Escape" || (evt.code == "Backspace" && !input_focused && !textarea_focused)) { // pressed ESC to close without submiting
			PostReq(`https://FloInput/response`, {
				request: current_request,
				value: null,
			});
			$(".main").fadeOut(0);
		}

		if (evt.code != "Enter") return;

		if (current_type == "small_text" && (pressedKeys["ShiftLeft"] || pressedKeys["ShiftRight"])) {
			evt.preventDefault();
		} else if (!(pressedKeys["ShiftLeft"] || pressedKeys["ShiftRight"])) {
			let _text_input = document.getElementById("text_input") as HTMLInputElement
			_text_input.disabled = true;

			$(".main").fadeOut(0);

			PostReq(`https://FloInput/response`, {
				request: current_request,
				value: current_type == "number" ? $("#number_input").val() : $("#text_input").val(),
			});

			_text_input.disabled = false;
		}
	});

	SetSize(0);
});

function SetSize(size: number) {
	$(".main").css("height", sizes[size].main_h);
	$(".main").css("width", sizes[size].main_w);
	$(".label").css("height", sizes[size].label_h);
	$(".label").css("width", sizes[size].label_w);
	$(".text-box").css("height", sizes[size].text_box_h);
	$(".text-box").css("width", sizes[size].text_box_w);

	if (size == 0 || size == 1) {
		$("#text_input").show();
		$("#number_input").hide();
		input_focused = false;
	} else {
		$("#number_input").show();
		$("#text_input").hide();
		textarea_focused = false;
	}
}

function PostReq(url: string | URL, data: {}) {
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(data));
}
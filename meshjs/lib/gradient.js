import Color from "./color.js"
import {randomInt} from "./math.js"

//note for some reason I cant import PixelData as default
import {PixelData} from "./pixeldata.js"
import {map} from "./math.js"

export default class Gradient {
	constructor(bounds, type = Gradient.LEFT_TO_RIGHT){
		this._bounds = bounds;
		this._type = type;

		//todo: could move this to create
		this._canvas = document.createElement("canvas");
		this._canvas.width = this._bounds.width;
		this._canvas.height = this._bounds.height;

		this._ctx = this._canvas.getContext("2d");

		let x0, y0, x1, y1;

		switch(type) {
			case Gradient.TOP_TO_BOTTOM:
					x0 = bounds.x;
					y0 = bounds.y;
					x1 = bounds.x;
					y1 = bounds.height;
				break;

			case Gradient.TOP_RIGHT_TO_BOTTOM_LEFT:
					x0 = bounds.x;
					y0 = bounds.y;
					x1 = bounds.width;
					y1 = bounds.height;
				break;

			case Gradient.BOTTOM_LEFT_TO_TOP_RIGHT:
					x0 = bounds.x;
					y0 = bounds.height;
					x1 = bounds.width;
					y1 = bounds.y;
				break;

			case Gradient.LEFT_TO_RIGHT:
				//fall through
			default:
				x0 = bounds.x;
				y0 = bounds.y;
				x1 = bounds.width;
				y1 = bounds.y;
		}

		this._gradient = this._ctx.createLinearGradient(x0, y0, x1, y1);
	}

	addColorStop(offset, color){

		if(color instanceof Color) {
			color = color.toRGBA();
		}

		this._gradient.addColorStop(offset, color);
	}

	create() {

		let x = this._bounds.x;
		let y = this._bounds.y;
		let w = this._bounds.width;
		let h = this._bounds.height;

		this._ctx.fillStyle = this._gradient;
		this._ctx.fillRect(x, y, w, h);

		this._pixelData = new PixelData(this._ctx.getImageData(x, y, w, h), false);

		return this._canvas;
	}

	get canvas() {
		return this._canvas;
	}

	getPixelData() {
		return this._pixelData;
	}

	getColor(x, y, alpha) {
		return this._pixelData.getColor(x, y, alpha);
	}

	static random(bounds, type) {
		let keys = Array.from(GRADIENTS.keys());
		let name = keys[randomInt(0, keys.length)];

		return Gradient.fromName(name, bounds, type);
	}

	static fromName(gradientName, bounds, type) {

		let g = new Gradient(bounds, type);
		let colors = GRADIENTS.get(gradientName);

		if(!colors) {
			console.log('Gradient.createGradientFromName : unknown name : {$gradientName}');
			return undefined;
		}

		let len = colors.length;
		for(let i = 0; i < len; i++) {
			//create map function between 0 and 1
			let offset = map(i, 0, len - 1, 0, 1);

			g.addColorStop(offset, colors[i]);
		}

		return g;
	}
}

Gradient.LEFT_TO_RIGHT = 0;
Gradient.TOP_TO_BOTTOM = 1;
Gradient.TOP_RIGHT_TO_BOTTOM_LEFT = 2;
Gradient.BOTTOM_LEFT_TO_TOP_RIGHT = 3;

/**
	Named gradients from uigradients.com, used Under
	an MIT license:
	https://github.com/ghosh/uiGradients/blob/master/gradients.json
*/
const GRADIENTS = new Map([
    [
        "Blu",
		["#00416A", "#E4E5E6"]
    ],
    [
        "Ver",
        ["#FFE000", "#799F0C"]
    ],
    [
        "Ver Black",
        ["#F7F8F8", "#ACBB78"]
    ],
    [
        "Combi",
        ["#00416A", "#799F0C", "#FFE000"]
    ],
    [
        "Anwar",
        ["#334d50", "#cbcaa5"]
    ],
    [
        "Bluelagoo",
        ["#0052D4", "#4364F7", "#6FB1FC"]
    ],
    [
        "Lunada",
        ["#5433FF", "#20BDFF", "#A5FECB"]
    ],
    [
        "Reaqua",
        ["#799F0C", "#ACBB78"]
    ],
    [
        "Mango",
        ["#ffe259", "#ffa751"]
    ],
    [
        "Bupe",
        ["#00416A", "#E4E5E6"]
    ],
    [
        "Rea",
        ["#FFE000", "#799F0C"]
    ],
    [
        "Windy",
        ["#acb6e5", "#86fde8"]
    ],
    [
        "Royal Blue",
        ["#536976", "#292E49"]
    ],
    [
        "Royal Blue + Petrol",
        ["#BBD2C5", "#536976", "#292E49"]
    ],
    [
        "Copper",
        ["#B79891", "#94716B"]
    ],
    [
        "Anamnisar",
        ["#9796f0", "#fbc7d4"]
    ],
    [
        "Petrol",
        ["#BBD2C5", "#536976"]
    ],
    [
        "Sky",
        ["#076585", "#fff"]
    ],
    [
        "Sel",
        ["#00467F", "#A5CC82"]
    ],
    [
        "Skyline",
        ["#1488CC", "#2B32B2"]
    ],
    [
        "DIMIGO",
        ["#ec008c", "#fc6767"]
    ],
    [
        "Purple Love",
        ["#cc2b5e", "#753a88"]
    ],
    [
        "Sexy Blue",
        ["#2193b0", "#6dd5ed"]
    ],
    [
        "Blooker20",
        ["#e65c00", "#F9D423"]
    ],
    [
        "Sea Blue",
        ["#2b5876", "#4e4376"]
    ],
    [
        "Nimvelo",
        ["#314755", "#26a0da"]
    ],
    [
        "Hazel",
        ["#77A1D3", "#79CBCA", "#E684AE"]
    ],
    [
        "Noon to Dusk",
        ["#ff6e7f", "#bfe9ff"]
    ],
    [
        "YouTube",
        ["#e52d27", "#b31217"]
    ],
    [
        "Cool Brown",
        ["#603813", "#b29f94"]
    ],
    [
        "Harmonic Energy",
        ["#16A085", "#F4D03F"]
    ],
    [
        "Playing with Reds",
        ["#D31027", "#EA384D"]
    ],
    [
        "Sunny Days",
        ["#EDE574", "#E1F5C4"]
    ],
    [
        "Green Beach",
        ["#02AAB0", "#00CDAC"]
    ],
    [
        "Intuitive Purple",
        ["#DA22FF", "#9733EE"]
    ],
    [
        "Emerald Water",
        ["#348F50", "#56B4D3"]
    ],
    [
        "Lemon Twist",
        ["#3CA55C", "#B5AC49"]
    ],
    [
        "Monte Carlo",
        ["#CC95C0", "#DBD4B4", "#7AA1D2"]
    ],
    [
        "Horizon",
        ["#003973", "#E5E5BE"]
    ],
    [
        "Rose Water",
        ["#E55D87", "#5FC3E4"]
    ],
    [
        "Frozen",
        ["#403B4A", "#E7E9BB"]
    ],
    [
        "Mango Pulp",
        ["#F09819", "#EDDE5D"]
    ],
    [
        "Bloody Mary",
        ["#FF512F", "#DD2476"]
    ],
    [
        "Aubergine",
        ["#AA076B", "#61045F"]
    ],
    [
        "Aqua Marine",
        ["#1A2980", "#26D0CE"]
    ],
    [
        "Sunrise",
        ["#FF512F", "#F09819"]
    ],
    [
        "Purple Paradise",
        ["#1D2B64", "#F8CDDA"]
    ],
    [
        "Stripe",
        ["#1FA2FF", "#12D8FA", "#A6FFCB"]
    ],
    [
        "Sea Weed",
        ["#4CB8C4", "#3CD3AD"]
    ],
    [
        "Pinky",
        ["#DD5E89", "#F7BB97"]
    ],
    [
        "Cherry",
        ["#EB3349", "#F45C43"]
    ],
    [
        "Mojito",
        ["#1D976C", "#93F9B9"]
    ],
    [
        "Juicy Orange",
        ["#FF8008", "#FFC837"]
    ],
    [
        "Mirage",
        ["#16222A", "#3A6073"]
    ],
    [
        "Steel Gray",
        ["#1F1C2C", "#928DAB"]
    ],
    [
        "Kashmir",
        ["#614385", "#516395"]
    ],
    [
        "Electric Violet",
        ["#4776E6", "#8E54E9"]
    ],
    [
        "Venice Blue",
        ["#085078", "#85D8CE"]
    ],
    [
        "Bora Bora",
        ["#2BC0E4", "#EAECC6"]
    ],
    [
        "Moss",
        ["#134E5E", "#71B280"]
    ],
    [
        "Shroom Haze",
        ["#5C258D", "#4389A2"]
    ],
    [
        "Mystic",
        ["#757F9A", "#D7DDE8"]
    ],
    [
        "Midnight City",
        ["#232526", "#414345"]
    ],
    [
        "Sea Blizz",
        ["#1CD8D2", "#93EDC7"]
    ],
    [
        "Opa",
        ["#3D7EAA", "#FFE47A"]
    ],
    [
        "Titanium",
        ["#283048", "#859398"]
    ],
    [
        "Mantle",
        ["#24C6DC", "#514A9D"]
    ],
    [
        "Dracula",
        ["#DC2424", "#4A569D"]
    ],
    [
        "Peach",
        ["#ED4264", "#FFEDBC"]
    ],
    [
        "Moonrise",
        ["#DAE2F8", "#D6A4A4"]
    ],
    [
        "Clouds",
        ["#ECE9E6", "#FFFFFF"]
    ],
    [
        "Stellar",
        ["#7474BF", "#348AC7"]
    ],
    [
        "Bourbon",
        ["#EC6F66", "#F3A183"]
    ],
    [
        "Calm Darya",
        ["#5f2c82", "#49a09d"]
    ],
    [
        "Influenza",
        ["#C04848", "#480048"]
    ],
    [
        "Shrimpy",
        ["#e43a15", "#e65245"]
    ],
    [
        "Army",
        ["#414d0b", "#727a17"]
    ],
    [
        "Miaka",
        ["#FC354C", "#0ABFBC"]
    ],
    [
        "Pinot Noir",
        ["#4b6cb7", "#182848"]
    ],
    [
        "Day Tripper",
        ["#f857a6", "#ff5858"]
    ],
    [
        "Namn",
        ["#a73737", "#7a2828"]
    ],
    [
        "Blurry Beach",
        ["#d53369", "#cbad6d"]
    ],
    [
        "Vasily",
        ["#e9d362", "#333333"]
    ],
    [
        "A Lost Memory",
        ["#DE6262", "#FFB88C"]
    ],
    [
        "Petrichor",
        ["#666600", "#999966"]
    ],
    [
        "Jonquil",
        ["#FFEEEE", "#DDEFBB"]
    ],
    [
        "Sirius Tamed",
        ["#EFEFBB", "#D4D3DD"]
    ],
    [
        "Kyoto",
        ["#c21500", "#ffc500"]
    ],
    [
        "Misty Meadow",
        ["#215f00", "#e4e4d9"]
    ],
    [
        "Aqualicious",
        ["#50C9C3", "#96DEDA"]
    ],
    [
        "Moor",
        ["#616161", "#9bc5c3"]
    ],
    [
        "Almost",
        ["#ddd6f3", "#faaca8"]
    ],
    [
        "Forever Lost",
        ["#5D4157", "#A8CABA"]
    ],
    [
        "Winter",
        ["#E6DADA", "#274046"]
    ],
    [
        "Nelson",
        ["#f2709c", "#ff9472"]
    ],
    [
        "Autumn",
        ["#DAD299", "#B0DAB9"]
    ],
    [
        "Candy",
        ["#D3959B", "#BFE6BA"]
    ],
    [
        "Reef",
        ["#00d2ff", "#3a7bd5"]
    ],
    [
        "The Strain",
        ["#870000", "#190A05"]
    ],
    [
        "Dirty Fog",
        ["#B993D6", "#8CA6DB"]
    ],
    [
        "Earthly",
        ["#649173", "#DBD5A4"]
    ],
    [
        "Virgin",
        ["#C9FFBF", "#FFAFBD"]
    ],
    [
        "Ash",
        ["#606c88", "#3f4c6b"]
    ],
    [
        "Cherryblossoms",
        ["#FBD3E9", "#BB377D"]
    ],
    [
        "Parklife",
        ["#ADD100", "#7B920A"]
    ],
    [
        "Dance To Forget",
        ["#FF4E50", "#F9D423"]
    ],
    [
        "Starfall",
        ["#F0C27B", "#4B1248"]
    ],
    [
        "Red Mist",
        ["#000000", "#e74c3c"]
    ],
    [
        "Teal Love",
        ["#AAFFA9", "#11FFBD"]
    ],
    [
        "Neon Life",
        ["#B3FFAB", "#12FFF7"]
    ],
    [
        "Man of Steel",
        ["#780206", "#061161"]
    ],
    [
        "Amethyst",
        ["#9D50BB", "#6E48AA"]
    ],
    [
        "Cheer Up Emo Kid",
        ["#556270", "#FF6B6B"]
    ],
    [
        "Shore",
        ["#70e1f5", "#ffd194"]
    ],
    [
        "Facebook Messenger",
        ["#00c6ff", "#0072ff"]
    ],
    [
        "SoundCloud",
        ["#fe8c00", "#f83600"]
    ],
    [
        "Behongo",
        ["#52c234", "#061700"]
    ],
    [
        "ServQuick",
        ["#485563", "#29323c"]
    ],
    [
        "Friday",
        ["#83a4d4", "#b6fbff"]
    ],
    [
        "Martini",
        ["#FDFC47", "#24FE41"]
    ],
    [
        "Metallic Toad",
        ["#abbaab", "#ffffff"]
    ],
    [
        "Between The Clouds",
        ["#73C8A9", "#373B44"]
    ],
    [
        "Crazy Orange I",
        ["#D38312", "#A83279"]
    ],
    [
        "Hersheys",
        ["#1e130c", "#9a8478"]
    ],
    [
        "Talking To Mice Elf",
        ["#948E99", "#2E1437"]
    ],
    [
        "Purple Bliss",
        ["#360033", "#0b8793"]
    ],
    [
        "Predawn",
        ["#FFA17F", "#00223E"]
    ],
    [
        "Endless River",
        ["#43cea2", "#185a9d"]
    ],
    [
        "Pastel Orange at the Sun",
        ["#ffb347", "#ffcc33"]
    ],
    [
        "Twitch",
        ["#6441A5", "#2a0845"]
    ],
    [
        "Atlas",
        ["#FEAC5E", "#C779D0", "#4BC0C8"]
    ],
    [
        "Instagram",
        ["#833ab4", "#fd1d1d", "#fcb045"]
    ],
    [
        "Flickr",
        ["#ff0084", "#33001b"]
    ],
    [
        "Vine",
        ["#00bf8f", "#001510"]
    ],
    [
        "Turquoise flow",
        ["#136a8a", "#267871"]
    ],
    [
        "Portrait",
        ["#8e9eab", "#eef2f3"]
    ],
    [
        "Virgin America",
        ["#7b4397", "#dc2430"]
    ],
    [
        "Koko Caramel",
        ["#D1913C", "#FFD194"]
    ],
    [
        "Fresh Turboscent",
        ["#F1F2B5", "#135058"]
    ],
    [
        "Green to dark",
        ["#6A9113", "#141517"]
    ],
    [
        "Ukraine",
        ["#004FF9", "#FFF94C"]
    ],
    [
        "Curiosity blue",
        ["#525252", "#3d72b4"]
    ],
    [
        "Dark Knight",
        ["#BA8B02", "#181818"]
    ],
    [
        "Piglet",
        ["#ee9ca7", "#ffdde1"]
    ],
    [
        "Lizard",
        ["#304352", "#d7d2cc"]
    ],
    [
        "Sage Persuasion",
        ["#CCCCB2", "#757519"]
    ],
    [
        "Between Night and Day",
        ["#2c3e50", "#3498db"]
    ],
    [
        "Timber",
        ["#fc00ff", "#00dbde"]
    ],
    [
        "Passion",
        ["#e53935", "#e35d5b"]
    ],
    [
        "Clear Sky",
        ["#005C97", "#363795"]
    ],
    [
        "Master Card",
        ["#f46b45", "#eea849"]
    ],
    [
        "Back To Earth",
        ["#00C9FF", "#92FE9D"]
    ],
    [
        "Deep Purple",
        ["#673AB7", "#512DA8"]
    ],
    [
        "Little Leaf",
        ["#76b852", "#8DC26F"]
    ],
    [
        "Netflix",
        ["#8E0E00", "#1F1C18"]
    ],
    [
        "Light Orange",
        ["#FFB75E", "#ED8F03"]
    ],
    [
        "Green and Blue",
        ["#c2e59c", "#64b3f4"]
    ],
    [
        "Poncho",
        ["#403A3E", "#BE5869"]
    ],
    [
        "Back to the Future",
        ["#C02425", "#F0CB35"]
    ],
    [
        "Blush",
        ["#B24592", "#F15F79"]
    ],
    [
        "Inbox",
        ["#457fca", "#5691c8"]
    ],
    [
        "Purplin",
        ["#6a3093", "#a044ff"]
    ],
    [
        "Pale Wood",
        ["#eacda3", "#d6ae7b"]
    ],
    [
        "Haikus",
        ["#fd746c", "#ff9068"]
    ],
    [
        "Pizelex",
        ["#114357", "#F29492"]
    ],
    [
        "Joomla",
        ["#1e3c72", "#2a5298"]
    ],
    [
        "Christmas",
        ["#2F7336", "#AA3A38"]
    ],
    [
        "Minnesota Vikings",
        ["#5614B0", "#DBD65C"]
    ],
    [
        "Miami Dolphins",
        ["#4DA0B0", "#D39D38"]
    ],
    [
        "Forest",
        ["#5A3F37", "#2C7744"]
    ],
    [
        "Nighthawk",
        ["#2980b9", "#2c3e50"]
    ],
    [
        "Superman",
        ["#0099F7", "#F11712"]
    ],
    [
        "Suzy",
        ["#834d9b", "#d04ed6"]
    ],
    [
        "Dark Skies",
        ["#4B79A1", "#283E51"]
    ],
    [
        "Deep Space",
        ["#000000", "#434343"]
    ],
    [
        "Decent",
        ["#4CA1AF", "#C4E0E5"]
    ],
    [
        "Colors Of Sky",
        ["#E0EAFC", "#CFDEF3"]
    ],
    [
        "Purple White",
        ["#BA5370", "#F4E2D8"]
    ],
    [
        "Ali",
        ["#ff4b1f", "#1fddff"]
    ],
    [
        "Alihossein",
        ["#f7ff00", "#db36a4"]
    ],
    [
        "Shahabi",
        ["#a80077", "#66ff00"]
    ],
    [
        "Red Ocean",
        ["#1D4350", "#A43931"]
    ],
    [
        "Tranquil",
        ["#EECDA3", "#EF629F"]
    ],
    [
        "Transfile",
        ["#16BFFD", "#CB3066"]
    ],

    [
        "Sylvia",
        ["#ff4b1f", "#ff9068"]
    ],
    [
        "Sweet Morning",
        ["#FF5F6D", "#FFC371"]
    ],
    [
        "Politics",
        ["#2196f3", "#f44336"]
    ],
    [
        "Bright Vault",
        ["#00d2ff", "#928DAB"]
    ],
    [
        "Solid Vault",
        ["#3a7bd5", "#3a6073"]
    ],
    [
        "Sunset",
        ["#0B486B", "#F56217"]
    ],
    [
        "Grapefruit Sunset",
        ["#e96443", "#904e95"]
    ],
    [
        "Deep Sea Space",
        ["#2C3E50", "#4CA1AF"]
    ],
    [
        "Dusk",
        ["#2C3E50", "#FD746C"]
    ],
    [
        "Minimal Red",
        ["#F00000", "#DC281E"]
    ],
    [
        "Royal",
        ["#141E30", "#243B55"]
    ],
    [
        "Mauve",
        ["#42275a", "#734b6d"]
    ],
    [
        "Frost",
        ["#000428", "#004e92"]
    ],
    [
        "Lush",
        ["#56ab2f", "#a8e063"]
    ],
    [
        "Firewatch",
        ["#cb2d3e", "#ef473a"]
    ],
    [
        "Sherbert",
        ["#f79d00", "#64f38c"]
    ],
    [
        "Blood Red",
        ["#f85032", "#e73827"]
    ],
    [
        "Sun on the Horizon",
        ["#fceabb", "#f8b500"]
    ],
    [
        "IIIT Delhi",
        ["#808080", "#3fada8"]
    ],
    [
        "Jupiter",
        ["#ffd89b", "#19547b"]
    ],
    [
        "50 Shades of Grey",
        ["#bdc3c7", "#2c3e50"]
    ],
    [
        "Dania",
        ["#BE93C5", "#7BC6CC"]
    ],
    [
        "Limeade",
        ["#A1FFCE", "#FAFFD1"]
    ],
    [
        "Disco",
        ["#4ECDC4", "#556270"]
    ],
    [
        "Love Couple",
        ["#3a6186", "#89253e"]
    ],
    [
        "Azure Pop",
        ["#ef32d9", "#89fffd"]
    ],
    [
        "Nepal",
        ["#de6161", "#2657eb"]
    ],
    [
        "Cosmic Fusion",
        ["#ff00cc", "#333399"]
    ],
    [
        "Snapchat",
        ["#fffc00", "#ffffff"]
    ],
    [
        "Ed's Sunset Gradient",
        ["#ff7e5f", "#feb47b"]
    ],
    [
        "Brady Brady Fun Fun",
        ["#00c3ff", "#ffff1c"]
    ],
    [
        "Black Rosé",
        ["#f4c4f3", "#fc67fa"]
    ],
    [
        "80's Purple",
        ["#41295a", "#2F0743"]
    ],
    [
        "Radar",
        ["#A770EF", "#CF8BF3", "#FDB99B"]
    ],
    [
        "Ibiza Sunset",
        ["#ee0979", "#ff6a00"]
    ],
    [
        "Dawn",
        ["#F3904F", "#3B4371"]
    ],
    [
        "Mild",
        ["#67B26F", "#4ca2cd"]
    ],
    [

        "Vice City",
        ["#3494E6", "#EC6EAD"]
    ],
    [
        "Jaipur",
        ["#DBE6F6", "#C5796D"]

    ],
    [
        "Jodhpur",
        ["#9CECFB", "#65C7F7", "#0052D4"]

    ],
    [
        "Cocoaa Ice",
        ["#c0c0aa", "#1cefff"]
    ],
    [
        "EasyMed",
        ["#DCE35B", "#45B649"]
    ],
    [
        "Rose Colored Lenses",
        ["#E8CBC0", "#636FA4"]
    ],
    [
        "What lies Beyond",
        ["#F0F2F0", "#000C40"]
    ],
    [
        "Roseanna",
        ["#FFAFBD", "#ffc3a0"]
    ],
    [
        "Honey Dew",
        ["#43C6AC", "#F8FFAE"]
    ],
    [
        "Under the Lake",
        ["#093028", "#237A57"]
    ],
    [
        "The Blue Lagoon",
        ["#43C6AC", "#191654"]
    ],
    [
        "Can You Feel The Love Tonight",
        ["#4568DC", "#B06AB3"]
    ],
    [
        "Very Blue",
        ["#0575E6", "#021B79"]
    ],
    [
        "Love and Liberty",
        ["#200122", "#6f0000"]
    ],
    [
        "Orca",
        ["#44A08D", "#093637"]
    ],
    [
        "Venice",
        ["#6190E8", "#A7BFE8"]
    ],
    [
        "Pacific Dream",
        ["#34e89e", "#0f3443"]
    ],
    [
        "Learning and Leading",
        ["#F7971E", "#FFD200"]
    ],
    [
        "Celestial",
        ["#C33764", "#1D2671"]
    ],
    [
        "Purplepine",
        ["#20002c", "#cbb4d4"]
    ],
    [
        "Sha la la",
        ["#D66D75", "#E29587"]
    ],
    [
        "Mini",
        ["#30E8BF", "#FF8235"]
    ],
    [
        "Maldives",
        ["#B2FEFA", "#0ED2F7"]
    ],
    [
        "Cinnamint",
        ["#4AC29A", "#BDFFF3"]
    ],
    [
        "Html",
        ["#E44D26", "#F16529"]
    ],
    [
        "Coal",
        ["#EB5757", "#000000"]
    ],
    [
        "Sunkist",
        ["#F2994A", "#F2C94C"]
    ],
    [
        "Blue Skies",
        ["#56CCF2", "#2F80ED"]
    ],
    [
        "Chitty Chitty Bang Bang",
        ["#007991", "#78ffd6"]
    ],
    [
        "Visions of Grandeur",
        ["#000046", "#1CB5E0"]
    ],
    [
        "Crystal Clear",
        ["#159957", "#155799"]
    ],
    [
        "Mello",
        ["#c0392b", "#8e44ad"]
    ],
    [
        "Compare Now",
        ["#EF3B36", "#FFFFFF"]
    ],
    [
        "Meridian",
        ["#283c86", "#45a247"]
    ],
    [
        "Relay",
        ["#3A1C71", "#D76D77", "#FFAF7B"]
    ],
    [
        "Alive",
        ["#CB356B", "#BD3F32"]
    ],
    [
        "Scooter",
        ["#36D1DC", "#5B86E5"]
    ],
    [
        "Terminal",
        ["#000000", "#0f9b0f"]
    ],
    [
        "Telegram",
        ["#1c92d2", "#f2fcfe"]
    ],
    [
        "Crimson Tide",
        ["#642B73", "#C6426E"]
    ],
    [
        "Socialive",
        ["#06beb6", "#48b1bf"]
    ],
    [
        "Subu",
        ["#0cebeb", "#20e3b2", "#29ffc6"]
    ],
    [
        "Broken Hearts",
        ["#d9a7c7", "#fffcdc"]
    ],
    [
        "Kimoby Is The New Blue",
        ["#396afc", "#2948ff"]
    ],
    [
        "Dull",
        ["#C9D6FF", "#E2E2E2"]
    ],
    [
        "Purpink",
        ["#7F00FF", "#E100FF"]
    ],
    [
        "Orange Coral",
        ["#ff9966", "#ff5e62"]
    ],
    [
        "Summer",
        ["#22c1c3", "#fdbb2d"]
    ],
    [
        "King Yna",
        ["#1a2a6c", "#b21f1f", "#fdbb2d"]
    ],
    [
        "Velvet Sun",
        ["#e1eec3", "#f05053"]
    ],
    [
        "Zinc",
        ["#ADA996", "#F2F2F2", "#DBDBDB", "#EAEAEA"]
    ],
    [
        "Hydrogen",
        ["#667db6", "#0082c8", "#0082c8", "#667db6"]
    ],
    [
        "Argon",
        ["#03001e", "#7303c0", "#ec38bc", "#fdeff9"]
    ],
    [
        "Lithium",
        ["#6D6027", "#D3CBB8"]
    ],
    [
        "Digital Water",
        ["#74ebd5","#ACB6E5"]
    ],
    [
        "Orange Fun",
        ["#fc4a1a", "#f7b733"]
    ],
    [
        "Rainbow Blue",
        ["#00F260", "#0575E6"]
    ],
    [
        "Pink Flavour",
        ["#800080", "#ffc0cb"]
    ],
    [
        "Sulphur",
        ["#CAC531", "#F3F9A7"]
    ],
    [
        "Selenium",
        ["#3C3B3F", "#605C3C"]
    ],
    [
        "Delicate",
        ["#D3CCE3", "#E9E4F0"]
    ],
    [

        "Ohhappiness",
        ["#00b09b", "#96c93d"]
    ],
    [
        "Lawrencium",
        ["#0f0c29", "#302b63", "#24243e"]
    ],
    [
        "Relaxing red",
        ["#fffbd5", "#b20a2c"]
    ],
    [
        "Taran Tado",
        ["#23074d", "#cc5333"]
    ],
    [
        "Bighead",
        ["#c94b4b", "#4b134f"]
    ],
    [
        "Sublime Vivid",
        ["#FC466B", "#3F5EFB"]
    ],
    [
        "Sublime Light",
        ["#FC5C7D", "#6A82FB"]
    ],
    [
        "Pun Yeta",
        ["#108dc7", "#ef8e38"]
    ],
    [
        "Quepal",
        ["#11998e", "#38ef7d"]
    ],
    [
        "Sand to Blue",
        ["#3E5151", "#DECBA4"]
    ],
    [
        "Wedding Day Blues",
        ["#40E0D0", "#FF8C00", "#FF0080"]
    ],
    [
        "Shifter",
        ["#bc4e9c", "#f80759"]
    ],
    [
        "Red Sunset",
        ["#355C7D", "#6C5B7B", "#C06C84"]
    ],
    [
        "Moon Purple",
        ["#4e54c8", "#8f94fb"]
    ],
    [
        "Pure Lust",
        ["#333333", "#dd1818"]
    ],
    [
        "Slight Ocean View",
        ["#a8c0ff", "#3f2b96"]
    ],
    [
        "eXpresso",
        ["#ad5389", "#3c1053"]
    ],
    [
        "Shifty",
        ["#636363", "#a2ab58"]
    ],
    [
        "Vanusa",
        ["#DA4453", "#89216B"]
    ],
    [
        "Evening Night",
        ["#005AA7", "#FFFDE4"]
    ],
    [
        "Magic",
        ["#59C173", "#a17fe0", "#5D26C1"]
    ],
    [
        "Margo",
        ["#FFEFBA", "#FFFFFF"]
    ],
    [
        "Blue Raspberry",
        ["#00B4DB", "#0083B0"]
    ],
    [
        "Citrus Peel",
        ["#FDC830", "#F37335"]
    ],
    [
        "Sin City Red",
        ["#ED213A", "#93291E"]
    ],
    [
        "Rastafari",
        ["#1E9600", "#FFF200", "#FF0000"]
    ],
    [
        "Summer Dog",
        ["#a8ff78", "#78ffd6"]
    ],
    [
        "Wiretap",
        ["#8A2387", "#E94057", "#F27121"]
    ],
    [
        "Burning Orange",
        ["#FF416C", "#FF4B2B"]
    ],
    [
        "Ultra Voilet",
        ["#654ea3", "#eaafc8"]
    ],
    [
      "By Design",
      ["#009FFF", "#ec2F4B"]
    ],
    [
        "Kyoo Tah",
        ["#544a7d", "#ffd452"]
    ],
    [
        "Kye Meh",
        ["#8360c3", "#2ebf91"]
    ],
    [
        "Kyoo Pal",
        ["#dd3e54", "#6be585"]
    ],
    [
        "Metapolis",
        ["#659999", "#f4791f"]
    ],
    [
        "Flare",
        ["#f12711", "#f5af19"]
    ],
    [
        "Witching Hour",
        ["#c31432", "#240b36"]
    ],
    [
        "Azur Lane",
        ["#7F7FD5", "#86A8E7", "#91EAE4"]
    ],
    [
        "Neuromancer",
        ["#f953c6", "#b91d73"]
    ],
    [
        "Harvey",
        ["#1f4037", "#99f2c8"]
    ],
    [
        "Amin",
        ["#8E2DE2", "#4A00E0"]
    ],
    [
        "Memariani",
        ["#aa4b6b", "#6b6b83" , "#3b8d99"]
    ],
    [
        "Yoda",
        ["#FF0099", "#493240"]
    ],
    [
        "Cool Sky",
        ["#2980B9", "#6DD5FA", "#FFFFFF"]
    ],
    [
        "Dark Ocean",
        ["#373B44", "#4286f4"]
    ],
    [
        "Evening Sunshine",
        ["#b92b27", "#1565C0"]
    ],
    [
        "JShine",
        ["#12c2e9","#c471ed","#f64f59"]
    ],
    [
        "Moonlit Asteroid",
        ["#0F2027", "#203A43", "#2C5364"]
    ]
]);

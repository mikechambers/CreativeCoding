import { greatestCommonDivisor } from "./math.js";

export function getScreenResolution() {
  return { height: screen.height, width: screen.width };
}

export function getScreenAspectRatio(width, height) {
  let gcd = greatestCommonDivisor(width, height);

  let w = screen.width / gcd;
  let h = screen.height / gcd;

  return [w, h];
}

export function getScreenAspectRatioString(arr) {
  return "${arr[0],arr[1]}";
}

//add dpi / ppi
//add ratio
//getLargestByAspectRatio
//make this a map or just an object?
let UHD = { width: 3840, height: 1440 };
let R_8K = { width: 7680, height: 4320 };

//1920x1080 16:9
// 1920x1200 1680x1050 1440x900 16:10
//1280x1024 and 1024x768 4:3

export let resolutions = new Map([
  [
    "720p",
    {
      width: 1280,
      height: 720,
      aspect: "16:9"
    }
  ],
  [
    "1080p",
    {
      width: 1920,
      height: 1080,
      aspect: "16:9"
    }
  ],
  [
    "1440p",
    {
      width: 2560,
      height: 1440,
      aspect: "16:9"
    }
  ],
  ["UHD", UHD],
  ["2160p", UHD],
  ["4K", UHD],
  ["Ultra HD", UHD],
  ["4320p", R_8K][("8K", R_8K)],
  [
    "16K",
    {
      width: 15360,
      height: 8640,
      aspect: "16:9"
    }
  ],

  /********* Mac Computers *********/
  [
    "Macbook Pro 13.3 Retina",
    {
      width: 2160,
      height: 1600
    }
  ],
  [
    "iMac 27",
    {
      width: 2560,
      height: 1440,
      aspect: "16:9"
    }
  ],
  [
    "iMac 21",
    {
      width: 1920,
      height: 1080,
      aspect: "16:9"
    }
  ],
  [
    "Macbook Pro 13.3",
    {
      width: 1280,
      height: 800,
      aspect: "16:10"
    }
  ],
  [
    "Macbook Pro 15.4",
    {
      width: 1440,
      height: 900,
      aspect: "16:10"
    }
  ],
  [
    "Macbook Pro 17",
    {
      width: 1920,
      height: 1200,
      aspect: "16:9"
    }
  ],
  [
    "Macbook Air 11.6",
    {
      width: 1366,
      height: 768,
      aspect: "16:9"
    }
  ],
  [
    "Macbook Air 13",
    {
      width: 1440,
      height: 900,
      aspect: "16:9"
    }
  ],
  [
    "Macbook Pro 15.4",
    {
      width: 2880,
      height: 1800
    }
  ],

  /********* Google Pixel *********/
  [
    "Google Pixel 2",
    {
      width: 1920,
      height: 1080,
      aspect: "16:9"
    }
  ],
  [
    "Google Pixel 2 XL",
    {
      width: 2880,
      height: 1440
    }
  ],
  [
    "Google Pixel",
    {
      width: 1920,
      height: 1080,
      aspect: "16:9"
    }
  ],
  [
    "Google Pixel XL",
    {
      width: 2560,
      height: 1440,
      aspect: "16:9"
    }
  ],

  /********* Apple iPhone *********/
  [
    "iPhone SE",
    {
      width: 640,
      height: 1136,
      ppi: 326,
      aspect: "9:16"
    }
  ],
  [
    "iPhone 5",
    {
      width: 640,
      height: 1136,
      ppi: 326,
      aspect: "9:16"
    }
  ],
  [
    "iPhone 8",
    {
      width: 750,
      height: 1334,
      ppi: 326,
      aspect: "9:16"
    }
  ],
  [
    "iPhone 8 Plus",
    {
      width: 1242,
      height: 2208,
      ppi: 401,
      aspect: "9:16"
    }
  ],
  [
    "iPhone X",
    {
      width: 375,
      height: 812,
      ppi: 458,
      aspect: "9:16"
    }
  ],

  /********* Apple iPad *********/
  [
    "iPad Mini",
    {
      width: 768,
      height: 1024,
      ppi: 326,
      aspect: "3:4"
    }
  ],
  [
    "iPad Air",
    {
      width: 768,
      height: 1024,
      ppi: 264,
      aspect: "3:4"
    }
  ],
  [
    "iPad Pro 10.5",
    {
      width: 1668,
      height: 2224,
      ppi: 264,
      aspect: "3:4"
    }
  ],
  [
    "iPad Pro 12.9",
    {
      width: 2048,
      height: 2732,
      ppi: 264,
      aspect: "3:4"
    }
  ],

  /********* Apple Watch *********/
  [
    "Apple Watch 38mm",
    {
      width: 272,
      height: 340,
      ppi: 326,
      aspect: "4:5"
    }
  ],
  [
    "Apple Watch 38mm",
    {
      width: 312,
      height: 390,
      ppi: 326,
      aspect: "4:5"
    }
  ],

  /********* Social Media *********/
  [
    "Instagram Square Image",
    {
      width: 1080,
      height: 1080,
      aspect: "1:1"
    }
  ],
  [
    "Instagram Square Video",
    {
      width: 1080,
      height: 1080,
      aspect: "1:1"
    }
  ]
]);

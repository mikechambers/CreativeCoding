import Color from "../../lib/color.js";
//import "babel-polyfill";
import { expect } from "chai";

describe("Color constructor : RGB", () => {
  it("Should map RGB colors passed in", () => {
    let r = 127;
    let g = 203;
    let b = 4;

    let c = new Color(r, g, b);

    expect(c.red).to.equal(r);
    expect(c.green).to.equal(g);
    expect(c.blue).to.equal(b);
  });
});

describe("Color constructor : RGB", () => {
  it("Alpha should be 1.0", () => {
    let r = 127;
    let g = 203;
    let b = 4;

    let c = new Color(r, g, b);

    expect(c.alpha).to.equal(1.0);
  });
});

describe("Color constructor RGBA", () => {
  it("Should map RGBA colors passed in", () => {
    let r = 127;
    let g = 203;
    let b = 4;
    let a = 0.7;

    let c = new Color(r, g, b, a);

    expect(c.red).to.equal(r);
    expect(c.green).to.equal(g);
    expect(c.blue).to.equal(b);
    expect(c.alpha).to.equal(a);
  });
});

describe("Color constructor C", () => {
  it("Should map single value colors passed in to grey", () => {
    let r = 127;

    let c = new Color(r);

    expect(c.red).to.equal(r);
    expect(c.green).to.equal(r);
    expect(c.blue).to.equal(r);
  });
});

describe("Color constructor CA", () => {
  it("Should map single value colors passed in to grey with specified alpha", () => {
    let r = 127;
    let a = 0.9;

    let c = new Color(r, a);

    expect(c.red).to.equal(r);
    expect(c.green).to.equal(r);
    expect(c.blue).to.equal(r);
    expect(c.alpha).to.equal(a);
  });
});

describe("blue setter", () => {
  it("blue getter should return value specified in setter", () => {
    let r = 127;
    let g = 203;
    let b = 4;
    let b2 = 29;

    let c = new Color(r, g, b);
    c.blue = b2;

    expect(c.blue).to.equal(b2);
  });
});

describe("red setter", () => {
  it("red getter should return value specified in setter", () => {
    let r = 127;
    let g = 203;
    let b = 4;
    let r2 = 120;

    let c = new Color(r, g, b);
    c.red = r2;

    expect(c.red).to.equal(r2);
  });
});

describe("green setter", () => {
  it("green getter should return value specified in setter", () => {
    let r = 127;
    let g = 203;
    let b = 4;
    let g2 = 249;

    let c = new Color(r, g, b);
    c.green = g2;

    expect(c.green).to.equal(g2);
  });
});

describe("isEqualTo", () => {
  it("Two color instances with same RGB values should return true", () => {
    let c = new Color(23, 255, 8);
    let c2 = new Color(23, 255, 8);

    expect(c.isEqualTo(c2)).to.equal(true);
    expect(c.isEqualTo(c2, true)).to.equal(true);
    expect(c.isEqualTo(c2, false)).to.equal(true);
  });
});

describe("isEqualTo", () => {
  it("Two color instances with same RGBA values should return true", () => {
    let c = new Color(23, 255, 8, 0.3);
    let c2 = new Color(23, 255, 8, 0.3);

    expect(c.isEqualTo(c2)).to.equal(true);
    expect(c.isEqualTo(c2, true)).to.equal(true);
    expect(c.isEqualTo(c2, false)).to.equal(true);
  });
});

describe("isEqualTo", () => {
  it("Two color instances with different RGB values should return false", () => {
    let c = new Color(23, 255, 8);
    let c2 = new Color(80, 22, 55);

    expect(c.isEqualTo(c2)).to.equal(false);
    expect(c.isEqualTo(c2, true)).to.equal(false);
    expect(c.isEqualTo(c2, false)).to.equal(false);
  });
});

describe("isEqualTo", () => {
  it("Two color instances with same RGB but different alpha values should return false", () => {
    let c = new Color(23, 255, 8, 0.8);
    let c2 = new Color(23, 255, 8, 0.3);

    expect(c.isEqualTo(c2, true)).to.equal(false);
  });
});

describe("toRGBA", () => {
  it("toRGBA should return correct css rgba string", () => {
    let c = new Color(23, 255, 8, 0.8);
    let rgba = "rgba(23, 255, 8, 0.8)";

    expect(c.toRGBA()).to.equal(rgba);
  });
});

describe("toHex", () => {
  it("toHex should return correct lowercase hexadecimal string", () => {
    let black = new Color(0, 0, 0);
    let blackWithAlpha = new Color(0, 0, 0, 0.5);
    expect(black.toHex()).to.equal("#000000");
    expect(blackWithAlpha.toHex()).to.equal("#000000");

    let white = new Color(255, 255, 255);
    let whiteWithAlpha = new Color(255, 255, 255, 0.5);
    expect(white.toHex()).to.equal("#ffffff");
    expect(whiteWithAlpha.toHex()).to.equal("#ffffff");

    let red = new Color(255, 0, 0);
    expect(red.toHex()).to.equal("#ff0000");

    let green = new Color(0, 255, 0);
    expect(green.toHex()).to.equal("#00ff00");

    let blue = new Color(0, 0, 255);
    expect(blue.toHex()).to.equal("#0000ff");

    let r = new Color(27, 88, 254);
    expect(r.toHex()).to.equal("#1b58fe");
  });
});

describe("clone", () => {
  it("clone returns an equivilant copy", () => {
    let c = new Color(27, 88, 254, 0.8);
    let c2 = c.clone();
    expect(c.isEqualTo(c2)).to.equal(true);
    expect(c.isEqualTo(c2, true)).to.equal(true);
    expect(c === c2).to.equal(false);
  });
});

describe("Color.fromHex", () => {
  it("fromHex returns correct color", () => {
    let hex = "#1b58fe";

    let color = new Color(27, 88, 254);

    expect(Color.fromHex(hex).isEqualTo(color)).to.equal(true);

    let hex1 = "1b58fe";
    expect(Color.fromHex(hex1).isEqualTo(color)).to.equal(true);
    expect(Color.fromHex("1b58Fe").isEqualTo(color)).to.equal(true);
    expect(Color.fromHex("#1b58Fe").isEqualTo(color)).to.equal(true);
    expect(Color.fromHex(hex1.toUpperCase()).isEqualTo(color)).to.equal(true);

    let black = new Color(0, 0, 0);
    expect(Color.fromHex("#000000").isEqualTo(black)).to.equal(true);
    expect(Color.fromHex("#000").isEqualTo(black)).to.equal(true);

    let white = new Color(255, 255, 255);
    expect(Color.fromHex("#FFFFFF").isEqualTo(white)).to.equal(true);
    expect(Color.fromHex("#FFF").isEqualTo(white)).to.equal(true);

    let grey = new Color(136, 136, 136);
    expect(Color.fromHex("#888888").isEqualTo(grey)).to.equal(true);
    expect(Color.fromHex("#888").isEqualTo(grey)).to.equal(true);
  });
});

describe("getRandom", () => {
  it("Color.getRandom should return a valid color instance", () => {
    let c = Color.getRandom();
    expect(c instanceof Color).to.equal(true);

    let c2 = Color.getRandom(0.8);
    expect(c2 instanceof Color).to.equal(true);
    expect(c2.alpha === 0.8).to.equal(true);

    for (let i = 0; i < 2000; i++) {
      let r = Color.getRandom();

      expect(r.red <= 255).to.equal(true);
      expect(r.green <= 255).to.equal(true);
      expect(r.blue <= 255).to.equal(true);

      expect(r.red >= 0).to.equal(true);
      expect(r.green >= 0).to.equal(true);
      expect(r.blue >= 0).to.equal(true);

      expect(r.alpha <= 1.0).to.equal(true);
      expect(r.alpha >= 0.0).to.equal(true);

      let r2 = Color.getRandom(true);

      expect(r2.red <= 255).to.equal(true);
      expect(r2.green <= 255).to.equal(true);
      expect(r2.blue <= 255).to.equal(true);

      expect(r2.red >= 0).to.equal(true);
      expect(r2.green >= 0).to.equal(true);
      expect(r2.blue >= 0).to.equal(true);

      expect(r2.alpha <= 1.0).to.equal(true);
      expect(r2.alpha >= 0.0).to.equal(true);
    }
  });
});

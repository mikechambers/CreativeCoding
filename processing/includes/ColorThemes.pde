class ColorThemes {

	HashMap<String, int[]> themes = new HashMap<String, int[]>();

	ColorThemes(){

		int[] CROSSWALK = { 
		           0xEFC63A,
		           0xEFAE33,
		           0xBF4707,
		           0x7C0706,
		           0xEF281E
		};

		themes.put("CROSSWALK", CROSSWALK);

		int[] FLAT_DESIGN_COLORS = {
			0x334D5C,
			0x45B29D,
			0xEFC94C,
			0xE27A3F,
			0xDF4949
		};

		themes.put("FLAT_DESIGN_COLORS", FLAT_DESIGN_COLORS);

		int[] BLUE_SET = {
			0x244674,
			0x4873A8,
			0x9FB9D0,
			0x7CA3CC,
			0xCCDAE7
		};

		themes.put("BLUE_SET", BLUE_SET);

		int[] MONOCHROMATIC_LIGHT_BLUES = {
			0x71EEFF,
			0x127280,
			0x25E4FF,
			0x397780,
			0x1DB7CC
		};

		themes.put("MONOCHROMATIC_LIGHT_BLUES", MONOCHROMATIC_LIGHT_BLUES);

		int[] AQUA_SKY = {
			0x3CD6E8,
			0x42BAFF,
			0x4FFFE1,
			0x3CE89A,
			0x42FF74
		};

		themes.put("AQUA_SKY", AQUA_SKY);

		int[] FALL = {
			0x930626,
			0xD72620,
			0x422C0B,
			0xDEA220,
			0x1E4A01
		};

		themes.put("FALL", FALL);

		int[] FIRENZE = {
			0xE04946,
			0x3BA686,
			0xB6D15D,
			0xFFD495,
			0xFA847E
		}; 

		themes.put("FIRENZE", FIRENZE);
	}

	int[] getTheme(String name) {
		return themes.get(name);
	}
}
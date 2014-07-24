class ColorTheme {

	HashMap<String, int[]> themes = new HashMap<String, int[]>();

	private int[] _theme;
	ColorTheme(String themeName){

		int[] CROSSWALK = { 
		           0xFFEFC63A,
		           0xFFEFAE33,
		           0xFFBF4707,
		           0xFF7C0706,
		           0xFFEF281E
		};

		themes.put("CROSSWALK", CROSSWALK);

		int[] FLAT_DESIGN_COLORS = {
			0xFF334D5C,
			0xFF45B29D,
			0xFFEFC94C,
			0xFFE27A3F,
			0xFFDF4949
		};

		themes.put("FLAT_DESIGN_COLORS", FLAT_DESIGN_COLORS);

		int[] BLUE_SET = {
			0xFF244674,
			0xFF4873A8,
			0xFF9FB9D0,
			0xFF7CA3CC,
			0xFFCCDAE7
		};

		themes.put("BLUE_SET", BLUE_SET);

		int[] MONOCHROMATIC_LIGHT_BLUES = {
			0xFF71EEFF,
			0xFF127280,
			0xFF25E4FF,
			0xFF397780,
			0xFF1DB7CC
		};

		themes.put("MONOCHROMATIC_LIGHT_BLUES", MONOCHROMATIC_LIGHT_BLUES);

		int[] AQUA_SKY = {
			0xFF3CD6E8,
			0xFF42BAFF,
			0xFF4FFFE1,
			0xFF3CE89A,
			0xFF42FF74
		};

		themes.put("AQUA_SKY", AQUA_SKY);

		int[] FALL = {
			0xFF930626,
			0xFFD72620,
			0xFF422C0B,
			0xFFDEA220,
			0xFF1E4A01
		};

		themes.put("FALL", FALL);

		int[] FIRENZE = {
			0xFFE04946,
			0xFF3BA686,
			0xFFB6D15D,
			0xFFFFD495,
			0xFFFA847E
		}; 

		themes.put("FIRENZE", FIRENZE);

		_theme = getTheme(themeName);
	}

	int getRandomColor() {
		//support for alpha?
		return _theme[floor(random(0, _theme.length))];
	}

	int[] getTheme(String name) {
		return themes.get(name);
	}
}
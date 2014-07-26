//either remove all processing code and make this a .java file
//or remove static variables
//could also move the static variables into their own .java file

class ColorTheme {

	public static final int[] CROSSWALK = { 
		0xFFEFC63A,
		0xFFEFAE33,
		0xFFBF4707,
		0xFF7C0706,
		0xFFEF281E
	};

	public static final int[] FLAT_DESIGN_COLORS = {
		0xFF334D5C,
		0xFF45B29D,
		0xFFEFC94C,
		0xFFE27A3F,
		0xFFDF4949
	};

	public static final int[] BLUE_SET = {
		0xFF244674,
		0xFF4873A8,
		0xFF9FB9D0,
		0xFF7CA3CC,
		0xFFCCDAE7
	};

	public static final int[] MONOCHROMATIC_LIGHT_BLUES = {
		0xFF71EEFF,
		0xFF127280,
		0xFF25E4FF,
		0xFF397780,
		0xFF1DB7CC
	};

	public static final  int[] AQUA_SKY = {
		0xFF3CD6E8,
		0xFF42BAFF,
		0xFF4FFFE1,
		0xFF3CE89A,
		0xFF42FF74
	};

	public static final int[] FALL = {
		0xFF930626,
		0xFFD72620,
		0xFF422C0B,
		0xFFDEA220,
		0xFF1E4A01
	};

	public static final int[] FIRENZE = {
		0xFFE04946,
		0xFF3BA686,
		0xFFB6D15D,
		0xFFFFD495,
		0xFFFA847E
	}; 

	private int[] _theme;
	private int _colorIndex = -1;

	ColorTheme(int[] theme){
		setTheme(theme);
	}

	int getRandomColor() {
		//support for alpha?
		return _theme[floor(random(0, _theme.length))];
	}

	int getNextColor() {
		int index = _colorIndex + 1;

		if(index == _theme.length) {
			index = 0;
		}

		_colorIndex = index;

		return _theme[index];
	}

	void setTheme(int[] theme) {
		_theme = theme;
	}
}
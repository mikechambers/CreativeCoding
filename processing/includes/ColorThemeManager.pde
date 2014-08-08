class ColorThemeManager {

	private int[] _theme;
	private int _colorIndex = -1;

	ColorThemeManager(String name){

		try {
			Field f = ColorThemes.class.getField(name);

			f.setAccessible(true);

			int[] _tmp = (int[]) f.get(null);

			setTheme(_tmp);
		} catch (Exception e) {
			println("Error loading color theme : " + name);
		}
	}

	int getRandomColor() {
		//support for alpha?
		return _theme[floor(random(0, _theme.length))];
	}

	int getPreviousColor() {
		int index = _colorIndex - 1;

		if(index <= 0) {
			index = _theme.length - 1;
		}

		_colorIndex = index;

		return _theme[index];
	}

	void reset() {
		_colorIndex = 0;
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
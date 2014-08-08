class ColorThemeManager {

	private int[] _theme;
	private int _colorIndex = -1;

	ColorThemeManager(int[] theme){
		setTheme(theme);
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
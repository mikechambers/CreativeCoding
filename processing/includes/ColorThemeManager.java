import java.lang.reflect.*;
import java.util.Random;

class ColorThemeManager {

	private int[] _theme;
	private int _colorIndex = -1;

	ColorThemeManager(String name){
		_theme = ColorThemeManager.getThemeByName(name);
	}

	static int[] getThemeByName(String name) {

		int[] _tmp = null;
		try {
			Field f = ColorThemes.class.getField(name);

			f.setAccessible(true);

			_tmp = (int[]) f.get(null);

		} catch (Exception e) {
			System.out.println("Error loading color theme : " + name);
		}

		return _tmp;
	}

	int getRandomColor() {

		int index = new Random().nextInt(_theme.length);
		return _theme[index];

		//return _theme[floor(random(0, _theme.length))];
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
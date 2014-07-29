import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import processing.pdf.PGraphicsPDF;

void savePDF() {

	if(!Config.recordPDF) {
		return;
	}

	endRecord();
}

void beginPDFRecord () {
	String n = getSavePath("pdf");
	beginRecord(PDF, n);
}

void saveAll () {
	saveImage();
	saveConfig();
	savePDF();
}

String getSavePath(String extension) {
	return "output/" + Config.name + "_" + suffix + "." + extension;
}

void saveConfig () {

	String n = getSavePath("config");
	PrintWriter output = createWriter(n);

	Field[] fields = Config.class.getDeclaredFields();
	for (Field f : fields) {
		f.setAccessible(true);
	    if (
	    		Modifier.isStatic(
	    			f.getModifiers()
	    		)
	    	) {

	    	try {
	    		output.println("Config." + f.getName() + " = " + (String.valueOf(f.get(null))) + ";");
	    	}
	    	catch (Exception e) {
	    		println(e.getMessage());
	    	}
	        
	    }

	}

	output.flush();
	output.close();
}

void saveImage() {
	String n = getSavePath("png");
	saveFrame(n);
}
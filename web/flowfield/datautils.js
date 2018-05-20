let downloadCount = 0;
const suffix = Date.now();

export function createFileName(appName, extension) {
	return appName + "_example_" + suffix + "_" + (++downloadCount) + "." + extension;
};

export function downloadBlob(blob, fileName) {
	window.URL = window.URL || window.webkitURL;

	//http://html5-demos.appspot.com/static/a.download.html
	//https://developer.mozilla.org/en-US/docs/Web/API/Blob
	var a = document.createElement('a');
	a.download = fileName;
	a.href = window.URL.createObjectURL(blob);
	a.click();
	a.remove();
}

//we could see if the string is base 64 encoded, if not, assume its is a string
//http://stackoverflow.com/a/5100158
export function dataURItoBlob(dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs
	var byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);

	var len = byteString.length;

	var i;
	for (i = 0; i < len; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	var bb = new Blob([ab], {type: mimeString});
	return bb;
};

export function downloadDataUrlAsFile(url, fileName) {
	var bb = dataURItoBlob(url);
	downloadBlob(bb, fileName);
};

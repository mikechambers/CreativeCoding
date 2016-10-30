/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global atob, btoa, ArrayBuffer, Uint8Array, Blob */


class FileDownloader {

    constructor(prefix) {
        this.suffix = Date.now();
        this.prefix = prefix;
        this.download_count = 0;
    };

    //we could see if the string is base 64 encoded, if not, assume its is a string
    //http://stackoverflow.com/a/5100158
    dataURItoBlob(dataURI) {
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
    
    createName(extension) {
        return this.prefix + "_example_" + this.suffix + "_" + (++this.download_count) + "." + extension;
    };
    
    downloadFile(url, fileName) {

        var bb = this.dataURItoBlob(url);
        
        window.URL = window.URL || window.webkitURL;
        
        //http://html5-demos.appspot.com/static/a.download.html
        //https://developer.mozilla.org/en-US/docs/Web/API/Blob
        var a = document.createElement('a');
        a.download = fileName;
        a.href = window.URL.createObjectURL(bb);
        a.click();
    };
        
    downloadImageFromCanvas(canvas, format) {
        var fileName = this.createName("png");
        
        if (!format) {
            format  = "image/png";
        }
        
        //var canvas = document.getElementById("myCanvas");
        var url = canvas.toDataURL(format);
        this.downloadFile(url, fileName);
    };
   
    downloadConfig(config) {
        var fileName = this.createName("json");
        var url = "data:application/json;utf8," + btoa(JSON.stringify(config, null, "\t"));
        this.downloadFile(url, fileName);
    };
    
    downloadSVGFromProject(project) {

        var fileName = this.createName("svg");
        
        //paper.project
        var url = "data:image/svg+xml;utf8," + btoa(project.exportSVG({asString: true}));
        this.downloadFile(url, fileName);
    };

}
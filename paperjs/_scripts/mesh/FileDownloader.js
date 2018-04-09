/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global atob, btoa, ArrayBuffer, Uint8Array, Blob */

/*

Info on video capture
https://developers.google.com/web/updates/2016/10/capture-stream

(may need to set some experimental flags in Chrome)

Supported Codecs in Chrome
https://zhirzh.github.io/2017/09/02/mediarecorder/

# audio codecs
audio/webm
audio/webm;codecs=opus

# video codecs
video/webm
video/webm;codecs=avc1

video/webm;codecs=h264
video/webm;codecs=h264,opus

video/webm;codecs=vp8
video/webm;codecs=vp8,opus

video/webm;codecs=vp9
video/webm;codecs=vp9,opus

video/webm;codecs=h264,vp9,opus
video/webm;codecs=vp8,vp9,opus

video/x-matroska
video/x-matroska;codecs=avc1

*/


class FileDownloader {

    constructor(prefix) {
        this.suffix = Date.now();
        this.prefix = prefix;
        this.download_count = 0;
    };


    //todo: can you export, restart?
    stopRecord() {
        this.recorder.stop();
    }

    startRecord(canvas, mimeString="video/webm;codecs=h264", fileExtension="webm", frameRate=60) {

        this.chunks = [];
        var o = this;

        let stream = canvas.captureStream(frameRate);

        //default to 5Mbps
        this.recorder = new MediaRecorder(stream, {mimeType:mimeString, videoBitsPerSecond:5000000});


        this.recorder.ondataavailable = function(event) {
            if(event.data.size) {
                o.chunks.push(event.data);
            }
        }

        this.recorder.start(10);

        this.fileExtension = fileExtension;
    }

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
    
    downloadDataUrlAsFile(url, fileName) {

        var bb = this.dataURItoBlob(url);
        this.downloadBlob(bb, fileName);
    };

    downloadBlob(blob, fileName) {
        window.URL = window.URL || window.webkitURL;
        
        //http://html5-demos.appspot.com/static/a.download.html
        //https://developer.mozilla.org/en-US/docs/Web/API/Blob
        var a = document.createElement('a');
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        a.click();
        a.remove();
    }
    
    downloadVideo() {
        if (this.chunks && this.chunks.length) {
            var fileName = this.createName(this.fileExtension);
            var blob = new Blob(this.chunks)
            this.downloadBlob(blob, fileName);
        }
    }

    downloadImageFromCanvas(canvas, format) {
        var fileName = this.createName("png");
        
        if (!format) {
            format  = "image/png";
        }
        
        //var canvas = document.getElementById("myCanvas");
        var url = canvas.toDataURL(format);
        this.downloadDataUrlAsFile(url, fileName);
    };
   
    downloadConfig(config) {
        var fileName = this.createName("json");
        var url = "data:application/json;utf8," + btoa(JSON.stringify(config, null, "\t"));
        this.downloadDataUrlAsFile(url, fileName);
    };
    
    downloadSVGFromProject(project) {

        var fileName = this.createName("svg");
        
        //paper.project
        var url = "data:image/svg+xml;utf8," + btoa(project.exportSVG({asString: true}));
        this.downloadDataUrlAsFile(url, fileName);
    };

}
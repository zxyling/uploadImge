function cropbox(options) {
     var el = options.imageBox;
     var obj = {
         state : {},
         ratio : 1,
         options : options,
         imageBox : el,
         thumbBox : el.querySelector(options.thumbBox),
         spinner : el.querySelector(options.spinner),
         image : new Image(),
         getDataURL() {
             let width = this.thumbBox.clientWidth,
                 height = this.thumbBox.clientHeight,
                 canvas = document.createElement("canvas"),
                 dim = el.style.backgroundPosition.split(' '),
                 size = el.style.backgroundSize.split(' '),
                 dx = parseInt(dim[0]) - el.clientWidth/2 + width/2,
                 dy = parseInt(dim[1]) - el.clientHeight/2 + height/2,
                 dw = parseInt(size[0]),
                 dh = parseInt(size[1]),
                 sh = parseInt(this.image.height),
                 sw = parseInt(this.image.width);

             canvas.width = width;
             canvas.height = height;
             var context = canvas.getContext("2d");
             context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
             var imageData = canvas.toDataURL('image/png');
             return imageData;
         },
         getBlob: function()
         {
             var imageData = this.getDataURL();
             var b64 = imageData.replace('data:image/png;base64,','');
             var binary = atob(b64);
             var array = [];
             for (var i = 0; i < binary.length; i++) {
                 array.push(binary.charCodeAt(i));
             }
             return  new Blob([new Uint8Array(array)], {type: 'image/png'});
         },
         zoomIn: function ()
         {
             this.ratio*=1.1;
             setBackground();
         },
         zoomOut: function ()
         {
             this.ratio*=0.9;
             setBackground();
         }

     },
     setBackground = function(){
        var w =  parseInt(obj.image.width)*obj.ratio;
        var h =  parseInt(obj.image.height)*obj.ratio;

        var pw = (el.clientWidth - w) / 2;
        var ph = (el.clientHeight - h) / 2;
        el.style.backgroundImage = `url(${obj.image.src})`;
        el.style.backgroundSize = `${w}px ${h}px`;
        el.style.backgroundPosition = `${pw}px ${ph}px`;
        el.style.backgroundRepeat = `no-repeat`;
    }
     imgMouseDown = function(e){
         e.stopImmediatePropagation();

         obj.state.dragable = true;
         obj.state.mouseX = e.clientX;
         obj.state.mouseY = e.clientY;
     },
     imgMouseMove = function(e){
         e.stopImmediatePropagation();

         if (obj.state.dragable)
         {
             var x = e.clientX - obj.state.mouseX;
             var y = e.clientY - obj.state.mouseY;

             var bg = el.style.backgroundPosition.split(' ');

             var bgX = x + parseInt(bg[0]);
             var bgY = y + parseInt(bg[1]);

             el.style.backgroundPosition =  bgX +'px ' + bgY + 'px';

             obj.state.mouseX = e.clientX;
             obj.state.mouseY = e.clientY;
         }
     },
     imgMouseUp = function(e){
         e.stopImmediatePropagation();
         obj.state.dragable = false;
     },
     zoomImage = function(e){
         e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? obj.ratio*=1.1 : obj.ratio*=0.9;
         setBackground();
     }

     obj.spinner.style.display = 'block';
     obj.image.onload = function() {
         obj.spinner.style.display = 'none';
         setBackground();

         el.addEventListener('mousedown', imgMouseDown);
         el.addEventListener('mousemove', imgMouseMove);
         window.addEventListener('mouseup', imgMouseUp);
         el.addEventListener('mousewheel DOMMouseScroll', zoomImage);
     };
     obj.image.src = options.imgSrc;
     console.log(obj.image);
     el.addEventListener('remove', function(){window.removeEventListener('mouseup', imgMouseUp)});

     return obj;
}

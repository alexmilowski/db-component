var componentDocument = document._currentScript ? document._currentScript.ownerDocument : document.currentScript.ownerDocument;

var magicFigure = Object.create(HTMLElement.prototype, {
   createdCallback: {
      value: function() {
         var t = componentDocument.getElementById("magic-figure");
         var root = this.createShadowRoot();
         var clone = document.importNode(t.content, true);
         root.appendChild(clone);

         var images = this.getElementsByTagName("magic-image");

         for (var i=0; i<images.length; i++) {
            var img = root.ownerDocument.createElement("img");
            img.src = images[i].getAttribute("href");
            root.appendChild(img);
         }
      }
   }
});
document.registerElement("magic-figure", {prototype: magicFigure});
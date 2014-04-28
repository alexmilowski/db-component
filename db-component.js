(function() {
/* TODO: this should be in the import */
var mathJax = document.createElement("script");
mathJax.setAttribute("src","http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_HTMLorMML");
mathJax.setAttribute("type","text/javascript");
document.head.appendChild(mathJax);

var componentDocument = document.currentScript.ownerDocument;
function makeCreator(templateId) {
   return function() {
      var t = componentDocument.getElementById(templateId);
      if (t) {
         var clone = document.importNode(t.content, true);
         this.createShadowRoot().appendChild(clone);
      }
   }
}
function makePrototype(prototype,id) {
   return Object.create(prototype, { createdCallback: { value: makeCreator(id) } })
}

document.registerElement("db-code", {prototype: makePrototype(HTMLSpanElement.prototype,"db-code") });
document.registerElement("db-para",{prototype: Object.create(HTMLParagraphElement.prototype)});
document.registerElement("db-orderedlist",{prototype: Object.create(HTMLOListElement.prototype)});
document.registerElement("db-itemizedlist",{prototype: makePrototype(HTMLSpanElement.prototype,"db-itemizedlist")});
document.registerElement("db-listitem",{prototype: makePrototype(HTMLSpanElement.prototype,"db-listitem")});
document.registerElement("db-figure",{prototype: makePrototype(HTMLSpanElement.prototype,"db-figure")});

function levelCount(target,level) {
   var count = 0;
   var context = target;
   while (context && context.localName==target.localName) {
      count++;
      context = context.previousElementSibling;
   }
   return count;
   
}

function divisionCount(target) {
   var numbers = [];
   var currentTop = target;
   while (currentTop && currentTop.localName!="db-article" && currentTop.localName.indexOf("db-")==0) {
      count = levelCount(currentTop);
      numbers.unshift(count);
      currentTop = currentTop.parentNode;
   }
   return numbers;
   
}

function figureNumber(target) {
   var figureNumber = levelCount(target);
   var numbers = divisionCount(target.parentNode)
   return numbers[0]+"."+figureNumber;
}

var dbTitle = Object.create(HTMLHeadingElement.prototype, {
   createdCallback: {
      value: function() {
         var t = componentDocument.getElementById("db-title");
         var clone = document.importNode(t.content, true);
         this.createShadowRoot().appendChild(clone);
         if (this.parentNode.localName=="db-section") {
            var numbers = divisionCount(this.parentNode)
            var numberSpan = this.shadowRoot.querySelector(".number");
            numberSpan.innerHTML = numbers.join(".")+". ";
            //this.shadowRoot.getElementsByTagName("p")[0].setAttribute("id","S-"+numbers.join("."));
         }
         if (this.parentNode.localName=="db-figure") {
            var numberSpan = this.shadowRoot.querySelector(".number");
            var figNumber = figureNumber(this.parentNode);
            numberSpan.innerHTML = "Figure "+figNumber+" ";
            //this.shadowRoot.getElementsByTagName("p")[0].setAttribute("id","F-"+figNumber);
         }
      }
   }
});
document.registerElement("db-title", {prototype: dbTitle});

var dbMediaObject = Object.create(HTMLElement.prototype, {
   createdCallback: {
      value: function() {
         var t = componentDocument.getElementById("db-mediaobject");
         var root = this.createShadowRoot();
         var clone = document.importNode(t.content, true);
         root.appendChild(clone);
         var images = this.getElementsByTagName("db-imagedata");
         for (var i=0; i<images.length; i++) {
            var img = document.createElement("img");
            img.src = images[i].getAttribute("fileref");
            root.appendChild(img);
         }
      }
   }
});
document.registerElement("db-mediaobject", {prototype: dbMediaObject});

var dbXRefObject = Object.create(HTMLSpanElement.prototype, {
   createdCallback: {
      value: function() {
         var root = this.createShadowRoot();
         var targetId = this.getAttribute("linkend");
         var target = this.ownerDocument.getElementById(targetId);
         if (!target) {
            root.appendChild(document.createTextNode("[#"+targetId+"]"));
            return;
         }
         if (target.localName=="db-figure") {
            var link = document.createElement("a");
            var titles = target.getElementsByTagName("db-title");
            link.href = "#"+targetId;
            link.appendChild(document.createTextNode("Figure "+figureNumber(target)+(titles.length>0 ? ", "+titles[0].textContent : "")));
            root.appendChild(link);
            return;
         }
         root.appendChild(document.createTextNode("[#"+targetId+" unsupported ref "+target.localName+"]"));
      }
   }
});
document.registerElement("db-xref", {prototype: dbXRefObject});

var dbProgramListingObject = Object.create(HTMLPreElement.prototype, {
   createdCallback: {
      value: function() {
         hljs.highlightBlock(this);
      }
   }
});
document.registerElement("db-programlisting",{prototype: dbProgramListingObject});

var dbArticle = Object.create(HTMLDivElement.prototype, {
   createdCallback: {
      value: function() {
         var t = componentDocument.getElementById("db-article");
         var root = this.createShadowRoot();
         var clone = document.importNode(t.content, true);
         root.appendChild(clone);
         this.update();
      }
   },
   toc: {
      configurable: false,
      get: function() {
         return this.shadowRoot.getElementById("toc");
      }
   },
   listOfFigures: {
      enumerable: true,
      get: function() {
         return this.shadowRoot.getElementById("list-of-figures");
      }
   }
});
dbArticle.update = function() {
   var titleSpan = this.shadowRoot.getElementById("title");
   var toc = this.shadowRoot.getElementById("toc");
   toc.innerHTML = "";
   var lof = this.shadowRoot.getElementById("list-of-figures");
   lof.innerHTML = "";
   var titles = this.getElementsByTagName("db-title");
   var tocValues = [];
   var lofValues = [];
   
   var blank = this.ownerDocument.createElement("option");
   blank.appendChild(this.ownerDocument.createTextNode("— Table of Contents —"));
   blank.setAttribute("value","");
   toc.appendChild(blank);
   blank = this.ownerDocument.createElement("option");
   blank.appendChild(this.ownerDocument.createTextNode("— List of Figures —"));
   blank.setAttribute("value","");
   lof.appendChild(blank);

   for (var i=0; i<titles.length; i++) {
      if (titles[i].parentNode.localName=="db-section") {
         var numbers = divisionCount(titles[i].parentNode)
         var text = numbers.join(".")+". "+titles[i].textContent;
         var option = this.ownerDocument.createElement("option");
         option.appendChild(this.ownerDocument.createTextNode(text));
         option.setAttribute("value",tocValues.length.toString());
         toc.appendChild(option);
         tocValues.push(titles[i]);
      } else if (titles[i].parentNode.localName=="db-figure") {
         var figNumber = figureNumber(titles[i].parentNode)
         var text = figNumber+". "+titles[i].textContent;
         var option = this.ownerDocument.createElement("option");
         option.appendChild(this.ownerDocument.createTextNode(text));
         option.setAttribute("value",lofValues.length.toString());
         lof.appendChild(option);
         lofValues.push(titles[i]);
      } else if (titles[i].parentNode.localName=="db-article") {
         titleSpan.innerHTML = titles[i].textContent;
      }
   }
   toc.onchange = function() {
      if (this.value=="") {
         return;
      }
      var index = Number.parseInt(this.value);
      tocValues[index].scrollIntoView();
      tocValues[index].ownerDocument.defaultView.scrollBy(0,-Number.parseInt(getComputedStyle(tocValues[index]).fontSize));
      tocUsed = false;
   }
   lof.onchange = function() {
      if (this.value=="") {
         return;
      }
      var index = Number.parseInt(this.value);
      lofValues[index].scrollIntoView();
   }
   lof.onclick = lof.onchange;
}

document.registerElement("db-article", {prototype: dbArticle });


})();



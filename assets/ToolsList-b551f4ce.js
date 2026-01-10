import{aw as V,b9 as U,ba as $,o as A,c as E,b as f,aB as w,aC as C,aE as W,aD as j}from"./index-23ba4857.js";function G(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])}return e}function T(e,t){return Array(t+1).join(e)}function O(e){return e.replace(/^\n*/,"")}function S(e){for(var t=e.length;t>0&&e[t-1]===`
`;)t--;return e.substring(0,t)}function D(e){return S(O(e))}var X=["ADDRESS","ARTICLE","ASIDE","AUDIO","BLOCKQUOTE","BODY","CANVAS","CENTER","DD","DIR","DIV","DL","DT","FIELDSET","FIGCAPTION","FIGURE","FOOTER","FORM","FRAMESET","H1","H2","H3","H4","H5","H6","HEADER","HGROUP","HR","HTML","ISINDEX","LI","MAIN","MENU","NAV","NOFRAMES","NOSCRIPT","OL","OUTPUT","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"];function y(e){return N(e,X)}var B=["AREA","BASE","BR","COL","COMMAND","EMBED","HR","IMG","INPUT","KEYGEN","LINK","META","PARAM","SOURCE","TRACK","WBR"];function L(e){return N(e,B)}function K(e){return I(e,B)}var x=["A","TABLE","THEAD","TBODY","TFOOT","TH","TD","IFRAME","SCRIPT","AUDIO","VIDEO"];function Y(e){return N(e,x)}function z(e){return I(e,x)}function N(e,t){return t.indexOf(e.nodeName)>=0}function I(e,t){return e.getElementsByTagName&&t.some(function(r){return e.getElementsByTagName(r).length})}var o={};o.paragraph={filter:"p",replacement:function(e){return`

`+e+`

`}};o.lineBreak={filter:"br",replacement:function(e,t,r){return r.br+`
`}};o.heading={filter:["h1","h2","h3","h4","h5","h6"],replacement:function(e,t,r){var n=Number(t.nodeName.charAt(1));if(r.headingStyle==="setext"&&n<3){var i=T(n===1?"=":"-",e.length);return`

`+e+`
`+i+`

`}else return`

`+T("#",n)+" "+e+`

`}};o.blockquote={filter:"blockquote",replacement:function(e){return e=D(e).replace(/^/gm,"> "),`

`+e+`

`}};o.list={filter:["ul","ol"],replacement:function(e,t){var r=t.parentNode;return r.nodeName==="LI"&&r.lastElementChild===t?`
`+e:`

`+e+`

`}};o.listItem={filter:"li",replacement:function(e,t,r){var n=r.bulletListMarker+"   ",i=t.parentNode;if(i.nodeName==="OL"){var a=i.getAttribute("start"),s=Array.prototype.indexOf.call(i.children,t);n=(a?Number(a)+s:s+1)+".  "}var u=/\n$/.test(e);return e=D(e)+(u?`
`:""),e=e.replace(/\n/gm,`
`+" ".repeat(n.length)),n+e+(t.nextSibling?`
`:"")}};o.indentedCodeBlock={filter:function(e,t){return t.codeBlockStyle==="indented"&&e.nodeName==="PRE"&&e.firstChild&&e.firstChild.nodeName==="CODE"},replacement:function(e,t,r){return`

    `+t.firstChild.textContent.replace(/\n/g,`
    `)+`

`}};o.fencedCodeBlock={filter:function(e,t){return t.codeBlockStyle==="fenced"&&e.nodeName==="PRE"&&e.firstChild&&e.firstChild.nodeName==="CODE"},replacement:function(e,t,r){for(var n=t.firstChild.getAttribute("class")||"",i=(n.match(/language-(\S+)/)||[null,""])[1],a=t.firstChild.textContent,s=r.fence.charAt(0),u=3,l=new RegExp("^"+s+"{3,}","gm"),c;c=l.exec(a);)c[0].length>=u&&(u=c[0].length+1);var d=T(s,u);return`

`+d+i+`
`+a.replace(/\n$/,"")+`
`+d+`

`}};o.horizontalRule={filter:"hr",replacement:function(e,t,r){return`

`+r.hr+`

`}};o.inlineLink={filter:function(e,t){return t.linkStyle==="inlined"&&e.nodeName==="A"&&e.getAttribute("href")},replacement:function(e,t){var r=t.getAttribute("href");r&&(r=r.replace(/([()])/g,"\\$1"));var n=h(t.getAttribute("title"));return n&&(n=' "'+n.replace(/"/g,'\\"')+'"'),"["+e+"]("+r+n+")"}};o.referenceLink={filter:function(e,t){return t.linkStyle==="referenced"&&e.nodeName==="A"&&e.getAttribute("href")},replacement:function(e,t,r){var n=t.getAttribute("href"),i=h(t.getAttribute("title"));i&&(i=' "'+i+'"');var a,s;switch(r.linkReferenceStyle){case"collapsed":a="["+e+"][]",s="["+e+"]: "+n+i;break;case"shortcut":a="["+e+"]",s="["+e+"]: "+n+i;break;default:var u=this.references.length+1;a="["+e+"]["+u+"]",s="["+u+"]: "+n+i}return this.references.push(s),a},references:[],append:function(e){var t="";return this.references.length&&(t=`

`+this.references.join(`
`)+`

`,this.references=[]),t}};o.emphasis={filter:["em","i"],replacement:function(e,t,r){return e.trim()?r.emDelimiter+e+r.emDelimiter:""}};o.strong={filter:["strong","b"],replacement:function(e,t,r){return e.trim()?r.strongDelimiter+e+r.strongDelimiter:""}};o.code={filter:function(e){var t=e.previousSibling||e.nextSibling,r=e.parentNode.nodeName==="PRE"&&!t;return e.nodeName==="CODE"&&!r},replacement:function(e){if(!e)return"";e=e.replace(/\r?\n|\r/g," ");for(var t=/^`|^ .*?[^ ].* $|`$/.test(e)?" ":"",r="`",n=e.match(/`+/gm)||[];n.indexOf(r)!==-1;)r=r+"`";return r+t+e+t+r}};o.image={filter:"img",replacement:function(e,t){var r=h(t.getAttribute("alt")),n=t.getAttribute("src")||"",i=h(t.getAttribute("title")),a=i?' "'+i+'"':"";return n?"!["+r+"]("+n+a+")":""}};function h(e){return e?e.replace(/(\n+\s*)+/g,`
`):""}function P(e){this.options=e,this._keep=[],this._remove=[],this.blankRule={replacement:e.blankReplacement},this.keepReplacement=e.keepReplacement,this.defaultRule={replacement:e.defaultReplacement},this.array=[];for(var t in e.rules)this.array.push(e.rules[t])}P.prototype={add:function(e,t){this.array.unshift(t)},keep:function(e){this._keep.unshift({filter:e,replacement:this.keepReplacement})},remove:function(e){this._remove.unshift({filter:e,replacement:function(){return""}})},forNode:function(e){if(e.isBlank)return this.blankRule;var t;return(t=p(this.array,e,this.options))||(t=p(this._keep,e,this.options))||(t=p(this._remove,e,this.options))?t:this.defaultRule},forEach:function(e){for(var t=0;t<this.array.length;t++)e(this.array[t],t)}};function p(e,t,r){for(var n=0;n<e.length;n++){var i=e[n];if(q(i,t,r))return i}}function q(e,t,r){var n=e.filter;if(typeof n=="string"){if(n===t.nodeName.toLowerCase())return!0}else if(Array.isArray(n)){if(n.indexOf(t.nodeName.toLowerCase())>-1)return!0}else if(typeof n=="function"){if(n.call(e,t,r))return!0}else throw new TypeError("`filter` needs to be a string, array, or function")}function Q(e){var t=e.element,r=e.isBlock,n=e.isVoid,i=e.isPre||function(F){return F.nodeName==="PRE"};if(!(!t.firstChild||i(t))){for(var a=null,s=!1,u=null,l=R(u,t,i);l!==t;){if(l.nodeType===3||l.nodeType===4){var c=l.data.replace(/[ \r\n\t]+/g," ");if((!a||/ $/.test(a.data))&&!s&&c[0]===" "&&(c=c.substr(1)),!c){l=g(l);continue}l.data=c,a=l}else if(l.nodeType===1)r(l)||l.nodeName==="BR"?(a&&(a.data=a.data.replace(/ $/,"")),a=null,s=!1):n(l)||i(l)?(a=null,s=!0):a&&(s=!1);else{l=g(l);continue}var d=R(u,l,i);u=l,l=d}a&&(a.data=a.data.replace(/ $/,""),a.data||g(a))}}function g(e){var t=e.nextSibling||e.parentNode;return e.parentNode.removeChild(e),t}function R(e,t,r){return e&&e.parentNode===t||r(t)?t.nextSibling||t.parentNode:t.firstChild||t.nextSibling||t.parentNode}var k=typeof window<"u"?window:{};function J(){var e=k.DOMParser,t=!1;try{new e().parseFromString("","text/html")&&(t=!0)}catch{}return t}function Z(){var e=function(){};return ee()?e.prototype.parseFromString=function(t){var r=new window.ActiveXObject("htmlfile");return r.designMode="on",r.open(),r.write(t),r.close(),r}:e.prototype.parseFromString=function(t){var r=document.implementation.createHTMLDocument("");return r.open(),r.write(t),r.close(),r},e}function ee(){var e=!1;try{document.implementation.createHTMLDocument("").open()}catch{k.ActiveXObject&&(e=!0)}return e}var te=J()?k.DOMParser:Z();function re(e,t){var r;if(typeof e=="string"){var n=ne().parseFromString('<x-turndown id="turndown-root">'+e+"</x-turndown>","text/html");r=n.getElementById("turndown-root")}else r=e.cloneNode(!0);return Q({element:r,isBlock:y,isVoid:L,isPre:t.preformattedCode?ie:null}),r}var v;function ne(){return v=v||new te,v}function ie(e){return e.nodeName==="PRE"||e.nodeName==="CODE"}function ae(e,t){return e.isBlock=y(e),e.isCode=e.nodeName==="CODE"||e.parentNode.isCode,e.isBlank=le(e),e.flankingWhitespace=se(e,t),e}function le(e){return!L(e)&&!Y(e)&&/^\s*$/i.test(e.textContent)&&!K(e)&&!z(e)}function se(e,t){if(e.isBlock||t.preformattedCode&&e.isCode)return{leading:"",trailing:""};var r=oe(e.textContent);return r.leadingAscii&&b("left",e,t)&&(r.leading=r.leadingNonAscii),r.trailingAscii&&b("right",e,t)&&(r.trailing=r.trailingNonAscii),{leading:r.leading,trailing:r.trailing}}function oe(e){var t=e.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);return{leading:t[1],leadingAscii:t[2],leadingNonAscii:t[3],trailing:t[4],trailingNonAscii:t[5],trailingAscii:t[6]}}function b(e,t,r){var n,i,a;return e==="left"?(n=t.previousSibling,i=/ $/):(n=t.nextSibling,i=/^ /),n&&(n.nodeType===3?a=i.test(n.nodeValue):r.preformattedCode&&n.nodeName==="CODE"?a=!1:n.nodeType===1&&!y(n)&&(a=i.test(n.textContent))),a}var ue=Array.prototype.reduce,ce=[[/\\/g,"\\\\"],[/\*/g,"\\*"],[/^-/g,"\\-"],[/^\+ /g,"\\+ "],[/^(=+)/g,"\\$1"],[/^(#{1,6}) /g,"\\$1 "],[/`/g,"\\`"],[/^~~~/g,"\\~~~"],[/\[/g,"\\["],[/\]/g,"\\]"],[/^>/g,"\\>"],[/_/g,"\\_"],[/^(\d+)\. /g,"$1\\. "]];function m(e){if(!(this instanceof m))return new m(e);var t={rules:o,headingStyle:"setext",hr:"* * *",bulletListMarker:"*",codeBlockStyle:"indented",fence:"```",emDelimiter:"_",strongDelimiter:"**",linkStyle:"inlined",linkReferenceStyle:"full",br:"  ",preformattedCode:!1,blankReplacement:function(r,n){return n.isBlock?`

`:""},keepReplacement:function(r,n){return n.isBlock?`

`+n.outerHTML+`

`:n.outerHTML},defaultReplacement:function(r,n){return n.isBlock?`

`+r+`

`:r}};this.options=G({},t,e),this.rules=new P(this.options)}m.prototype={turndown:function(e){if(!he(e))throw new TypeError(e+" is not a string, or an element/document/fragment node.");if(e==="")return"";var t=H.call(this,new re(e,this.options));return fe.call(this,t)},use:function(e){if(Array.isArray(e))for(var t=0;t<e.length;t++)this.use(e[t]);else if(typeof e=="function")e(this);else throw new TypeError("plugin must be a Function or an Array of Functions");return this},addRule:function(e,t){return this.rules.add(e,t),this},keep:function(e){return this.rules.keep(e),this},remove:function(e){return this.rules.remove(e),this},escape:function(e){return ce.reduce(function(t,r){return t.replace(r[0],r[1])},e)}};function H(e){var t=this;return ue.call(e.childNodes,function(r,n){n=new ae(n,t.options);var i="";return n.nodeType===3?i=n.isCode?n.nodeValue:t.escape(n.nodeValue):n.nodeType===1&&(i=de.call(t,n)),_(r,i)},"")}function fe(e){var t=this;return this.rules.forEach(function(r){typeof r.append=="function"&&(e=_(e,r.append(t.options)))}),e.replace(/^[\t\r\n]+/,"").replace(/[\t\r\n\s]+$/,"")}function de(e){var t=this.rules.forNode(e),r=H.call(this,e),n=e.flankingWhitespace;return(n.leading||n.trailing)&&(r=r.trim()),n.leading+t.replacement(r,e,this.options)+n.trailing}function _(e,t){var r=S(e),n=O(t),i=Math.max(e.length-r.length,t.length-n.length),a=`

`.substring(0,i);return r+a+n}function he(e){return e!=null&&(typeof e=="string"||e.nodeType&&(e.nodeType===1||e.nodeType===9||e.nodeType===11))}let M=null;const me={name:"SimpleTools",data(){return{htmlInput:"",htmlToMdOutput:"",md:""}},computed:{renderedMd(){const e=U.parse(this.md||"");return $.sanitize(e)}},watch:{htmlInput(e){if(clearTimeout(M),!e.trim()){this.htmlToMdOutput="",this.md="";return}M=setTimeout(()=>{this.convertHtmlToMd()},300)}},methods:{convertHtmlToMd(){try{const e=new m({headingStyle:"atx",codeBlockStyle:"fenced",emDelimiter:"*"});e.remove(["script","style"]);const t=e.turndown(this.htmlInput);this.htmlToMdOutput=t,this.md=t}catch{this.htmlToMdOutput="HTML 转换失败"}}}},pe={class:"tools"},ge={class:"tool"},ve={key:0},Te={class:"tool"},ye=["innerHTML"];function Ne(e,t,r,n,i,a){return A(),E("div",pe,[f("section",ge,[t[2]||(t[2]=f("h2",null,"HTML 转 Markdown",-1)),w(f("textarea",{"onUpdate:modelValue":t[0]||(t[0]=s=>i.htmlInput=s),rows:"6",placeholder:"粘贴 HTML，这里会自动转换为 Markdown"},"      ",512),[[C,i.htmlInput]]),i.htmlToMdOutput?(A(),E("pre",ve,W(i.htmlToMdOutput),1)):j("",!0)]),f("section",Te,[t[3]||(t[3]=f("h2",null,"Markdown 预览",-1)),w(f("textarea",{"onUpdate:modelValue":t[1]||(t[1]=s=>i.md=s),rows:"6",placeholder:"# Hello Markdown"},"      ",512),[[C,i.md]]),f("div",{class:"preview",innerHTML:a.renderedMd},null,8,ye)])])}const Ae=V(me,[["render",Ne],["__scopeId","data-v-af703861"]]);export{Ae as default};

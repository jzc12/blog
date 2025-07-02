import{p as y}from"./chunk-44GW5IO5-c42fce51.js";import{L as B,s as S,g as z,t as F,u as P,f as E,h as W,_ as l,p as m,M as w,N as T,A,Q as D,q as _}from"./index-912f735d.js";import{p as N}from"./mermaid-parser.core-4c5d2314.js";import"./_baseUniq-386e3fe6.js";import"./_basePickBy-9ab79579.js";import"./clone-372ce987.js";var x={packet:[]},v=structuredClone(x),L=B.packet,M=l(()=>{const t=w({...L,...T().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),Y=l(()=>v.packet,"getPacket"),I=l(t=>{t.length>0&&v.packet.push(t)},"pushWord"),O=l(()=>{A(),v=structuredClone(x)},"clear"),u={pushWord:I,getPacket:Y,getConfig:M,clear:O,setAccTitle:S,getAccTitle:z,setDiagramTitle:F,getDiagramTitle:P,getAccDescription:E,setAccDescription:W},q=1e4,G=l(t=>{y(t,u);let e=-1,o=[],s=1;const{bitsPerRow:n}=u.getConfig();for(let{start:a,end:r,bits:c,label:f}of t.blocks){if(a!==void 0&&r!==void 0&&r<a)throw new Error(`Packet block ${a} - ${r} is invalid. End must be greater than start.`);if(a??(a=e+1),a!==e+1)throw new Error(`Packet block ${a} - ${r??a} is not contiguous. It should start from ${e+1}.`);if(c===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(r??(r=a+(c??1)-1),c??(c=r-a+1),e=r,m.debug(`Packet block ${a} - ${e} with label ${f}`);o.length<=n+1&&u.getPacket().length<q;){const[d,p]=H({start:a,end:r,bits:c,label:f},s,n);if(o.push(d),d.end+1===s*n&&(u.pushWord(o),o=[],s++),!p)break;({start:a,end:r,bits:c,label:f}=p)}}u.pushWord(o)},"populate"),H=l((t,e,o)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*o)return[t,void 0];const s=e*o-1,n=e*o;return[{start:t.start,end:s,label:t.label,bits:s-t.start},{start:n,end:t.end,label:t.label,bits:t.end-n}]},"getNextFittingBlock"),K={parse:l(async t=>{const e=await N("packet",t);m.debug(e),G(e)},"parse")},Q=l((t,e,o,s)=>{const n=s.db,a=n.getConfig(),{rowHeight:r,paddingY:c,bitWidth:f,bitsPerRow:d}=a,p=n.getPacket(),i=n.getDiagramTitle(),k=r+c,g=k*(p.length+1)-(i?0:r),h=f*d+2,b=D(e);b.attr("viewbox",`0 0 ${h} ${g}`),_(b,g,h,a.useMaxWidth);for(const[C,$]of p.entries())R(b,$,C,a);b.append("text").text(i).attr("x",h/2).attr("y",g-k/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),R=l((t,e,o,{rowHeight:s,paddingX:n,paddingY:a,bitWidth:r,bitsPerRow:c,showBits:f})=>{const d=t.append("g"),p=o*(s+a)+a;for(const i of e){const k=i.start%c*r+1,g=(i.end-i.start+1)*r-n;if(d.append("rect").attr("x",k).attr("y",p).attr("width",g).attr("height",s).attr("class","packetBlock"),d.append("text").attr("x",k+g/2).attr("y",p+s/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(i.label),!f)continue;const h=i.end===i.start,b=p-2;d.append("text").attr("x",k+(h?g/2:0)).attr("y",b).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",h?"middle":"start").text(i.start),h||d.append("text").attr("x",k+g).attr("y",b).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(i.end)}},"drawWord"),U={draw:Q},X={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},j=l(({packet:t}={})=>{const e=w(X,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),rt={parser:K,db:u,renderer:U,styles:j};export{rt as diagram};

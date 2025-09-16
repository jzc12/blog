import{p as y}from"./chunk-44GW5IO5-1de6941f.js";import{F as B,s as S,g as F,q as z,r as P,d as E,e as W,_ as l,m,G as w,H as T,y as D,O as _,n as A}from"./index-59a2655c.js";import{p as N}from"./mermaid-parser.core-1a069554.js";import"./_baseUniq-99246fe7.js";import"./_basePickBy-954b2e8c.js";import"./clone-ec6cc2ad.js";var x={packet:[]},v=structuredClone(x),L=B.packet,O=l(()=>{const t=w({...L,...T().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),Y=l(()=>v.packet,"getPacket"),G=l(t=>{t.length>0&&v.packet.push(t)},"pushWord"),H=l(()=>{D(),v=structuredClone(x)},"clear"),u={pushWord:G,getPacket:Y,getConfig:O,clear:H,setAccTitle:S,getAccTitle:F,setDiagramTitle:z,getDiagramTitle:P,getAccDescription:E,setAccDescription:W},I=1e4,M=l(t=>{y(t,u);let e=-1,o=[],n=1;const{bitsPerRow:s}=u.getConfig();for(let{start:a,end:r,bits:c,label:f}of t.blocks){if(a!==void 0&&r!==void 0&&r<a)throw new Error(`Packet block ${a} - ${r} is invalid. End must be greater than start.`);if(a??(a=e+1),a!==e+1)throw new Error(`Packet block ${a} - ${r??a} is not contiguous. It should start from ${e+1}.`);if(c===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(r??(r=a+(c??1)-1),c??(c=r-a+1),e=r,m.debug(`Packet block ${a} - ${e} with label ${f}`);o.length<=s+1&&u.getPacket().length<I;){const[d,p]=q({start:a,end:r,bits:c,label:f},n,s);if(o.push(d),d.end+1===n*s&&(u.pushWord(o),o=[],n++),!p)break;({start:a,end:r,bits:c,label:f}=p)}}u.pushWord(o)},"populate"),q=l((t,e,o)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*o)return[t,void 0];const n=e*o-1,s=e*o;return[{start:t.start,end:n,label:t.label,bits:n-t.start},{start:s,end:t.end,label:t.label,bits:t.end-s}]},"getNextFittingBlock"),K={parse:l(async t=>{const e=await N("packet",t);m.debug(e),M(e)},"parse")},R=l((t,e,o,n)=>{const s=n.db,a=s.getConfig(),{rowHeight:r,paddingY:c,bitWidth:f,bitsPerRow:d}=a,p=s.getPacket(),i=s.getDiagramTitle(),k=r+c,g=k*(p.length+1)-(i?0:r),b=f*d+2,h=_(e);h.attr("viewbox",`0 0 ${b} ${g}`),A(h,g,b,a.useMaxWidth);for(const[C,$]of p.entries())U(h,$,C,a);h.append("text").text(i).attr("x",b/2).attr("y",g-k/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),U=l((t,e,o,{rowHeight:n,paddingX:s,paddingY:a,bitWidth:r,bitsPerRow:c,showBits:f})=>{const d=t.append("g"),p=o*(n+a)+a;for(const i of e){const k=i.start%c*r+1,g=(i.end-i.start+1)*r-s;if(d.append("rect").attr("x",k).attr("y",p).attr("width",g).attr("height",n).attr("class","packetBlock"),d.append("text").attr("x",k+g/2).attr("y",p+n/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(i.label),!f)continue;const b=i.end===i.start,h=p-2;d.append("text").attr("x",k+(b?g/2:0)).attr("y",h).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",b?"middle":"start").text(i.start),b||d.append("text").attr("x",k+g).attr("y",h).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(i.end)}},"drawWord"),X={draw:R},j={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},J=l(({packet:t}={})=>{const e=w(j,t);return`
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
	`},"styles"),rt={parser:K,db:u,renderer:X,styles:J};export{rt as diagram};

(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();let A=null,H=null,N=null,At="pct",jt=[],zt=1e5,Ht=1;function K(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function te(t,e){const n=t.length;if(n<10)return[];const o=(n-1)/2,s=t.reduce((d,u)=>d+u,0)/n;let a=0,r=0;for(let d=0;d<n;d++)a+=(d-o)*(t[d]-s),r+=(d-o)*(d-o);const i=r!==0?a/r:0,l=t[n-1],c=[];for(let d=1;d<=e;d++){const u=(Math.random()-.5)*Math.abs(i)*d*.5;c.push(K(l+i*d+u,2))}return c}function ee(t,e){const n=new Date,o=[],s=t-e;for(let a=0;a<s;a++){const r=new Date(n);r.setDate(r.getDate()-(s-a)),a===0||a===s-1||a%Math.max(1,Math.floor(s/6))===0?o.push(r.getMonth()+1+"/"+r.getDate()):o.push("")}for(let a=0;a<e;a++){const r=new Date(n);r.setDate(r.getDate()+a+1),a===0||a===e-1||a%Math.max(1,Math.floor(e/2))===0?o.push("🔮"+(r.getMonth()+1)+"/"+r.getDate()):o.push("")}return o}function ne(t,e,n,o){const s=document.getElementById(t);s&&(jt=e,zt=n||1e5,Ht=o||1,A&&A.dispose(),A=echarts.init(s),Ot())}function Ot(){const t=jt,e=zt,n=Ht,o=At==="value",s="#4fc3f7",a=["#69f0ae","#f0c060","#b388ff","#ff80ab","#18ffff","#ffab40","#ff5252"],r=[];let i=0,l=0;const c=t.find(g=>g.isUser);c&&(l=c.chartData.length),t.forEach((g,k)=>{g.chartData.length>i&&(i=g.chartData.length)});let d=[],u=-1;if(c){const g=c.chartData;for(let k=0;k<g.length;k++)if((g[k]-100)*n<=-100){u=k;break}if(u<0){const k=te(c.chartData,Math.max(1,Math.floor(i*.05)));k.length>0&&(d=k,i=Math.max(i,l+d.length))}}let m=[];const v=t.find(g=>g.isUser&&g.dateLabels);if(v&&v.dateLabels)m=[...v.dateLabels];else{const g=Math.max(0,i-l);m=ee(i,g)}if(d.length>0&&m.length>0){const g=m[m.length-1],[k,R]=g.split("/").map(Number);for(let $=1;$<=d.length;$++){const x=new Date(2026,k-1,R);x.setDate(x.getDate()+$);const y=$===1||$===d.length||$%Math.max(1,Math.floor(d.length/3))===0?"🔮"+(x.getMonth()+1)+"/"+x.getDate():"";m.push(y)}}t.forEach((g,k)=>{const R=g.isUser,$=g.isBenchmark,x=g.chartData,y=R?s:a[(k-1)%a.length];let b=[],S=-1;if(o)for(let I=0;I<x.length;I++){if((x[I]-100)*n<=-100){S=I,b.push(0);break}b.push(K(e*n*x[I]/100,0))}else for(let I=0;I<x.length;I++){const F=K((x[I]-100)*n,1);if(F<=-100){S=I,b.push(-100);break}b.push(F)}for(;b.length<i;)b.push(null);let C=[...b];if(R&&d.length>0&&!o)for(let I=0;I<d.length;I++){const F=K((d[I]-100)*n,1);l+I<C.length?C[l+I]=F:C.push(F)}else if(R&&d.length>0&&o)for(let I=0;I<d.length;I++){const F=K(e*n*d[I]/100,0);l+I<C.length?C[l+I]=F:C.push(F)}if(R&&d.length>0&&S<0){const I=C.slice(0,l),F=new Array(l-1).fill(null),ct=I[I.length-1];F.push(ct);for(let U=0;U<d.length;U++){const dt=o?K(e*n*d[U]/100,0):K((d[U]-100)*n,1);F.push(dt)}r.push({name:g.label,type:"line",data:I,smooth:!0,symbol:"none",lineStyle:{width:4,type:"solid",color:y},itemStyle:{color:y},emphasis:{focus:"series",lineStyle:{width:6}},z:10,endLabel:{show:!0,formatter:g.label,color:y,fontSize:11,offset:[10,0]}}),r.push({name:"预测走势",type:"line",data:F,smooth:!0,symbol:"none",lineStyle:{width:3,type:"dashed",color:y,opacity:.7},itemStyle:{color:y},z:9,silent:!0})}else r.push({name:g.label,type:"line",data:C,smooth:!0,symbol:"none",lineStyle:{width:R?4:$?1.5:2,type:"solid",color:y,opacity:$?.5:1},itemStyle:{color:y},emphasis:{focus:"series",lineStyle:{width:R?6:3}},z:R?10:1,endLabel:R?{show:!0,formatter:g.label,color:y,fontSize:11,offset:[10,0]}:void 0,...S>=0?{markPoint:{data:[{name:"💥",coord:[S,o?0:-100],symbol:"pin",symbolSize:35,itemStyle:{color:"#ff5252"},label:{show:!0,formatter:"💥爆仓",fontSize:14,color:"#ff5252",fontWeight:"bold",offset:[0,-15]}}],animation:!1}}:{}})});const h=o?"总价值（元）":"收益率（%）";let L=1/0,w=-1/0;r.forEach(g=>{g.data&&g.data.forEach(k=>{k!==null&&!isNaN(k)&&(L=Math.min(L,k),w=Math.max(w,k))})});const B=w-L;L=L-B*.1,w=w+B*.1;const E={backgroundColor:"transparent",tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb",fontSize:12},formatter:function(g){const k=g.filter(y=>y.value!==null&&y.value!==void 0&&!y.seriesName.includes("预测"));if(k.length===0)return"";let $='<div style="font-weight:bold;margin-bottom:4px;">'+g[0].axisValue.replace("🔮","预测 ")+"</div>";const x=[...k].sort((y,b)=>(b.value||0)-(y.value||0));for(const y of x){const b=t.find(I=>I.label===y.seriesName&&I.isUser),S=b?"⭐ ":"",C=o?"¥"+Number(y.value).toLocaleString():(y.value>=0?"+":"")+y.value.toFixed(1)+"%";$+='<div style="display:flex;align-items:center;gap:6px;'+(b?"font-weight:bold;":"")+'"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+y.color+';"></span>'+S+y.seriesName+": "+C+"</div>"}return $}},legend:{bottom:0,textStyle:{color:"#9ca3af",fontSize:10},icon:"roundRect",itemWidth:12,itemHeight:8,data:t.map(g=>g.label)},grid:{left:"12%",right:"8%",top:"10%",bottom:"15%"},xAxis:{type:"category",data:m,axisLine:{lineStyle:{color:"#2d3d54"}},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:9,rotate:30},splitLine:{show:!1}},yAxis:{type:"value",name:h,nameLocation:"middle",nameGap:50,nameTextStyle:{color:"#9ca3af",fontSize:12},axisLine:{show:!0,lineStyle:{color:"#2d3d54"}},axisTick:{show:!0,lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,formatter:o?g=>g>=1e4?(g/1e4).toFixed(1)+"万":g.toLocaleString():g=>g.toFixed(0)+"%"},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},min:Math.floor(L),max:Math.ceil(w)},series:r};A.setOption(E,!0);const p=document.getElementById("forecast-section");p&&p.classList.toggle("hidden",d.length===0),window.addEventListener("resize",()=>A==null?void 0:A.resize())}function $t(t){var e,n,o,s,a,r,i,l,c,d,u,m,v,h;At=t,A&&(A.dispose(),A=echarts.init(document.getElementById("chart-returns")),Ot()),(e=document.getElementById("chart-mode-pct"))==null||e.classList.toggle("active",t==="pct"),(n=document.getElementById("chart-mode-pct"))==null||n.classList.toggle("bg-neon-blue/20",t==="pct"),(o=document.getElementById("chart-mode-pct"))==null||o.classList.toggle("text-neon-blue",t==="pct"),(s=document.getElementById("chart-mode-pct"))==null||s.classList.toggle("border-neon-blue/30",t==="pct"),(a=document.getElementById("chart-mode-pct"))==null||a.classList.toggle("bg-dark-500/30",t!=="pct"),(r=document.getElementById("chart-mode-pct"))==null||r.classList.toggle("text-gray-400",t!=="pct"),(i=document.getElementById("chart-mode-pct"))==null||i.classList.toggle("border-dark-500",t!=="pct"),(l=document.getElementById("chart-mode-value"))==null||l.classList.toggle("active",t==="value"),(c=document.getElementById("chart-mode-value"))==null||c.classList.toggle("bg-neon-blue/20",t==="value"),(d=document.getElementById("chart-mode-value"))==null||d.classList.toggle("text-neon-blue",t==="value"),(u=document.getElementById("chart-mode-value"))==null||u.classList.toggle("border-neon-blue/30",t==="value"),(m=document.getElementById("chart-mode-value"))==null||m.classList.toggle("bg-dark-500/30",t!=="value"),(v=document.getElementById("chart-mode-value"))==null||v.classList.toggle("text-gray-400",t!=="value"),(h=document.getElementById("chart-mode-value"))==null||h.classList.toggle("border-dark-500",t!=="value")}function oe(t,e,n){const o=document.getElementById(t);if(!o)return;H&&H.dispose(),H=echarts.init(o);const s={backgroundColor:"transparent",tooltip:{backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(124,58,237,0.3)",textStyle:{color:"#e5e7eb"}},radar:{center:["50%","50%"],radius:"65%",indicator:e.dimensions.map(a=>({name:a,max:100})),axisName:{color:"#9ca3af",fontSize:11},splitArea:{areaStyle:{color:["rgba(79,195,247,0.02)","rgba(79,195,247,0.02)"]}},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},axisLine:{lineStyle:{color:"rgba(45,61,84,0.5)"}}},series:[{type:"radar",data:[{value:e.values,name:n,areaStyle:{color:"rgba(124,58,237,0.15)"},lineStyle:{color:"#b388ff",width:2},itemStyle:{color:"#b388ff"},symbol:"circle",symbolSize:5}]}]};H.setOption(s,!0),window.addEventListener("resize",()=>H==null?void 0:H.resize())}function qt(){const t=document.getElementById("sector-pie");t&&(N&&N.dispose(),N=echarts.init(t))}function se(t){if(!N)return;const e=["#4fc3f7","#69f0ae","#f0c060","#ff5252","#b388ff","#ff80ab","#18ffff"],n={backgroundColor:"transparent",tooltip:{trigger:"item",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb"},formatter:"{b}: {c}% ({d}%)"},series:[{type:"pie",radius:["50%","75%"],center:["50%","50%"],emphasis:{label:{fontSize:14,fontWeight:"bold"},scaleSize:8},label:{color:"#9ca3af",fontSize:11,formatter:`{b}
{c}%`},labelLine:{lineStyle:{color:"#4b5563"}},data:t.length>0?t:[{name:"未选择",value:100,itemStyle:{color:"#1f2937"}}],itemStyle:{borderColor:"#0a0e17",borderWidth:2,color:o=>e[o.dataIndex%e.length]}}]};N.setOption(n,!0)}function ae(){A==null||A.dispose(),A=null,H==null||H.dispose(),H=null,N==null||N.dispose(),N=null}function Mt(t,e){if(t.length<e)return[];const n=new Array(t.length).fill(null);let o=0;for(let s=0;s<t.length;s++)o+=t[s],s>=e&&(o-=t[s-e]),s>=e-1&&(n[s]=parseFloat((o/e).toFixed(2)));return n}function re(t,e=14){if(t.length<e+1)return[];const n=new Array(t.length).fill(null),o=[],s=[];for(let i=1;i<t.length;i++){const l=t[i]-t[i-1];o.push(l>0?l:0),s.push(l<0?-l:0)}let a=o.slice(0,e).reduce((i,l)=>i+l,0)/e,r=s.slice(0,e).reduce((i,l)=>i+l,0)/e;for(let i=e;i<o.length;i++){if(r===0)n[i+1]=100;else{const l=a/r;n[i+1]=parseFloat((100-100/(1+l)).toFixed(1))}a=(a*(e-1)+o[i])/e,r=(r*(e-1)+s[i])/e}return n}let et=[],D=[],tt="a-share",ot="all",Lt=!1,Et=!1,Rt=!1,It=!1,Dt=!1;function Y(){M.holdings=D.map(t=>({code:t.code,name:t.name,sector:t.sector,market:t.market,weight:t.weight}))}function Nt(){var n;D=[],Y(),tt="a-share",ot="all",M.stocksData&&ie(M.stocksData),Lt||(document.querySelectorAll(".market-tab").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".market-tab").forEach(s=>s.classList.remove("active")),o.classList.add("active"),tt=o.dataset.market,document.getElementById("stock-search").value="",G()})}),Lt=!0),Dt||((n=document.getElementById("btn-random"))==null||n.addEventListener("click",de),Dt=!0);const t=document.getElementById("stock-search");if(t&&!Rt){let o=null;t.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(()=>{const s=t.value.trim().toLowerCase();s&&(tt="all",document.querySelectorAll(".market-tab").forEach(a=>a.classList.remove("active"))),G(s)},250)}),Rt=!0}Et||(document.querySelectorAll(".period-btn").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".period-btn").forEach(a=>a.classList.remove("active")),o.classList.add("active");const s=o.dataset.period;s==="custom"?(document.getElementById("custom-period-wrap").classList.remove("hidden"),M.period="custom"):(document.getElementById("custom-period-wrap").classList.add("hidden"),M.period=s)})}),Et=!0);const e=document.getElementById("custom-months");if(e&&!It){const o=()=>{let s=parseInt(e.value);(isNaN(s)||s<1)&&(s=1),s>120&&(s=120),e.value=s,M.customMonths=s};e.addEventListener("input",o),e.addEventListener("blur",o),It=!0}qt(),W()}function ie(t){et=t.stocks,le(t.sectors),G(),qt()}function le(t){const e=document.getElementById("sector-filters");if(!e)return;e.innerHTML="";const n=document.createElement("button");n.className="sector-btn active",n.textContent="全部",n.addEventListener("click",()=>{ot="all",document.querySelectorAll(".sector-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),G()}),e.appendChild(n),t.forEach(o=>{const s=document.createElement("button");s.className="sector-btn",s.textContent=o,s.addEventListener("click",()=>{ot=o,document.querySelectorAll(".sector-btn").forEach(a=>a.classList.remove("active")),s.classList.add("active"),G()}),e.appendChild(s)})}function G(t){const e=document.getElementById("stock-grid");if(!e)return;let n=et;if(t){const o=t.toLowerCase();n=et.filter(s=>s.name.toLowerCase().includes(o)||s.code.toLowerCase().includes(o)).slice(0,50)}else tt==="all"&&(tt="a-share"),n=et.filter(o=>{const s=o.market===tt,a=ot==="all"||o.sector===ot;return s&&a});n.sort((o,s)=>s.marketCap-o.marketCap),e.innerHTML=n.map(o=>{var i;const s=D.find(l=>l.code===o.code),a=o.latestPrice;return`
      <div class="stock-card ${s?"selected":""}" data-code="${o.code}" data-name="${o.name}"
           data-sector="${o.sector}" data-market="${o.market}">
        <div class="flex items-center justify-between mb-1">
          <span class="text-white font-medium text-sm truncate flex-1">${o.name}</span>
          <div class="flex items-center gap-1">
            <button class="stock-detail-btn text-xs text-gray-500 hover:text-neon-blue px-1.5 py-0.5 rounded bg-dark-600/50 transition-colors" data-code="${o.code}" title="查看详情">ℹ️</button>
            ${s?'<span class="text-neon-blue text-xs">✓</span>':""}
          </div>
        </div>
        <div class="text-xs text-gray-500 mb-1">${o.code} · ${o.sector}</div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-400">PE ${((i=o.pe)==null?void 0:i.toFixed(1))||"--"}</span>
          <span class="font-mono text-gray-300">¥${(a==null?void 0:a.toFixed(2))||"--"}</span>
        </div>
      </div>
    `}).join(""),e.querySelectorAll(".stock-card").forEach(o=>{o.addEventListener("click",s=>{s.target.closest(".stock-detail-btn")||Wt(o.dataset)})}),e.querySelectorAll(".stock-detail-btn").forEach(o=>{o.addEventListener("click",s=>{s.stopPropagation();const a=o.dataset.code;ce(a)})})}function ce(t){var v,h,L,w,B,E;const e=et.find(p=>p.code===t);if(!e)return;const n=e.prices.slice(-60),o=Math.min(...n),s=Math.max(...n),a={"a-share":"A股",hk:"港股",us:"美股",index:"指数"},r=n[0],l=((n[n.length-1]-r)/r*100).toFixed(2),c=l>=0?"text-neon-red":"text-neon-green",d=l>=0?"+":"",u=l>=0?"#ff5252":"#69f0ae";for(let p=0;p<n.length;p+=10);const m=document.createElement("div");m.className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm",m.innerHTML=`
    <div class="bg-dark-800 rounded-2xl p-6 max-w-lg w-full mx-4 border border-dark-500 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
      <!-- 头部 -->
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="text-xl font-bold text-white">${e.name}</h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm text-gray-400">${e.code}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-dark-600 text-gray-300">${a[e.market]||e.market}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-dark-600 text-gray-300">${e.sector}</span>
          </div>
        </div>
        <button class="text-gray-500 hover:text-white text-2xl" onclick="this.closest('.fixed').remove()">&times;</button>
      </div>
      
      <!-- 价格信息 -->
      <div class="bg-dark-700/50 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-gray-500 mb-1">最新价格</div>
            <div class="text-2xl font-mono font-bold text-white">¥${((v=e.latestPrice)==null?void 0:v.toFixed(2))||"--"}</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-500 mb-1">近60日涨跌</div>
            <div class="text-xl font-mono font-bold ${c}">${d}${l}%</div>
          </div>
        </div>
      </div>
      
      <!-- 走势图 -->
      <div class="bg-dark-700/30 rounded-xl p-4 mb-4">
        <div class="text-xs text-gray-500 mb-2">近60日价格走势</div>
        <div id="stock-price-chart" style="width: 100%; height: 200px;"></div>
        <div class="flex justify-between text-xs text-gray-500 mt-2">
          <span>最低: ¥${o.toFixed(2)}</span>
          <span>最高: ¥${s.toFixed(2)}</span>
        </div>
      </div>
      
      <!-- 关键指标 -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">市盈率 (PE)</div>
          <div class="text-lg font-mono text-white">${((h=e.pe)==null?void 0:h.toFixed(1))||"--"}</div>
          <div class="text-xs text-gray-600">${e.pe>30?"估值偏高":e.pe<15?"估值偏低":"估值合理"}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">市值</div>
          <div class="text-lg font-mono text-white">${(e.marketCap/1e4).toFixed(0)}亿</div>
          <div class="text-xs text-gray-600">${e.marketCap>1e4?"大盘股":e.marketCap>1e3?"中盘股":"小盘股"}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">营收增长</div>
          <div class="text-lg font-mono ${e.revenueGrowth>0?"text-neon-red":"text-neon-green"}">${((L=e.revenueGrowth)==null?void 0:L.toFixed(1))||"--"}%</div>
          <div class="text-xs text-gray-600">${e.revenueGrowth>20?"高增长":e.revenueGrowth>0?"稳健增长":"负增长"}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">ROE</div>
          <div class="text-lg font-mono text-white">${((w=e.roe)==null?void 0:w.toFixed(1))||"--"}%</div>
          <div class="text-xs text-gray-600">${e.roe>15?"优秀":e.roe>10?"良好":"一般"}</div>
        </div>
      </div>
      
      <!-- 技术指标 -->
      <div class="bg-dark-700/30 rounded-lg p-3 mb-4">
        <div class="text-xs text-gray-500 mb-2">📊 技术指标（基于历史模拟数据）</div>
        <div class="grid grid-cols-3 gap-2 text-center" id="tech-indicators-${e.code}">
          <div class="text-xs text-gray-500">正在计算...</div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex gap-3">
        <button class="stock-modal-close flex-1 bg-dark-600/50 text-gray-400 border border-dark-500 rounded-lg py-2.5 text-sm font-medium hover:bg-dark-500 hover:text-white transition-colors">关闭</button>
        <button class="stock-modal-add flex-1 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg py-2.5 text-sm font-medium hover:shadow-lg hover:shadow-neon-blue/20 transition-all" data-code="${e.code}" data-name="${e.name}" data-sector="${e.sector}" data-market="${e.market}">＋ 加入组合</button>
      </div>
    </div>
  `,document.body.appendChild(m),(B=m.querySelector(".stock-modal-close"))==null||B.addEventListener("click",()=>m.remove()),(E=m.querySelector(".stock-modal-add"))==null||E.addEventListener("click",function(){const{code:p,name:g,sector:k,market:R}=this.dataset;Wt({code:p,name:g,sector:k,market:R}),m.remove()}),m.addEventListener("click",p=>{p.target===m&&m.remove()}),setTimeout(()=>{const p=document.getElementById(`tech-indicators-${e.code}`);if(!p)return;const g=e.prices.slice(-120),k=Mt(g,20),R=Mt(g,60),$=re(g,14);g[g.length-1];const x=k[k.length-1],y=R[R.length-1],b=$[$.length-1],S=x>y?"📈 多头排列":"📉 空头排列",C=b>70?"⚠️ 超买":b<30?"💡 超卖":"➖ 中性";p.innerHTML=`
      <div><div class="text-xs text-gray-500">MA20</div><div class="font-mono text-sm ${x>y?"text-neon-red":"text-neon-green"}">${(x==null?void 0:x.toFixed(2))||"--"}</div></div>
      <div><div class="text-xs text-gray-500">RSI(14)</div><div class="font-mono text-sm ${b>70?"text-neon-red":b<30?"text-neon-green":"text-gray-300"}">${(b==null?void 0:b.toFixed(1))||"--"}</div></div>
      <div><div class="text-xs text-gray-500">趋势</div><div class="text-xs">${S}</div><div class="text-xs text-gray-500">${C}</div></div>
    `},100),setTimeout(()=>{const p=document.getElementById("stock-price-chart");if(p&&typeof echarts<"u"){const g=echarts.init(p),k={backgroundColor:"transparent",grid:{left:"3%",right:"3%",top:"5%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:n.map((R,$)=>$+1),axisLine:{lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,interval:9,formatter:R=>`${R}日`},axisTick:{show:!1}},yAxis:{type:"value",scale:!0,axisLine:{show:!1},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:10,formatter:R=>"¥"+R.toFixed(0)},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}}},series:[{data:n,type:"line",smooth:!0,symbol:"none",lineStyle:{width:3,color:u},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:u+"40"},{offset:1,color:u+"00"}])}}],tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:u,textStyle:{color:"#e5e7eb",fontSize:12},formatter:R=>{const $=R[0].value;return`<div style="font-weight:bold">第${R[0].axisValue}天</div><div>价格: ¥${$.toFixed(2)}</div>`}}};g.setOption(k),window.addEventListener("resize",()=>g.resize())}},100),m.addEventListener("click",p=>{p.target===m&&m.remove()})}function Wt({code:t,name:e,sector:n,market:o}){var r,i;const s=D.findIndex(l=>l.code===t);if(s>=0)D.splice(s,1);else if(D.length<10)D.push({code:t,name:e,sector:n,market:o,weight:0});else{showToast("最多选择10只成分股","error");return}vt(),Y();const a=(i=(r=document.getElementById("stock-search"))==null?void 0:r.value)==null?void 0:i.trim();G(a||void 0),W(),X(),V()}function vt(){if(D.length===0)return;const t=Math.floor(100/D.length),e=100-t*D.length;D.forEach((o,s)=>{o.weight=t+(s<e?1:0)});const n=D.reduce((o,s)=>o+s.weight,0);n!==100&&D.length>0&&(D[0].weight+=100-n)}function W(){var s;const t=document.getElementById("selected-list"),e=document.getElementById("weight-sum");if(D.length===0){t.innerHTML='<span class="text-gray-500">请从上方选择股票</span>',e.textContent="合计: 0%";return}t.innerHTML=D.map((a,r)=>`
    <div class="selected-item w-full">
      <button class="text-gray-500 hover:text-red-400 text-lg flex-shrink-0"
              data-action="remove" data-index="${r}">✕</button>
      <div class="flex-1 min-w-0">
        <div class="text-white text-sm truncate">${a.name}</div>
        <div class="text-xs text-gray-500">${a.code} · ${a.sector}</div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <input type="range" min="1" max="95" value="${a.weight}"
               class="weight-slider w-16 md:w-24"
               data-action="weight" data-index="${r}" />
        <input type="number" min="1" max="95" value="${a.weight}"
               class="weight-input w-14 bg-dark-700 border border-dark-500 rounded-lg px-1.5 py-1 text-center text-neon-blue font-mono text-sm focus:outline-none focus:border-neon-blue"
               data-action="weight-input" data-index="${r}" />
        <span class="text-neon-blue font-mono text-sm w-8 text-right">%</span>
      </div>
    </div>
  `).join("");const n=D.reduce((a,r)=>a+r.weight,0);e.textContent=`合计: ${n}%`,e.className=n===100?"text-sm font-mono text-neon-green":"text-sm font-mono text-neon-red";const o=((s=document.getElementById("lock-weights"))==null?void 0:s.checked)||!1;t.querySelectorAll('[data-action="weight"]').forEach(a=>{a.addEventListener("input",r=>{const i=parseInt(a.dataset.index);D[i].weight=parseInt(r.target.value);const l=t.querySelector(`[data-action="weight-input"][data-index="${i}"]`);l&&(l.value=r.target.value),o?(Y(),W(),X(),V()):St(i,parseInt(r.target.value))}),a.addEventListener("change",r=>{if(!o)return;const i=parseInt(a.dataset.index);D[i].weight=parseInt(r.target.value),Y(),W(),X(),V()})}),t.querySelectorAll('[data-action="weight-input"]').forEach(a=>{a.addEventListener("change",r=>{const i=parseInt(a.dataset.index);let l=parseInt(r.target.value)||1;l=Math.max(1,Math.min(95,l)),D[i].weight=l;const c=t.querySelector(`[data-action="weight"][data-index="${i}"]`);c&&(c.value=l),o?(Y(),W(),X(),V()):St(i,l)})}),t.querySelectorAll('[data-action="remove"]').forEach(a=>{a.addEventListener("click",()=>{const r=parseInt(a.dataset.index);D.splice(r,1),vt(),Y(),G(),W(),X(),V()})})}function St(t,e){const n=D.filter((r,i)=>i!==t);if(n.length===0)return;D[t].weight=e;const o=100-e,s=n.reduce((r,i)=>r+i.weight,0);if(s===0){const r=Math.floor(o/n.length);n.forEach(l=>l.weight=r);const i=n.reduce((l,c)=>l+c.weight,0);n[0].weight+=o-i}else{const r=o/s;let i=0;n.forEach((d,u)=>{d.weight=Math.max(1,Math.round(d.weight*r)),i+=d.weight});let l=o-i,c=0;for(;l!==0&&c<20;){c++;for(const d of n)if(l>0?(d.weight++,l--):l<0&&d.weight>1&&(d.weight--,l++),l===0)break}l!==0&&n.length>0&&(n[0].weight=Math.max(1,n[0].weight+l))}const a=D.reduce((r,i)=>r+i.weight,0);a!==100&&D.length>0&&(D[0].weight+=100-a),Y(),W(),X(),V()}function X(){const t={};D.forEach(n=>{t[n.sector]=(t[n.sector]||0)+n.weight});const e=Object.entries(t).map(([n,o])=>({name:n,value:o}));se(e)}function de(){var n;D=[];const t=4+Math.floor(Math.random()*4),e=[...et].sort(()=>Math.random()-.5);for(let o=0;o<Math.min(t,e.length);o++){const s=e[o];D.push({code:s.code,name:s.name,sector:s.sector,market:s.market,weight:0})}vt(),document.getElementById("stock-search").value="",tt="a-share",document.querySelectorAll(".market-tab").forEach(o=>o.classList.remove("active")),(n=document.querySelector('[data-market="a-share"]'))==null||n.classList.add("active"),G(),W(),X(),V(),showToast(`🎲 随机选中 ${D.length} 只股票，看看运气如何？`)}function Vt(){return D.map(t=>({code:t.code,weight:t.weight}))}function ue(){return M.period==="custom"?"custom"+(M.customMonths||18):M.period}let Pt=!1;function me(t){var i,l;const{results:e,amount:n,leverage:o}=t,s=n||1e5,a=o||1,r=[...e].sort((c,d)=>c.rank-d.rank);ge(r,s,a),ne("chart-returns",r,s,a),he(r,s,a),Pt||((i=document.getElementById("chart-mode-pct"))==null||i.addEventListener("click",()=>$t("pct")),(l=document.getElementById("chart-mode-value"))==null||l.addEventListener("click",()=>$t("value")),Pt=!0)}function ge(t,e,n){const o=document.getElementById("ranking-table");if(!o)return;const s=["🥇","🥈","🥉"];o.innerHTML=t.map((a,r)=>{const i=a.isUser,l=r<3?s[r]:a.rank,c=a.totalReturn>=0?"text-neon-red":"text-neon-green",d=i?"user-highlight":"",u=a.totalReturn*n,m=parseFloat(Math.max(-100,u).toFixed(1)),v=Math.round(e*m/100),h=(m>=0?"+":"")+Number(v).toLocaleString(),L=parseFloat((a.maxDrawdown*n).toFixed(1));let w="";if(!i&&a.holdingsDetail&&a.holdingsDetail.length>0){const B=a.holdingsDetail.map(E=>`<div class="flex justify-between text-xs py-1">
          <span class="text-gray-400">${E.name}</span>
          <span class="text-neon-blue font-mono">${E.weight}%</span>
        </div>`).join("");w=`
        <div class="mt-2 pt-2 border-t border-dark-600/30 holdings-detail hidden" id="holdings-${r}">
          <div class="text-xs text-gray-500 mb-1">持仓成分</div>
          ${B}
        </div>
      `}return`
      <div class="rank-row ${d} animate-slide-up" style="animation-delay: ${r*.08}s">
        <span class="rank-badge">${l}</span>
        <span class="text-2xl flex-shrink-0">${a.icon||""}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-white font-medium text-sm truncate">
              ${a.label}
            </span>
            ${a.isBenchmark?'<span class="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-dark-500/50">基准</span>':""}
            ${!a.isUser&&!a.isBenchmark?'<span class="text-xs text-neon-purple px-2 py-0.5 rounded-full bg-dark-500/50">AI</span>':""}
          </div>
          <div class="text-xs text-gray-500">${a.description||""}</div>
          ${!i&&a.holdingsDetail?`<button class="text-xs text-neon-blue mt-1 hover:underline" onclick="toggleHoldings(${r})">查看持仓</button>`:""}
          ${w}
        </div>
        <div class="text-right flex-shrink-0">
          <div class="font-mono font-bold ${c} text-base">
            ${m>=0?"+":""}${m.toFixed(1)}%
          </div>
          <div class="text-xs ${c} font-mono">
            ${h}元
          </div>
          <div class="text-xs text-gray-500">
            最大回撤 ${L}%
          </div>
        </div>
      </div>
    `}).join(""),window.toggleHoldings||(window.toggleHoldings=function(a){const r=document.getElementById(`holdings-${a}`);r&&r.classList.toggle("hidden")})}function he(t,e,n){const o=document.getElementById("metrics-table");if(!o)return;const s=["基金","累计收益","年化收益","最大回撤","夏普比率","胜率"],a=t.map(r=>{const i=r.totalReturn>=0?"metric-up":"metric-down",l=r.totalReturn*n,c=parseFloat(Math.max(-100,l).toFixed(1)),d="★".repeat(r.fundRating||0)+"☆".repeat(5-(r.fundRating||0)),u=r.isUser?`
      <div class="mt-2 pt-2 border-t border-dark-600/30">
        <div class="grid grid-cols-6 gap-2 text-xs">
          <div class="text-center">
            <div class="text-gray-500">索提诺</div>
            <div class="font-mono ${r.sortinoRatio>=1?"text-neon-green":"text-gray-300"}">${r.sortinoRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">信息比率</div>
            <div class="font-mono ${r.informationRatio>=.5?"text-neon-green":"text-gray-300"}">${r.informationRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">Calmar</div>
            <div class="font-mono text-gray-300">${r.calmarRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">盈亏比</div>
            <div class="font-mono text-gray-300">${r.profitLossRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">评级</div>
            <div class="font-mono text-gold-400">${d}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">风险等级</div>
            <div class="font-mono ${r.riskLevel==="高"?"text-neon-red":r.riskLevel==="低"?"text-neon-green":"text-gray-300"}">${r.riskLevel||"中"}</div>
          </div>
        </div>
      </div>
    `:"";return`
      <tr class="border-b border-dark-600/30 hover:bg-dark-700/30 transition-colors">
        <td class="px-3 py-2.5 text-sm text-white font-medium whitespace-nowrap">
          ${r.isUser?"⭐ ":r.icon+" "}${r.label}
        </td>
        <td class="px-3 py-2.5 font-mono text-sm ${i}">${c>=0?"+":""}${c.toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${r.annualizedReturn>=0?"+":""}${r.annualizedReturn}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${(r.maxDrawdown*n).toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm ${r.sharpeRatio>=1?"text-neon-green":r.sharpeRatio>=.5?"text-gray-300":"text-neon-red"}">${r.sharpeRatio}</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${r.winRate}%</td>
      </tr>
      ${r.isUser?`<tr><td colspan="6" class="px-3 py-2 bg-dark-700/20">${u}</td></tr>`:""}
    `}).join("");o.innerHTML=`
    <div class="overflow-x-auto">
      <table class="metrics-table w-full text-xs">
        <thead>
          <tr class="border-b border-dark-500/30">
            ${s.map(r=>`<th class="px-3 py-2 text-left font-medium whitespace-nowrap cursor-help" title="${fe(r)}">${r}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${a}
        </tbody>
      </table>
      
      <!-- 专业指标说明 -->
      <div class="mt-4 p-4 bg-dark-700/30 rounded-lg text-xs text-gray-400">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-neon-blue text-lg">💡</span>
          <span class="font-medium text-white">专业指标说明（点击指标名称查看详情）</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('sharpe')">
            <div class="text-neon-purple font-medium mb-1">夏普比率 (Sharpe Ratio)</div>
            <div>衡量每承受一单位总风险，能获得多少超额收益。>1.0优秀，>2.0卓越。</div>
          </div>
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('sortino')">
            <div class="text-neon-purple font-medium mb-1">索提诺比率 (Sortino Ratio)</div>
            <div>只考虑下行波动的风险调整收益，比夏普比率更精准。</div>
          </div>
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('information')">
            <div class="text-neon-purple font-medium mb-1">信息比率 (Information Ratio)</div>
            <div>超额收益与跟踪误差的比值，衡量主动管理能力。>0.5良好。</div>
          </div>
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('calmar')">
            <div class="text-neon-purple font-medium mb-1">Calmar比率</div>
            <div>年化收益与最大回撤的比值，衡量长期风险调整收益。</div>
          </div>
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('profitloss')">
            <div class="text-neon-purple font-medium mb-1">盈亏比</div>
            <div>平均盈利与平均亏损的比值，>1说明盈利能力强。</div>
          </div>
          <div class="p-2 bg-dark-600/30 rounded cursor-pointer hover:bg-dark-600/50 transition-colors" onclick="showMetricDetail('rating')">
            <div class="text-gold-400 font-medium mb-1">★基金评级</div>
            <div>基于夏普比率、回撤控制、年化收益、胜率的综合五星评级。</div>
          </div>
        </div>
      </div>
    </div>
  `}function fe(t){return{基金:"基金名称",累计收益:"回测期内的总收益率",年化收益:"按年计算的收益率",最大回撤:"从高点到低点的最大亏损幅度",夏普比率:"风险调整后收益，>1优秀",胜率:"盈利交易日占比"}[t]||t}window.showMetricDetail||(window.showMetricDetail=function(t){var l;const n={sharpe:{title:"夏普比率 (Sharpe Ratio)",content:`夏普比率 = (年化收益率 - 无风险利率) / 年化波动率

由诺贝尔经济学奖得主威廉·夏普提出的最著名风险调整收益指标。

解读标准：
• > 2.0：卓越，顶级基金水平
• 1.0-2.0：优秀，值得投资
• 0.5-1.0：一般，勉强可接受
• < 0.5：较差，风险收益比不佳

注意：夏普比率惩罚所有波动（包括上涨），牛市中可能偏低。`},sortino:{title:"索提诺比率 (Sortino Ratio)",content:`索提诺比率 = (年化收益率 - 无风险利率) / 下行标准差

夏普比率的改进版，只惩罚下行波动，不惩罚上涨波动。

适用场景：
• 更适合评估偏股型基金
• 对非对称收益分布更准确
• 更能反映投资者的真实感受

一般来说，索提诺比率 > 夏普比率，因为排除了上涨波动。`},information:{title:"信息比率 (Information Ratio)",content:`信息比率 = 超额收益 / 跟踪误差

衡量基金经理的主动管理能力，即相对于基准创造了多少超额收益。

解读标准：
• > 1.0：卓越的主动管理能力
• 0.5-1.0：良好的主动管理能力
• 0-0.5：一般的主动管理能力
• < 0：不如买指数基金

这是机构投资者评估基金经理的核心指标。`},calmar:{title:"Calmar比率",content:`Calmar比率 = 年化收益率 / 最大回撤

用最大回撤代替波动率来衡量风险，更适合长期投资者。

特点：
• 关注最坏情况下的表现
• 更适合评估稳健型基金
• 对极端风险更敏感

一般来说，Calmar比率 > 2 说明风险收益比良好。`},profitloss:{title:"盈亏比",content:`盈亏比 = 平均盈利 / 平均亏损

衡量交易系统的质量，反映"赚的时候赚多少，亏的时候亏多少"。

解读：
• > 2.0：优秀，赚多亏少
• 1.5-2.0：良好
• 1.0-1.5：一般
• < 1.0：危险，赚少亏多

注意：盈亏比需要结合胜率一起看。高盈亏比+低胜率可能是"三年不开张，开张吃三年"的类型。`},rating:{title:"五星基金评级体系",content:`综合评分体系，基于以下维度：

1. 夏普比率（权重30%）
   衡量风险调整收益

2. 最大回撤（权重25%）
   衡量风险控制能力

3. 年化收益（权重25%）
   衡量绝对收益能力

4. 胜率（权重20%）
   衡量稳定性

评级标准：
• ★★★★★：4-5分，顶级基金
• ★★★★☆：3-4分，优秀基金
• ★★★☆☆：2-3分，良好基金
• ★★☆☆☆：1-2分，一般基金
• ★☆☆☆☆：<1分，需谨慎`}}[t];if(!n)return;(l=document.querySelector(".metric-modal-overlay"))==null||l.remove();const o=document.createElement("div");o.className="metric-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm",o.innerHTML=`
      <div class="bg-dark-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-dark-500 shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto">
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-lg font-bold text-white">${n.title}</h3>
          <button class="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div class="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
          ${n.content}
        </div>
        <div class="mt-4 pt-3 border-t border-dark-600/30">
          <button class="metric-modal-close w-full bg-dark-600/50 text-gray-400 border border-dark-500 rounded-lg py-2.5 text-sm font-medium hover:bg-dark-500 hover:text-white transition-colors">
            关闭
          </button>
        </div>
      </div>
    `,document.body.appendChild(o);const s=o.querySelector(".metric-modal-close"),a=o.querySelector("button"),r=()=>o.remove();s==null||s.addEventListener("click",r),a==null||a.addEventListener("click",r),o.addEventListener("click",c=>{c.target===o&&r()});const i=c=>{c.key==="Escape"&&(r(),document.removeEventListener("keydown",i))};document.addEventListener("keydown",i)});function pe(t,e=null){const{styleTag:n,matchPerson:o,matchPersonDesc:s,matchPersonOrg:a,metrics:r,radarData:i,commentary:l}=t,c=document.getElementById("diagnosis-tag");c&&(c.innerHTML=`
      <span class="diagnosis-badge text-xl md:text-2xl animate-fade-in">${n}</span>
    `);const d=document.getElementById("diagnosis-subtitle");d&&(d.innerHTML=`
      <span class="text-gray-400">对标人物：</span>
      <span class="text-neon-blue font-bold">${o}</span>
      <span class="text-gray-500 text-sm"> — ${s}</span>
      ${a?`<span class="text-gray-600 text-sm block">${a}</span>`:""}
    `),oe("chart-radar",i,"你的基金");const u=document.getElementById("commentary-text");u&&(e!=null&&e.results&&e.results.length>0?Gt(u,e.results,e.errors):e!=null&&e.loading?ve(u):e!=null&&e.errors&&e.errors.length>0?ye(u,l,e.errors):be(u,l)),ke(r)}function xe(t){const e=document.getElementById("commentary-text");e&&(t.results&&t.results.length>0?Gt(e,t.results,t.errors):t.errors&&t.errors.length>0&&e.innerHTML.includes("loading-dots")&&we(e,t.errors))}function Gt(t,e,n){let o=e.map((s,a)=>`<div class="llm-result mb-3">
      <div class="text-white leading-relaxed text-sm md:text-base">${s.text.replace(/\*\*(.+?)\*\*/g,'<strong class="text-neon-blue">$1</strong>').replace(/\*(.+?)\*/g,"<em>$1</em>").split(`

`).map(i=>i.trim()).filter(Boolean).map(i=>`<p style="margin-bottom:10px;line-height:1.8;">${i.replace(/\n/g,"<br>")}</p>`).join("")}</div>
    </div>`).join("");o+='<div class="mt-3 text-right text-xs text-gray-500">🤖 AI 点评 · 仅供参考</div>',n&&n.length>0&&(o+=`<div class="mt-2 text-right text-xs text-gray-600">
      ⚠️ ${n.map(s=>s.api+"："+s.error).join("；")}
    </div>`),t.innerHTML=o}function ve(t){t.innerHTML=`
    <div class="flex items-center gap-3 py-4">
      <div class="loading-dots flex gap-1">
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style="animation-delay:0.2s"></span>
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style="animation-delay:0.4s"></span>
      </div>
      <span class="text-gray-400 text-sm">AI正在分析你的投资风格...</span>
    </div>
  `}function ye(t,e,n){let o="";if(e){const s=e.split(`

`).map(a=>a.trim()).filter(Boolean);o+=s.map((a,r)=>'<p style="margin-bottom:'+(r<s.length-1?"12px":"0")+';line-height:1.8;">'+a+"</p>").join("")}else o+='<p class="text-gray-400 text-sm">暂无可用的点评内容。</p>';o+='<div class="mt-3 text-right text-xs text-gray-500">📋 离线模板点评 · 仅供参考</div>',o+=`<div class="mt-4 p-3 bg-dark-600/30 rounded-lg border border-dark-500/30">
    <div class="text-xs text-gray-500 mb-2">🔧 API 诊断信息</div>
    <div class="space-y-1">
      ${n.map(s=>`
        <div class="flex items-start gap-2 text-xs">
          <span class="text-red-400 flex-shrink-0">✗</span>
          <div>
            <span class="text-gray-400 font-medium">${s.api}</span>
            <span class="text-gray-500 ml-1">— ${s.error}</span>
          </div>
        </div>
      `).join("")}
    </div>
    <div class="mt-3 pt-2 border-t border-dark-500/20 text-xs text-gray-600">
      <p class="mb-1">💡 提示：</p>
      <ul class="list-disc list-inside space-y-0.5">
        <li>复制 <code class="text-gray-500 bg-dark-500/50 px-1 rounded">config.example.js</code> → <code class="text-gray-500 bg-dark-500/50 px-1 rounded">config.js</code></li>
        <li>填入你的 API 地址和 Key（支持 OpenAI 兼容接口）</li>
        <li>开发环境请将 <code class="text-gray-500 bg-dark-500/50 px-1 rounded">baseUrl</code> 设为空字符串（走 Vite 代理）</li>
      </ul>
    </div>
  </div>`,t.innerHTML=o}function be(t,e){if(!e){t.innerHTML='<p class="text-gray-400 text-sm">暂无可用的点评内容。</p>';return}const n=e.split(`

`).map(o=>o.trim()).filter(Boolean);t.innerHTML=n.map((o,s)=>'<p style="margin-bottom:'+(s<n.length-1?"12px":"0")+';line-height:1.8;">'+o+"</p>").join(""),t.innerHTML+='<div class="mt-3 text-right text-xs text-gray-500">📋 离线模板点评 · 仅供参考</div>'}function we(t,e){t.innerHTML=`
    <div class="py-2">
      <p class="text-gray-400 text-sm mb-3">AI点评生成失败，请检查API配置后重试。</p>
      <div class="p-3 bg-dark-600/30 rounded-lg border border-dark-500/30">
        <div class="text-xs text-gray-500 mb-2">🔧 错误详情</div>
        ${e.map(n=>`
          <div class="flex items-start gap-2 text-xs mb-1">
            <span class="text-red-400 flex-shrink-0">✗</span>
            <span class="text-gray-400">${n.api}：${n.error}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `}function ke(t){const e=document.getElementById("ai-commentary");if(!e)return;let n=document.getElementById("metrics-summary");n&&n.remove(),n=document.createElement("div"),n.id="metrics-summary";const o=(r,i)=>{if(r==null||isNaN(r))return"-";const l=Math.pow(10,i);return Math.round(r*l)/l},s="★".repeat(t.fundRating||0)+"☆".repeat(5-(t.fundRating||0)),a=t.fundRating>=4?"text-gold-400":t.fundRating>=3?"text-neon-blue":"text-gray-400";n.innerHTML=`
    <div class="mt-4 pt-4 border-t border-dark-600/30">
      <!-- 基金评级卡片 -->
      <div class="bg-dark-700/50 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-400">基金评级</span>
          <span class="text-2xl ${a}">${s}</span>
        </div>
        <div class="flex items-center gap-4 text-xs">
          <span class="text-gray-500">风险等级:</span>
          <span class="px-2 py-1 rounded ${t.riskLevel==="高"?"bg-red-500/20 text-red-400":t.riskLevel==="低"?"bg-green-500/20 text-green-400":"bg-blue-500/20 text-blue-400"}">${t.riskLevel}风险</span>
          ${t.ratingReasons?`<span class="text-gray-500">|</span><span class="text-gray-400">${t.ratingReasons.join("、")}</span>`:""}
        </div>
      </div>
      
      <!-- 核心指标 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">年化收益</div>
          <div class="font-mono font-bold ${t.annualizedReturn>=0?"text-neon-red":"text-neon-green"}">${t.annualizedReturn>=0?"+":""}${o(t.annualizedReturn,1)}%</div>
        </div>
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">最大回撤</div>
          <div class="font-mono font-bold text-neon-blue">${o(t.maxDrawdown,1)}%</div>
        </div>
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">夏普比率</div>
          <div class="font-mono font-bold ${t.sharpeRatio>=1?"text-neon-green":"text-gray-300"}">${o(t.sharpeRatio,2)}</div>
        </div>
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">胜率</div>
          <div class="font-mono font-bold text-gray-300">${o(t.winRate,1)}%</div>
        </div>
      </div>
      
      <!-- 专业指标 -->
      <div class="bg-dark-700/30 rounded-xl p-4">
        <div class="text-xs text-gray-500 mb-3">专业风险调整指标</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div class="text-xs text-gray-600 mb-1">索提诺比率</div>
            <div class="font-mono text-sm text-gray-300">${o(t.sortinoRatio,2)}</div>
            <div class="text-xs text-gray-600">只考虑下行风险</div>
          </div>
          <div>
            <div class="text-xs text-gray-600 mb-1">信息比率</div>
            <div class="font-mono text-sm ${t.informationRatio>=.5?"text-neon-green":"text-gray-300"}">${o(t.informationRatio,2)}</div>
            <div class="text-xs text-gray-600">超额收益/跟踪误差</div>
          </div>
          <div>
            <div class="text-xs text-gray-600 mb-1">Calmar比率</div>
            <div class="font-mono text-sm text-gray-300">${o(t.calmarRatio,2)}</div>
            <div class="text-xs text-gray-600">年化收益/最大回撤</div>
          </div>
          <div>
            <div class="text-xs text-gray-600 mb-1">盈亏比</div>
            <div class="font-mono text-sm text-gray-300">${o(t.profitLossRatio,2)}</div>
            <div class="text-xs text-gray-600">平均盈利/平均亏损</div>
          </div>
        </div>
      </div>
    </div>
  `,e.appendChild(n)}const T=252;function z(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}const $e={"3m":Math.floor(T/4),"6m":Math.floor(T/2),"1y":T,"3y":T*3,"5y":T*5,"10y":T*10};function Me(t){if(t.startsWith("custom")){const e=parseInt(t.replace("custom",""))||18,n=Math.max(1,Math.min(120,e));return Math.floor(T*n/12)}return $e[t]||T}function Ut(t,e,n){const o={};t.stocks.forEach(f=>{o[f.code]=f});const s=e.reduce((f,P)=>{const _=o[P.code];return _?Math.min(f,_.prices.length):f},1/0),a=isFinite(s)?s:T*5,r=Math.min(Me(n),T*10),i=Math.min(r,a),l=[],c=100;for(let f=i;f>0;f--){const P=a-f;if(P<0)continue;let _=0;for(const st of e){const at=o[st.code];if(!at||P>=at.prices.length)continue;const kt=at.prices[P],ft=at.prices[a-i];if(!kt||!ft||ft===0)continue;const Zt=st.weight/100;_+=Zt*(kt/ft)}l.push(parseFloat((c*_).toFixed(4)))}const d=l[l.length-1],u=z((d-c)/c*100,2);let m=0,v=l[0];for(const f of l){f>v&&(v=f);const P=(v-f)/v*100;P>m&&(m=P)}m=z(m,2);const h=i/T,L=z((Math.pow(d/c,1/h)-1)*100,2),w=[];for(let f=1;f<l.length;f++)w.push((l[f]-l[f-1])/l[f-1]);const B=w.reduce((f,P)=>f+P,0)/w.length,E=w.reduce((f,P)=>f+Math.pow(P-B,2),0)/w.length,p=Math.sqrt(E),g=z(p*Math.sqrt(T)*100,2),k=.02,R=g>0?z((L/100-k)/(g/100),2):0,$=w.filter(f=>f<0),x=$.length>0?Math.sqrt($.reduce((f,P)=>f+Math.pow(P-$.reduce((_,st)=>_+st,0)/$.length,2),0)/$.length):0,y=x>0?z((L/100-k)/(x*Math.sqrt(T)),2):0,b=z((L/100-k)/1,2),S=w.map(f=>f-k/T),C=Math.sqrt(S.reduce((f,P)=>f+P*P,0)/S.length)*Math.sqrt(T),I=C>0?z((L/100-k)/C,2):0,F=m>0?z(L/m,2):0,ct=w.filter(f=>f>0).length,U=z(ct/w.length*100,1),dt=w.filter(f=>f>0).reduce((f,P)=>f+P,0)/w.filter(f=>f>0).length||0,bt=Math.abs(w.filter(f=>f<0).reduce((f,P)=>f+P,0)/w.filter(f=>f<0).length)||0,Xt=bt>0?z(dt/bt,2):0;let j=0,O=[];R>=1.5?(j+=2,O.push("夏普比率优秀")):R>=1?(j+=1.5,O.push("夏普比率良好")):R>=.5&&(j+=1,O.push("夏普比率一般")),m<=10?(j+=1.5,O.push("回撤控制优秀")):m<=20?(j+=1,O.push("回撤控制良好")):m<=30&&(j+=.5),L>=20?(j+=1.5,O.push("收益表现优秀")):L>=10?(j+=1,O.push("收益表现良好")):L>=5&&(j+=.5),U>=60&&(j+=.5,O.push("胜率较高")),j=Math.min(5,Math.max(1,Math.round(j)));let ut="中";m<=15&&g<=20?ut="低":(m>=30||g>=40)&&(ut="高");const wt=Math.max(1,Math.floor(l.length/50)),mt=[],gt=[];for(let f=0;f<l.length;f+=wt)mt.push(l[f]),gt.push(f);(l.length-1)%wt!==0&&(mt.push(l[l.length-1]),gt.push(l.length-1));const Jt=new Date,ht=new Date(Jt);ht.setDate(ht.getDate()-i);const Qt=gt.map(f=>{const P=new Date(ht);return P.setDate(P.getDate()+f),P.getMonth()+1+"/"+P.getDate()});return{name:"user",label:"你的基金",isUser:!0,totalReturn:u,annualizedReturn:L,annualizedVol:g,maxDrawdown:m,sharpeRatio:R,sortinoRatio:y,treynorRatio:b,informationRatio:I,calmarRatio:F,profitLossRatio:Xt,winRate:U,fundRating:j,ratingReasons:O,riskLevel:ut,initialValue:c,finalValue:d,chartData:mt,dateLabels:Qt,days:i,holdings:e.map(f=>{const P=o[f.code];return{code:f.code,name:(P==null?void 0:P.name)||f.code,weight:f.weight}})}}function Le(t,e){const n=[];return n.push(...Ee(t,e)),n.push(...Re(t,e)),n}function q(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}function Ee(t,e){const n=t.stocks,o=n.filter(c=>c.market==="a-share").sort((c,d)=>d.marketCap-c.marketCap).slice(0,20),s=o.map(c=>({code:c.code,weight:q(100/o.length,1)})),a=n.filter(c=>c.market==="a-share"&&(c.sector==="科技"||c.sector==="医药"||c.sector==="新能源")).filter(c=>c.marketCap<5e3).slice(0,15),r=a.map(c=>({code:c.code,weight:q(100/a.length,1)})),i=n.filter(c=>c.market==="us"&&c.sector==="科技").sort((c,d)=>d.marketCap-c.marketCap).slice(0,10),l=i.map(c=>({code:c.code,weight:q(100/i.length,1)}));return[J("benchmark-csi300","沪深300","A股大盘蓝筹基准","🇨🇳",s,t,e),J("benchmark-gem","创业板指","A股成长创新基准","🇨🇳",r,t,e),J("benchmark-nasdaq","纳斯达克100","美股科技龙头基准","🇺🇸",l,t,e)]}function Re(t,e){const n=t.stocks,o=n.filter(u=>u.pe>0&&u.pe<25&&u.dividendYield>2).filter(u=>u.sector==="消费"||u.sector==="金融").sort((u,m)=>m.dividendYield-u.dividendYield).slice(0,8),s=o.map(u=>({code:u.code,weight:q(100/o.length,1)})),a=n.filter(u=>u.revenueGrowth>10).filter(u=>u.sector==="科技"||u.sector==="医药"||u.sector==="新能源").sort((u,m)=>m.revenueGrowth-u.revenueGrowth).slice(0,8),r=a.map(u=>({code:u.code,weight:q(100/a.length,1)})),i=n.map(u=>{const m=u.prices,v=m[m.length-1],h=m[Math.max(0,m.length-63)];return{...u,momentum:q((v-h)/h*100,2)}}).sort((u,m)=>m.momentum-u.momentum).slice(0,8),l=i.map(u=>({code:u.code,weight:q(100/i.length,1)})),c=n.filter(u=>u.roe>5).map(u=>{const m=u.prices,v=m[m.length-1],h=m[Math.max(0,m.length-63)];return{...u,change:q((v-h)/h*100,2)}}).sort((u,m)=>u.change-m.change).slice(0,8),d=c.map(u=>({code:u.code,weight:q(100/c.length,1)}));return[J("ai-value","🐻 价值大师","深度价值投资","🐻",s,t,e),J("ai-growth","🐂 成长猎手","激进成长投资","🐂",r,t,e),J("ai-momentum","🐎 趋势追踪","动量交易策略","🐎",l,t,e),J("ai-reverse","🦉 逆向投资","超跌反转策略","🦉",d,t,e)]}function J(t,e,n,o,s,a,r){const i=Ut(a,s,r);return i.name=t,i.label=e,i.description=n,i.icon=o,i.isUser=!1,i.isBenchmark=t.startsWith("benchmark-"),i.holdingsDetail=s.map(l=>{const c=a.stocks.find(d=>d.code===l.code);return{code:l.code,name:(c==null?void 0:c.name)||l.code,weight:l.weight,sector:(c==null?void 0:c.sector)||"未知",market:(c==null?void 0:c.market)||"未知"}}),i}const rt=[{id:"jiucai",emoji:"🥬",name:"韭菜本菜",matchPerson:"每一个在市场里交过学费的人",personDesc:"初代股民集体回忆",personOrg:"",condition:t=>t.totalReturn<0&&t.concentration>.5},{id:"foxi",emoji:"🧘",name:"佛系躺平派",matchPerson:"但斌",personDesc:"「时间的玫瑰」——买了就当忘了",personOrg:"东方港湾董事长",condition:t=>t.turnover<.3&&t.bluechipRatio>.6},{id:"jiuxiang",emoji:"🍶",name:"酱香科技研究员",matchPerson:"张坤",personDesc:"易方达蓝筹精选掌舵人",personOrg:"易方达基金",condition:t=>(t.sectorWeights.消费||0)>30},{id:"yaoyao",emoji:"💊",name:"医药葛兰分兰",matchPerson:"葛兰",personDesc:"中欧医疗健康，医药赛道信仰者",personOrg:"中欧基金",condition:t=>(t.sectorWeights.医药||0)>40},{id:"ark",emoji:"🚀",name:"ARK中国分K",matchPerson:"Cathie Wood",personDesc:"ARK Invest创始人",personOrg:"ARK Invest",condition:t=>(t.sectorWeights.科技||0)>50&&t.turnover>.5},{id:"buffett",emoji:"👴",name:"巴菲特传人",matchPerson:"Warren Buffett",personDesc:"价值投资灯塔",personOrg:"伯克希尔·哈撒韦",condition:t=>(t.sectorWeights.消费||0)+(t.sectorWeights.金融||0)>50&&t.turnover<.3&&t.roe>15},{id:"diamond",emoji:"🦍",name:"钻石手",matchPerson:"WSB散户大军",personDesc:"「Diamond Hands」——回撤50%也绝不割肉",personOrg:"Reddit r/wallstreetbets",condition:t=>t.maxDrawdown>25&&t.turnover<.3},{id:"wolf",emoji:"🐺",name:"华尔街之狼",matchPerson:"各路游资大佬",personDesc:"高频交易，主打一个刺激",personOrg:"龙虎榜常客",condition:t=>t.turnover>.8},{id:"national",emoji:"🏛️",name:"国家队在逃成员",matchPerson:"社保基金/汇金",personDesc:"银行+央企+蓝筹，稳如泰山",personOrg:"全国社保基金理事会",condition:t=>(t.sectorWeights.金融||0)>40&&t.annualizedVol<20&&t.roe>10},{id:"global",emoji:"🌍",name:"全球宏观玩家",matchPerson:"Ray Dalio",personDesc:"桥水基金创始人",personOrg:"桥水基金",condition:t=>t.crossMarket&&t.marketCount>=3},{id:"growth",emoji:"🌱",name:"成长股猎人",matchPerson:"朱少醒",personDesc:"富国天惠，15年20倍的公募传奇",personOrg:"富国基金",condition:t=>(t.sectorWeights.科技||0)>30&&t.revenueGrowth>20},{id:"balanced",emoji:"⚖️",name:"均衡配置达人",matchPerson:"谢治宇",personDesc:"兴全合润，不偏科的均衡派代表",personOrg:"兴证全球基金",condition:t=>t.maxSectorWeight<35&&t.stockCount>=6}];function nt(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function Ie(t,e,n,o){var y;const a=Object.entries(e.sectorWeights||{}).sort((b,S)=>S[1]-b[1])[0]||["未知",0];Object.entries(e.marketWeights||{}).sort((b,S)=>S[1]-b[1]);const r={"a-share":"A股",hk:"港股",us:"美股",index:"指数ETF"},i=[],l={},c={};n.forEach(b=>{const S=o[b.code];S&&(l[S.market]=(l[S.market]||0)+b.weight,c[S.sector]=(c[S.sector]||0)+b.weight)});const d=Object.entries(l).sort((b,S)=>S[1]-b[1]),u=Object.entries(c).sort((b,S)=>S[1]-b[1]),m=(y=d[0])==null?void 0:y[0],v=d.length,h=e.leverage||1,L=e.maxDrawdown>=100||e.totalReturn<=-100,w=h>3,B=e.totalReturn<-50,E=e.totalReturn<-20&&e.totalReturn>=-50,p=e.totalReturn<0&&e.totalReturn>=-20,g=e.totalReturn>=0&&e.totalReturn<10,k=e.totalReturn>=10&&e.totalReturn<50,R=e.totalReturn>=50;let $="";if(L?w?$=`💥 **爆仓警告！** 你使用了${h}x杠杆，最终回撤${e.maxDrawdown.toFixed(1)}%，本金几乎归零。这不是投资，这是赌博！高杠杆+重仓=自杀式操作。`:$=`💥 **巨额亏损！** 最大回撤${e.maxDrawdown.toFixed(1)}%，几乎亏光所有本金。你的选股或择时出现了严重问题。`:B?w?$=`📉 **高杠杆惨案！** ${h}x杠杆放大了亏损，最终收益${e.totalReturn.toFixed(1)}%。杠杆是双刃剑，这次你被割伤了。`:$=`📉 **深度套牢！** 亏损${Math.abs(e.totalReturn).toFixed(1)}%，持仓体验极差。建议重新审视每只股票的基本面。`:E?$=`😰 **投资失利！** 亏损${Math.abs(e.totalReturn).toFixed(1)}%，虽然没到爆仓程度，但也足够肉疼。复盘一下原因？`:p?$=`🤔 **白忙一场！** 亏了${Math.abs(e.totalReturn).toFixed(1)}%，承担了风险却没得到回报。`:g?$=`🙂 **小赚一笔！** 盈利${e.totalReturn.toFixed(1)}%，虽然不多但好歹是正收益。`:k?$=`😊 **稳健盈利！** 收益${e.totalReturn.toFixed(1)}%，回撤${e.maxDrawdown.toFixed(1)}%，这是真正的投资能力！`:R&&(w?$=`🚀 **杠杆暴利！** ${h}x杠杆+${e.totalReturn.toFixed(1)}%收益=暴富神话！但别飘，见好就收。`:$=`🌟 **投资大师！** 收益${e.totalReturn.toFixed(1)}%，这是巴菲特级别的表现！`),i.push($),i.push(`
📊 **持仓诊断**：`),u.length>0){const b=u[0],S=b[1]>60?`重仓${b[0]}(${b[1].toFixed(0)}%)，集中度极高，风险集中。`:b[1]>40?`${b[0]}(${b[1].toFixed(0)}%)占比偏高。`:"行业分布较均衡。";i.push(`• ${S}`)}v===1?i.push(`• 全仓${r[m]||m}，单一市场风险集中。`):i.push(`• 跨${v}个市场配置，分散了风险。`),e.stockCount<=2?i.push(`• 仅${e.stockCount}只标的，集中度极高，押注式投资风险极大。`):e.stockCount>=8?i.push(`• ${e.stockCount}只标的，可能过于分散。`):i.push(`• ${e.stockCount}只标的，集中度适中。`),h>1&&(i.push(`
⚠️ **杠杆分析**（${h}x杠杆）：`),L?i.push(`• **爆仓元凶！** ${h}x杠杆导致回撤放大。没有杠杆最多亏${(100/h).toFixed(0)}%，有了杠杆亏了100%+。`):B?i.push(`• **杠杆放大亏损！** ${h}x杠杆让你的亏损速度加快了${h}倍。`):i.push(`• 使用了${h}x杠杆，放大了收益和风险。`)),i.push(`
📈 **风险收益**：`),i.push(`• 年化收益：${e.annualizedReturn>=0?"+":""}${e.annualizedReturn.toFixed(1)}%`),i.push(`• 最大回撤：${e.maxDrawdown.toFixed(1)}%${e.maxDrawdown>30?"（极高风险）":e.maxDrawdown>20?"（高风险）":e.maxDrawdown>10?"（中等风险）":"（低风险）"}`),i.push(`• 夏普比率：${e.sharpeRatio.toFixed(2)}`),i.push(`
💡 **专属建议**：`);const x=[];return L?(x.push("🚨 立即退出所有杠杆仓位，本金没了就什么都没了。"),x.push("📚 建议先学习《聪明的投资者》等经典书籍。"),x.push("🎮 先用模拟盘练习至少3个月。")):B||E?(x.push("🛑 暂停加仓，不要继续摊低成本。"),x.push("🔍 仔细分析每只股票的买入逻辑。"),w&&x.push("📉 降低杠杆至1x或2x。")):p?x.push("🤔 微调策略，优化选股标准。"):g?x.push("📊 加入债券ETF等低风险资产平滑曲线。"):(k||R)&&x.push("💰 适当减仓，锁定部分利润。"),a[1]>60&&x.push(`🔄 ${a[0]}占比过高，建议减仓分散。`),v===1&&!L&&x.push("🌍 建议配置其他市场分散风险。"),e.maxDrawdown>30&&!L&&x.push("🛡️ 设置止损线（如-15%）并严格执行。"),i.push(...x.map((b,S)=>`${S+1}. ${b}`)),i.push(`
🎯 **总结**：`),L?i.push("这次投资以爆仓告终。记住这次教训，重建本金，重新出发。💪"):B||E?i.push("这次投资虽然亏损，但经验比金钱更重要。🌱"):p?i.push("基本持平，小幅优化就能扭亏为盈。📚"):g?i.push("小赚是不错的开始，继续优化。🐢"):k?i.push("不错的收益！保持并持续优化。🏆"):R&&i.push("卓越的表现！保持学习、控制风险。🌟"),i.join(`
`)}function _t(t,e,n){const o={};t.stocks.forEach(E=>{o[E.code]=E});const s={},a={};let r=0,i=0,l=0,c=0;e.forEach(E=>{const p=o[E.code];if(!p)return;const g=E.weight/100;s[p.sector]=(s[p.sector]||0)+E.weight,a[p.market]=(a[p.market]||0)+E.weight,r+=p.revenueGrowth*g,i+=p.roe*g,l+=p.pe*g,p.marketCap>3e3&&c++});const d=e.length<=5?.7:e.length<=7?.4:.25,m=(s.科技||0)>40?.6+Math.random()*.2:.2+Math.random()*.3,v={totalReturn:n.totalReturn,annualizedReturn:n.annualizedReturn,annualizedVol:n.annualizedVol,maxDrawdown:n.maxDrawdown,sharpeRatio:n.sharpeRatio,sortinoRatio:n.sortinoRatio,informationRatio:n.informationRatio,calmarRatio:n.calmarRatio,profitLossRatio:n.profitLossRatio,winRate:n.winRate,fundRating:n.fundRating,ratingReasons:n.ratingReasons,riskLevel:n.riskLevel,leverage:n.leverage,sectorWeights:s,marketWeights:a,concentration:d,turnover:m,revenueGrowth:parseFloat(r.toFixed(1)),roe:parseFloat(i.toFixed(2)),pe:parseFloat(l.toFixed(2)),bluechipRatio:parseFloat((c/e.length).toFixed(2)),maxSectorWeight:parseFloat(Math.max(...Object.values(s)).toFixed(1)),stockCount:e.length,crossMarket:Object.keys(a).length>=2,marketCount:Object.keys(a).length};let h=null,L=0;for(const E of rt)if(E.condition(v)){const p=E.id==="jiucai"?5:E.id==="global"?3:1;p>L&&(L=p,h=E)}h||(h=rt.find(E=>E.id==="balanced")||rt[rt.length-1]);const w=Ie(h,v,e,o),B={dimensions:["年化收益","风险控制","行业集中度","跨市场配置","选股ROE"],values:[nt(Math.min(100,Math.max(0,v.annualizedReturn+50)),0),nt(Math.min(100,Math.max(0,100-v.annualizedVol)),0),nt(Math.min(100,Math.max(0,v.maxSectorWeight)),0),nt(Math.min(100,Math.max(0,Object.keys(a).length*30)),0),nt(Math.min(100,Math.max(0,v.roe*1.5)),0)]};return{styleTag:`${h.emoji} ${h.name}`,matchPerson:h.matchPerson,matchPersonDesc:h.personDesc,matchPersonOrg:h.personOrg||"",styleId:h.id,metrics:v,radarData:B,commentary:w}}const Bt=window.LLM_CONFIG||{},it=Bt.primary||Bt.eastmoney||{baseUrl:"",apiKey:"",model:""};let Q=null,Z=[],Kt=!1;const Ct=3e4;function De(t){return Z=[],Q=Ce(Pe(t)).then(e=>e?[{model:"AI",text:e}]:null),Q}async function Ft(){if(!Q)return{results:null,errors:[{api:"System",error:"未发起请求"}],loading:!1};let t=null;const e=new Promise(o=>{setTimeout(()=>{o({stillLoading:!0})},100)}),n=await Promise.race([Q,e]);return n&&n.stillLoading?t=await Q:t=n,Q=null,!t||t.length===0?{results:null,errors:[...Z],loading:!1}:{results:t,errors:[...Z],loading:!1}}function Se(){return Q!==null}function Pe(t){const{styleTag:e,matchPerson:n,matchPersonDesc:o,matchPersonOrg:s,metrics:a}=t,r=Object.entries(a.sectorWeights||{}).map(([u,m])=>`${u}${m.toFixed(0)}%`).join("、"),i=Object.entries(a.marketWeights||{}).map(([u,m])=>`${{"a-share":"A股",hk:"港股",us:"美股",index:"指数ETF"}[u]||u}${m.toFixed(0)}%`).join("、"),c=(a.annualizedReturn||0)>=0;Kt=c;const d=c?"赚了别藏着，去东方财富股吧晒晒操作，让韭菜们学学！":"亏了别慌，下载东方财富APP，权威·专业·及时，帮你找回场子！";return`你是东方财富的资深基金经理，为用户点评投资组合。

## 组合信息
- 风格标签：${e}
- 对标人物：${n}（${o}${s?"，"+s:""}）
- 行业分布：${r}
- 市场分布：${i}
- 年化收益：${a.annualizedReturn}%
- 最大回撤：${a.maxDrawdown}%
- 夏普比率：${a.sharpeRatio}
- 杠杆：${a.leverage||1}x
- 持仓：${a.stockCount}只

## 写作要求
1. 中文，200-250字，分段，可用**粗体**但不用标题
2. 幽默风趣，用股民梗，先夸后吐槽，调侃对标人物
3. 少用引号，不要给词加引号
4. 适度emoji，不要每句都加

## ⚠️ 强制要求（必须遵守）
点评的最后一句话必须是产品推荐，直接写下面这句（可微调语气但必须包含东方财富和产品名）：
${d}`}function Be(t){if(!t)return"";const e=[/最终回答[：:]\s*/,/最终点评[：:]\s*/,/以下是点评[：:]\s*/,/点评如下[：:]\s*/,/回复[：:]\s*\n/];for(const s of e){const a=t.match(s);if(a){const r=t.slice(a.index+a[0].length).trim();if(r.length>50)return r}}const n=t.split(/\n\n+/).filter(s=>s.trim());if(n.length>=3)for(let s=n.length-1;s>=0;s--){const a=n[s].trim();if(!/^(我们|首先|需要|用户|任务|好的|让我|我来|根据|以上|下面|现在)/.test(a)&&a.length>20)return n.slice(s).join(`

`)}const o=t.replace(/^.*?我们需要.*?\n/s,"").trim();return o.length>50?o:t.trim()}async function Ce(t){var s,a;if(!it.apiKey)return Z.push({api:"API",error:"未配置 apiKey（请创建 config.js 并填入 Key）"}),null;const e=it.baseUrl||"/api",n=new AbortController,o=setTimeout(()=>n.abort(),Ct);try{const r=await fetch(`${e}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${it.apiKey}`},body:JSON.stringify({model:it.model,messages:[{role:"system",content:"你是东方财富的资深基金经理。直接输出点评正文，禁止输出思考过程。少用引号，适度emoji，结尾自然引导到东方财富产品。"},{role:"user",content:t}],max_tokens:2e3,temperature:.8}),signal:n.signal});if(!r.ok){const d=await r.text().catch(()=>"");return Z.push({api:"API",error:`HTTP ${r.status}${d?": "+d.slice(0,200):""}`}),null}const l=(a=(s=(await r.json()).choices)==null?void 0:s[0])==null?void 0:a.message;let c=((l==null?void 0:l.content)||"").trim();return!c&&(l!=null&&l.reasoning_content)&&(c=Be(l.reasoning_content)),c&&!c.includes("东方财富")&&(c+=Kt?`

赚了别藏着，去东方财富股吧晒晒操作，让韭菜们学学！`:`

亏了别慌，下载东方财富APP，权威·专业·及时，帮你找回场子！`),c||Z.push({api:"API",error:"返回内容为空（模型未输出有效回复）"}),c||null}catch(r){const i=r.name==="AbortError"?`请求超时（${Ct/1e3}秒）。请检查：1) 是否在公司内网 2) Vite 代理是否正常 3) API 地址是否正确`:r.message||"网络错误";return Z.push({api:"API",error:i}),console.warn("[LLM]",r.message),null}finally{clearTimeout(o)}}const M={currentScreen:"builder",fundName:"",holdings:[],period:"1y",customMonths:18,backtestResults:null,stocksData:null,userResult:null,investAmount:1e5,leverage:1};let lt=null,pt=null;function Fe(){const t=document.getElementById("particle-canvas");if(!t)return;const e=t.getContext("2d");let n=[];lt&&(cancelAnimationFrame(lt),lt=null),pt&&window.removeEventListener("resize",pt);function o(){t.width=window.innerWidth,t.height=window.innerHeight}o(),pt=o,window.addEventListener("resize",o);class s{constructor(){this.reset()}reset(){this.x=Math.random()*t.width,this.y=Math.random()*t.height,this.size=Math.random()*2+.5,this.speedX=(Math.random()-.5)*.3,this.speedY=(Math.random()-.5)*.3,this.opacity=Math.random()*.5+.1}update(){this.x+=this.speedX,this.y+=this.speedY,(this.x<0||this.x>t.width||this.y<0||this.y>t.height)&&this.reset()}draw(){e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fillStyle=`rgba(79, 195, 247, ${this.opacity})`,e.fill()}}for(let r=0;r<80;r++)n.push(new s);function a(){e.clearRect(0,0,t.width,t.height),n.forEach(r=>{r.update(),r.draw()});for(let r=0;r<n.length;r++)for(let i=r+1;i<n.length;i++){const l=n[r].x-n[i].x,c=n[r].y-n[i].y,d=Math.sqrt(l*l+c*c);d<120&&(e.beginPath(),e.moveTo(n[r].x,n[r].y),e.lineTo(n[i].x,n[i].y),e.strokeStyle=`rgba(79, 195, 247, ${.08*(1-d/120)})`,e.lineWidth=.5,e.stroke())}lt=requestAnimationFrame(a)}a()}function yt(t){ae(),document.querySelectorAll(".screen").forEach(o=>o.classList.remove("active","hidden")),document.querySelectorAll(".screen").forEach(o=>o.classList.add("hidden"));const e=document.getElementById(`screen-${t}`);e&&(e.classList.remove("hidden"),e.classList.add("active"),e.scrollIntoView({behavior:"smooth",block:"start"})),M.currentScreen=t;const n=document.getElementById("header");n&&(n.style.display=t==="builder"?"":"none")}async function Yt(){try{const e=await fetch("./"+"stocks.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);const n=await e.json();return n.stocks.forEach(o=>{o.latestPrice=o.prices[o.prices.length-1]}),M.stocksData=n,M.stocksData}catch(t){return console.error("Failed to load stocks:",t),null}}async function Te(){var e,n,o,s,a,r,i,l;const t=document.getElementById("btn-start");t.disabled=!0,t.textContent="⏳ 回测计算中...";try{const c=Vt(),d=ue();let u=parseFloat((e=document.getElementById("invest-amount"))==null?void 0:e.value)||1e5;u=Math.max(100,Math.min(1e8,u));const m=parseFloat((n=document.getElementById("leverage"))==null?void 0:n.value)||1;let v=M.fundName||((s=(o=document.getElementById("fund-name"))==null?void 0:o.value)==null?void 0:s.trim());v||(v=ze(c,M.stocksData)),M.stocksData||await Yt();const h=Ut(M.stocksData,c,d);if(d.startsWith("custom")){const p=parseInt(d.replace("custom",""))||18,g=Math.floor((((l=(i=(r=(a=M.stocksData)==null?void 0:a.stocks)==null?void 0:r[0])==null?void 0:i.prices)==null?void 0:l.length)||1250)/21);p>g&&Tt(`数据仅覆盖约${g}个月，已自动缩短至可用范围`,"info")}h.label=v,h.amount=u,h.leverage=m,M.userResult=h,M.holdings=c,M.investAmount=u,M.leverage=m;const L=Le(M.stocksData,d),w=[h,...L];w.sort((p,g)=>g.totalReturn-p.totalReturn),w.forEach((p,g)=>{p.rank=g+1}),M.backtestResults=w,yt("arena"),me({fundName:v,period:d,results:w,amount:u,leverage:m});const B={...h,totalReturn:h.totalReturn*m,maxDrawdown:h.maxDrawdown*m},E=_t(M.stocksData,c,B);E.metrics.leverage=m,De(E)}catch(c){Tt("回测失败："+c.message,"error"),t.disabled=!1,t.textContent="⚡ 开始挑战"}}async function Ae(){yt("diagnosis");const t={...M.userResult,totalReturn:M.userResult.totalReturn*M.leverage,maxDrawdown:M.userResult.maxDrawdown*M.leverage},e=_t(M.stocksData,M.holdings,t);e.metrics.leverage=M.leverage;const n=Se();let o={results:null,errors:[],loading:n};n||(o=await Ft()),pe(e,o),n&&(o=await Ft(),xe(o))}function je(){M.fundName="",M.holdings=[],M.backtestResults=null,M.userResult=null,document.getElementById("fund-name").value="",document.getElementById("btn-start").disabled=!0,yt("builder"),Nt()}function ze(t,e){var $;if(!t||t.length===0)return"我的基金";const n={};e&&e.stocks&&e.stocks.forEach(x=>{n[x.code]=x});const o={},s={};let a=!1,r=!1,i=!1,l=!1;t.forEach(x=>{const y=n[x.code];y&&(o[y.market]=(o[y.market]||0)+x.weight,s[y.sector]=(s[y.sector]||0)+x.weight,y.sector==="科技"&&(a=!0),y.sector==="金融"&&(r=!0),y.sector==="消费"&&(i=!0),y.sector==="医药"&&(l=!0))});const c=Object.entries(o).sort((x,y)=>y[1]-x[1]),d=(($=c[0])==null?void 0:$[0])||"a-share",u=c.length,m={"a-share":["华夏","国泰","南方","易方达","嘉实","博时","广发","富国"],hk:["港股","香港","恒生","中港","沪港深"],us:["纳斯达克","标普","美股","全球","海外"],index:["指数","ETF","被动"]};let v;u>=3?v=["全球","国际","环球","世界","跨市场"]:u===2?v=["沪港深","深港通","AH","中美","跨市场"]:v=m[d]||m["a-share"];let h=[];a&&t.length<=3?h=["创新","科技","成长","新兴","前沿","智能"]:r&&t.length<=3?h=["金融","价值","蓝筹","红利","稳健","精选"]:i&&t.length<=3?h=["消费","品质","生活","品牌","升级"]:l&&t.length<=3?h=["健康","医疗","生命","医药","生物"]:t.length>=8?h=["优选","精选","配置","均衡","多元","全能"]:t.length<=3?h=["聚焦","集中","核心","龙头","精选","优势"]:h=["成长","价值","均衡","轮动","趋势","精选","优选","灵活"];const L=["混合","股票","配置","优选","精选","成长","价值","稳健","进取","灵活"],w=v[Math.floor(Math.random()*v.length)],B=h[Math.floor(Math.random()*h.length)],E=L[Math.floor(Math.random()*L.length)],p=[w+B+E,w+E+B,B+E,w+B],g=p[Math.floor(Math.random()*p.length)],k=["超级","至尊","王者","巅峰","传奇","无敌","神级","霸道"];return k[Math.floor(Math.random()*k.length)]+g+"（您）"}async function He(){Fe(),await Yt(),Nt();const t=document.getElementById("invest-amount");t&&(t.addEventListener("input",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value&&parseInt(n.target.value)!==o&&(n.target.value=o)}),t.addEventListener("blur",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value=o})),document.getElementById("btn-start").addEventListener("click",Te),document.getElementById("btn-diagnosis").addEventListener("click",Ae),document.getElementById("btn-restart").addEventListener("click",je),document.getElementById("fund-name").addEventListener("input",n=>{M.fundName=n.target.value.trim(),V()});const e=document.getElementById("leverage");e&&e.addEventListener("input",()=>{document.getElementById("leverage-display").textContent=e.value+"x"})}He();let xt=null;function Tt(t,e="info"){const n=document.getElementById("toast-msg");n&&n.remove(),xt&&clearTimeout(xt);const o=e==="error"?"bg-red-500/90":"bg-green-500/90",s=document.createElement("div");s.id="toast-msg",s.className=`fixed top-4 left-1/2 -translate-x-1/2 ${o} text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm`,s.textContent=t,document.body.appendChild(s),xt=setTimeout(()=>{s.style.opacity="0",s.style.transition="opacity .3s",setTimeout(()=>s.remove(),300)},3e3)}function V(){const t=document.getElementById("btn-start");t&&(t.disabled=Vt().length<1)}

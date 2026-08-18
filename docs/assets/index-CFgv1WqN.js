(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const b={currentScreen:"builder",fundName:"",holdings:[],period:"1y",backtestResults:null,stocksData:null,userResult:null,investAmount:1e5,leverage:1,customMonths:18};let mt=null;function Mt(t,e="info"){const n=document.getElementById("toast-message");n&&n.remove(),mt&&clearTimeout(mt);const o=document.createElement("div");o.id="toast-message";const i=e==="error"?"bg-red-500/90":e==="success"?"bg-green-500/90":"bg-neon-blue/90";o.className=`fixed top-4 left-1/2 transform -translate-x-1/2 ${i} text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in`,o.textContent=t,document.body.appendChild(o),mt=setTimeout(()=>{o.style.opacity="0",o.style.transition="opacity 0.3s",setTimeout(()=>o.remove(),300)},3e3)}function G(){const t=document.getElementById("btn-start");if(!t)return;const e=b.holdings||[];t.disabled=e.length<1}let P=null,T=null,H=null,Et="pct",Lt=[],St=1e5,Rt=1;function V(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function Nt(t,e){const n=t.length;if(n<10)return[];const o=(n-1)/2,i=t.reduce((l,m)=>l+m,0)/n;let a=0,s=0;for(let l=0;l<n;l++)a+=(l-o)*(t[l]-i),s+=(l-o)*(l-o);const r=s!==0?a/s:0,c=t[n-1],d=[];for(let l=1;l<=e;l++){const m=(Math.random()-.5)*Math.abs(r)*l*.5;d.push(V(c+r*l+m,2))}return d}function qt(t,e){const n=new Date,o=[],i=t-e;for(let a=0;a<i;a++){const s=new Date(n);s.setDate(s.getDate()-(i-a)),a===0||a===i-1||a%Math.max(1,Math.floor(i/6))===0?o.push(s.getMonth()+1+"/"+s.getDate()):o.push("")}for(let a=0;a<e;a++){const s=new Date(n);s.setDate(s.getDate()+a+1),a===0||a===e-1||a%Math.max(1,Math.floor(e/2))===0?o.push("🔮"+(s.getMonth()+1)+"/"+s.getDate()):o.push("")}return o}function Ht(t,e,n,o){const i=document.getElementById(t);i&&(Lt=e,St=n||1e5,Rt=o||1,P&&P.dispose(),P=echarts.init(i),Dt())}function Dt(){const t=Lt,e=St,n=Rt,o=Et==="value",i="#4fc3f7",a=["#69f0ae","#f0c060","#b388ff","#ff80ab","#18ffff","#ffab40","#ff5252"],s=[];let r=0,c=0;const d=t.find(g=>g.isUser);d&&(c=d.chartData.length),t.forEach((g,v)=>{g.chartData.length>r&&(r=g.chartData.length)});let l=[],m=-1;if(d){const g=d.chartData;for(let v=0;v<g.length;v++)if((g[v]-100)*n<=-100){m=v;break}if(m<0){const v=Nt(d.chartData,Math.max(1,Math.floor(r*.05)));v.length>0&&(l=v,r=Math.max(r,c+l.length))}}let u=[];const x=t.find(g=>g.isUser&&g.dateLabels);if(x&&x.dateLabels)u=[...x.dateLabels];else{const g=Math.max(0,r-c);u=qt(r,g)}if(l.length>0&&u.length>0){const g=u[u.length-1],[v,w]=g.split("/").map(Number);for(let I=1;I<=l.length;I++){const B=new Date(2026,v-1,w);B.setDate(B.getDate()+I);const p=I===1||I===l.length||I%Math.max(1,Math.floor(l.length/3))===0?"🔮"+(B.getMonth()+1)+"/"+B.getDate():"";u.push(p)}}t.forEach((g,v)=>{const w=g.isUser,I=g.isBenchmark,B=g.chartData,p=w?i:a[(v-1)%a.length];let y=[],O=-1;if(o)for(let $=0;$<B.length;$++){if((B[$]-100)*n<=-100){O=$,y.push(0);break}y.push(V(e*n*B[$]/100,0))}else for(let $=0;$<B.length;$++){const C=V((B[$]-100)*n,1);if(C<=-100){O=$,y.push(-100);break}y.push(C)}for(;y.length<r;)y.push(null);let z=[...y];if(w&&l.length>0&&!o)for(let $=0;$<l.length;$++){const C=V((l[$]-100)*n,1);c+$<z.length?z[c+$]=C:z.push(C)}else if(w&&l.length>0&&o)for(let $=0;$<l.length;$++){const C=V(e*n*l[$]/100,0);c+$<z.length?z[c+$]=C:z.push(C)}if(w&&l.length>0&&O<0){const $=z.slice(0,c),C=new Array(c-1).fill(null),it=$[$.length-1];C.push(it);for(let W=0;W<l.length;W++){const rt=o?V(e*n*l[W]/100,0):V((l[W]-100)*n,1);C.push(rt)}s.push({name:g.label,type:"line",data:$,smooth:!0,symbol:"none",lineStyle:{width:4,type:"solid",color:p},itemStyle:{color:p},emphasis:{focus:"series",lineStyle:{width:6}},z:10,endLabel:{show:!0,formatter:g.label,color:p,fontSize:11,offset:[10,0]}}),s.push({name:"预测走势",type:"line",data:C,smooth:!0,symbol:"none",lineStyle:{width:3,type:"dashed",color:p,opacity:.7},itemStyle:{color:p},z:9,silent:!0})}else s.push({name:g.label,type:"line",data:z,smooth:!0,symbol:"none",lineStyle:{width:w?4:I?1.5:2,type:"solid",color:p,opacity:I?.5:1},itemStyle:{color:p},emphasis:{focus:"series",lineStyle:{width:w?6:3}},z:w?10:1,endLabel:w?{show:!0,formatter:g.label,color:p,fontSize:11,offset:[10,0]}:void 0,...O>=0?{markPoint:{data:[{name:"💥",coord:[O,o?0:-100],symbol:"pin",symbolSize:35,itemStyle:{color:"#ff5252"},label:{show:!0,formatter:"💥爆仓",fontSize:14,color:"#ff5252",fontWeight:"bold",offset:[0,-15]}}],animation:!1}}:{}})});const h=o?"总价值（元）":"收益率（%）";let R=1/0,D=-1/0;s.forEach(g=>{g.data&&g.data.forEach(v=>{v!==null&&!isNaN(v)&&(R=Math.min(R,v),D=Math.max(D,v))})});const E=D-R;R=R-E*.1,D=D+E*.1;const k={backgroundColor:"transparent",tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb",fontSize:12},formatter:function(g){const v=g.filter(p=>p.value!==null&&p.value!==void 0&&!p.seriesName.includes("预测"));if(v.length===0)return"";let I='<div style="font-weight:bold;margin-bottom:4px;">'+g[0].axisValue.replace("🔮","预测 ")+"</div>";const B=[...v].sort((p,y)=>(y.value||0)-(p.value||0));for(const p of B){const y=t.find($=>$.label===p.seriesName&&$.isUser),O=y?"⭐ ":"",z=o?"¥"+Number(p.value).toLocaleString():(p.value>=0?"+":"")+p.value.toFixed(1)+"%";I+='<div style="display:flex;align-items:center;gap:6px;'+(y?"font-weight:bold;":"")+'"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+p.color+';"></span>'+O+p.seriesName+": "+z+"</div>"}return I}},legend:{bottom:0,textStyle:{color:"#9ca3af",fontSize:10},icon:"roundRect",itemWidth:12,itemHeight:8,data:t.map(g=>g.label)},grid:{left:"12%",right:"8%",top:"10%",bottom:"15%"},xAxis:{type:"category",data:u,axisLine:{lineStyle:{color:"#2d3d54"}},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:9,rotate:30},splitLine:{show:!1}},yAxis:{type:"value",name:h,nameLocation:"middle",nameGap:50,nameTextStyle:{color:"#9ca3af",fontSize:12},axisLine:{show:!0,lineStyle:{color:"#2d3d54"}},axisTick:{show:!0,lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,formatter:o?g=>g>=1e4?(g/1e4).toFixed(1)+"万":g.toLocaleString():g=>g.toFixed(0)+"%"},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},min:Math.floor(R),max:Math.ceil(D)},series:s};P.setOption(k,!0);const M=document.getElementById("forecast-section");M&&M.classList.toggle("hidden",l.length===0),window.addEventListener("resize",()=>P==null?void 0:P.resize())}function xt(t){var e,n,o,i,a,s,r,c,d,l,m,u,x,h;Et=t,P&&(P.dispose(),P=echarts.init(document.getElementById("chart-returns")),Dt()),(e=document.getElementById("chart-mode-pct"))==null||e.classList.toggle("active",t==="pct"),(n=document.getElementById("chart-mode-pct"))==null||n.classList.toggle("bg-neon-blue/20",t==="pct"),(o=document.getElementById("chart-mode-pct"))==null||o.classList.toggle("text-neon-blue",t==="pct"),(i=document.getElementById("chart-mode-pct"))==null||i.classList.toggle("border-neon-blue/30",t==="pct"),(a=document.getElementById("chart-mode-pct"))==null||a.classList.toggle("bg-dark-500/30",t!=="pct"),(s=document.getElementById("chart-mode-pct"))==null||s.classList.toggle("text-gray-400",t!=="pct"),(r=document.getElementById("chart-mode-pct"))==null||r.classList.toggle("border-dark-500",t!=="pct"),(c=document.getElementById("chart-mode-value"))==null||c.classList.toggle("active",t==="value"),(d=document.getElementById("chart-mode-value"))==null||d.classList.toggle("bg-neon-blue/20",t==="value"),(l=document.getElementById("chart-mode-value"))==null||l.classList.toggle("text-neon-blue",t==="value"),(m=document.getElementById("chart-mode-value"))==null||m.classList.toggle("border-neon-blue/30",t==="value"),(u=document.getElementById("chart-mode-value"))==null||u.classList.toggle("bg-dark-500/30",t!=="value"),(x=document.getElementById("chart-mode-value"))==null||x.classList.toggle("text-gray-400",t!=="value"),(h=document.getElementById("chart-mode-value"))==null||h.classList.toggle("border-dark-500",t!=="value")}function Wt(t,e,n){const o=document.getElementById(t);if(!o)return;T&&T.dispose(),T=echarts.init(o);const i={backgroundColor:"transparent",tooltip:{backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(124,58,237,0.3)",textStyle:{color:"#e5e7eb"}},radar:{center:["50%","50%"],radius:"65%",indicator:e.dimensions.map(a=>({name:a,max:100})),axisName:{color:"#9ca3af",fontSize:11},splitArea:{areaStyle:{color:["rgba(79,195,247,0.02)","rgba(79,195,247,0.02)"]}},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},axisLine:{lineStyle:{color:"rgba(45,61,84,0.5)"}}},series:[{type:"radar",data:[{value:e.values,name:n,areaStyle:{color:"rgba(124,58,237,0.15)"},lineStyle:{color:"#b388ff",width:2},itemStyle:{color:"#b388ff"},symbol:"circle",symbolSize:5}]}]};T.setOption(i,!0),window.addEventListener("resize",()=>T==null?void 0:T.resize())}function It(){const t=document.getElementById("sector-pie");t&&(H&&H.dispose(),H=echarts.init(t))}function Vt(t){if(!H)return;const e=["#4fc3f7","#69f0ae","#f0c060","#ff5252","#b388ff","#ff80ab","#18ffff"],n={backgroundColor:"transparent",tooltip:{trigger:"item",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb"},formatter:"{b}: {c}% ({d}%)"},series:[{type:"pie",radius:["50%","75%"],center:["50%","50%"],emphasis:{label:{fontSize:14,fontWeight:"bold"},scaleSize:8},label:{color:"#9ca3af",fontSize:11,formatter:`{b}
{c}%`},labelLine:{lineStyle:{color:"#4b5563"}},data:t.length>0?t:[{name:"未选择",value:100,itemStyle:{color:"#1f2937"}}],itemStyle:{borderColor:"#0a0e17",borderWidth:2,color:o=>e[o.dataIndex%e.length]}}]};H.setOption(n,!0)}function Gt(){P==null||P.dispose(),P=null,T==null||T.dispose(),T=null,H==null||H.dispose(),H=null}let Z=[],L=[],J="a-share",tt="all",vt=!1,yt=!1,bt=!1,wt=!1;function U(){b.holdings=L.map(t=>({code:t.code,name:t.name,sector:t.sector,market:t.market,weight:t.weight}))}function Bt(){L=[],U(),J="a-share",tt="all",b.stocksData&&Ut(b.stocksData),vt||(document.querySelectorAll(".market-tab").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".market-tab").forEach(o=>o.classList.remove("active")),n.classList.add("active"),J=n.dataset.market,document.getElementById("stock-search").value="",K()})}),vt=!0);const t=document.getElementById("stock-search");if(t&&!bt){let n=null;t.addEventListener("input",()=>{clearTimeout(n),n=setTimeout(()=>{const o=t.value.trim().toLowerCase();o&&(J="all",document.querySelectorAll(".market-tab").forEach(i=>i.classList.remove("active"))),K(o)},250)}),bt=!0}yt||(document.querySelectorAll(".period-btn").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".period-btn").forEach(i=>i.classList.remove("active")),n.classList.add("active");const o=n.dataset.period;o==="custom"?(document.getElementById("custom-period-wrap").classList.remove("hidden"),b.period="custom"):(document.getElementById("custom-period-wrap").classList.add("hidden"),b.period=o)})}),yt=!0);const e=document.getElementById("custom-months");e&&!wt&&(e.addEventListener("input",()=>{b.customMonths=parseInt(e.value)||18}),wt=!0),It(),Y()}function Ut(t){Z=t.stocks,Yt(t.sectors),K(),It()}function Yt(t){const e=document.getElementById("sector-filters");if(!e)return;e.innerHTML="";const n=document.createElement("button");n.className="sector-btn active",n.textContent="全部",n.addEventListener("click",()=>{tt="all",document.querySelectorAll(".sector-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),K()}),e.appendChild(n),t.forEach(o=>{const i=document.createElement("button");i.className="sector-btn",i.textContent=o,i.addEventListener("click",()=>{tt=o,document.querySelectorAll(".sector-btn").forEach(a=>a.classList.remove("active")),i.classList.add("active"),K()}),e.appendChild(i)})}function K(t){const e=document.getElementById("stock-grid");if(!e)return;let n=Z;if(t){const o=t.toLowerCase();n=Z.filter(i=>i.name.toLowerCase().includes(o)||i.code.toLowerCase().includes(o)).slice(0,50)}else J==="all"&&(J="a-share"),n=Z.filter(o=>{const i=o.market===J,a=tt==="all"||o.sector===tt;return i&&a});n.sort((o,i)=>i.marketCap-o.marketCap),e.innerHTML=n.map(o=>{var r;const i=L.find(c=>c.code===o.code),a=o.latestPrice;return`
      <div class="stock-card ${i?"selected":""}" data-code="${o.code}" data-name="${o.name}"
           data-sector="${o.sector}" data-market="${o.market}">
        <div class="flex items-center justify-between mb-1">
          <span class="text-white font-medium text-sm truncate flex-1">${o.name}</span>
          <div class="flex items-center gap-1">
            <button class="stock-detail-btn text-xs text-gray-500 hover:text-neon-blue px-1.5 py-0.5 rounded bg-dark-600/50 transition-colors" data-code="${o.code}" title="查看详情">ℹ️</button>
            ${i?'<span class="text-neon-blue text-xs">✓</span>':""}
          </div>
        </div>
        <div class="text-xs text-gray-500 mb-1">${o.code} · ${o.sector}</div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-400">PE ${((r=o.pe)==null?void 0:r.toFixed(1))||"--"}</span>
          <span class="font-mono text-gray-300">¥${(a==null?void 0:a.toFixed(2))||"--"}</span>
        </div>
      </div>
    `}).join(""),e.querySelectorAll(".stock-card").forEach(o=>{o.addEventListener("click",i=>{i.target.closest(".stock-detail-btn")||Kt(o.dataset)})}),e.querySelectorAll(".stock-detail-btn").forEach(o=>{o.addEventListener("click",i=>{i.stopPropagation();const a=o.dataset.code;_t(a)})})}function _t(t){var x,h,R,D;const e=Z.find(E=>E.code===t);if(!e)return;const n=e.prices.slice(-60),o=Math.min(...n),i=Math.max(...n),a={"a-share":"A股",hk:"港股",us:"美股",index:"指数"},s=n[0],c=((n[n.length-1]-s)/s*100).toFixed(2),d=c>=0?"text-neon-red":"text-neon-green",l=c>=0?"+":"",m=c>=0?"#ff5252":"#69f0ae";for(let E=0;E<n.length;E+=10);const u=document.createElement("div");u.className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm",u.innerHTML=`
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
            <div class="text-2xl font-mono font-bold text-white">¥${((x=e.latestPrice)==null?void 0:x.toFixed(2))||"--"}</div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-500 mb-1">近60日涨跌</div>
            <div class="text-xl font-mono font-bold ${d}">${l}${c}%</div>
          </div>
        </div>
      </div>
      
      <!-- 走势图 -->
      <div class="bg-dark-700/30 rounded-xl p-4 mb-4">
        <div class="text-xs text-gray-500 mb-2">近60日价格走势</div>
        <div id="stock-price-chart" style="width: 100%; height: 200px;"></div>
        <div class="flex justify-between text-xs text-gray-500 mt-2">
          <span>最低: ¥${o.toFixed(2)}</span>
          <span>最高: ¥${i.toFixed(2)}</span>
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
          <div class="text-lg font-mono ${e.revenueGrowth>0?"text-neon-red":"text-neon-green"}">${((R=e.revenueGrowth)==null?void 0:R.toFixed(1))||"--"}%</div>
          <div class="text-xs text-gray-600">${e.revenueGrowth>20?"高增长":e.revenueGrowth>0?"稳健增长":"负增长"}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">ROE</div>
          <div class="text-lg font-mono text-white">${((D=e.roe)==null?void 0:D.toFixed(1))||"--"}%</div>
          <div class="text-xs text-gray-600">${e.roe>15?"优秀":e.roe>10?"良好":"一般"}</div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex gap-3">
        <button class="flex-1 bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded-lg py-2.5 text-sm font-medium hover:bg-neon-blue/30 transition-colors" onclick="this.closest('.fixed').remove()">关闭</button>
        <button class="flex-1 bg-neon-blue text-dark-900 rounded-lg py-2.5 text-sm font-medium hover:bg-neon-blue/90 transition-colors" onclick="toggleStock({code:'${e.code}',name:'${e.name}',sector:'${e.sector}',market:'${e.market}'}); this.closest('.fixed').remove();">加入组合</button>
      </div>
    </div>
  `,document.body.appendChild(u),setTimeout(()=>{const E=document.getElementById("stock-price-chart");if(E&&typeof echarts<"u"){const k=echarts.init(E),M={backgroundColor:"transparent",grid:{left:"3%",right:"3%",top:"5%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:n.map((g,v)=>v+1),axisLine:{lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,interval:9,formatter:g=>`${g}日`},axisTick:{show:!1}},yAxis:{type:"value",scale:!0,axisLine:{show:!1},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:10,formatter:g=>"¥"+g.toFixed(0)},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}}},series:[{data:n,type:"line",smooth:!0,symbol:"none",lineStyle:{width:3,color:m},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:m+"40"},{offset:1,color:m+"00"}])}}],tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:m,textStyle:{color:"#e5e7eb",fontSize:12},formatter:g=>{const v=g[0].value;return`<div style="font-weight:bold">第${g[0].axisValue}天</div><div>价格: ¥${v.toFixed(2)}</div>`}}};k.setOption(M),window.addEventListener("resize",()=>k.resize())}},100),u.addEventListener("click",E=>{E.target===u&&u.remove()})}function Kt({code:t,name:e,sector:n,market:o}){var s,r;const i=L.findIndex(c=>c.code===t);if(i>=0)L.splice(i,1);else if(L.length<10)L.push({code:t,name:e,sector:n,market:o,weight:0});else{Mt("最多选择10只成分股","error");return}Ct(),U();const a=(r=(s=document.getElementById("stock-search"))==null?void 0:s.value)==null?void 0:r.trim();K(a||void 0),Y(),X(),G()}function Ct(){if(L.length===0)return;const t=Math.floor(100/L.length),e=100-t*L.length;L.forEach((o,i)=>{o.weight=t+(i<e?1:0)});const n=L.reduce((o,i)=>o+i.weight,0);n!==100&&L.length>0&&(L[0].weight+=100-n)}function Y(){var i;const t=document.getElementById("selected-list"),e=document.getElementById("weight-sum");if(L.length===0){t.innerHTML='<span class="text-gray-500">请从上方选择股票</span>',e.textContent="合计: 0%";return}t.innerHTML=L.map((a,s)=>`
    <div class="selected-item w-full">
      <button class="text-gray-500 hover:text-red-400 text-lg flex-shrink-0"
              data-action="remove" data-index="${s}">✕</button>
      <div class="flex-1 min-w-0">
        <div class="text-white text-sm truncate">${a.name}</div>
        <div class="text-xs text-gray-500">${a.code} · ${a.sector}</div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <input type="range" min="1" max="95" value="${a.weight}"
               class="weight-slider w-16 md:w-24"
               data-action="weight" data-index="${s}" />
        <input type="number" min="1" max="95" value="${a.weight}"
               class="weight-input w-14 bg-dark-700 border border-dark-500 rounded-lg px-1.5 py-1 text-center text-neon-blue font-mono text-sm focus:outline-none focus:border-neon-blue"
               data-action="weight-input" data-index="${s}" />
        <span class="text-neon-blue font-mono text-sm w-8 text-right">%</span>
      </div>
    </div>
  `).join("");const n=L.reduce((a,s)=>a+s.weight,0);e.textContent=`合计: ${n}%`,e.className=n===100?"text-sm font-mono text-neon-green":"text-sm font-mono text-neon-red";const o=((i=document.getElementById("lock-weights"))==null?void 0:i.checked)||!1;t.querySelectorAll('[data-action="weight"]').forEach(a=>{a.addEventListener("input",s=>{const r=parseInt(a.dataset.index);L[r].weight=parseInt(s.target.value);const c=t.querySelector(`[data-action="weight-input"][data-index="${r}"]`);c&&(c.value=s.target.value),o?(U(),Y(),X(),G()):kt(r,parseInt(s.target.value))}),a.addEventListener("change",s=>{if(!o)return;const r=parseInt(a.dataset.index);L[r].weight=parseInt(s.target.value),U(),Y(),X(),G()})}),t.querySelectorAll('[data-action="weight-input"]').forEach(a=>{a.addEventListener("change",s=>{const r=parseInt(a.dataset.index);let c=parseInt(s.target.value)||1;c=Math.max(1,Math.min(95,c)),L[r].weight=c;const d=t.querySelector(`[data-action="weight"][data-index="${r}"]`);d&&(d.value=c),o?(U(),Y(),X(),G()):kt(r,c)})}),t.querySelectorAll('[data-action="remove"]').forEach(a=>{a.addEventListener("click",()=>{const s=parseInt(a.dataset.index);L.splice(s,1),Ct(),U(),K(),Y(),X(),G()})})}function kt(t,e){const n=L.filter((s,r)=>r!==t);if(n.length===0)return;L[t].weight=e;const o=100-e,i=n.reduce((s,r)=>s+r.weight,0);if(i===0){const s=Math.floor(o/n.length);n.forEach(c=>c.weight=s);const r=n.reduce((c,d)=>c+d.weight,0);n[0].weight+=o-r}else{const s=o/i;let r=0;n.forEach((l,m)=>{l.weight=Math.max(1,Math.round(l.weight*s)),r+=l.weight});let c=o-r,d=0;for(;c!==0&&d<20;){d++;for(const l of n)if(c>0?(l.weight++,c--):c<0&&l.weight>1&&(l.weight--,c++),c===0)break}c!==0&&n.length>0&&(n[0].weight=Math.max(1,n[0].weight+c))}const a=L.reduce((s,r)=>s+r.weight,0);a!==100&&L.length>0&&(L[0].weight+=100-a),U(),Y(),X(),G()}function X(){const t={};L.forEach(n=>{t[n.sector]=(t[n.sector]||0)+n.weight});const e=Object.entries(t).map(([n,o])=>({name:n,value:o}));Vt(e)}function Xt(){return L.map(t=>({code:t.code,weight:t.weight}))}function Jt(){return b.period==="custom"?"custom"+(b.customMonths||18):b.period}let $t=!1;function Qt(t){var r,c;const{results:e,amount:n,leverage:o}=t,i=n||1e5,a=o||1,s=[...e].sort((d,l)=>d.rank-l.rank);Zt(s,i,a),Ht("chart-returns",s,i,a),te(s,i,a),$t||((r=document.getElementById("chart-mode-pct"))==null||r.addEventListener("click",()=>xt("pct")),(c=document.getElementById("chart-mode-value"))==null||c.addEventListener("click",()=>xt("value")),$t=!0)}function Zt(t,e,n){const o=document.getElementById("ranking-table");if(!o)return;const i=["🥇","🥈","🥉"];o.innerHTML=t.map((a,s)=>{const r=a.isUser,c=s<3?i[s]:a.rank,d=a.totalReturn>=0?"text-neon-red":"text-neon-green",l=r?"user-highlight":"",m=a.totalReturn*n,u=parseFloat(Math.max(-100,m).toFixed(1)),x=Math.round(e*u/100),h=(u>=0?"+":"")+Number(x).toLocaleString(),R=parseFloat((a.maxDrawdown*n).toFixed(1));let D="";if(!r&&a.holdingsDetail&&a.holdingsDetail.length>0){const E=a.holdingsDetail.map(k=>`<div class="flex justify-between text-xs py-1">
          <span class="text-gray-400">${k.name}</span>
          <span class="text-neon-blue font-mono">${k.weight}%</span>
        </div>`).join("");D=`
        <div class="mt-2 pt-2 border-t border-dark-600/30 holdings-detail hidden" id="holdings-${s}">
          <div class="text-xs text-gray-500 mb-1">持仓成分</div>
          ${E}
        </div>
      `}return`
      <div class="rank-row ${l} animate-slide-up" style="animation-delay: ${s*.08}s">
        <span class="rank-badge">${c}</span>
        <span class="text-2xl flex-shrink-0">${a.icon||""}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-white font-medium text-sm truncate">
              ${r?"⭐ ":""}${a.label}
            </span>
            ${a.isBenchmark?'<span class="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-dark-500/50">基准</span>':""}
            ${!a.isUser&&!a.isBenchmark?'<span class="text-xs text-neon-purple px-2 py-0.5 rounded-full bg-dark-500/50">AI</span>':""}
          </div>
          <div class="text-xs text-gray-500">${a.description||""}</div>
          ${!r&&a.holdingsDetail?`<button class="text-xs text-neon-blue mt-1 hover:underline" onclick="toggleHoldings(${s})">查看持仓</button>`:""}
          ${D}
        </div>
        <div class="text-right flex-shrink-0">
          <div class="font-mono font-bold ${d} text-base">
            ${u>=0?"+":""}${u.toFixed(1)}%
          </div>
          <div class="text-xs ${d} font-mono">
            ${h}元
          </div>
          <div class="text-xs text-gray-500">
            最大回撤 ${R}%
          </div>
        </div>
      </div>
    `}).join(""),window.toggleHoldings||(window.toggleHoldings=function(a){const s=document.getElementById(`holdings-${a}`);s&&s.classList.toggle("hidden")})}function te(t,e,n){const o=document.getElementById("metrics-table");if(!o)return;const i=["基金","累计收益","年化收益","最大回撤","夏普比率","胜率"],a=t.map(s=>{const r=s.totalReturn>=0?"metric-up":"metric-down",c=s.totalReturn*n,d=parseFloat(Math.max(-100,c).toFixed(1)),l="★".repeat(s.fundRating||0)+"☆".repeat(5-(s.fundRating||0)),m=s.isUser?`
      <div class="mt-2 pt-2 border-t border-dark-600/30">
        <div class="grid grid-cols-6 gap-2 text-xs">
          <div class="text-center">
            <div class="text-gray-500">索提诺</div>
            <div class="font-mono ${s.sortinoRatio>=1?"text-neon-green":"text-gray-300"}">${s.sortinoRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">信息比率</div>
            <div class="font-mono ${s.informationRatio>=.5?"text-neon-green":"text-gray-300"}">${s.informationRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">Calmar</div>
            <div class="font-mono text-gray-300">${s.calmarRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">盈亏比</div>
            <div class="font-mono text-gray-300">${s.profitLossRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">评级</div>
            <div class="font-mono text-gold-400">${l}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">风险等级</div>
            <div class="font-mono ${s.riskLevel==="高"?"text-neon-red":s.riskLevel==="低"?"text-neon-green":"text-gray-300"}">${s.riskLevel||"中"}</div>
          </div>
        </div>
      </div>
    `:"";return`
      <tr class="border-b border-dark-600/30 hover:bg-dark-700/30 transition-colors">
        <td class="px-3 py-2.5 text-sm text-white font-medium whitespace-nowrap">
          ${s.isUser?"⭐ ":s.icon+" "}${s.label}
        </td>
        <td class="px-3 py-2.5 font-mono text-sm ${r}">${d>=0?"+":""}${d.toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${s.annualizedReturn>=0?"+":""}${s.annualizedReturn}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${(s.maxDrawdown*n).toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm ${s.sharpeRatio>=1?"text-neon-green":s.sharpeRatio>=.5?"text-gray-300":"text-neon-red"}">${s.sharpeRatio}</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${s.winRate}%</td>
      </tr>
      ${s.isUser?`<tr><td colspan="6" class="px-3 py-2 bg-dark-700/20">${m}</td></tr>`:""}
    `}).join("");o.innerHTML=`
    <div class="overflow-x-auto">
      <table class="metrics-table w-full text-xs">
        <thead>
          <tr class="border-b border-dark-500/30">
            ${i.map(s=>`<th class="px-3 py-2 text-left font-medium whitespace-nowrap cursor-help" title="${ee(s)}">${s}</th>`).join("")}
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
  `}function ee(t){return{基金:"基金名称",累计收益:"回测期内的总收益率",年化收益:"按年计算的收益率",最大回撤:"从高点到低点的最大亏损幅度",夏普比率:"风险调整后收益，>1优秀",胜率:"盈利交易日占比"}[t]||t}window.showMetricDetail||(window.showMetricDetail=function(t){const n={sharpe:{title:"夏普比率 (Sharpe Ratio)",content:`夏普比率 = (年化收益率 - 无风险利率) / 年化波动率

这是最著名的风险调整收益指标，由诺贝尔经济学奖得主威廉·夏普提出。

解读标准：
• > 2.0：卓越，顶级基金水平
• 1.0-2.0：优秀，值得投资
• 0.5-1.0：一般，勉强可接受
• < 0.5：较差，风险收益比不佳

注意：夏普比率惩罚所有波动（包括上涨），所以牛市中可能偏低。`},sortino:{title:"索提诺比率 (Sortino Ratio)",content:`索提诺比率 = (年化收益率 - 无风险利率) / 下行标准差

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
   - 衡量风险调整收益

2. 最大回撤（权重25%）
   - 衡量风险控制能力

3. 年化收益（权重25%）
   - 衡量绝对收益能力

4. 胜率（权重20%）
   - 衡量稳定性

评级标准：
• ★★★★★：4-5分，顶级基金
• ★★★★☆：3-4分，优秀基金
• ★★★☆☆：2-3分，良好基金
• ★★☆☆☆：1-2分，一般基金
• ★☆☆☆☆：<1分，需谨慎`}}[t];n&&alert(`${n.title}

${n.content}`)});function ne(t){const{styleTag:e,matchPerson:n,matchPersonDesc:o,matchPersonOrg:i,metrics:a,radarData:s,commentary:r}=t,c=document.getElementById("diagnosis-tag");c&&(c.innerHTML=`
      <span class="diagnosis-badge text-xl md:text-2xl animate-fade-in">${e}</span>
    `);const d=document.getElementById("diagnosis-subtitle");d&&(d.innerHTML=`
      <span class="text-gray-400">对标人物：</span>
      <span class="text-neon-blue font-bold">${n}</span>
      <span class="text-gray-500 text-sm"> — ${o}</span>
      ${i?`<span class="text-gray-600 text-sm block">${i}</span>`:""}
    `),Wt("chart-radar",s,"你的基金");const l=document.getElementById("commentary-text");if(l&&r){const m=r.split(`

`).map(u=>u.trim()).filter(Boolean);l.innerHTML=m.map((u,x)=>'<p style="margin-bottom:'+(x<m.length-1?"12px":"0")+';line-height:1.8;">'+u+"</p>").join("")}oe(a)}function oe(t){const e=document.getElementById("ai-commentary");if(!e)return;let n=document.getElementById("metrics-summary");n&&n.remove(),n=document.createElement("div"),n.id="metrics-summary";const o=(s,r)=>{if(s==null||isNaN(s))return"-";const c=Math.pow(10,r);return Math.round(s*c)/c},i="★".repeat(t.fundRating||0)+"☆".repeat(5-(t.fundRating||0)),a=t.fundRating>=4?"text-gold-400":t.fundRating>=3?"text-neon-blue":"text-gray-400";n.innerHTML=`
    <div class="mt-4 pt-4 border-t border-dark-600/30">
      <!-- 基金评级卡片 -->
      <div class="bg-dark-700/50 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-400">基金评级</span>
          <span class="text-2xl ${a}">${i}</span>
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
  `,e.appendChild(n)}const F=252;function j(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}const ae={"3m":Math.floor(F/4),"6m":Math.floor(F/2),"1y":F,"3y":F*3,"5y":F*5,"10y":F*10};function se(t){if(t.startsWith("custom")){const e=parseInt(t.replace("custom",""))||18;return Math.floor(F*e/12)}return ae[t]||F}function Ft(t,e,n){var pt;const o=Math.min(se(n),F*10),i={};t.stocks.forEach(f=>{i[f.code]=f});const a=[],s=100,r=((pt=i[e[0].code])==null?void 0:pt.prices.length)||F*5;for(let f=o;f>0;f--){const S=r-f;let et=0;for(const nt of e){const ot=i[nt.code];if(!ot||S>=ot.prices.length)continue;const jt=ot.prices[S],Tt=ot.prices[r-o],Ot=nt.weight/100;et+=Ot*(jt/Tt)}a.push(parseFloat((s*et).toFixed(4)))}const c=a[a.length-1],d=j((c-s)/s*100,2);let l=0,m=a[0];for(const f of a){f>m&&(m=f);const S=(m-f)/m*100;S>l&&(l=S)}l=j(l,2);const u=o/F,x=j((Math.pow(c/s,1/u)-1)*100,2),h=[];for(let f=1;f<a.length;f++)h.push((a[f]-a[f-1])/a[f-1]);const R=h.reduce((f,S)=>f+S,0)/h.length,D=h.reduce((f,S)=>f+Math.pow(S-R,2),0)/h.length,E=Math.sqrt(D),k=j(E*Math.sqrt(F)*100,2),M=.02,g=k>0?j((x/100-M)/(k/100),2):0,v=h.filter(f=>f<0),w=v.length>0?Math.sqrt(v.reduce((f,S)=>f+Math.pow(S-v.reduce((et,nt)=>et+nt,0)/v.length,2),0)/v.length):0,I=w>0?j((x/100-M)/(w*Math.sqrt(F)),2):0,B=j((x/100-M)/1,2),p=h.map(f=>f-M/F),y=Math.sqrt(p.reduce((f,S)=>f+S*S,0)/p.length)*Math.sqrt(F),O=y>0?j((x/100-M)/y,2):0,z=l>0?j(x/l,2):0,$=h.filter(f=>f>0).length,C=j($/h.length*100,1),it=h.filter(f=>f>0).reduce((f,S)=>f+S,0)/h.filter(f=>f>0).length||0,W=Math.abs(h.filter(f=>f<0).reduce((f,S)=>f+S,0)/h.filter(f=>f<0).length)||0,rt=W>0?j(it/W,2):0;let A=0,N=[];g>=1.5?(A+=2,N.push("夏普比率优秀")):g>=1?(A+=1.5,N.push("夏普比率良好")):g>=.5&&(A+=1,N.push("夏普比率一般")),l<=10?(A+=1.5,N.push("回撤控制优秀")):l<=20?(A+=1,N.push("回撤控制良好")):l<=30&&(A+=.5),x>=20?(A+=1.5,N.push("收益表现优秀")):x>=10?(A+=1,N.push("收益表现良好")):x>=5&&(A+=.5),C>=60&&(A+=.5,N.push("胜率较高")),A=Math.min(5,Math.max(1,Math.round(A)));let lt="中";l<=15&&k<=20?lt="低":(l>=30||k>=40)&&(lt="高");const ft=Math.max(1,Math.floor(a.length/50)),ct=[],dt=[];for(let f=0;f<a.length;f+=ft)ct.push(a[f]),dt.push(f);(a.length-1)%ft!==0&&(ct.push(a[a.length-1]),dt.push(a.length-1));const At=new Date,ut=new Date(At);ut.setDate(ut.getDate()-o);const zt=dt.map(f=>{const S=new Date(ut);return S.setDate(S.getDate()+f),S.getMonth()+1+"/"+S.getDate()});return{name:"user",label:"你的基金",isUser:!0,totalReturn:d,annualizedReturn:x,annualizedVol:k,maxDrawdown:l,sharpeRatio:g,sortinoRatio:I,treynorRatio:B,informationRatio:O,calmarRatio:z,profitLossRatio:rt,winRate:C,fundRating:A,ratingReasons:N,riskLevel:lt,initialValue:s,finalValue:c,chartData:ct,dateLabels:zt,days:o,holdings:e.map(f=>{const S=i[f.code];return{code:f.code,name:(S==null?void 0:S.name)||f.code,weight:f.weight}})}}function ie(t,e){const n=[];return n.push(...re(t,e)),n.push(...le(t,e)),n}function q(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}function re(t,e){const n=t.stocks,o=n.filter(d=>d.market==="a-share").sort((d,l)=>l.marketCap-d.marketCap).slice(0,20),i=o.map(d=>({code:d.code,weight:q(100/o.length,1)})),a=n.filter(d=>d.market==="a-share"&&(d.sector==="科技"||d.sector==="医药"||d.sector==="新能源")).filter(d=>d.marketCap<5e3).slice(0,15),s=a.map(d=>({code:d.code,weight:q(100/a.length,1)})),r=n.filter(d=>d.market==="us"&&d.sector==="科技").sort((d,l)=>l.marketCap-d.marketCap).slice(0,10),c=r.map(d=>({code:d.code,weight:q(100/r.length,1)}));return[_("benchmark-csi300","沪深300","A股大盘蓝筹基准","📊",i,t,e),_("benchmark-gem","创业板指","A股成长创新基准","📊",s,t,e),_("benchmark-nasdaq","纳斯达克100","美股科技龙头基准","📊",c,t,e)]}function le(t,e){const n=t.stocks,o=n.filter(m=>m.pe>0&&m.pe<25&&m.dividendYield>2).filter(m=>m.sector==="消费"||m.sector==="金融").sort((m,u)=>u.dividendYield-m.dividendYield).slice(0,8),i=o.map(m=>({code:m.code,weight:q(100/o.length,1)})),a=n.filter(m=>m.revenueGrowth>10).filter(m=>m.sector==="科技"||m.sector==="医药"||m.sector==="新能源").sort((m,u)=>u.revenueGrowth-m.revenueGrowth).slice(0,8),s=a.map(m=>({code:m.code,weight:q(100/a.length,1)})),r=n.map(m=>{const u=m.prices,x=u[u.length-1],h=u[Math.max(0,u.length-63)];return{...m,momentum:q((x-h)/h*100,2)}}).sort((m,u)=>u.momentum-m.momentum).slice(0,8),c=r.map(m=>({code:m.code,weight:q(100/r.length,1)})),d=n.filter(m=>m.roe>5).map(m=>{const u=m.prices,x=u[u.length-1],h=u[Math.max(0,u.length-63)];return{...m,change:q((x-h)/h*100,2)}}).sort((m,u)=>m.change-u.change).slice(0,8),l=d.map(m=>({code:m.code,weight:q(100/d.length,1)}));return[_("ai-value","🧓 价值大师","深度价值投资","🤖",i,t,e),_("ai-growth","🚀 成长猎手","激进成长投资","🤖",s,t,e),_("ai-momentum","📈 趋势追踪","动量交易策略","🤖",c,t,e),_("ai-reverse","🔄 逆向投资","超跌反转策略","🤖",l,t,e)]}function _(t,e,n,o,i,a,s){const r=Ft(a,i,s);return r.name=t,r.label=e,r.description=n,r.icon=o,r.isUser=!1,r.isBenchmark=o==="📊",r.holdingsDetail=i.map(c=>{const d=a.stocks.find(l=>l.code===c.code);return{code:c.code,name:(d==null?void 0:d.name)||c.code,weight:c.weight,sector:(d==null?void 0:d.sector)||"未知",market:(d==null?void 0:d.market)||"未知"}}),r}const at=[{id:"jiucai",emoji:"🥬",name:"韭菜本菜",matchPerson:"每一个在市场里交过学费的人",personDesc:"初代股民集体回忆",personOrg:"",condition:t=>t.totalReturn<0&&t.concentration>.5},{id:"foxi",emoji:"🧘",name:"佛系躺平派",matchPerson:"但斌",personDesc:"「时间的玫瑰」——买了就当忘了",personOrg:"东方港湾董事长",condition:t=>t.turnover<.3&&t.bluechipRatio>.6},{id:"jiuxiang",emoji:"🍶",name:"酱香科技研究员",matchPerson:"张坤",personDesc:"易方达蓝筹精选掌舵人",personOrg:"易方达基金",condition:t=>(t.sectorWeights.消费||0)>30},{id:"yaoyao",emoji:"💊",name:"医药葛兰分兰",matchPerson:"葛兰",personDesc:"中欧医疗健康，医药赛道信仰者",personOrg:"中欧基金",condition:t=>(t.sectorWeights.医药||0)>40},{id:"ark",emoji:"🚀",name:"ARK中国分K",matchPerson:"Cathie Wood",personDesc:"ARK Invest创始人",personOrg:"ARK Invest",condition:t=>(t.sectorWeights.科技||0)>50&&t.turnover>.5},{id:"buffett",emoji:"👴",name:"巴菲特传人",matchPerson:"Warren Buffett",personDesc:"价值投资灯塔",personOrg:"伯克希尔·哈撒韦",condition:t=>(t.sectorWeights.消费||0)+(t.sectorWeights.金融||0)>50&&t.turnover<.3&&t.roe>15},{id:"diamond",emoji:"🦍",name:"钻石手",matchPerson:"WSB散户大军",personDesc:"「Diamond Hands」——回撤50%也绝不割肉",personOrg:"Reddit r/wallstreetbets",condition:t=>t.maxDrawdown>25&&t.turnover<.3},{id:"wolf",emoji:"🐺",name:"华尔街之狼",matchPerson:"各路游资大佬",personDesc:"高频交易，主打一个刺激",personOrg:"龙虎榜常客",condition:t=>t.turnover>.8},{id:"national",emoji:"🏛️",name:"国家队在逃成员",matchPerson:"社保基金/汇金",personDesc:"银行+央企+蓝筹，稳如泰山",personOrg:"全国社保基金理事会",condition:t=>(t.sectorWeights.金融||0)>40&&t.annualizedVol<20&&t.roe>10},{id:"global",emoji:"🌍",name:"全球宏观玩家",matchPerson:"Ray Dalio",personDesc:"桥水基金创始人",personOrg:"桥水基金",condition:t=>t.crossMarket&&t.marketCount>=3},{id:"growth",emoji:"🌱",name:"成长股猎人",matchPerson:"朱少醒",personDesc:"富国天惠，15年20倍的公募传奇",personOrg:"富国基金",condition:t=>(t.sectorWeights.科技||0)>30&&t.revenueGrowth>20},{id:"balanced",emoji:"⚖️",name:"均衡配置达人",matchPerson:"谢治宇",personDesc:"兴全合润，不偏科的均衡派代表",personOrg:"兴证全球基金",condition:t=>t.maxSectorWeight<35&&t.stockCount>=6}];function Q(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function ce(t,e,n,o){var I,B;const i=Object.entries(e.sectorWeights||{}).sort((p,y)=>y[1]-p[1]),a=i[0]||["未知",0];i[1];const s=Object.entries(e.marketWeights||{}).sort((p,y)=>y[1]-p[1]),r={"a-share":"🇨🇳A股",hk:"🇭🇰港股",us:"🇺🇸美股",index:"📊指数ETF"};let c=null,d=null,l=-1/0,m=1/0;n.forEach(p=>{const y=o[p.code];!y||y.pe<=0||(y.pe>l&&(l=y.pe,c=y),y.pe<m&&(m=y.pe,d=y))});const u=[],x={},h={};n.forEach(p=>{const y=o[p.code];y&&(x[y.market]=(x[y.market]||0)+p.weight,h[y.sector]=(h[y.sector]||0)+p.weight)});const R=Object.entries(x).sort((p,y)=>y[1]-p[1]),D=Object.entries(h).sort((p,y)=>y[1]-p[1]),E=(I=R[0])==null?void 0:I[0],k=((B=R[0])==null?void 0:B[1])||0,M=R.length;if(u.push(`🔍 你的投资风格是「${t.emoji} ${t.name}」，最接近的偶像是${t.matchPerson}——${t.personDesc}。${t.matchPersonOrg?"现任"+t.matchPersonOrg+"。":""}`),D.length>0){const p=D[0],y=D[1]||["无",0];u.push(`📊 行业配置：重仓「${p[0]}」(${p[1].toFixed(0)}%)${y[1]>0?`，其次是「${y[0]}」(${y[1].toFixed(0)}%)`:""}。${p[1]>50?'单一行业集中度偏高，属于"把鸡蛋放在一个篮子里"的类型，涨跌都容易放大。':p[1]<30?'行业分布均衡，分散化做得不错，属于"不把鸡蛋放在一个篮子里"的稳健派。':"行业集中度适中，攻守兼备。"}`)}if(M>=2){const p=R.map(y=>`${r[y[0]]||y[0]}(${y[1].toFixed(0)}%)`).join("、");u.push(`🌍 市场配置：覆盖${M}个市场——${p}。${M>=3?"全球化视野开阔，真正做到了「东方不亮西方亮」！这配置，巴菲特看了都想抄作业。":"跨市场配置不错，分散了单一市场的系统性风险。"}`)}else if(E){const p=r[E]||E,y={"a-share":"全仓A股？格局小了！虽然国货当自强，但全球配置才能睡得香。建议适当配置港股和美股，分散单一市场风险。",hk:"专注港股？港股通确实有机会，但恒生指数波动大，建议适当配置A股和美股对冲风险。",us:"All in美股？纳斯达克确实香，但美股也有回调风险。建议适当配置A股和港股，享受新兴市场红利。",index:"只买指数？被动投资确实省心，但主动选股才能创造超额收益。"};u.push(`🌍 市场配置：${p}占比${k.toFixed(0)}%。${y[E]||"单一市场配置风险集中，建议适当分散到其它市场。"}`)}const g=e.totalReturn>=0?"盈利":"亏损";if(u.push(`💰 回测期内${g}${e.totalReturn>=0?"+":""}${e.totalReturn.toFixed(1)}%（年化${e.annualizedReturn>=0?"+":""}${e.annualizedReturn.toFixed(1)}%），最大回撤${e.maxDrawdown.toFixed(1)}%，夏普比率${e.sharpeRatio.toFixed(2)}。`),e.totalReturn>50?u.push(`收益炸裂！但${e.maxDrawdown.toFixed(1)}%的回撤也说明「富贵险中求」。记住：凭运气赚的钱，别凭实力亏回去。`):e.totalReturn>10?u.push("收益稳健可期，回撤控制得当，属于「稳稳幸福」型选手。"):e.totalReturn>0?u.push("勉强跑赢存款，但距离「财富自由」还有差距。优化行业配置，提升夏普比率是下一步关键。"):u.push("亏钱不可怕，可怕的是不知道为什么亏。复盘这段时期的选股逻辑，总结经验教训。"),u.push(`💼 持仓画像：${e.stockCount}只标的，`),e.stockCount<=2?u.push('集中度拉满，属于"一把梭"风格——赢了会所嫩模，输了下海干活。建议下次别满仓单调，毕竟黑天鹅来的时候，连巴菲特都扛不住😅'):e.stockCount<=5?u.push('集中度适中，属于"精选龙头"派。既不会因为太分散而平庸，也不会因为太集中而暴雷。保持这个节奏，复利效应会帮你实现财富自由🎯'):u.push('分散得比沪深300还均匀，属于"不把鸡蛋放在一个篮子里"的稳健派。虽然短期爆发力不足，但长期下来，时间会成为你的朋友⏰'),c&&d){const p=e.pe<15?'整体估值偏低，属于"捡烟蒂"型投资者——格雷厄姆看了都想收你为徒。不过要小心价值陷阱，便宜的不一定好，好的不一定便宜🚬':e.pe>35?'整体估值偏高，属于"为梦想窒息"型——费雪看了都点赞。但高估值需要高成长来消化，一旦业绩不及预期，杀估值的时候会很疼💸':'估值水平合理，既不贪便宜也不追泡沫，属于"性价比"选手。这种理性在A股难能可贵，继续保持🧘';u.push(`📊 PE跨度从${d.name}(${m.toFixed(0)})到${c.name}(${l.toFixed(0)})，${p}`)}const v=e.leverage||1;if(v>3){const p=e.totalReturn>=0?`${v}x杠杆！这次确实赚麻了，但别忘了杠杆是把双刃剑——${(e.maxDrawdown*v).toFixed(0)}%的最大回撤意味着${e.maxDrawdown>20?'一个不小心就是"天台见"的节奏。建议赶紧把杠杆降下来，别让到手的鸭子飞了🦆':"风控稍有闪失就会放大亏损。建议见好就收，别被胜利冲昏头脑😵"}`:`${v}x杠杆！${(e.maxDrawdown*v).toFixed(0)}%的回撤已经让你的本金腰斩，再不减仓就要归零了。赶紧降杠杆，活着最重要！🆘`;u.push(`⚠️ ${p}`)}else v>1&&u.push(`⚡ ${v}x杠杆，属于"小赌怡情"的范畴。适度放大收益和风险，但记得设置止损线，别让"怡情"变成"伤身"🎰`);u.push("💡 老炮的几条忠告（建议截图保存）：");let w=1;return a[1]>50&&u.push(`${w++}. 「${a[0]}」占比过高，建议适当减仓。单一行业就像单恋一枝花，虽然深情但风险太大，分散配置才能"万花丛中过，片叶不沾身"🌸`),s.length<2&&u.push(`${w++}. 只玩A股？格局小了！建议配置纳指ETF或标普500ETF，享受全球龙头成长红利。毕竟"东方不亮西方亮"，分散投资才能睡得香🌍`),e.maxDrawdown>25&&u.push(`${w++}. 回撤超过25%，心脏还好吗？建议加入黄金ETF或国债ETF作为"压舱石"，平滑净值曲线。毕竟投资是为了更好的生活，不是为了体验过山车🎢`),e.sharpeRatio<.3&&u.push(`${w++}. 夏普比率偏低，说明冒了较大风险却未获得对应回报。建议优化选股，或者考虑买指数基金，毕竟"打不过就加入"也是一种智慧📈`),e.totalReturn<0&&u.push(`${w++}. 这次亏了别灰心，投资是一场马拉松。复盘一下选股逻辑，总结经验教训。记住："亏钱不可怕，可怕的是不知道为什么亏"💪`),u.push(`${w++}. 定期复盘、动态再平衡是长期盈利的关键。不要买入后就"躺平"，市场变化比你想象的快。记住："投资有风险，入市需谨慎"⚠️`),u.join(`

`)}function de(t,e,n){const o={};t.stocks.forEach(k=>{o[k.code]=k});const i={},a={};let s=0,r=0,c=0,d=0;e.forEach(k=>{const M=o[k.code];if(!M)return;const g=k.weight/100;i[M.sector]=(i[M.sector]||0)+k.weight,a[M.market]=(a[M.market]||0)+k.weight,s+=M.revenueGrowth*g,r+=M.roe*g,c+=M.pe*g,M.marketCap>3e3&&d++});const l=e.length<=5?.7:e.length<=7?.4:.25,u=(i.科技||0)>40?.6+Math.random()*.2:.2+Math.random()*.3,x={totalReturn:n.totalReturn,annualizedReturn:n.annualizedReturn,annualizedVol:n.annualizedVol,maxDrawdown:n.maxDrawdown,sharpeRatio:n.sharpeRatio,sortinoRatio:n.sortinoRatio,informationRatio:n.informationRatio,calmarRatio:n.calmarRatio,profitLossRatio:n.profitLossRatio,winRate:n.winRate,fundRating:n.fundRating,ratingReasons:n.ratingReasons,riskLevel:n.riskLevel,sectorWeights:i,marketWeights:a,concentration:l,turnover:u,revenueGrowth:parseFloat(s.toFixed(1)),roe:parseFloat(r.toFixed(2)),pe:parseFloat(c.toFixed(2)),bluechipRatio:parseFloat((d/e.length).toFixed(2)),maxSectorWeight:parseFloat(Math.max(...Object.values(i)).toFixed(1)),stockCount:e.length,crossMarket:Object.keys(a).length>=2,marketCount:Object.keys(a).length};let h=null,R=0;for(const k of at)if(k.condition(x)){const M=k.id==="jiucai"?5:k.id==="global"?3:1;M>R&&(R=M,h=k)}h||(h=at.find(k=>k.id==="balanced")||at[at.length-1]);const D=ce(h,x,e,o),E={dimensions:["年化收益","风险控制","行业集中度","跨市场配置","选股ROE"],values:[Q(Math.min(100,Math.max(0,x.annualizedReturn+50)),0),Q(Math.min(100,Math.max(0,100-x.annualizedVol)),0),Q(Math.min(100,Math.max(0,x.maxSectorWeight)),0),Q(Math.min(100,Math.max(0,Object.keys(a).length*30)),0),Q(Math.min(100,Math.max(0,x.roe*1.5)),0)]};return{styleTag:`${h.emoji} ${h.name}`,matchPerson:h.matchPerson,matchPersonDesc:h.personDesc,matchPersonOrg:h.personOrg||"",styleId:h.id,metrics:x,radarData:E,commentary:D}}let st=null,gt=null;function ue(){const t=document.getElementById("particle-canvas");if(!t)return;const e=t.getContext("2d");let n=[];st&&(cancelAnimationFrame(st),st=null),gt&&window.removeEventListener("resize",gt);function o(){t.width=window.innerWidth,t.height=window.innerHeight}o(),gt=o,window.addEventListener("resize",o);class i{constructor(){this.reset()}reset(){this.x=Math.random()*t.width,this.y=Math.random()*t.height,this.size=Math.random()*2+.5,this.speedX=(Math.random()-.5)*.3,this.speedY=(Math.random()-.5)*.3,this.opacity=Math.random()*.5+.1}update(){this.x+=this.speedX,this.y+=this.speedY,(this.x<0||this.x>t.width||this.y<0||this.y>t.height)&&this.reset()}draw(){e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fillStyle=`rgba(79, 195, 247, ${this.opacity})`,e.fill()}}for(let s=0;s<80;s++)n.push(new i);function a(){e.clearRect(0,0,t.width,t.height),n.forEach(s=>{s.update(),s.draw()});for(let s=0;s<n.length;s++)for(let r=s+1;r<n.length;r++){const c=n[s].x-n[r].x,d=n[s].y-n[r].y,l=Math.sqrt(c*c+d*d);l<120&&(e.beginPath(),e.moveTo(n[s].x,n[s].y),e.lineTo(n[r].x,n[r].y),e.strokeStyle=`rgba(79, 195, 247, ${.08*(1-l/120)})`,e.lineWidth=.5,e.stroke())}st=requestAnimationFrame(a)}a()}function ht(t){Gt(),document.querySelectorAll(".screen").forEach(o=>o.classList.remove("active","hidden")),document.querySelectorAll(".screen").forEach(o=>o.classList.add("hidden"));const e=document.getElementById(`screen-${t}`);e&&(e.classList.remove("hidden"),e.classList.add("active"),e.scrollIntoView({behavior:"smooth",block:"start"})),b.currentScreen=t;const n=document.getElementById("header");n&&(n.style.display=t==="builder"?"":"none")}async function Pt(){try{const e=await fetch("./"+"stocks.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);const n=await e.json();return n.stocks.forEach(o=>{o.latestPrice=o.prices[o.prices.length-1]}),b.stocksData=n,b.stocksData}catch(t){return console.error("Failed to load stocks:",t),null}}async function me(){var e,n,o,i;const t=document.getElementById("btn-start");t.disabled=!0,t.textContent="⏳ 回测计算中...";try{const a=Xt(),s=Jt();let r=parseFloat((e=document.getElementById("invest-amount"))==null?void 0:e.value)||1e5;r=Math.max(100,Math.min(1e8,r));const c=parseFloat((n=document.getElementById("leverage"))==null?void 0:n.value)||1;let d=b.fundName||((i=(o=document.getElementById("fund-name"))==null?void 0:o.value)==null?void 0:i.trim());d||(d=fe(a,b.stocksData)),b.stocksData||await Pt();const l=Ft(b.stocksData,a,s);l.label=d,l.amount=r,l.leverage=c,b.userResult=l,b.holdings=a,b.investAmount=r,b.leverage=c;const m=ie(b.stocksData,s),u=[l,...m];u.sort((x,h)=>h.totalReturn-x.totalReturn),u.forEach((x,h)=>{x.rank=h+1}),b.backtestResults=u,ht("arena"),Qt({fundName:d,period:s,results:u,amount:r,leverage:c})}catch(a){Mt("回测失败："+a.message,"error"),t.disabled=!1,t.textContent="⚡ 开始挑战"}}function ge(){ht("diagnosis");const t={...b.userResult,totalReturn:b.userResult.totalReturn*b.leverage,maxDrawdown:b.userResult.maxDrawdown*b.leverage},e=de(b.stocksData,b.holdings,t);e.metrics.leverage=b.leverage,ne(e)}function he(){b.fundName="",b.holdings=[],b.backtestResults=null,b.userResult=null,document.getElementById("fund-name").value="",document.getElementById("btn-start").disabled=!0,ht("builder"),Bt()}function fe(t,e){var g;if(!t||t.length===0)return"我的基金";const n={};e&&e.stocks&&e.stocks.forEach(v=>{n[v.code]=v});const o={},i={};let a=!1,s=!1,r=!1,c=!1;t.forEach(v=>{const w=n[v.code];w&&(o[w.market]=(o[w.market]||0)+v.weight,i[w.sector]=(i[w.sector]||0)+v.weight,w.sector==="科技"&&(a=!0),w.sector==="金融"&&(s=!0),w.sector==="消费"&&(r=!0),w.sector==="医药"&&(c=!0))});const d=Object.entries(o).sort((v,w)=>w[1]-v[1]),l=((g=d[0])==null?void 0:g[0])||"a-share",m=d.length,u={"a-share":["华夏","国泰","南方","易方达","嘉实","博时","广发","富国"],hk:["港股","香港","恒生","中港","沪港深"],us:["纳斯达克","标普","美股","全球","海外"],index:["指数","ETF","被动"]};let x;m>=3?x=["全球","国际","环球","世界","跨市场"]:m===2?x=["沪港深","深港通","AH","中美","跨市场"]:x=u[l]||u["a-share"];let h=[];a&&t.length<=3?h=["创新","科技","成长","新兴","前沿","智能"]:s&&t.length<=3?h=["金融","价值","蓝筹","红利","稳健","精选"]:r&&t.length<=3?h=["消费","品质","生活","品牌","升级"]:c&&t.length<=3?h=["健康","医疗","生命","医药","生物"]:t.length>=8?h=["优选","精选","配置","均衡","多元","全能"]:t.length<=3?h=["聚焦","集中","核心","龙头","精选","优势"]:h=["成长","价值","均衡","轮动","趋势","精选","优选","灵活"];const R=["混合","股票","配置","优选","精选","成长","价值","稳健","进取","灵活"],D=x[Math.floor(Math.random()*x.length)],E=h[Math.floor(Math.random()*h.length)],k=R[Math.floor(Math.random()*R.length)],M=[D+E+k,D+k+E,E+k,D+E];return M[Math.floor(Math.random()*M.length)]}async function pe(){ue(),await Pt(),Bt();const t=document.getElementById("invest-amount");t&&(t.addEventListener("input",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value&&parseInt(n.target.value)!==o&&(n.target.value=o)}),t.addEventListener("blur",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value=o})),document.getElementById("btn-start").addEventListener("click",me),document.getElementById("btn-diagnosis").addEventListener("click",ge),document.getElementById("btn-restart").addEventListener("click",he),document.getElementById("fund-name").addEventListener("input",n=>{b.fundName=n.target.value.trim(),G()});const e=document.getElementById("leverage");e&&e.addEventListener("input",()=>{document.getElementById("leverage-display").textContent=e.value+"x"})}pe();

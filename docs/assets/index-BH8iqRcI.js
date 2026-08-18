(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();const b={currentScreen:"builder",fundName:"",holdings:[],period:"1y",backtestResults:null,stocksData:null,userResult:null,investAmount:1e5,leverage:1,customMonths:18};let mt=null;function Mt(t,e="info"){const n=document.getElementById("toast-message");n&&n.remove(),mt&&clearTimeout(mt);const o=document.createElement("div");o.id="toast-message";const r=e==="error"?"bg-red-500/90":e==="success"?"bg-green-500/90":"bg-neon-blue/90";o.className=`fixed top-4 left-1/2 transform -translate-x-1/2 ${r} text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in`,o.textContent=t,document.body.appendChild(o),mt=setTimeout(()=>{o.style.opacity="0",o.style.transition="opacity 0.3s",setTimeout(()=>o.remove(),300)},3e3)}function G(){const t=document.getElementById("btn-start");if(!t)return;const e=b.holdings||[];t.disabled=e.length<1}let T=null,O=null,N=null,Lt="pct",Et=[],Rt=1e5,St=1;function V(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function Ht(t,e){const n=t.length;if(n<10)return[];const o=(n-1)/2,r=t.reduce((l,u)=>l+u,0)/n;let a=0,s=0;for(let l=0;l<n;l++)a+=(l-o)*(t[l]-r),s+=(l-o)*(l-o);const i=s!==0?a/s:0,c=t[n-1],d=[];for(let l=1;l<=e;l++){const u=(Math.random()-.5)*Math.abs(i)*l*.5;d.push(V(c+i*l+u,2))}return d}function qt(t,e){const n=new Date,o=[],r=t-e;for(let a=0;a<r;a++){const s=new Date(n);s.setDate(s.getDate()-(r-a)),a===0||a===r-1||a%Math.max(1,Math.floor(r/6))===0?o.push(s.getMonth()+1+"/"+s.getDate()):o.push("")}for(let a=0;a<e;a++){const s=new Date(n);s.setDate(s.getDate()+a+1),a===0||a===e-1||a%Math.max(1,Math.floor(e/2))===0?o.push("🔮"+(s.getMonth()+1)+"/"+s.getDate()):o.push("")}return o}function Nt(t,e,n,o){const r=document.getElementById(t);r&&(Et=e,Rt=n||1e5,St=o||1,T&&T.dispose(),T=echarts.init(r),Dt())}function Dt(){const t=Et,e=Rt,n=St,o=Lt==="value",r="#4fc3f7",a=["#69f0ae","#f0c060","#b388ff","#ff80ab","#18ffff","#ffab40","#ff5252"],s=[];let i=0,c=0;const d=t.find(g=>g.isUser);d&&(c=d.chartData.length),t.forEach((g,x)=>{g.chartData.length>i&&(i=g.chartData.length)});let l=[],u=-1;if(d){const g=d.chartData;for(let x=0;x<g.length;x++)if((g[x]-100)*n<=-100){u=x;break}if(u<0){const x=Ht(d.chartData,Math.max(1,Math.floor(i*.05)));x.length>0&&(l=x,i=Math.max(i,c+l.length))}}let h=[];const p=t.find(g=>g.isUser&&g.dateLabels);if(p&&p.dateLabels)h=[...p.dateLabels];else{const g=Math.max(0,i-c);h=qt(i,g)}if(l.length>0&&h.length>0){const g=h[h.length-1],[x,w]=g.split("/").map(Number);for(let B=1;B<=l.length;B++){const E=new Date(2026,x-1,w);E.setDate(E.getDate()+B);const M=B===1||B===l.length||B%Math.max(1,Math.floor(l.length/3))===0?"🔮"+(E.getMonth()+1)+"/"+E.getDate():"";h.push(M)}}t.forEach((g,x)=>{const w=g.isUser,B=g.isBenchmark,E=g.chartData,M=w?r:a[(x-1)%a.length];let y=[],S=-1;if(o)for(let k=0;k<E.length;k++){if((E[k]-100)*n<=-100){S=k,y.push(0);break}y.push(V(e*n*E[k]/100,0))}else for(let k=0;k<E.length;k++){const F=V((E[k]-100)*n,1);if(F<=-100){S=k,y.push(-100);break}y.push(F)}for(;y.length<i;)y.push(null);let z=[...y];if(w&&l.length>0&&!o)for(let k=0;k<l.length;k++){const F=V((l[k]-100)*n,1);c+k<z.length?z[c+k]=F:z.push(F)}else if(w&&l.length>0&&o)for(let k=0;k<l.length;k++){const F=V(e*n*l[k]/100,0);c+k<z.length?z[c+k]=F:z.push(F)}if(w&&l.length>0&&S<0){const k=z.slice(0,c),F=new Array(c-1).fill(null),it=k[k.length-1];F.push(it);for(let W=0;W<l.length;W++){const rt=o?V(e*n*l[W]/100,0):V((l[W]-100)*n,1);F.push(rt)}s.push({name:g.label,type:"line",data:k,smooth:!0,symbol:"none",lineStyle:{width:4,type:"solid",color:M},itemStyle:{color:M},emphasis:{focus:"series",lineStyle:{width:6}},z:10,endLabel:{show:!0,formatter:g.label,color:M,fontSize:11,offset:[10,0]}}),s.push({name:"预测走势",type:"line",data:F,smooth:!0,symbol:"none",lineStyle:{width:3,type:"dashed",color:M,opacity:.7},itemStyle:{color:M},z:9,silent:!0})}else s.push({name:g.label,type:"line",data:z,smooth:!0,symbol:"none",lineStyle:{width:w?4:B?1.5:2,type:"solid",color:M,opacity:B?.5:1},itemStyle:{color:M},emphasis:{focus:"series",lineStyle:{width:w?6:3}},z:w?10:1,endLabel:w?{show:!0,formatter:g.label,color:M,fontSize:11,offset:[10,0]}:void 0,...S>=0?{markPoint:{data:[{name:"💥",coord:[S,o?0:-100],symbol:"pin",symbolSize:35,itemStyle:{color:"#ff5252"},label:{show:!0,formatter:"💥爆仓",fontSize:14,color:"#ff5252",fontWeight:"bold",offset:[0,-15]}}],animation:!1}}:{}})});const m=o?"总价值（元）":"收益率（%）";let I=1/0,C=-1/0;s.forEach(g=>{g.data&&g.data.forEach(x=>{x!==null&&!isNaN(x)&&(I=Math.min(I,x),C=Math.max(C,x))})});const L=C-I;I=I-L*.1,C=C+L*.1;const v={backgroundColor:"transparent",tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb",fontSize:12},formatter:function(g){const x=g.filter(M=>M.value!==null&&M.value!==void 0&&!M.seriesName.includes("预测"));if(x.length===0)return"";let B='<div style="font-weight:bold;margin-bottom:4px;">'+g[0].axisValue.replace("🔮","预测 ")+"</div>";const E=[...x].sort((M,y)=>(y.value||0)-(M.value||0));for(const M of E){const y=t.find(k=>k.label===M.seriesName&&k.isUser),S=y?"⭐ ":"",z=o?"¥"+Number(M.value).toLocaleString():(M.value>=0?"+":"")+M.value.toFixed(1)+"%";B+='<div style="display:flex;align-items:center;gap:6px;'+(y?"font-weight:bold;":"")+'"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+M.color+';"></span>'+S+M.seriesName+": "+z+"</div>"}return B}},legend:{bottom:0,textStyle:{color:"#9ca3af",fontSize:10},icon:"roundRect",itemWidth:12,itemHeight:8,data:t.map(g=>g.label)},grid:{left:"12%",right:"8%",top:"10%",bottom:"15%"},xAxis:{type:"category",data:h,axisLine:{lineStyle:{color:"#2d3d54"}},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:9,rotate:30},splitLine:{show:!1}},yAxis:{type:"value",name:m,nameLocation:"middle",nameGap:50,nameTextStyle:{color:"#9ca3af",fontSize:12},axisLine:{show:!0,lineStyle:{color:"#2d3d54"}},axisTick:{show:!0,lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,formatter:o?g=>g>=1e4?(g/1e4).toFixed(1)+"万":g.toLocaleString():g=>g.toFixed(0)+"%"},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},min:Math.floor(I),max:Math.ceil(C)},series:s};T.setOption(v,!0);const $=document.getElementById("forecast-section");$&&$.classList.toggle("hidden",l.length===0),window.addEventListener("resize",()=>T==null?void 0:T.resize())}function xt(t){var e,n,o,r,a,s,i,c,d,l,u,h,p,m;Lt=t,T&&(T.dispose(),T=echarts.init(document.getElementById("chart-returns")),Dt()),(e=document.getElementById("chart-mode-pct"))==null||e.classList.toggle("active",t==="pct"),(n=document.getElementById("chart-mode-pct"))==null||n.classList.toggle("bg-neon-blue/20",t==="pct"),(o=document.getElementById("chart-mode-pct"))==null||o.classList.toggle("text-neon-blue",t==="pct"),(r=document.getElementById("chart-mode-pct"))==null||r.classList.toggle("border-neon-blue/30",t==="pct"),(a=document.getElementById("chart-mode-pct"))==null||a.classList.toggle("bg-dark-500/30",t!=="pct"),(s=document.getElementById("chart-mode-pct"))==null||s.classList.toggle("text-gray-400",t!=="pct"),(i=document.getElementById("chart-mode-pct"))==null||i.classList.toggle("border-dark-500",t!=="pct"),(c=document.getElementById("chart-mode-value"))==null||c.classList.toggle("active",t==="value"),(d=document.getElementById("chart-mode-value"))==null||d.classList.toggle("bg-neon-blue/20",t==="value"),(l=document.getElementById("chart-mode-value"))==null||l.classList.toggle("text-neon-blue",t==="value"),(u=document.getElementById("chart-mode-value"))==null||u.classList.toggle("border-neon-blue/30",t==="value"),(h=document.getElementById("chart-mode-value"))==null||h.classList.toggle("bg-dark-500/30",t!=="value"),(p=document.getElementById("chart-mode-value"))==null||p.classList.toggle("text-gray-400",t!=="value"),(m=document.getElementById("chart-mode-value"))==null||m.classList.toggle("border-dark-500",t!=="value")}function Wt(t,e,n){const o=document.getElementById(t);if(!o)return;O&&O.dispose(),O=echarts.init(o);const r={backgroundColor:"transparent",tooltip:{backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(124,58,237,0.3)",textStyle:{color:"#e5e7eb"}},radar:{center:["50%","50%"],radius:"65%",indicator:e.dimensions.map(a=>({name:a,max:100})),axisName:{color:"#9ca3af",fontSize:11},splitArea:{areaStyle:{color:["rgba(79,195,247,0.02)","rgba(79,195,247,0.02)"]}},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},axisLine:{lineStyle:{color:"rgba(45,61,84,0.5)"}}},series:[{type:"radar",data:[{value:e.values,name:n,areaStyle:{color:"rgba(124,58,237,0.15)"},lineStyle:{color:"#b388ff",width:2},itemStyle:{color:"#b388ff"},symbol:"circle",symbolSize:5}]}]};O.setOption(r,!0),window.addEventListener("resize",()=>O==null?void 0:O.resize())}function It(){const t=document.getElementById("sector-pie");t&&(N&&N.dispose(),N=echarts.init(t))}function Vt(t){if(!N)return;const e=["#4fc3f7","#69f0ae","#f0c060","#ff5252","#b388ff","#ff80ab","#18ffff"],n={backgroundColor:"transparent",tooltip:{trigger:"item",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb"},formatter:"{b}: {c}% ({d}%)"},series:[{type:"pie",radius:["50%","75%"],center:["50%","50%"],emphasis:{label:{fontSize:14,fontWeight:"bold"},scaleSize:8},label:{color:"#9ca3af",fontSize:11,formatter:`{b}
{c}%`},labelLine:{lineStyle:{color:"#4b5563"}},data:t.length>0?t:[{name:"未选择",value:100,itemStyle:{color:"#1f2937"}}],itemStyle:{borderColor:"#0a0e17",borderWidth:2,color:o=>e[o.dataIndex%e.length]}}]};N.setOption(n,!0)}function Gt(){T==null||T.dispose(),T=null,O==null||O.dispose(),O=null,N==null||N.dispose(),N=null}let Z=[],R=[],J="a-share",tt="all",vt=!1,yt=!1,bt=!1,wt=!1;function U(){b.holdings=R.map(t=>({code:t.code,name:t.name,sector:t.sector,market:t.market,weight:t.weight}))}function Bt(){R=[],U(),J="a-share",tt="all",b.stocksData&&Ut(b.stocksData),vt||(document.querySelectorAll(".market-tab").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".market-tab").forEach(o=>o.classList.remove("active")),n.classList.add("active"),J=n.dataset.market,document.getElementById("stock-search").value="",K()})}),vt=!0);const t=document.getElementById("stock-search");if(t&&!bt){let n=null;t.addEventListener("input",()=>{clearTimeout(n),n=setTimeout(()=>{const o=t.value.trim().toLowerCase();o&&(J="all",document.querySelectorAll(".market-tab").forEach(r=>r.classList.remove("active"))),K(o)},250)}),bt=!0}yt||(document.querySelectorAll(".period-btn").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".period-btn").forEach(r=>r.classList.remove("active")),n.classList.add("active");const o=n.dataset.period;o==="custom"?(document.getElementById("custom-period-wrap").classList.remove("hidden"),b.period="custom"):(document.getElementById("custom-period-wrap").classList.add("hidden"),b.period=o)})}),yt=!0);const e=document.getElementById("custom-months");e&&!wt&&(e.addEventListener("input",()=>{b.customMonths=parseInt(e.value)||18}),wt=!0),It(),Y()}function Ut(t){Z=t.stocks,Yt(t.sectors),K(),It()}function Yt(t){const e=document.getElementById("sector-filters");if(!e)return;e.innerHTML="";const n=document.createElement("button");n.className="sector-btn active",n.textContent="全部",n.addEventListener("click",()=>{tt="all",document.querySelectorAll(".sector-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),K()}),e.appendChild(n),t.forEach(o=>{const r=document.createElement("button");r.className="sector-btn",r.textContent=o,r.addEventListener("click",()=>{tt=o,document.querySelectorAll(".sector-btn").forEach(a=>a.classList.remove("active")),r.classList.add("active"),K()}),e.appendChild(r)})}function K(t){const e=document.getElementById("stock-grid");if(!e)return;let n=Z;if(t){const o=t.toLowerCase();n=Z.filter(r=>r.name.toLowerCase().includes(o)||r.code.toLowerCase().includes(o)).slice(0,50)}else J==="all"&&(J="a-share"),n=Z.filter(o=>{const r=o.market===J,a=tt==="all"||o.sector===tt;return r&&a});n.sort((o,r)=>r.marketCap-o.marketCap),e.innerHTML=n.map(o=>{var i;const r=R.find(c=>c.code===o.code),a=o.latestPrice;return`
      <div class="stock-card ${r?"selected":""}" data-code="${o.code}" data-name="${o.name}"
           data-sector="${o.sector}" data-market="${o.market}">
        <div class="flex items-center justify-between mb-1">
          <span class="text-white font-medium text-sm truncate flex-1">${o.name}</span>
          <div class="flex items-center gap-1">
            <button class="stock-detail-btn text-xs text-gray-500 hover:text-neon-blue px-1.5 py-0.5 rounded bg-dark-600/50 transition-colors" data-code="${o.code}" title="查看详情">ℹ️</button>
            ${r?'<span class="text-neon-blue text-xs">✓</span>':""}
          </div>
        </div>
        <div class="text-xs text-gray-500 mb-1">${o.code} · ${o.sector}</div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-400">PE ${((i=o.pe)==null?void 0:i.toFixed(1))||"--"}</span>
          <span class="font-mono text-gray-300">¥${(a==null?void 0:a.toFixed(2))||"--"}</span>
        </div>
      </div>
    `}).join(""),e.querySelectorAll(".stock-card").forEach(o=>{o.addEventListener("click",r=>{r.target.closest(".stock-detail-btn")||Kt(o.dataset)})}),e.querySelectorAll(".stock-detail-btn").forEach(o=>{o.addEventListener("click",r=>{r.stopPropagation();const a=o.dataset.code;_t(a)})})}function _t(t){var p,m,I,C;const e=Z.find(L=>L.code===t);if(!e)return;const n=e.prices.slice(-60),o=Math.min(...n),r=Math.max(...n),a={"a-share":"A股",hk:"港股",us:"美股",index:"指数"},s=n[0],c=((n[n.length-1]-s)/s*100).toFixed(2),d=c>=0?"text-neon-red":"text-neon-green",l=c>=0?"+":"",u=c>=0?"#ff5252":"#69f0ae";for(let L=0;L<n.length;L+=10);const h=document.createElement("div");h.className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm",h.innerHTML=`
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
            <div class="text-2xl font-mono font-bold text-white">¥${((p=e.latestPrice)==null?void 0:p.toFixed(2))||"--"}</div>
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
          <span>最高: ¥${r.toFixed(2)}</span>
        </div>
      </div>
      
      <!-- 关键指标 -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">市盈率 (PE)</div>
          <div class="text-lg font-mono text-white">${((m=e.pe)==null?void 0:m.toFixed(1))||"--"}</div>
          <div class="text-xs text-gray-600">${e.pe>30?"估值偏高":e.pe<15?"估值偏低":"估值合理"}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">市值</div>
          <div class="text-lg font-mono text-white">${(e.marketCap/1e4).toFixed(0)}亿</div>
          <div class="text-xs text-gray-600">${e.marketCap>1e4?"大盘股":e.marketCap>1e3?"中盘股":"小盘股"}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">营收增长</div>
          <div class="text-lg font-mono ${e.revenueGrowth>0?"text-neon-red":"text-neon-green"}">${((I=e.revenueGrowth)==null?void 0:I.toFixed(1))||"--"}%</div>
          <div class="text-xs text-gray-600">${e.revenueGrowth>20?"高增长":e.revenueGrowth>0?"稳健增长":"负增长"}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">ROE</div>
          <div class="text-lg font-mono text-white">${((C=e.roe)==null?void 0:C.toFixed(1))||"--"}%</div>
          <div class="text-xs text-gray-600">${e.roe>15?"优秀":e.roe>10?"良好":"一般"}</div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex gap-3">
        <button class="flex-1 bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded-lg py-2.5 text-sm font-medium hover:bg-neon-blue/30 transition-colors" onclick="this.closest('.fixed').remove()">关闭</button>
        <button class="flex-1 bg-neon-blue text-dark-900 rounded-lg py-2.5 text-sm font-medium hover:bg-neon-blue/90 transition-colors" onclick="toggleStock({code:'${e.code}',name:'${e.name}',sector:'${e.sector}',market:'${e.market}'}); this.closest('.fixed').remove();">加入组合</button>
      </div>
    </div>
  `,document.body.appendChild(h),setTimeout(()=>{const L=document.getElementById("stock-price-chart");if(L&&typeof echarts<"u"){const v=echarts.init(L),$={backgroundColor:"transparent",grid:{left:"3%",right:"3%",top:"5%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:n.map((g,x)=>x+1),axisLine:{lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,interval:9,formatter:g=>`${g}日`},axisTick:{show:!1}},yAxis:{type:"value",scale:!0,axisLine:{show:!1},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:10,formatter:g=>"¥"+g.toFixed(0)},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}}},series:[{data:n,type:"line",smooth:!0,symbol:"none",lineStyle:{width:3,color:u},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:u+"40"},{offset:1,color:u+"00"}])}}],tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:u,textStyle:{color:"#e5e7eb",fontSize:12},formatter:g=>{const x=g[0].value;return`<div style="font-weight:bold">第${g[0].axisValue}天</div><div>价格: ¥${x.toFixed(2)}</div>`}}};v.setOption($),window.addEventListener("resize",()=>v.resize())}},100),h.addEventListener("click",L=>{L.target===h&&h.remove()})}function Kt({code:t,name:e,sector:n,market:o}){var s,i;const r=R.findIndex(c=>c.code===t);if(r>=0)R.splice(r,1);else if(R.length<10)R.push({code:t,name:e,sector:n,market:o,weight:0});else{Mt("最多选择10只成分股","error");return}Ct(),U();const a=(i=(s=document.getElementById("stock-search"))==null?void 0:s.value)==null?void 0:i.trim();K(a||void 0),Y(),X(),G()}function Ct(){if(R.length===0)return;const t=Math.floor(100/R.length),e=100-t*R.length;R.forEach((o,r)=>{o.weight=t+(r<e?1:0)});const n=R.reduce((o,r)=>o+r.weight,0);n!==100&&R.length>0&&(R[0].weight+=100-n)}function Y(){var r;const t=document.getElementById("selected-list"),e=document.getElementById("weight-sum");if(R.length===0){t.innerHTML='<span class="text-gray-500">请从上方选择股票</span>',e.textContent="合计: 0%";return}t.innerHTML=R.map((a,s)=>`
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
  `).join("");const n=R.reduce((a,s)=>a+s.weight,0);e.textContent=`合计: ${n}%`,e.className=n===100?"text-sm font-mono text-neon-green":"text-sm font-mono text-neon-red";const o=((r=document.getElementById("lock-weights"))==null?void 0:r.checked)||!1;t.querySelectorAll('[data-action="weight"]').forEach(a=>{a.addEventListener("input",s=>{const i=parseInt(a.dataset.index);R[i].weight=parseInt(s.target.value);const c=t.querySelector(`[data-action="weight-input"][data-index="${i}"]`);c&&(c.value=s.target.value),o?(U(),Y(),X(),G()):kt(i,parseInt(s.target.value))}),a.addEventListener("change",s=>{if(!o)return;const i=parseInt(a.dataset.index);R[i].weight=parseInt(s.target.value),U(),Y(),X(),G()})}),t.querySelectorAll('[data-action="weight-input"]').forEach(a=>{a.addEventListener("change",s=>{const i=parseInt(a.dataset.index);let c=parseInt(s.target.value)||1;c=Math.max(1,Math.min(95,c)),R[i].weight=c;const d=t.querySelector(`[data-action="weight"][data-index="${i}"]`);d&&(d.value=c),o?(U(),Y(),X(),G()):kt(i,c)})}),t.querySelectorAll('[data-action="remove"]').forEach(a=>{a.addEventListener("click",()=>{const s=parseInt(a.dataset.index);R.splice(s,1),Ct(),U(),K(),Y(),X(),G()})})}function kt(t,e){const n=R.filter((s,i)=>i!==t);if(n.length===0)return;R[t].weight=e;const o=100-e,r=n.reduce((s,i)=>s+i.weight,0);if(r===0){const s=Math.floor(o/n.length);n.forEach(c=>c.weight=s);const i=n.reduce((c,d)=>c+d.weight,0);n[0].weight+=o-i}else{const s=o/r;let i=0;n.forEach((l,u)=>{l.weight=Math.max(1,Math.round(l.weight*s)),i+=l.weight});let c=o-i,d=0;for(;c!==0&&d<20;){d++;for(const l of n)if(c>0?(l.weight++,c--):c<0&&l.weight>1&&(l.weight--,c++),c===0)break}c!==0&&n.length>0&&(n[0].weight=Math.max(1,n[0].weight+c))}const a=R.reduce((s,i)=>s+i.weight,0);a!==100&&R.length>0&&(R[0].weight+=100-a),U(),Y(),X(),G()}function X(){const t={};R.forEach(n=>{t[n.sector]=(t[n.sector]||0)+n.weight});const e=Object.entries(t).map(([n,o])=>({name:n,value:o}));Vt(e)}function Xt(){return R.map(t=>({code:t.code,weight:t.weight}))}function Jt(){return b.period==="custom"?"custom"+(b.customMonths||18):b.period}let $t=!1;function Qt(t){var i,c;const{results:e,amount:n,leverage:o}=t,r=n||1e5,a=o||1,s=[...e].sort((d,l)=>d.rank-l.rank);Zt(s,r,a),Nt("chart-returns",s,r,a),te(s,r,a),$t||((i=document.getElementById("chart-mode-pct"))==null||i.addEventListener("click",()=>xt("pct")),(c=document.getElementById("chart-mode-value"))==null||c.addEventListener("click",()=>xt("value")),$t=!0)}function Zt(t,e,n){const o=document.getElementById("ranking-table");if(!o)return;const r=["🥇","🥈","🥉"];o.innerHTML=t.map((a,s)=>{const i=a.isUser,c=s<3?r[s]:a.rank,d=a.totalReturn>=0?"text-neon-red":"text-neon-green",l=i?"user-highlight":"",u=a.totalReturn*n,h=parseFloat(Math.max(-100,u).toFixed(1)),p=Math.round(e*h/100),m=(h>=0?"+":"")+Number(p).toLocaleString(),I=parseFloat((a.maxDrawdown*n).toFixed(1));let C="";if(!i&&a.holdingsDetail&&a.holdingsDetail.length>0){const L=a.holdingsDetail.map(v=>`<div class="flex justify-between text-xs py-1">
          <span class="text-gray-400">${v.name}</span>
          <span class="text-neon-blue font-mono">${v.weight}%</span>
        </div>`).join("");C=`
        <div class="mt-2 pt-2 border-t border-dark-600/30 holdings-detail hidden" id="holdings-${s}">
          <div class="text-xs text-gray-500 mb-1">持仓成分</div>
          ${L}
        </div>
      `}return`
      <div class="rank-row ${l} animate-slide-up" style="animation-delay: ${s*.08}s">
        <span class="rank-badge">${c}</span>
        <span class="text-2xl flex-shrink-0">${a.icon||""}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-white font-medium text-sm truncate">
              ${i?"⭐ ":""}${a.label}
            </span>
            ${a.isBenchmark?'<span class="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-dark-500/50">基准</span>':""}
            ${!a.isUser&&!a.isBenchmark?'<span class="text-xs text-neon-purple px-2 py-0.5 rounded-full bg-dark-500/50">AI</span>':""}
          </div>
          <div class="text-xs text-gray-500">${a.description||""}</div>
          ${!i&&a.holdingsDetail?`<button class="text-xs text-neon-blue mt-1 hover:underline" onclick="toggleHoldings(${s})">查看持仓</button>`:""}
          ${C}
        </div>
        <div class="text-right flex-shrink-0">
          <div class="font-mono font-bold ${d} text-base">
            ${h>=0?"+":""}${h.toFixed(1)}%
          </div>
          <div class="text-xs ${d} font-mono">
            ${m}元
          </div>
          <div class="text-xs text-gray-500">
            最大回撤 ${I}%
          </div>
        </div>
      </div>
    `}).join(""),window.toggleHoldings||(window.toggleHoldings=function(a){const s=document.getElementById(`holdings-${a}`);s&&s.classList.toggle("hidden")})}function te(t,e,n){const o=document.getElementById("metrics-table");if(!o)return;const r=["基金","累计收益","年化收益","最大回撤","夏普比率","胜率"],a=t.map(s=>{const i=s.totalReturn>=0?"metric-up":"metric-down",c=s.totalReturn*n,d=parseFloat(Math.max(-100,c).toFixed(1)),l="★".repeat(s.fundRating||0)+"☆".repeat(5-(s.fundRating||0)),u=s.isUser?`
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
        <td class="px-3 py-2.5 font-mono text-sm ${i}">${d>=0?"+":""}${d.toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${s.annualizedReturn>=0?"+":""}${s.annualizedReturn}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${(s.maxDrawdown*n).toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm ${s.sharpeRatio>=1?"text-neon-green":s.sharpeRatio>=.5?"text-gray-300":"text-neon-red"}">${s.sharpeRatio}</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${s.winRate}%</td>
      </tr>
      ${s.isUser?`<tr><td colspan="6" class="px-3 py-2 bg-dark-700/20">${u}</td></tr>`:""}
    `}).join("");o.innerHTML=`
    <div class="overflow-x-auto">
      <table class="metrics-table w-full text-xs">
        <thead>
          <tr class="border-b border-dark-500/30">
            ${r.map(s=>`<th class="px-3 py-2 text-left font-medium whitespace-nowrap cursor-help" title="${ee(s)}">${s}</th>`).join("")}
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

${n.content}`)});function ne(t){const{styleTag:e,matchPerson:n,matchPersonDesc:o,matchPersonOrg:r,metrics:a,radarData:s,commentary:i}=t,c=document.getElementById("diagnosis-tag");c&&(c.innerHTML=`
      <span class="diagnosis-badge text-xl md:text-2xl animate-fade-in">${e}</span>
    `);const d=document.getElementById("diagnosis-subtitle");d&&(d.innerHTML=`
      <span class="text-gray-400">对标人物：</span>
      <span class="text-neon-blue font-bold">${n}</span>
      <span class="text-gray-500 text-sm"> — ${o}</span>
      ${r?`<span class="text-gray-600 text-sm block">${r}</span>`:""}
    `),Wt("chart-radar",s,"你的基金");const l=document.getElementById("commentary-text");if(l&&i){const u=i.split(`

`).map(h=>h.trim()).filter(Boolean);l.innerHTML=u.map((h,p)=>'<p style="margin-bottom:'+(p<u.length-1?"12px":"0")+';line-height:1.8;">'+h+"</p>").join("")}oe(a)}function oe(t){const e=document.getElementById("ai-commentary");if(!e)return;let n=document.getElementById("metrics-summary");n&&n.remove(),n=document.createElement("div"),n.id="metrics-summary";const o=(s,i)=>{if(s==null||isNaN(s))return"-";const c=Math.pow(10,i);return Math.round(s*c)/c},r="★".repeat(t.fundRating||0)+"☆".repeat(5-(t.fundRating||0)),a=t.fundRating>=4?"text-gold-400":t.fundRating>=3?"text-neon-blue":"text-gray-400";n.innerHTML=`
    <div class="mt-4 pt-4 border-t border-dark-600/30">
      <!-- 基金评级卡片 -->
      <div class="bg-dark-700/50 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-400">基金评级</span>
          <span class="text-2xl ${a}">${r}</span>
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
  `,e.appendChild(n)}const P=252;function j(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}const ae={"3m":Math.floor(P/4),"6m":Math.floor(P/2),"1y":P,"3y":P*3,"5y":P*5,"10y":P*10};function se(t){if(t.startsWith("custom")){const e=parseInt(t.replace("custom",""))||18;return Math.floor(P*e/12)}return ae[t]||P}function Ft(t,e,n){var pt;const o=Math.min(se(n),P*10),r={};t.stocks.forEach(f=>{r[f.code]=f});const a=[],s=100,i=((pt=r[e[0].code])==null?void 0:pt.prices.length)||P*5;for(let f=o;f>0;f--){const D=i-f;let et=0;for(const nt of e){const ot=r[nt.code];if(!ot||D>=ot.prices.length)continue;const zt=ot.prices[D],jt=ot.prices[i-o],Ot=nt.weight/100;et+=Ot*(zt/jt)}a.push(parseFloat((s*et).toFixed(4)))}const c=a[a.length-1],d=j((c-s)/s*100,2);let l=0,u=a[0];for(const f of a){f>u&&(u=f);const D=(u-f)/u*100;D>l&&(l=D)}l=j(l,2);const h=o/P,p=j((Math.pow(c/s,1/h)-1)*100,2),m=[];for(let f=1;f<a.length;f++)m.push((a[f]-a[f-1])/a[f-1]);const I=m.reduce((f,D)=>f+D,0)/m.length,C=m.reduce((f,D)=>f+Math.pow(D-I,2),0)/m.length,L=Math.sqrt(C),v=j(L*Math.sqrt(P)*100,2),$=.02,g=v>0?j((p/100-$)/(v/100),2):0,x=m.filter(f=>f<0),w=x.length>0?Math.sqrt(x.reduce((f,D)=>f+Math.pow(D-x.reduce((et,nt)=>et+nt,0)/x.length,2),0)/x.length):0,B=w>0?j((p/100-$)/(w*Math.sqrt(P)),2):0,E=j((p/100-$)/1,2),M=m.map(f=>f-$/P),y=Math.sqrt(M.reduce((f,D)=>f+D*D,0)/M.length)*Math.sqrt(P),S=y>0?j((p/100-$)/y,2):0,z=l>0?j(p/l,2):0,k=m.filter(f=>f>0).length,F=j(k/m.length*100,1),it=m.filter(f=>f>0).reduce((f,D)=>f+D,0)/m.filter(f=>f>0).length||0,W=Math.abs(m.filter(f=>f<0).reduce((f,D)=>f+D,0)/m.filter(f=>f<0).length)||0,rt=W>0?j(it/W,2):0;let A=0,H=[];g>=1.5?(A+=2,H.push("夏普比率优秀")):g>=1?(A+=1.5,H.push("夏普比率良好")):g>=.5&&(A+=1,H.push("夏普比率一般")),l<=10?(A+=1.5,H.push("回撤控制优秀")):l<=20?(A+=1,H.push("回撤控制良好")):l<=30&&(A+=.5),p>=20?(A+=1.5,H.push("收益表现优秀")):p>=10?(A+=1,H.push("收益表现良好")):p>=5&&(A+=.5),F>=60&&(A+=.5,H.push("胜率较高")),A=Math.min(5,Math.max(1,Math.round(A)));let lt="中";l<=15&&v<=20?lt="低":(l>=30||v>=40)&&(lt="高");const ft=Math.max(1,Math.floor(a.length/50)),ct=[],dt=[];for(let f=0;f<a.length;f+=ft)ct.push(a[f]),dt.push(f);(a.length-1)%ft!==0&&(ct.push(a[a.length-1]),dt.push(a.length-1));const Tt=new Date,ut=new Date(Tt);ut.setDate(ut.getDate()-o);const At=dt.map(f=>{const D=new Date(ut);return D.setDate(D.getDate()+f),D.getMonth()+1+"/"+D.getDate()});return{name:"user",label:"你的基金",isUser:!0,totalReturn:d,annualizedReturn:p,annualizedVol:v,maxDrawdown:l,sharpeRatio:g,sortinoRatio:B,treynorRatio:E,informationRatio:S,calmarRatio:z,profitLossRatio:rt,winRate:F,fundRating:A,ratingReasons:H,riskLevel:lt,initialValue:s,finalValue:c,chartData:ct,dateLabels:At,days:o,holdings:e.map(f=>{const D=r[f.code];return{code:f.code,name:(D==null?void 0:D.name)||f.code,weight:f.weight}})}}function ie(t,e){const n=[];return n.push(...re(t,e)),n.push(...le(t,e)),n}function q(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}function re(t,e){const n=t.stocks,o=n.filter(d=>d.market==="a-share").sort((d,l)=>l.marketCap-d.marketCap).slice(0,20),r=o.map(d=>({code:d.code,weight:q(100/o.length,1)})),a=n.filter(d=>d.market==="a-share"&&(d.sector==="科技"||d.sector==="医药"||d.sector==="新能源")).filter(d=>d.marketCap<5e3).slice(0,15),s=a.map(d=>({code:d.code,weight:q(100/a.length,1)})),i=n.filter(d=>d.market==="us"&&d.sector==="科技").sort((d,l)=>l.marketCap-d.marketCap).slice(0,10),c=i.map(d=>({code:d.code,weight:q(100/i.length,1)}));return[_("benchmark-csi300","沪深300","A股大盘蓝筹基准","📊",r,t,e),_("benchmark-gem","创业板指","A股成长创新基准","📊",s,t,e),_("benchmark-nasdaq","纳斯达克100","美股科技龙头基准","📊",c,t,e)]}function le(t,e){const n=t.stocks,o=n.filter(u=>u.pe>0&&u.pe<25&&u.dividendYield>2).filter(u=>u.sector==="消费"||u.sector==="金融").sort((u,h)=>h.dividendYield-u.dividendYield).slice(0,8),r=o.map(u=>({code:u.code,weight:q(100/o.length,1)})),a=n.filter(u=>u.revenueGrowth>10).filter(u=>u.sector==="科技"||u.sector==="医药"||u.sector==="新能源").sort((u,h)=>h.revenueGrowth-u.revenueGrowth).slice(0,8),s=a.map(u=>({code:u.code,weight:q(100/a.length,1)})),i=n.map(u=>{const h=u.prices,p=h[h.length-1],m=h[Math.max(0,h.length-63)];return{...u,momentum:q((p-m)/m*100,2)}}).sort((u,h)=>h.momentum-u.momentum).slice(0,8),c=i.map(u=>({code:u.code,weight:q(100/i.length,1)})),d=n.filter(u=>u.roe>5).map(u=>{const h=u.prices,p=h[h.length-1],m=h[Math.max(0,h.length-63)];return{...u,change:q((p-m)/m*100,2)}}).sort((u,h)=>u.change-h.change).slice(0,8),l=d.map(u=>({code:u.code,weight:q(100/d.length,1)}));return[_("ai-value","🧓 价值大师","深度价值投资","🤖",r,t,e),_("ai-growth","🚀 成长猎手","激进成长投资","🤖",s,t,e),_("ai-momentum","📈 趋势追踪","动量交易策略","🤖",c,t,e),_("ai-reverse","🔄 逆向投资","超跌反转策略","🤖",l,t,e)]}function _(t,e,n,o,r,a,s){const i=Ft(a,r,s);return i.name=t,i.label=e,i.description=n,i.icon=o,i.isUser=!1,i.isBenchmark=o==="📊",i.holdingsDetail=r.map(c=>{const d=a.stocks.find(l=>l.code===c.code);return{code:c.code,name:(d==null?void 0:d.name)||c.code,weight:c.weight,sector:(d==null?void 0:d.sector)||"未知",market:(d==null?void 0:d.market)||"未知"}}),i}const at=[{id:"jiucai",emoji:"🥬",name:"韭菜本菜",matchPerson:"每一个在市场里交过学费的人",personDesc:"初代股民集体回忆",personOrg:"",condition:t=>t.totalReturn<0&&t.concentration>.5},{id:"foxi",emoji:"🧘",name:"佛系躺平派",matchPerson:"但斌",personDesc:"「时间的玫瑰」——买了就当忘了",personOrg:"东方港湾董事长",condition:t=>t.turnover<.3&&t.bluechipRatio>.6},{id:"jiuxiang",emoji:"🍶",name:"酱香科技研究员",matchPerson:"张坤",personDesc:"易方达蓝筹精选掌舵人",personOrg:"易方达基金",condition:t=>(t.sectorWeights.消费||0)>30},{id:"yaoyao",emoji:"💊",name:"医药葛兰分兰",matchPerson:"葛兰",personDesc:"中欧医疗健康，医药赛道信仰者",personOrg:"中欧基金",condition:t=>(t.sectorWeights.医药||0)>40},{id:"ark",emoji:"🚀",name:"ARK中国分K",matchPerson:"Cathie Wood",personDesc:"ARK Invest创始人",personOrg:"ARK Invest",condition:t=>(t.sectorWeights.科技||0)>50&&t.turnover>.5},{id:"buffett",emoji:"👴",name:"巴菲特传人",matchPerson:"Warren Buffett",personDesc:"价值投资灯塔",personOrg:"伯克希尔·哈撒韦",condition:t=>(t.sectorWeights.消费||0)+(t.sectorWeights.金融||0)>50&&t.turnover<.3&&t.roe>15},{id:"diamond",emoji:"🦍",name:"钻石手",matchPerson:"WSB散户大军",personDesc:"「Diamond Hands」——回撤50%也绝不割肉",personOrg:"Reddit r/wallstreetbets",condition:t=>t.maxDrawdown>25&&t.turnover<.3},{id:"wolf",emoji:"🐺",name:"华尔街之狼",matchPerson:"各路游资大佬",personDesc:"高频交易，主打一个刺激",personOrg:"龙虎榜常客",condition:t=>t.turnover>.8},{id:"national",emoji:"🏛️",name:"国家队在逃成员",matchPerson:"社保基金/汇金",personDesc:"银行+央企+蓝筹，稳如泰山",personOrg:"全国社保基金理事会",condition:t=>(t.sectorWeights.金融||0)>40&&t.annualizedVol<20&&t.roe>10},{id:"global",emoji:"🌍",name:"全球宏观玩家",matchPerson:"Ray Dalio",personDesc:"桥水基金创始人",personOrg:"桥水基金",condition:t=>t.crossMarket&&t.marketCount>=3},{id:"growth",emoji:"🌱",name:"成长股猎人",matchPerson:"朱少醒",personDesc:"富国天惠，15年20倍的公募传奇",personOrg:"富国基金",condition:t=>(t.sectorWeights.科技||0)>30&&t.revenueGrowth>20},{id:"balanced",emoji:"⚖️",name:"均衡配置达人",matchPerson:"谢治宇",personDesc:"兴全合润，不偏科的均衡派代表",personOrg:"兴证全球基金",condition:t=>t.maxSectorWeight<35&&t.stockCount>=6}];function Q(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function ce(t,e,n,o){var M;const a=Object.entries(e.sectorWeights||{}).sort((y,S)=>S[1]-y[1])[0]||["未知",0];Object.entries(e.marketWeights||{}).sort((y,S)=>S[1]-y[1]);const s={"a-share":"A股",hk:"港股",us:"美股",index:"指数ETF"},i=[],c={},d={};n.forEach(y=>{const S=o[y.code];S&&(c[S.market]=(c[S.market]||0)+y.weight,d[S.sector]=(d[S.sector]||0)+y.weight)});const l=Object.entries(c).sort((y,S)=>S[1]-y[1]),u=Object.entries(d).sort((y,S)=>S[1]-y[1]),h=(M=l[0])==null?void 0:M[0],p=l.length,m=e.leverage||1,I=e.maxDrawdown>=100||e.totalReturn<=-100,C=m>3,L=e.totalReturn<-50,v=e.totalReturn<-20&&e.totalReturn>=-50,$=e.totalReturn<0&&e.totalReturn>=-20,g=e.totalReturn>=0&&e.totalReturn<10,x=e.totalReturn>=10&&e.totalReturn<50,w=e.totalReturn>=50;let B="";if(I?C?B=`💥 **爆仓警告！** 你使用了${m}x杠杆，最终回撤${e.maxDrawdown.toFixed(1)}%，本金几乎归零。这不是投资，这是赌博！高杠杆+重仓=自杀式操作。`:B=`💥 **巨额亏损！** 最大回撤${e.maxDrawdown.toFixed(1)}%，几乎亏光所有本金。你的选股或择时出现了严重问题。`:L?C?B=`📉 **高杠杆惨案！** ${m}x杠杆放大了亏损，最终收益${e.totalReturn.toFixed(1)}%。杠杆是双刃剑，这次你被割伤了。`:B=`📉 **深度套牢！** 亏损${Math.abs(e.totalReturn).toFixed(1)}%，持仓体验极差。建议重新审视每只股票的基本面。`:v?B=`😰 **投资失利！** 亏损${Math.abs(e.totalReturn).toFixed(1)}%，虽然没到爆仓程度，但也足够肉疼。复盘一下原因？`:$?B=`🤔 **白忙一场！** 亏了${Math.abs(e.totalReturn).toFixed(1)}%，承担了风险却没得到回报。`:g?B=`🙂 **小赚一笔！** 盈利${e.totalReturn.toFixed(1)}%，虽然不多但好歹是正收益。`:x?B=`😊 **稳健盈利！** 收益${e.totalReturn.toFixed(1)}%，回撤${e.maxDrawdown.toFixed(1)}%，这是真正的投资能力！`:w&&(C?B=`🚀 **杠杆暴利！** ${m}x杠杆+${e.totalReturn.toFixed(1)}%收益=暴富神话！但别飘，见好就收。`:B=`🌟 **投资大师！** 收益${e.totalReturn.toFixed(1)}%，这是巴菲特级别的表现！`),i.push(B),i.push(`
📊 **持仓诊断**：`),u.length>0){const y=u[0],S=y[1]>60?`重仓${y[0]}(${y[1].toFixed(0)}%)，集中度极高，风险集中。`:y[1]>40?`${y[0]}(${y[1].toFixed(0)}%)占比偏高。`:"行业分布较均衡。";i.push(`• ${S}`)}p===1?i.push(`• 全仓${s[h]||h}，单一市场风险集中。`):i.push(`• 跨${p}个市场配置，分散了风险。`),e.stockCount<=2?i.push(`• 仅${e.stockCount}只标的，集中度极高，押注式投资风险极大。`):e.stockCount>=8?i.push(`• ${e.stockCount}只标的，可能过于分散。`):i.push(`• ${e.stockCount}只标的，集中度适中。`),m>1&&(i.push(`
⚠️ **杠杆分析**（${m}x杠杆）：`),I?i.push(`• **爆仓元凶！** ${m}x杠杆导致回撤放大。没有杠杆最多亏${(100/m).toFixed(0)}%，有了杠杆亏了100%+。`):L?i.push(`• **杠杆放大亏损！** ${m}x杠杆让你的亏损速度加快了${m}倍。`):i.push(`• 使用了${m}x杠杆，放大了收益和风险。`)),i.push(`
📈 **风险收益**：`),i.push(`• 年化收益：${e.annualizedReturn>=0?"+":""}${e.annualizedReturn.toFixed(1)}%`),i.push(`• 最大回撤：${e.maxDrawdown.toFixed(1)}%${e.maxDrawdown>30?"（极高风险）":e.maxDrawdown>20?"（高风险）":e.maxDrawdown>10?"（中等风险）":"（低风险）"}`),i.push(`• 夏普比率：${e.sharpeRatio.toFixed(2)}`),i.push(`
💡 **专属建议**：`);const E=[];return I?(E.push("🚨 立即退出所有杠杆仓位，本金没了就什么都没了。"),E.push("📚 建议先学习《聪明的投资者》等经典书籍。"),E.push("🎮 先用模拟盘练习至少3个月。")):L||v?(E.push("🛑 暂停加仓，不要继续摊低成本。"),E.push("🔍 仔细分析每只股票的买入逻辑。"),C&&E.push("📉 降低杠杆至1x或2x。")):$?E.push("🤔 微调策略，优化选股标准。"):g?E.push("📊 加入债券ETF等低风险资产平滑曲线。"):(x||w)&&E.push("💰 适当减仓，锁定部分利润。"),a[1]>60&&E.push(`🔄 ${a[0]}占比过高，建议减仓分散。`),p===1&&!I&&E.push("🌍 建议配置其他市场分散风险。"),e.maxDrawdown>30&&!I&&E.push("🛡️ 设置止损线（如-15%）并严格执行。"),i.push(...E.map((y,S)=>`${S+1}. ${y}`)),i.push(`
🎯 **总结**：`),I?i.push("这次投资以爆仓告终。记住这次教训，重建本金，重新出发。💪"):L||v?i.push("这次投资虽然亏损，但经验比金钱更重要。🌱"):$?i.push("基本持平，小幅优化就能扭亏为盈。📚"):g?i.push("小赚是不错的开始，继续优化。🐢"):x?i.push("不错的收益！保持并持续优化。🏆"):w&&i.push("卓越的表现！保持学习、控制风险。🌟"),i.join(`
`)}function de(t,e,n){const o={};t.stocks.forEach(v=>{o[v.code]=v});const r={},a={};let s=0,i=0,c=0,d=0;e.forEach(v=>{const $=o[v.code];if(!$)return;const g=v.weight/100;r[$.sector]=(r[$.sector]||0)+v.weight,a[$.market]=(a[$.market]||0)+v.weight,s+=$.revenueGrowth*g,i+=$.roe*g,c+=$.pe*g,$.marketCap>3e3&&d++});const l=e.length<=5?.7:e.length<=7?.4:.25,h=(r.科技||0)>40?.6+Math.random()*.2:.2+Math.random()*.3,p={totalReturn:n.totalReturn,annualizedReturn:n.annualizedReturn,annualizedVol:n.annualizedVol,maxDrawdown:n.maxDrawdown,sharpeRatio:n.sharpeRatio,sortinoRatio:n.sortinoRatio,informationRatio:n.informationRatio,calmarRatio:n.calmarRatio,profitLossRatio:n.profitLossRatio,winRate:n.winRate,fundRating:n.fundRating,ratingReasons:n.ratingReasons,riskLevel:n.riskLevel,leverage:n.leverage,sectorWeights:r,marketWeights:a,concentration:l,turnover:h,revenueGrowth:parseFloat(s.toFixed(1)),roe:parseFloat(i.toFixed(2)),pe:parseFloat(c.toFixed(2)),bluechipRatio:parseFloat((d/e.length).toFixed(2)),maxSectorWeight:parseFloat(Math.max(...Object.values(r)).toFixed(1)),stockCount:e.length,crossMarket:Object.keys(a).length>=2,marketCount:Object.keys(a).length};let m=null,I=0;for(const v of at)if(v.condition(p)){const $=v.id==="jiucai"?5:v.id==="global"?3:1;$>I&&(I=$,m=v)}m||(m=at.find(v=>v.id==="balanced")||at[at.length-1]);const C=ce(m,p,e,o),L={dimensions:["年化收益","风险控制","行业集中度","跨市场配置","选股ROE"],values:[Q(Math.min(100,Math.max(0,p.annualizedReturn+50)),0),Q(Math.min(100,Math.max(0,100-p.annualizedVol)),0),Q(Math.min(100,Math.max(0,p.maxSectorWeight)),0),Q(Math.min(100,Math.max(0,Object.keys(a).length*30)),0),Q(Math.min(100,Math.max(0,p.roe*1.5)),0)]};return{styleTag:`${m.emoji} ${m.name}`,matchPerson:m.matchPerson,matchPersonDesc:m.personDesc,matchPersonOrg:m.personOrg||"",styleId:m.id,metrics:p,radarData:L,commentary:C}}let st=null,gt=null;function ue(){const t=document.getElementById("particle-canvas");if(!t)return;const e=t.getContext("2d");let n=[];st&&(cancelAnimationFrame(st),st=null),gt&&window.removeEventListener("resize",gt);function o(){t.width=window.innerWidth,t.height=window.innerHeight}o(),gt=o,window.addEventListener("resize",o);class r{constructor(){this.reset()}reset(){this.x=Math.random()*t.width,this.y=Math.random()*t.height,this.size=Math.random()*2+.5,this.speedX=(Math.random()-.5)*.3,this.speedY=(Math.random()-.5)*.3,this.opacity=Math.random()*.5+.1}update(){this.x+=this.speedX,this.y+=this.speedY,(this.x<0||this.x>t.width||this.y<0||this.y>t.height)&&this.reset()}draw(){e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fillStyle=`rgba(79, 195, 247, ${this.opacity})`,e.fill()}}for(let s=0;s<80;s++)n.push(new r);function a(){e.clearRect(0,0,t.width,t.height),n.forEach(s=>{s.update(),s.draw()});for(let s=0;s<n.length;s++)for(let i=s+1;i<n.length;i++){const c=n[s].x-n[i].x,d=n[s].y-n[i].y,l=Math.sqrt(c*c+d*d);l<120&&(e.beginPath(),e.moveTo(n[s].x,n[s].y),e.lineTo(n[i].x,n[i].y),e.strokeStyle=`rgba(79, 195, 247, ${.08*(1-l/120)})`,e.lineWidth=.5,e.stroke())}st=requestAnimationFrame(a)}a()}function ht(t){Gt(),document.querySelectorAll(".screen").forEach(o=>o.classList.remove("active","hidden")),document.querySelectorAll(".screen").forEach(o=>o.classList.add("hidden"));const e=document.getElementById(`screen-${t}`);e&&(e.classList.remove("hidden"),e.classList.add("active"),e.scrollIntoView({behavior:"smooth",block:"start"})),b.currentScreen=t;const n=document.getElementById("header");n&&(n.style.display=t==="builder"?"":"none")}async function Pt(){try{const e=await fetch("./"+"stocks.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);const n=await e.json();return n.stocks.forEach(o=>{o.latestPrice=o.prices[o.prices.length-1]}),b.stocksData=n,b.stocksData}catch(t){return console.error("Failed to load stocks:",t),null}}async function me(){var e,n,o,r;const t=document.getElementById("btn-start");t.disabled=!0,t.textContent="⏳ 回测计算中...";try{const a=Xt(),s=Jt();let i=parseFloat((e=document.getElementById("invest-amount"))==null?void 0:e.value)||1e5;i=Math.max(100,Math.min(1e8,i));const c=parseFloat((n=document.getElementById("leverage"))==null?void 0:n.value)||1;let d=b.fundName||((r=(o=document.getElementById("fund-name"))==null?void 0:o.value)==null?void 0:r.trim());d||(d=fe(a,b.stocksData)),b.stocksData||await Pt();const l=Ft(b.stocksData,a,s);l.label=d,l.amount=i,l.leverage=c,b.userResult=l,b.holdings=a,b.investAmount=i,b.leverage=c;const u=ie(b.stocksData,s),h=[l,...u];h.sort((p,m)=>m.totalReturn-p.totalReturn),h.forEach((p,m)=>{p.rank=m+1}),b.backtestResults=h,ht("arena"),Qt({fundName:d,period:s,results:h,amount:i,leverage:c})}catch(a){Mt("回测失败："+a.message,"error"),t.disabled=!1,t.textContent="⚡ 开始挑战"}}function ge(){ht("diagnosis");const t={...b.userResult,totalReturn:b.userResult.totalReturn*b.leverage,maxDrawdown:b.userResult.maxDrawdown*b.leverage},e=de(b.stocksData,b.holdings,t);e.metrics.leverage=b.leverage,ne(e)}function he(){b.fundName="",b.holdings=[],b.backtestResults=null,b.userResult=null,document.getElementById("fund-name").value="",document.getElementById("btn-start").disabled=!0,ht("builder"),Bt()}function fe(t,e){var g;if(!t||t.length===0)return"我的基金";const n={};e&&e.stocks&&e.stocks.forEach(x=>{n[x.code]=x});const o={},r={};let a=!1,s=!1,i=!1,c=!1;t.forEach(x=>{const w=n[x.code];w&&(o[w.market]=(o[w.market]||0)+x.weight,r[w.sector]=(r[w.sector]||0)+x.weight,w.sector==="科技"&&(a=!0),w.sector==="金融"&&(s=!0),w.sector==="消费"&&(i=!0),w.sector==="医药"&&(c=!0))});const d=Object.entries(o).sort((x,w)=>w[1]-x[1]),l=((g=d[0])==null?void 0:g[0])||"a-share",u=d.length,h={"a-share":["华夏","国泰","南方","易方达","嘉实","博时","广发","富国"],hk:["港股","香港","恒生","中港","沪港深"],us:["纳斯达克","标普","美股","全球","海外"],index:["指数","ETF","被动"]};let p;u>=3?p=["全球","国际","环球","世界","跨市场"]:u===2?p=["沪港深","深港通","AH","中美","跨市场"]:p=h[l]||h["a-share"];let m=[];a&&t.length<=3?m=["创新","科技","成长","新兴","前沿","智能"]:s&&t.length<=3?m=["金融","价值","蓝筹","红利","稳健","精选"]:i&&t.length<=3?m=["消费","品质","生活","品牌","升级"]:c&&t.length<=3?m=["健康","医疗","生命","医药","生物"]:t.length>=8?m=["优选","精选","配置","均衡","多元","全能"]:t.length<=3?m=["聚焦","集中","核心","龙头","精选","优势"]:m=["成长","价值","均衡","轮动","趋势","精选","优选","灵活"];const I=["混合","股票","配置","优选","精选","成长","价值","稳健","进取","灵活"],C=p[Math.floor(Math.random()*p.length)],L=m[Math.floor(Math.random()*m.length)],v=I[Math.floor(Math.random()*I.length)],$=[C+L+v,C+v+L,L+v,C+L];return $[Math.floor(Math.random()*$.length)]}async function pe(){ue(),await Pt(),Bt();const t=document.getElementById("invest-amount");t&&(t.addEventListener("input",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value&&parseInt(n.target.value)!==o&&(n.target.value=o)}),t.addEventListener("blur",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value=o})),document.getElementById("btn-start").addEventListener("click",me),document.getElementById("btn-diagnosis").addEventListener("click",ge),document.getElementById("btn-restart").addEventListener("click",he),document.getElementById("fund-name").addEventListener("input",n=>{b.fundName=n.target.value.trim(),G()});const e=document.getElementById("leverage");e&&e.addEventListener("input",()=>{document.getElementById("leverage-display").textContent=e.value+"x"})}pe();

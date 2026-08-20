(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();let A=null,O=null,N=null,Ct="pct",Ft=[],Tt=1e5,At=1;function _(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function Jt(t,e){const n=t.length;if(n<10)return[];const o=(n-1)/2,r=t.reduce((c,u)=>c+u,0)/n;let s=0,a=0;for(let c=0;c<n;c++)s+=(c-o)*(t[c]-r),a+=(c-o)*(c-o);const i=a!==0?s/a:0,l=t[n-1],d=[];for(let c=1;c<=e;c++){const u=(Math.random()-.5)*Math.abs(i)*c*.5;d.push(_(l+i*c+u,2))}return d}function Qt(t,e){const n=new Date,o=[],r=t-e;for(let s=0;s<r;s++){const a=new Date(n);a.setDate(a.getDate()-(r-s)),s===0||s===r-1||s%Math.max(1,Math.floor(r/6))===0?o.push(a.getMonth()+1+"/"+a.getDate()):o.push("")}for(let s=0;s<e;s++){const a=new Date(n);a.setDate(a.getDate()+s+1),s===0||s===e-1||s%Math.max(1,Math.floor(e/2))===0?o.push("🔮"+(a.getMonth()+1)+"/"+a.getDate()):o.push("")}return o}function Zt(t,e,n,o){const r=document.getElementById(t);r&&(Ft=e,Tt=n||1e5,At=o||1,A&&A.dispose(),A=echarts.init(r),jt())}function jt(){const t=Ft,e=Tt,n=At,o=Ct==="value",r="#4fc3f7",s=["#69f0ae","#f0c060","#b388ff","#ff80ab","#18ffff","#ffab40","#ff5252"],a=[];let i=0,l=0;const d=t.find(g=>g.isUser);d&&(l=d.chartData.length),t.forEach((g,w)=>{g.chartData.length>i&&(i=g.chartData.length)});let c=[],u=-1;if(d){const g=d.chartData;for(let w=0;w<g.length;w++)if((g[w]-100)*n<=-100){u=w;break}if(u<0){const w=Jt(d.chartData,Math.max(1,Math.floor(i*.05)));w.length>0&&(c=w,i=Math.max(i,l+c.length))}}let h=[];const p=t.find(g=>g.isUser&&g.dateLabels);if(p&&p.dateLabels)h=[...p.dateLabels];else{const g=Math.max(0,i-l);h=Qt(i,g)}if(c.length>0&&h.length>0){const g=h[h.length-1],[w,L]=g.split("/").map(Number);for(let $=1;$<=c.length;$++){const v=new Date(2026,w-1,L);v.setDate(v.getDate()+$);const y=$===1||$===c.length||$%Math.max(1,Math.floor(c.length/3))===0?"🔮"+(v.getMonth()+1)+"/"+v.getDate():"";h.push(y)}}t.forEach((g,w)=>{const L=g.isUser,$=g.isBenchmark,v=g.chartData,y=L?r:s[(w-1)%s.length];let b=[],S=-1;if(o)for(let E=0;E<v.length;E++){if((v[E]-100)*n<=-100){S=E,b.push(0);break}b.push(_(e*n*v[E]/100,0))}else for(let E=0;E<v.length;E++){const C=_((v[E]-100)*n,1);if(C<=-100){S=E,b.push(-100);break}b.push(C)}for(;b.length<i;)b.push(null);let T=[...b];if(L&&c.length>0&&!o)for(let E=0;E<c.length;E++){const C=_((c[E]-100)*n,1);l+E<T.length?T[l+E]=C:T.push(C)}else if(L&&c.length>0&&o)for(let E=0;E<c.length;E++){const C=_(e*n*c[E]/100,0);l+E<T.length?T[l+E]=C:T.push(C)}if(L&&c.length>0&&S<0){const E=T.slice(0,l),C=new Array(l-1).fill(null),ct=E[E.length-1];C.push(ct);for(let U=0;U<c.length;U++){const dt=o?_(e*n*c[U]/100,0):_((c[U]-100)*n,1);C.push(dt)}a.push({name:g.label,type:"line",data:E,smooth:!0,symbol:"none",lineStyle:{width:4,type:"solid",color:y},itemStyle:{color:y},emphasis:{focus:"series",lineStyle:{width:6}},z:10,endLabel:{show:!0,formatter:g.label,color:y,fontSize:11,offset:[10,0]}}),a.push({name:"预测走势",type:"line",data:C,smooth:!0,symbol:"none",lineStyle:{width:3,type:"dashed",color:y,opacity:.7},itemStyle:{color:y},z:9,silent:!0})}else a.push({name:g.label,type:"line",data:T,smooth:!0,symbol:"none",lineStyle:{width:L?4:$?1.5:2,type:"solid",color:y,opacity:$?.5:1},itemStyle:{color:y},emphasis:{focus:"series",lineStyle:{width:L?6:3}},z:L?10:1,endLabel:L?{show:!0,formatter:g.label,color:y,fontSize:11,offset:[10,0]}:void 0,...S>=0?{markPoint:{data:[{name:"💥",coord:[S,o?0:-100],symbol:"pin",symbolSize:35,itemStyle:{color:"#ff5252"},label:{show:!0,formatter:"💥爆仓",fontSize:14,color:"#ff5252",fontWeight:"bold",offset:[0,-15]}}],animation:!1}}:{}})});const m=o?"总价值（元）":"收益率（%）";let I=1/0,D=-1/0;a.forEach(g=>{g.data&&g.data.forEach(w=>{w!==null&&!isNaN(w)&&(I=Math.min(I,w),D=Math.max(D,w))})});const P=D-I;I=I-P*.1,D=D+P*.1;const k={backgroundColor:"transparent",tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb",fontSize:12},formatter:function(g){const w=g.filter(y=>y.value!==null&&y.value!==void 0&&!y.seriesName.includes("预测"));if(w.length===0)return"";let $='<div style="font-weight:bold;margin-bottom:4px;">'+g[0].axisValue.replace("🔮","预测 ")+"</div>";const v=[...w].sort((y,b)=>(b.value||0)-(y.value||0));for(const y of v){const b=t.find(E=>E.label===y.seriesName&&E.isUser),S=b?"⭐ ":"",T=o?"¥"+Number(y.value).toLocaleString():(y.value>=0?"+":"")+y.value.toFixed(1)+"%";$+='<div style="display:flex;align-items:center;gap:6px;'+(b?"font-weight:bold;":"")+'"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+y.color+';"></span>'+S+y.seriesName+": "+T+"</div>"}return $}},legend:{bottom:0,textStyle:{color:"#9ca3af",fontSize:10},icon:"roundRect",itemWidth:12,itemHeight:8,data:t.map(g=>g.label)},grid:{left:"12%",right:"8%",top:"10%",bottom:"15%"},xAxis:{type:"category",data:h,axisLine:{lineStyle:{color:"#2d3d54"}},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:9,rotate:30},splitLine:{show:!1}},yAxis:{type:"value",name:m,nameLocation:"middle",nameGap:50,nameTextStyle:{color:"#9ca3af",fontSize:12},axisLine:{show:!0,lineStyle:{color:"#2d3d54"}},axisTick:{show:!0,lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,formatter:o?g=>g>=1e4?(g/1e4).toFixed(1)+"万":g.toLocaleString():g=>g.toFixed(0)+"%"},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},min:Math.floor(I),max:Math.ceil(D)},series:a};A.setOption(k,!0);const x=document.getElementById("forecast-section");x&&x.classList.toggle("hidden",c.length===0),window.addEventListener("resize",()=>A==null?void 0:A.resize())}function wt(t){var e,n,o,r,s,a,i,l,d,c,u,h,p,m;Ct=t,A&&(A.dispose(),A=echarts.init(document.getElementById("chart-returns")),jt()),(e=document.getElementById("chart-mode-pct"))==null||e.classList.toggle("active",t==="pct"),(n=document.getElementById("chart-mode-pct"))==null||n.classList.toggle("bg-neon-blue/20",t==="pct"),(o=document.getElementById("chart-mode-pct"))==null||o.classList.toggle("text-neon-blue",t==="pct"),(r=document.getElementById("chart-mode-pct"))==null||r.classList.toggle("border-neon-blue/30",t==="pct"),(s=document.getElementById("chart-mode-pct"))==null||s.classList.toggle("bg-dark-500/30",t!=="pct"),(a=document.getElementById("chart-mode-pct"))==null||a.classList.toggle("text-gray-400",t!=="pct"),(i=document.getElementById("chart-mode-pct"))==null||i.classList.toggle("border-dark-500",t!=="pct"),(l=document.getElementById("chart-mode-value"))==null||l.classList.toggle("active",t==="value"),(d=document.getElementById("chart-mode-value"))==null||d.classList.toggle("bg-neon-blue/20",t==="value"),(c=document.getElementById("chart-mode-value"))==null||c.classList.toggle("text-neon-blue",t==="value"),(u=document.getElementById("chart-mode-value"))==null||u.classList.toggle("border-neon-blue/30",t==="value"),(h=document.getElementById("chart-mode-value"))==null||h.classList.toggle("bg-dark-500/30",t!=="value"),(p=document.getElementById("chart-mode-value"))==null||p.classList.toggle("text-gray-400",t!=="value"),(m=document.getElementById("chart-mode-value"))==null||m.classList.toggle("border-dark-500",t!=="value")}function te(t,e,n){const o=document.getElementById(t);if(!o)return;O&&O.dispose(),O=echarts.init(o);const r={backgroundColor:"transparent",tooltip:{backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(124,58,237,0.3)",textStyle:{color:"#e5e7eb"}},radar:{center:["50%","50%"],radius:"65%",indicator:e.dimensions.map(s=>({name:s,max:100})),axisName:{color:"#9ca3af",fontSize:11},splitArea:{areaStyle:{color:["rgba(79,195,247,0.02)","rgba(79,195,247,0.02)"]}},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},axisLine:{lineStyle:{color:"rgba(45,61,84,0.5)"}}},series:[{type:"radar",data:[{value:e.values,name:n,areaStyle:{color:"rgba(124,58,237,0.15)"},lineStyle:{color:"#b388ff",width:2},itemStyle:{color:"#b388ff"},symbol:"circle",symbolSize:5}]}]};O.setOption(r,!0),window.addEventListener("resize",()=>O==null?void 0:O.resize())}function zt(){const t=document.getElementById("sector-pie");t&&(N&&N.dispose(),N=echarts.init(t))}function ee(t){if(!N)return;const e=["#4fc3f7","#69f0ae","#f0c060","#ff5252","#b388ff","#ff80ab","#18ffff"],n={backgroundColor:"transparent",tooltip:{trigger:"item",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb"},formatter:"{b}: {c}% ({d}%)"},series:[{type:"pie",radius:["50%","75%"],center:["50%","50%"],emphasis:{label:{fontSize:14,fontWeight:"bold"},scaleSize:8},label:{color:"#9ca3af",fontSize:11,formatter:`{b}
{c}%`},labelLine:{lineStyle:{color:"#4b5563"}},data:t.length>0?t:[{name:"未选择",value:100,itemStyle:{color:"#1f2937"}}],itemStyle:{borderColor:"#0a0e17",borderWidth:2,color:o=>e[o.dataIndex%e.length]}}]};N.setOption(n,!0)}function ne(){A==null||A.dispose(),A=null,O==null||O.dispose(),O=null,N==null||N.dispose(),N=null}function kt(t,e){if(t.length<e)return[];const n=new Array(t.length).fill(null);let o=0;for(let r=0;r<t.length;r++)o+=t[r],r>=e&&(o-=t[r-e]),r>=e-1&&(n[r]=parseFloat((o/e).toFixed(2)));return n}function oe(t,e=14){if(t.length<e+1)return[];const n=new Array(t.length).fill(null),o=[],r=[];for(let i=1;i<t.length;i++){const l=t[i]-t[i-1];o.push(l>0?l:0),r.push(l<0?-l:0)}let s=o.slice(0,e).reduce((i,l)=>i+l,0)/e,a=r.slice(0,e).reduce((i,l)=>i+l,0)/e;for(let i=e;i<o.length;i++){if(a===0)n[i+1]=100;else{const l=s/a;n[i+1]=parseFloat((100-100/(1+l)).toFixed(1))}s=(s*(e-1)+o[i])/e,a=(a*(e-1)+r[i])/e}return n}let tt=[],R=[],Z="a-share",nt="all",$t=!1,Mt=!1,Lt=!1,Et=!1,Rt=!1;function K(){M.holdings=R.map(t=>({code:t.code,name:t.name,sector:t.sector,market:t.market,weight:t.weight}))}function Ot(){var n;R=[],K(),Z="a-share",nt="all",M.stocksData&&se(M.stocksData),$t||(document.querySelectorAll(".market-tab").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".market-tab").forEach(r=>r.classList.remove("active")),o.classList.add("active"),Z=o.dataset.market,document.getElementById("stock-search").value="",G()})}),$t=!0),Rt||((n=document.getElementById("btn-random"))==null||n.addEventListener("click",ie),Rt=!0);const t=document.getElementById("stock-search");if(t&&!Lt){let o=null;t.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(()=>{const r=t.value.trim().toLowerCase();r&&(Z="all",document.querySelectorAll(".market-tab").forEach(s=>s.classList.remove("active"))),G(r)},250)}),Lt=!0}Mt||(document.querySelectorAll(".period-btn").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".period-btn").forEach(s=>s.classList.remove("active")),o.classList.add("active");const r=o.dataset.period;r==="custom"?(document.getElementById("custom-period-wrap").classList.remove("hidden"),M.period="custom"):(document.getElementById("custom-period-wrap").classList.add("hidden"),M.period=r)})}),Mt=!0);const e=document.getElementById("custom-months");e&&!Et&&(e.addEventListener("input",()=>{M.customMonths=parseInt(e.value)||18}),Et=!0),zt(),W()}function se(t){tt=t.stocks,ae(t.sectors),G(),zt()}function ae(t){const e=document.getElementById("sector-filters");if(!e)return;e.innerHTML="";const n=document.createElement("button");n.className="sector-btn active",n.textContent="全部",n.addEventListener("click",()=>{nt="all",document.querySelectorAll(".sector-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),G()}),e.appendChild(n),t.forEach(o=>{const r=document.createElement("button");r.className="sector-btn",r.textContent=o,r.addEventListener("click",()=>{nt=o,document.querySelectorAll(".sector-btn").forEach(s=>s.classList.remove("active")),r.classList.add("active"),G()}),e.appendChild(r)})}function G(t){const e=document.getElementById("stock-grid");if(!e)return;let n=tt;if(t){const o=t.toLowerCase();n=tt.filter(r=>r.name.toLowerCase().includes(o)||r.code.toLowerCase().includes(o)).slice(0,50)}else Z==="all"&&(Z="a-share"),n=tt.filter(o=>{const r=o.market===Z,s=nt==="all"||o.sector===nt;return r&&s});n.sort((o,r)=>r.marketCap-o.marketCap),e.innerHTML=n.map(o=>{var i;const r=R.find(l=>l.code===o.code),s=o.latestPrice;return`
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
          <span class="font-mono text-gray-300">¥${(s==null?void 0:s.toFixed(2))||"--"}</span>
        </div>
      </div>
    `}).join(""),e.querySelectorAll(".stock-card").forEach(o=>{o.addEventListener("click",r=>{r.target.closest(".stock-detail-btn")||Ht(o.dataset)})}),e.querySelectorAll(".stock-detail-btn").forEach(o=>{o.addEventListener("click",r=>{r.stopPropagation();const s=o.dataset.code;re(s)})})}function re(t){var p,m,I,D,P,k;const e=tt.find(x=>x.code===t);if(!e)return;const n=e.prices.slice(-60),o=Math.min(...n),r=Math.max(...n),s={"a-share":"A股",hk:"港股",us:"美股",index:"指数"},a=n[0],l=((n[n.length-1]-a)/a*100).toFixed(2),d=l>=0?"text-neon-red":"text-neon-green",c=l>=0?"+":"",u=l>=0?"#ff5252":"#69f0ae";for(let x=0;x<n.length;x+=10);const h=document.createElement("div");h.className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm",h.innerHTML=`
    <div class="bg-dark-800 rounded-2xl p-6 max-w-lg w-full mx-4 border border-dark-500 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
      <!-- 头部 -->
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="text-xl font-bold text-white">${e.name}</h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm text-gray-400">${e.code}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-dark-600 text-gray-300">${s[e.market]||e.market}</span>
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
            <div class="text-xl font-mono font-bold ${d}">${c}${l}%</div>
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
          <div class="text-lg font-mono text-white">${((D=e.roe)==null?void 0:D.toFixed(1))||"--"}%</div>
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
  `,document.body.appendChild(h),(P=h.querySelector(".stock-modal-close"))==null||P.addEventListener("click",()=>h.remove()),(k=h.querySelector(".stock-modal-add"))==null||k.addEventListener("click",function(){const{code:x,name:g,sector:w,market:L}=this.dataset;Ht({code:x,name:g,sector:w,market:L}),h.remove()}),h.addEventListener("click",x=>{x.target===h&&h.remove()}),setTimeout(()=>{const x=document.getElementById(`tech-indicators-${e.code}`);if(!x)return;const g=e.prices.slice(-120),w=kt(g,20),L=kt(g,60),$=oe(g,14);g[g.length-1];const v=w[w.length-1],y=L[L.length-1],b=$[$.length-1],S=v>y?"📈 多头排列":"📉 空头排列",T=b>70?"⚠️ 超买":b<30?"💡 超卖":"➖ 中性";x.innerHTML=`
      <div><div class="text-xs text-gray-500">MA20</div><div class="font-mono text-sm ${v>y?"text-neon-red":"text-neon-green"}">${(v==null?void 0:v.toFixed(2))||"--"}</div></div>
      <div><div class="text-xs text-gray-500">RSI(14)</div><div class="font-mono text-sm ${b>70?"text-neon-red":b<30?"text-neon-green":"text-gray-300"}">${(b==null?void 0:b.toFixed(1))||"--"}</div></div>
      <div><div class="text-xs text-gray-500">趋势</div><div class="text-xs">${S}</div><div class="text-xs text-gray-500">${T}</div></div>
    `},100),setTimeout(()=>{const x=document.getElementById("stock-price-chart");if(x&&typeof echarts<"u"){const g=echarts.init(x),w={backgroundColor:"transparent",grid:{left:"3%",right:"3%",top:"5%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:n.map((L,$)=>$+1),axisLine:{lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,interval:9,formatter:L=>`${L}日`},axisTick:{show:!1}},yAxis:{type:"value",scale:!0,axisLine:{show:!1},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:10,formatter:L=>"¥"+L.toFixed(0)},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}}},series:[{data:n,type:"line",smooth:!0,symbol:"none",lineStyle:{width:3,color:u},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:u+"40"},{offset:1,color:u+"00"}])}}],tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:u,textStyle:{color:"#e5e7eb",fontSize:12},formatter:L=>{const $=L[0].value;return`<div style="font-weight:bold">第${L[0].axisValue}天</div><div>价格: ¥${$.toFixed(2)}</div>`}}};g.setOption(w),window.addEventListener("resize",()=>g.resize())}},100),h.addEventListener("click",x=>{x.target===h&&h.remove()})}function Ht({code:t,name:e,sector:n,market:o}){var a,i;const r=R.findIndex(l=>l.code===t);if(r>=0)R.splice(r,1);else if(R.length<10)R.push({code:t,name:e,sector:n,market:o,weight:0});else{showToast("最多选择10只成分股","error");return}xt(),K();const s=(i=(a=document.getElementById("stock-search"))==null?void 0:a.value)==null?void 0:i.trim();G(s||void 0),W(),Y(),V()}function xt(){if(R.length===0)return;const t=Math.floor(100/R.length),e=100-t*R.length;R.forEach((o,r)=>{o.weight=t+(r<e?1:0)});const n=R.reduce((o,r)=>o+r.weight,0);n!==100&&R.length>0&&(R[0].weight+=100-n)}function W(){var r;const t=document.getElementById("selected-list"),e=document.getElementById("weight-sum");if(R.length===0){t.innerHTML='<span class="text-gray-500">请从上方选择股票</span>',e.textContent="合计: 0%";return}t.innerHTML=R.map((s,a)=>`
    <div class="selected-item w-full">
      <button class="text-gray-500 hover:text-red-400 text-lg flex-shrink-0"
              data-action="remove" data-index="${a}">✕</button>
      <div class="flex-1 min-w-0">
        <div class="text-white text-sm truncate">${s.name}</div>
        <div class="text-xs text-gray-500">${s.code} · ${s.sector}</div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <input type="range" min="1" max="95" value="${s.weight}"
               class="weight-slider w-16 md:w-24"
               data-action="weight" data-index="${a}" />
        <input type="number" min="1" max="95" value="${s.weight}"
               class="weight-input w-14 bg-dark-700 border border-dark-500 rounded-lg px-1.5 py-1 text-center text-neon-blue font-mono text-sm focus:outline-none focus:border-neon-blue"
               data-action="weight-input" data-index="${a}" />
        <span class="text-neon-blue font-mono text-sm w-8 text-right">%</span>
      </div>
    </div>
  `).join("");const n=R.reduce((s,a)=>s+a.weight,0);e.textContent=`合计: ${n}%`,e.className=n===100?"text-sm font-mono text-neon-green":"text-sm font-mono text-neon-red";const o=((r=document.getElementById("lock-weights"))==null?void 0:r.checked)||!1;t.querySelectorAll('[data-action="weight"]').forEach(s=>{s.addEventListener("input",a=>{const i=parseInt(s.dataset.index);R[i].weight=parseInt(a.target.value);const l=t.querySelector(`[data-action="weight-input"][data-index="${i}"]`);l&&(l.value=a.target.value),o?(K(),W(),Y(),V()):It(i,parseInt(a.target.value))}),s.addEventListener("change",a=>{if(!o)return;const i=parseInt(s.dataset.index);R[i].weight=parseInt(a.target.value),K(),W(),Y(),V()})}),t.querySelectorAll('[data-action="weight-input"]').forEach(s=>{s.addEventListener("change",a=>{const i=parseInt(s.dataset.index);let l=parseInt(a.target.value)||1;l=Math.max(1,Math.min(95,l)),R[i].weight=l;const d=t.querySelector(`[data-action="weight"][data-index="${i}"]`);d&&(d.value=l),o?(K(),W(),Y(),V()):It(i,l)})}),t.querySelectorAll('[data-action="remove"]').forEach(s=>{s.addEventListener("click",()=>{const a=parseInt(s.dataset.index);R.splice(a,1),xt(),K(),G(),W(),Y(),V()})})}function It(t,e){const n=R.filter((a,i)=>i!==t);if(n.length===0)return;R[t].weight=e;const o=100-e,r=n.reduce((a,i)=>a+i.weight,0);if(r===0){const a=Math.floor(o/n.length);n.forEach(l=>l.weight=a);const i=n.reduce((l,d)=>l+d.weight,0);n[0].weight+=o-i}else{const a=o/r;let i=0;n.forEach((c,u)=>{c.weight=Math.max(1,Math.round(c.weight*a)),i+=c.weight});let l=o-i,d=0;for(;l!==0&&d<20;){d++;for(const c of n)if(l>0?(c.weight++,l--):l<0&&c.weight>1&&(c.weight--,l++),l===0)break}l!==0&&n.length>0&&(n[0].weight=Math.max(1,n[0].weight+l))}const s=R.reduce((a,i)=>a+i.weight,0);s!==100&&R.length>0&&(R[0].weight+=100-s),K(),W(),Y(),V()}function Y(){const t={};R.forEach(n=>{t[n.sector]=(t[n.sector]||0)+n.weight});const e=Object.entries(t).map(([n,o])=>({name:n,value:o}));ee(e)}function ie(){var n;R=[];const t=4+Math.floor(Math.random()*4),e=[...tt].sort(()=>Math.random()-.5);for(let o=0;o<Math.min(t,e.length);o++){const r=e[o];R.push({code:r.code,name:r.name,sector:r.sector,market:r.market,weight:0})}xt(),document.getElementById("stock-search").value="",Z="a-share",document.querySelectorAll(".market-tab").forEach(o=>o.classList.remove("active")),(n=document.querySelector('[data-market="a-share"]'))==null||n.classList.add("active"),G(),W(),Y(),V(),showToast(`🎲 随机选中 ${R.length} 只股票，看看运气如何？`)}function qt(){return R.map(t=>({code:t.code,weight:t.weight}))}function le(){return M.period==="custom"?"custom"+(M.customMonths||18):M.period}let Dt=!1;function ce(t){var i,l;const{results:e,amount:n,leverage:o}=t,r=n||1e5,s=o||1,a=[...e].sort((d,c)=>d.rank-c.rank);de(a,r,s),Zt("chart-returns",a,r,s),ue(a,r,s),Dt||((i=document.getElementById("chart-mode-pct"))==null||i.addEventListener("click",()=>wt("pct")),(l=document.getElementById("chart-mode-value"))==null||l.addEventListener("click",()=>wt("value")),Dt=!0)}function de(t,e,n){const o=document.getElementById("ranking-table");if(!o)return;const r=["🥇","🥈","🥉"];o.innerHTML=t.map((s,a)=>{const i=s.isUser,l=a<3?r[a]:s.rank,d=s.totalReturn>=0?"text-neon-red":"text-neon-green",c=i?"user-highlight":"",u=s.totalReturn*n,h=parseFloat(Math.max(-100,u).toFixed(1)),p=Math.round(e*h/100),m=(h>=0?"+":"")+Number(p).toLocaleString(),I=parseFloat((s.maxDrawdown*n).toFixed(1));let D="";if(!i&&s.holdingsDetail&&s.holdingsDetail.length>0){const P=s.holdingsDetail.map(k=>`<div class="flex justify-between text-xs py-1">
          <span class="text-gray-400">${k.name}</span>
          <span class="text-neon-blue font-mono">${k.weight}%</span>
        </div>`).join("");D=`
        <div class="mt-2 pt-2 border-t border-dark-600/30 holdings-detail hidden" id="holdings-${a}">
          <div class="text-xs text-gray-500 mb-1">持仓成分</div>
          ${P}
        </div>
      `}return`
      <div class="rank-row ${c} animate-slide-up" style="animation-delay: ${a*.08}s">
        <span class="rank-badge">${l}</span>
        <span class="text-2xl flex-shrink-0">${s.icon||""}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-white font-medium text-sm truncate">
              ${s.label}
            </span>
            ${s.isBenchmark?'<span class="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-dark-500/50">基准</span>':""}
            ${!s.isUser&&!s.isBenchmark?'<span class="text-xs text-neon-purple px-2 py-0.5 rounded-full bg-dark-500/50">AI</span>':""}
          </div>
          <div class="text-xs text-gray-500">${s.description||""}</div>
          ${!i&&s.holdingsDetail?`<button class="text-xs text-neon-blue mt-1 hover:underline" onclick="toggleHoldings(${a})">查看持仓</button>`:""}
          ${D}
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
    `}).join(""),window.toggleHoldings||(window.toggleHoldings=function(s){const a=document.getElementById(`holdings-${s}`);a&&a.classList.toggle("hidden")})}function ue(t,e,n){const o=document.getElementById("metrics-table");if(!o)return;const r=["基金","累计收益","年化收益","最大回撤","夏普比率","胜率"],s=t.map(a=>{const i=a.totalReturn>=0?"metric-up":"metric-down",l=a.totalReturn*n,d=parseFloat(Math.max(-100,l).toFixed(1)),c="★".repeat(a.fundRating||0)+"☆".repeat(5-(a.fundRating||0)),u=a.isUser?`
      <div class="mt-2 pt-2 border-t border-dark-600/30">
        <div class="grid grid-cols-6 gap-2 text-xs">
          <div class="text-center">
            <div class="text-gray-500">索提诺</div>
            <div class="font-mono ${a.sortinoRatio>=1?"text-neon-green":"text-gray-300"}">${a.sortinoRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">信息比率</div>
            <div class="font-mono ${a.informationRatio>=.5?"text-neon-green":"text-gray-300"}">${a.informationRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">Calmar</div>
            <div class="font-mono text-gray-300">${a.calmarRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">盈亏比</div>
            <div class="font-mono text-gray-300">${a.profitLossRatio||"-"}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">评级</div>
            <div class="font-mono text-gold-400">${c}</div>
          </div>
          <div class="text-center">
            <div class="text-gray-500">风险等级</div>
            <div class="font-mono ${a.riskLevel==="高"?"text-neon-red":a.riskLevel==="低"?"text-neon-green":"text-gray-300"}">${a.riskLevel||"中"}</div>
          </div>
        </div>
      </div>
    `:"";return`
      <tr class="border-b border-dark-600/30 hover:bg-dark-700/30 transition-colors">
        <td class="px-3 py-2.5 text-sm text-white font-medium whitespace-nowrap">
          ${a.isUser?"⭐ ":a.icon+" "}${a.label}
        </td>
        <td class="px-3 py-2.5 font-mono text-sm ${i}">${d>=0?"+":""}${d.toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${a.annualizedReturn>=0?"+":""}${a.annualizedReturn}%</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${(a.maxDrawdown*n).toFixed(1)}%</td>
        <td class="px-3 py-2.5 font-mono text-sm ${a.sharpeRatio>=1?"text-neon-green":a.sharpeRatio>=.5?"text-gray-300":"text-neon-red"}">${a.sharpeRatio}</td>
        <td class="px-3 py-2.5 font-mono text-sm text-gray-300">${a.winRate}%</td>
      </tr>
      ${a.isUser?`<tr><td colspan="6" class="px-3 py-2 bg-dark-700/20">${u}</td></tr>`:""}
    `}).join("");o.innerHTML=`
    <div class="overflow-x-auto">
      <table class="metrics-table w-full text-xs">
        <thead>
          <tr class="border-b border-dark-500/30">
            ${r.map(a=>`<th class="px-3 py-2 text-left font-medium whitespace-nowrap cursor-help" title="${me(a)}">${a}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${s}
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
  `}function me(t){return{基金:"基金名称",累计收益:"回测期内的总收益率",年化收益:"按年计算的收益率",最大回撤:"从高点到低点的最大亏损幅度",夏普比率:"风险调整后收益，>1优秀",胜率:"盈利交易日占比"}[t]||t}window.showMetricDetail||(window.showMetricDetail=function(t){const n={sharpe:{title:"夏普比率 (Sharpe Ratio)",content:`夏普比率 = (年化收益率 - 无风险利率) / 年化波动率

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

${n.content}`)});function ge(t,e=null){const{styleTag:n,matchPerson:o,matchPersonDesc:r,matchPersonOrg:s,metrics:a,radarData:i,commentary:l}=t,d=document.getElementById("diagnosis-tag");d&&(d.innerHTML=`
      <span class="diagnosis-badge text-xl md:text-2xl animate-fade-in">${n}</span>
    `);const c=document.getElementById("diagnosis-subtitle");c&&(c.innerHTML=`
      <span class="text-gray-400">对标人物：</span>
      <span class="text-neon-blue font-bold">${o}</span>
      <span class="text-gray-500 text-sm"> — ${r}</span>
      ${s?`<span class="text-gray-600 text-sm block">${s}</span>`:""}
    `),te("chart-radar",i,"你的基金");const u=document.getElementById("commentary-text");u&&(e!=null&&e.results&&e.results.length>0?Nt(u,e.results,e.errors):e!=null&&e.loading?fe(u):e!=null&&e.errors&&e.errors.length>0?pe(u,l,e.errors):xe(u,l)),ye(a)}function he(t){const e=document.getElementById("commentary-text");e&&(t.results&&t.results.length>0?Nt(e,t.results,t.errors):t.errors&&t.errors.length>0&&e.innerHTML.includes("loading-dots")&&ve(e,t.errors))}function Nt(t,e,n){let o=e.map((r,s)=>`<div class="llm-result mb-3">
      <div class="text-white leading-relaxed text-sm md:text-base">${r.text.replace(/\*\*(.+?)\*\*/g,'<strong class="text-neon-blue">$1</strong>').replace(/\*(.+?)\*/g,"<em>$1</em>").split(`

`).map(i=>i.trim()).filter(Boolean).map(i=>`<p style="margin-bottom:10px;line-height:1.8;">${i.replace(/\n/g,"<br>")}</p>`).join("")}</div>
    </div>`).join("");o+='<div class="mt-3 text-right text-xs text-gray-500">🤖 AI 点评 · 仅供参考</div>',n&&n.length>0&&(o+=`<div class="mt-2 text-right text-xs text-gray-600">
      ⚠️ ${n.map(r=>r.api+"："+r.error).join("；")}
    </div>`),t.innerHTML=o}function fe(t){t.innerHTML=`
    <div class="flex items-center gap-3 py-4">
      <div class="loading-dots flex gap-1">
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style="animation-delay:0.2s"></span>
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style="animation-delay:0.4s"></span>
      </div>
      <span class="text-gray-400 text-sm">AI正在分析你的投资风格...</span>
    </div>
  `}function pe(t,e,n){let o="";if(e){const r=e.split(`

`).map(s=>s.trim()).filter(Boolean);o+=r.map((s,a)=>'<p style="margin-bottom:'+(a<r.length-1?"12px":"0")+';line-height:1.8;">'+s+"</p>").join("")}else o+='<p class="text-gray-400 text-sm">暂无可用的点评内容。</p>';o+='<div class="mt-3 text-right text-xs text-gray-500">📋 离线模板点评 · 仅供参考</div>',o+=`<div class="mt-4 p-3 bg-dark-600/30 rounded-lg border border-dark-500/30">
    <div class="text-xs text-gray-500 mb-2">🔧 API 诊断信息</div>
    <div class="space-y-1">
      ${n.map(r=>`
        <div class="flex items-start gap-2 text-xs">
          <span class="text-red-400 flex-shrink-0">✗</span>
          <div>
            <span class="text-gray-400 font-medium">${r.api}</span>
            <span class="text-gray-500 ml-1">— ${r.error}</span>
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
  </div>`,t.innerHTML=o}function xe(t,e){if(!e){t.innerHTML='<p class="text-gray-400 text-sm">暂无可用的点评内容。</p>';return}const n=e.split(`

`).map(o=>o.trim()).filter(Boolean);t.innerHTML=n.map((o,r)=>'<p style="margin-bottom:'+(r<n.length-1?"12px":"0")+';line-height:1.8;">'+o+"</p>").join(""),t.innerHTML+='<div class="mt-3 text-right text-xs text-gray-500">📋 离线模板点评 · 仅供参考</div>'}function ve(t,e){t.innerHTML=`
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
  `}function ye(t){const e=document.getElementById("ai-commentary");if(!e)return;let n=document.getElementById("metrics-summary");n&&n.remove(),n=document.createElement("div"),n.id="metrics-summary";const o=(a,i)=>{if(a==null||isNaN(a))return"-";const l=Math.pow(10,i);return Math.round(a*l)/l},r="★".repeat(t.fundRating||0)+"☆".repeat(5-(t.fundRating||0)),s=t.fundRating>=4?"text-gold-400":t.fundRating>=3?"text-neon-blue":"text-gray-400";n.innerHTML=`
    <div class="mt-4 pt-4 border-t border-dark-600/30">
      <!-- 基金评级卡片 -->
      <div class="bg-dark-700/50 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-400">基金评级</span>
          <span class="text-2xl ${s}">${r}</span>
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
  `,e.appendChild(n)}const F=252;function z(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}const be={"3m":Math.floor(F/4),"6m":Math.floor(F/2),"1y":F,"3y":F*3,"5y":F*5,"10y":F*10};function we(t){if(t.startsWith("custom")){const e=parseInt(t.replace("custom",""))||18;return Math.floor(F*e/12)}return be[t]||F}function Wt(t,e,n){var bt;const o=Math.min(we(n),F*10),r={};t.stocks.forEach(f=>{r[f.code]=f});const s=[],a=100,i=((bt=r[e[0].code])==null?void 0:bt.prices.length)||F*5;for(let f=o;f>0;f--){const B=i-f;let ot=0;for(const st of e){const at=r[st.code];if(!at||B>=at.prices.length)continue;const Kt=at.prices[B],Yt=at.prices[i-o],Xt=st.weight/100;ot+=Xt*(Kt/Yt)}s.push(parseFloat((a*ot).toFixed(4)))}const l=s[s.length-1],d=z((l-a)/a*100,2);let c=0,u=s[0];for(const f of s){f>u&&(u=f);const B=(u-f)/u*100;B>c&&(c=B)}c=z(c,2);const h=o/F,p=z((Math.pow(l/a,1/h)-1)*100,2),m=[];for(let f=1;f<s.length;f++)m.push((s[f]-s[f-1])/s[f-1]);const I=m.reduce((f,B)=>f+B,0)/m.length,D=m.reduce((f,B)=>f+Math.pow(B-I,2),0)/m.length,P=Math.sqrt(D),k=z(P*Math.sqrt(F)*100,2),x=.02,g=k>0?z((p/100-x)/(k/100),2):0,w=m.filter(f=>f<0),L=w.length>0?Math.sqrt(w.reduce((f,B)=>f+Math.pow(B-w.reduce((ot,st)=>ot+st,0)/w.length,2),0)/w.length):0,$=L>0?z((p/100-x)/(L*Math.sqrt(F)),2):0,v=z((p/100-x)/1,2),y=m.map(f=>f-x/F),b=Math.sqrt(y.reduce((f,B)=>f+B*B,0)/y.length)*Math.sqrt(F),S=b>0?z((p/100-x)/b,2):0,T=c>0?z(p/c,2):0,E=m.filter(f=>f>0).length,C=z(E/m.length*100,1),ct=m.filter(f=>f>0).reduce((f,B)=>f+B,0)/m.filter(f=>f>0).length||0,U=Math.abs(m.filter(f=>f<0).reduce((f,B)=>f+B,0)/m.filter(f=>f<0).length)||0,dt=U>0?z(ct/U,2):0;let j=0,H=[];g>=1.5?(j+=2,H.push("夏普比率优秀")):g>=1?(j+=1.5,H.push("夏普比率良好")):g>=.5&&(j+=1,H.push("夏普比率一般")),c<=10?(j+=1.5,H.push("回撤控制优秀")):c<=20?(j+=1,H.push("回撤控制良好")):c<=30&&(j+=.5),p>=20?(j+=1.5,H.push("收益表现优秀")):p>=10?(j+=1,H.push("收益表现良好")):p>=5&&(j+=.5),C>=60&&(j+=.5,H.push("胜率较高")),j=Math.min(5,Math.max(1,Math.round(j)));let ut="中";c<=15&&k<=20?ut="低":(c>=30||k>=40)&&(ut="高");const yt=Math.max(1,Math.floor(s.length/50)),mt=[],gt=[];for(let f=0;f<s.length;f+=yt)mt.push(s[f]),gt.push(f);(s.length-1)%yt!==0&&(mt.push(s[s.length-1]),gt.push(s.length-1));const Ut=new Date,ht=new Date(Ut);ht.setDate(ht.getDate()-o);const _t=gt.map(f=>{const B=new Date(ht);return B.setDate(B.getDate()+f),B.getMonth()+1+"/"+B.getDate()});return{name:"user",label:"你的基金",isUser:!0,totalReturn:d,annualizedReturn:p,annualizedVol:k,maxDrawdown:c,sharpeRatio:g,sortinoRatio:$,treynorRatio:v,informationRatio:S,calmarRatio:T,profitLossRatio:dt,winRate:C,fundRating:j,ratingReasons:H,riskLevel:ut,initialValue:a,finalValue:l,chartData:mt,dateLabels:_t,days:o,holdings:e.map(f=>{const B=r[f.code];return{code:f.code,name:(B==null?void 0:B.name)||f.code,weight:f.weight}})}}function ke(t,e){const n=[];return n.push(...$e(t,e)),n.push(...Me(t,e)),n}function q(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}function $e(t,e){const n=t.stocks,o=n.filter(d=>d.market==="a-share").sort((d,c)=>c.marketCap-d.marketCap).slice(0,20),r=o.map(d=>({code:d.code,weight:q(100/o.length,1)})),s=n.filter(d=>d.market==="a-share"&&(d.sector==="科技"||d.sector==="医药"||d.sector==="新能源")).filter(d=>d.marketCap<5e3).slice(0,15),a=s.map(d=>({code:d.code,weight:q(100/s.length,1)})),i=n.filter(d=>d.market==="us"&&d.sector==="科技").sort((d,c)=>c.marketCap-d.marketCap).slice(0,10),l=i.map(d=>({code:d.code,weight:q(100/i.length,1)}));return[X("benchmark-csi300","沪深300","A股大盘蓝筹基准","🇨🇳",r,t,e),X("benchmark-gem","创业板指","A股成长创新基准","🇨🇳",a,t,e),X("benchmark-nasdaq","纳斯达克100","美股科技龙头基准","🇺🇸",l,t,e)]}function Me(t,e){const n=t.stocks,o=n.filter(u=>u.pe>0&&u.pe<25&&u.dividendYield>2).filter(u=>u.sector==="消费"||u.sector==="金融").sort((u,h)=>h.dividendYield-u.dividendYield).slice(0,8),r=o.map(u=>({code:u.code,weight:q(100/o.length,1)})),s=n.filter(u=>u.revenueGrowth>10).filter(u=>u.sector==="科技"||u.sector==="医药"||u.sector==="新能源").sort((u,h)=>h.revenueGrowth-u.revenueGrowth).slice(0,8),a=s.map(u=>({code:u.code,weight:q(100/s.length,1)})),i=n.map(u=>{const h=u.prices,p=h[h.length-1],m=h[Math.max(0,h.length-63)];return{...u,momentum:q((p-m)/m*100,2)}}).sort((u,h)=>h.momentum-u.momentum).slice(0,8),l=i.map(u=>({code:u.code,weight:q(100/i.length,1)})),d=n.filter(u=>u.roe>5).map(u=>{const h=u.prices,p=h[h.length-1],m=h[Math.max(0,h.length-63)];return{...u,change:q((p-m)/m*100,2)}}).sort((u,h)=>u.change-h.change).slice(0,8),c=d.map(u=>({code:u.code,weight:q(100/d.length,1)}));return[X("ai-value","🐻 价值大师","深度价值投资","🐻",r,t,e),X("ai-growth","🐂 成长猎手","激进成长投资","🐂",a,t,e),X("ai-momentum","🐎 趋势追踪","动量交易策略","🐎",l,t,e),X("ai-reverse","🦉 逆向投资","超跌反转策略","🦉",c,t,e)]}function X(t,e,n,o,r,s,a){const i=Wt(s,r,a);return i.name=t,i.label=e,i.description=n,i.icon=o,i.isUser=!1,i.isBenchmark=t.startsWith("benchmark-"),i.holdingsDetail=r.map(l=>{const d=s.stocks.find(c=>c.code===l.code);return{code:l.code,name:(d==null?void 0:d.name)||l.code,weight:l.weight,sector:(d==null?void 0:d.sector)||"未知",market:(d==null?void 0:d.market)||"未知"}}),i}const rt=[{id:"jiucai",emoji:"🥬",name:"韭菜本菜",matchPerson:"每一个在市场里交过学费的人",personDesc:"初代股民集体回忆",personOrg:"",condition:t=>t.totalReturn<0&&t.concentration>.5},{id:"foxi",emoji:"🧘",name:"佛系躺平派",matchPerson:"但斌",personDesc:"「时间的玫瑰」——买了就当忘了",personOrg:"东方港湾董事长",condition:t=>t.turnover<.3&&t.bluechipRatio>.6},{id:"jiuxiang",emoji:"🍶",name:"酱香科技研究员",matchPerson:"张坤",personDesc:"易方达蓝筹精选掌舵人",personOrg:"易方达基金",condition:t=>(t.sectorWeights.消费||0)>30},{id:"yaoyao",emoji:"💊",name:"医药葛兰分兰",matchPerson:"葛兰",personDesc:"中欧医疗健康，医药赛道信仰者",personOrg:"中欧基金",condition:t=>(t.sectorWeights.医药||0)>40},{id:"ark",emoji:"🚀",name:"ARK中国分K",matchPerson:"Cathie Wood",personDesc:"ARK Invest创始人",personOrg:"ARK Invest",condition:t=>(t.sectorWeights.科技||0)>50&&t.turnover>.5},{id:"buffett",emoji:"👴",name:"巴菲特传人",matchPerson:"Warren Buffett",personDesc:"价值投资灯塔",personOrg:"伯克希尔·哈撒韦",condition:t=>(t.sectorWeights.消费||0)+(t.sectorWeights.金融||0)>50&&t.turnover<.3&&t.roe>15},{id:"diamond",emoji:"🦍",name:"钻石手",matchPerson:"WSB散户大军",personDesc:"「Diamond Hands」——回撤50%也绝不割肉",personOrg:"Reddit r/wallstreetbets",condition:t=>t.maxDrawdown>25&&t.turnover<.3},{id:"wolf",emoji:"🐺",name:"华尔街之狼",matchPerson:"各路游资大佬",personDesc:"高频交易，主打一个刺激",personOrg:"龙虎榜常客",condition:t=>t.turnover>.8},{id:"national",emoji:"🏛️",name:"国家队在逃成员",matchPerson:"社保基金/汇金",personDesc:"银行+央企+蓝筹，稳如泰山",personOrg:"全国社保基金理事会",condition:t=>(t.sectorWeights.金融||0)>40&&t.annualizedVol<20&&t.roe>10},{id:"global",emoji:"🌍",name:"全球宏观玩家",matchPerson:"Ray Dalio",personDesc:"桥水基金创始人",personOrg:"桥水基金",condition:t=>t.crossMarket&&t.marketCount>=3},{id:"growth",emoji:"🌱",name:"成长股猎人",matchPerson:"朱少醒",personDesc:"富国天惠，15年20倍的公募传奇",personOrg:"富国基金",condition:t=>(t.sectorWeights.科技||0)>30&&t.revenueGrowth>20},{id:"balanced",emoji:"⚖️",name:"均衡配置达人",matchPerson:"谢治宇",personDesc:"兴全合润，不偏科的均衡派代表",personOrg:"兴证全球基金",condition:t=>t.maxSectorWeight<35&&t.stockCount>=6}];function et(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function Le(t,e,n,o){var y;const s=Object.entries(e.sectorWeights||{}).sort((b,S)=>S[1]-b[1])[0]||["未知",0];Object.entries(e.marketWeights||{}).sort((b,S)=>S[1]-b[1]);const a={"a-share":"A股",hk:"港股",us:"美股",index:"指数ETF"},i=[],l={},d={};n.forEach(b=>{const S=o[b.code];S&&(l[S.market]=(l[S.market]||0)+b.weight,d[S.sector]=(d[S.sector]||0)+b.weight)});const c=Object.entries(l).sort((b,S)=>S[1]-b[1]),u=Object.entries(d).sort((b,S)=>S[1]-b[1]),h=(y=c[0])==null?void 0:y[0],p=c.length,m=e.leverage||1,I=e.maxDrawdown>=100||e.totalReturn<=-100,D=m>3,P=e.totalReturn<-50,k=e.totalReturn<-20&&e.totalReturn>=-50,x=e.totalReturn<0&&e.totalReturn>=-20,g=e.totalReturn>=0&&e.totalReturn<10,w=e.totalReturn>=10&&e.totalReturn<50,L=e.totalReturn>=50;let $="";if(I?D?$=`💥 **爆仓警告！** 你使用了${m}x杠杆，最终回撤${e.maxDrawdown.toFixed(1)}%，本金几乎归零。这不是投资，这是赌博！高杠杆+重仓=自杀式操作。`:$=`💥 **巨额亏损！** 最大回撤${e.maxDrawdown.toFixed(1)}%，几乎亏光所有本金。你的选股或择时出现了严重问题。`:P?D?$=`📉 **高杠杆惨案！** ${m}x杠杆放大了亏损，最终收益${e.totalReturn.toFixed(1)}%。杠杆是双刃剑，这次你被割伤了。`:$=`📉 **深度套牢！** 亏损${Math.abs(e.totalReturn).toFixed(1)}%，持仓体验极差。建议重新审视每只股票的基本面。`:k?$=`😰 **投资失利！** 亏损${Math.abs(e.totalReturn).toFixed(1)}%，虽然没到爆仓程度，但也足够肉疼。复盘一下原因？`:x?$=`🤔 **白忙一场！** 亏了${Math.abs(e.totalReturn).toFixed(1)}%，承担了风险却没得到回报。`:g?$=`🙂 **小赚一笔！** 盈利${e.totalReturn.toFixed(1)}%，虽然不多但好歹是正收益。`:w?$=`😊 **稳健盈利！** 收益${e.totalReturn.toFixed(1)}%，回撤${e.maxDrawdown.toFixed(1)}%，这是真正的投资能力！`:L&&(D?$=`🚀 **杠杆暴利！** ${m}x杠杆+${e.totalReturn.toFixed(1)}%收益=暴富神话！但别飘，见好就收。`:$=`🌟 **投资大师！** 收益${e.totalReturn.toFixed(1)}%，这是巴菲特级别的表现！`),i.push($),i.push(`
📊 **持仓诊断**：`),u.length>0){const b=u[0],S=b[1]>60?`重仓${b[0]}(${b[1].toFixed(0)}%)，集中度极高，风险集中。`:b[1]>40?`${b[0]}(${b[1].toFixed(0)}%)占比偏高。`:"行业分布较均衡。";i.push(`• ${S}`)}p===1?i.push(`• 全仓${a[h]||h}，单一市场风险集中。`):i.push(`• 跨${p}个市场配置，分散了风险。`),e.stockCount<=2?i.push(`• 仅${e.stockCount}只标的，集中度极高，押注式投资风险极大。`):e.stockCount>=8?i.push(`• ${e.stockCount}只标的，可能过于分散。`):i.push(`• ${e.stockCount}只标的，集中度适中。`),m>1&&(i.push(`
⚠️ **杠杆分析**（${m}x杠杆）：`),I?i.push(`• **爆仓元凶！** ${m}x杠杆导致回撤放大。没有杠杆最多亏${(100/m).toFixed(0)}%，有了杠杆亏了100%+。`):P?i.push(`• **杠杆放大亏损！** ${m}x杠杆让你的亏损速度加快了${m}倍。`):i.push(`• 使用了${m}x杠杆，放大了收益和风险。`)),i.push(`
📈 **风险收益**：`),i.push(`• 年化收益：${e.annualizedReturn>=0?"+":""}${e.annualizedReturn.toFixed(1)}%`),i.push(`• 最大回撤：${e.maxDrawdown.toFixed(1)}%${e.maxDrawdown>30?"（极高风险）":e.maxDrawdown>20?"（高风险）":e.maxDrawdown>10?"（中等风险）":"（低风险）"}`),i.push(`• 夏普比率：${e.sharpeRatio.toFixed(2)}`),i.push(`
💡 **专属建议**：`);const v=[];return I?(v.push("🚨 立即退出所有杠杆仓位，本金没了就什么都没了。"),v.push("📚 建议先学习《聪明的投资者》等经典书籍。"),v.push("🎮 先用模拟盘练习至少3个月。")):P||k?(v.push("🛑 暂停加仓，不要继续摊低成本。"),v.push("🔍 仔细分析每只股票的买入逻辑。"),D&&v.push("📉 降低杠杆至1x或2x。")):x?v.push("🤔 微调策略，优化选股标准。"):g?v.push("📊 加入债券ETF等低风险资产平滑曲线。"):(w||L)&&v.push("💰 适当减仓，锁定部分利润。"),s[1]>60&&v.push(`🔄 ${s[0]}占比过高，建议减仓分散。`),p===1&&!I&&v.push("🌍 建议配置其他市场分散风险。"),e.maxDrawdown>30&&!I&&v.push("🛡️ 设置止损线（如-15%）并严格执行。"),i.push(...v.map((b,S)=>`${S+1}. ${b}`)),i.push(`
🎯 **总结**：`),I?i.push("这次投资以爆仓告终。记住这次教训，重建本金，重新出发。💪"):P||k?i.push("这次投资虽然亏损，但经验比金钱更重要。🌱"):x?i.push("基本持平，小幅优化就能扭亏为盈。📚"):g?i.push("小赚是不错的开始，继续优化。🐢"):w?i.push("不错的收益！保持并持续优化。🏆"):L&&i.push("卓越的表现！保持学习、控制风险。🌟"),i.join(`
`)}function Vt(t,e,n){const o={};t.stocks.forEach(k=>{o[k.code]=k});const r={},s={};let a=0,i=0,l=0,d=0;e.forEach(k=>{const x=o[k.code];if(!x)return;const g=k.weight/100;r[x.sector]=(r[x.sector]||0)+k.weight,s[x.market]=(s[x.market]||0)+k.weight,a+=x.revenueGrowth*g,i+=x.roe*g,l+=x.pe*g,x.marketCap>3e3&&d++});const c=e.length<=5?.7:e.length<=7?.4:.25,h=(r.科技||0)>40?.6+Math.random()*.2:.2+Math.random()*.3,p={totalReturn:n.totalReturn,annualizedReturn:n.annualizedReturn,annualizedVol:n.annualizedVol,maxDrawdown:n.maxDrawdown,sharpeRatio:n.sharpeRatio,sortinoRatio:n.sortinoRatio,informationRatio:n.informationRatio,calmarRatio:n.calmarRatio,profitLossRatio:n.profitLossRatio,winRate:n.winRate,fundRating:n.fundRating,ratingReasons:n.ratingReasons,riskLevel:n.riskLevel,leverage:n.leverage,sectorWeights:r,marketWeights:s,concentration:c,turnover:h,revenueGrowth:parseFloat(a.toFixed(1)),roe:parseFloat(i.toFixed(2)),pe:parseFloat(l.toFixed(2)),bluechipRatio:parseFloat((d/e.length).toFixed(2)),maxSectorWeight:parseFloat(Math.max(...Object.values(r)).toFixed(1)),stockCount:e.length,crossMarket:Object.keys(s).length>=2,marketCount:Object.keys(s).length};let m=null,I=0;for(const k of rt)if(k.condition(p)){const x=k.id==="jiucai"?5:k.id==="global"?3:1;x>I&&(I=x,m=k)}m||(m=rt.find(k=>k.id==="balanced")||rt[rt.length-1]);const D=Le(m,p,e,o),P={dimensions:["年化收益","风险控制","行业集中度","跨市场配置","选股ROE"],values:[et(Math.min(100,Math.max(0,p.annualizedReturn+50)),0),et(Math.min(100,Math.max(0,100-p.annualizedVol)),0),et(Math.min(100,Math.max(0,p.maxSectorWeight)),0),et(Math.min(100,Math.max(0,Object.keys(s).length*30)),0),et(Math.min(100,Math.max(0,p.roe*1.5)),0)]};return{styleTag:`${m.emoji} ${m.name}`,matchPerson:m.matchPerson,matchPersonDesc:m.personDesc,matchPersonOrg:m.personOrg||"",styleId:m.id,metrics:p,radarData:P,commentary:D}}const St=window.LLM_CONFIG||{},it=St.primary||St.eastmoney||{baseUrl:"",apiKey:"",model:""};let J=null,Q=[];const Bt=3e4;function Ee(t){return Q=[],J=Se(Ie(t)).then(e=>e?[{model:"AI",text:e}]:null),J}async function Pt(){if(!J)return{results:null,errors:[{api:"System",error:"未发起请求"}],loading:!1};let t=null;const e=new Promise(o=>{setTimeout(()=>{o({stillLoading:!0})},100)}),n=await Promise.race([J,e]);return n&&n.stillLoading?t=await J:t=n,J=null,!t||t.length===0?{results:null,errors:[...Q],loading:!1}:{results:t,errors:[...Q],loading:!1}}function Re(){return J!==null}function Ie(t){const{styleTag:e,matchPerson:n,matchPersonDesc:o,matchPersonOrg:r,metrics:s}=t,a=Object.entries(s.sectorWeights||{}).map(([l,d])=>`${l}${d.toFixed(0)}%`).join("、"),i=Object.entries(s.marketWeights||{}).map(([l,d])=>`${{"a-share":"A股",hk:"港股",us:"美股",index:"指数ETF"}[l]||l}${d.toFixed(0)}%`).join("、");return`你是资深基金经理，点评以下投资组合（中文，150-200字，分段，用Markdown但不用标题）：

- 风格标签：${e}
- 对标人物：${n}（${o}${r?"，"+r:""}）
- 行业分布：${a}
- 市场分布：${i}
- 年化收益：${s.annualizedReturn}%
- 最大回撤：${s.maxDrawdown}%
- 夏普比率：${s.sharpeRatio}
- 杠杆：${s.leverage||1}x
- 持仓：${s.stockCount}只

要求：幽默风趣，用股民梗，先夸后吐槽，对标人物调侃，给建议，适度用emoji。`}function De(t){if(!t)return"";const e=[/最终回答[：:]\s*/,/最终点评[：:]\s*/,/以下是点评[：:]\s*/,/点评如下[：:]\s*/,/回复[：:]\s*\n/];for(const r of e){const s=t.match(r);if(s){const a=t.slice(s.index+s[0].length).trim();if(a.length>50)return a}}const n=t.split(/\n\n+/).filter(r=>r.trim());if(n.length>=3)for(let r=n.length-1;r>=0;r--){const s=n[r].trim();if(!/^(我们|首先|需要|用户|任务|好的|让我|我来|根据|这个|以上|下面|那么|所以|因此|总之|现在)/.test(s)&&s.length>30)return n.slice(r).join(`

`)}const o=t.replace(/^.*?我们需要.*?\n/s,"").trim();return o.length>50?o:t.trim()}async function Se(t){var r,s;if(!it.apiKey)return Q.push({api:"API",error:"未配置 apiKey（请创建 config.js 并填入 Key）"}),null;const e=it.baseUrl||"/api",n=new AbortController,o=setTimeout(()=>n.abort(),Bt);try{const a=await fetch(`${e}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${it.apiKey}`},body:JSON.stringify({model:it.model,messages:[{role:"system",content:"你是资深基金经理。直接输出点评正文，禁止输出思考过程、分析步骤或自言自语。"},{role:"user",content:t}],max_tokens:2e3,temperature:.8}),signal:n.signal});if(!a.ok){const c=await a.text().catch(()=>"");return Q.push({api:"API",error:`HTTP ${a.status}${c?": "+c.slice(0,200):""}`}),null}const l=(s=(r=(await a.json()).choices)==null?void 0:r[0])==null?void 0:s.message;let d=((l==null?void 0:l.content)||"").trim();return!d&&(l!=null&&l.reasoning_content)&&(d=De(l.reasoning_content)),d||Q.push({api:"API",error:"返回内容为空（模型未输出有效回复）"}),d||null}catch(a){const i=a.name==="AbortError"?`请求超时（${Bt/1e3}秒）。请检查：1) 是否在公司内网 2) Vite 代理是否正常 3) API 地址是否正确`:a.message||"网络错误";return Q.push({api:"API",error:i}),console.warn("[LLM]",a.message),null}finally{clearTimeout(o)}}const M={currentScreen:"builder",fundName:"",holdings:[],period:"1y",customMonths:18,backtestResults:null,stocksData:null,userResult:null,investAmount:1e5,leverage:1};let lt=null,ft=null;function Be(){const t=document.getElementById("particle-canvas");if(!t)return;const e=t.getContext("2d");let n=[];lt&&(cancelAnimationFrame(lt),lt=null),ft&&window.removeEventListener("resize",ft);function o(){t.width=window.innerWidth,t.height=window.innerHeight}o(),ft=o,window.addEventListener("resize",o);class r{constructor(){this.reset()}reset(){this.x=Math.random()*t.width,this.y=Math.random()*t.height,this.size=Math.random()*2+.5,this.speedX=(Math.random()-.5)*.3,this.speedY=(Math.random()-.5)*.3,this.opacity=Math.random()*.5+.1}update(){this.x+=this.speedX,this.y+=this.speedY,(this.x<0||this.x>t.width||this.y<0||this.y>t.height)&&this.reset()}draw(){e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fillStyle=`rgba(79, 195, 247, ${this.opacity})`,e.fill()}}for(let a=0;a<80;a++)n.push(new r);function s(){e.clearRect(0,0,t.width,t.height),n.forEach(a=>{a.update(),a.draw()});for(let a=0;a<n.length;a++)for(let i=a+1;i<n.length;i++){const l=n[a].x-n[i].x,d=n[a].y-n[i].y,c=Math.sqrt(l*l+d*d);c<120&&(e.beginPath(),e.moveTo(n[a].x,n[a].y),e.lineTo(n[i].x,n[i].y),e.strokeStyle=`rgba(79, 195, 247, ${.08*(1-c/120)})`,e.lineWidth=.5,e.stroke())}lt=requestAnimationFrame(s)}s()}function vt(t){ne(),document.querySelectorAll(".screen").forEach(o=>o.classList.remove("active","hidden")),document.querySelectorAll(".screen").forEach(o=>o.classList.add("hidden"));const e=document.getElementById(`screen-${t}`);e&&(e.classList.remove("hidden"),e.classList.add("active"),e.scrollIntoView({behavior:"smooth",block:"start"})),M.currentScreen=t;const n=document.getElementById("header");n&&(n.style.display=t==="builder"?"":"none")}async function Gt(){try{const e=await fetch("./"+"stocks.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);const n=await e.json();return n.stocks.forEach(o=>{o.latestPrice=o.prices[o.prices.length-1]}),M.stocksData=n,M.stocksData}catch(t){return console.error("Failed to load stocks:",t),null}}async function Pe(){var e,n,o,r;const t=document.getElementById("btn-start");t.disabled=!0,t.textContent="⏳ 回测计算中...";try{const s=qt(),a=le();let i=parseFloat((e=document.getElementById("invest-amount"))==null?void 0:e.value)||1e5;i=Math.max(100,Math.min(1e8,i));const l=parseFloat((n=document.getElementById("leverage"))==null?void 0:n.value)||1;let d=M.fundName||((r=(o=document.getElementById("fund-name"))==null?void 0:o.value)==null?void 0:r.trim());d||(d=Te(s,M.stocksData)),M.stocksData||await Gt();const c=Wt(M.stocksData,s,a);c.label=d,c.amount=i,c.leverage=l,M.userResult=c,M.holdings=s,M.investAmount=i,M.leverage=l;const u=ke(M.stocksData,a),h=[c,...u];h.sort((I,D)=>D.totalReturn-I.totalReturn),h.forEach((I,D)=>{I.rank=D+1}),M.backtestResults=h,vt("arena"),ce({fundName:d,period:a,results:h,amount:i,leverage:l});const p={...c,totalReturn:c.totalReturn*l,maxDrawdown:c.maxDrawdown*l},m=Vt(M.stocksData,s,p);m.metrics.leverage=l,Ee(m)}catch(s){je("回测失败："+s.message,"error"),t.disabled=!1,t.textContent="⚡ 开始挑战"}}async function Ce(){vt("diagnosis");const t={...M.userResult,totalReturn:M.userResult.totalReturn*M.leverage,maxDrawdown:M.userResult.maxDrawdown*M.leverage},e=Vt(M.stocksData,M.holdings,t);e.metrics.leverage=M.leverage;const n=Re();let o={results:null,errors:[],loading:n};n||(o=await Pt()),ge(e,o),n&&(o=await Pt(),he(o))}function Fe(){M.fundName="",M.holdings=[],M.backtestResults=null,M.userResult=null,document.getElementById("fund-name").value="",document.getElementById("btn-start").disabled=!0,vt("builder"),Ot()}function Te(t,e){var $;if(!t||t.length===0)return"我的基金";const n={};e&&e.stocks&&e.stocks.forEach(v=>{n[v.code]=v});const o={},r={};let s=!1,a=!1,i=!1,l=!1;t.forEach(v=>{const y=n[v.code];y&&(o[y.market]=(o[y.market]||0)+v.weight,r[y.sector]=(r[y.sector]||0)+v.weight,y.sector==="科技"&&(s=!0),y.sector==="金融"&&(a=!0),y.sector==="消费"&&(i=!0),y.sector==="医药"&&(l=!0))});const d=Object.entries(o).sort((v,y)=>y[1]-v[1]),c=(($=d[0])==null?void 0:$[0])||"a-share",u=d.length,h={"a-share":["华夏","国泰","南方","易方达","嘉实","博时","广发","富国"],hk:["港股","香港","恒生","中港","沪港深"],us:["纳斯达克","标普","美股","全球","海外"],index:["指数","ETF","被动"]};let p;u>=3?p=["全球","国际","环球","世界","跨市场"]:u===2?p=["沪港深","深港通","AH","中美","跨市场"]:p=h[c]||h["a-share"];let m=[];s&&t.length<=3?m=["创新","科技","成长","新兴","前沿","智能"]:a&&t.length<=3?m=["金融","价值","蓝筹","红利","稳健","精选"]:i&&t.length<=3?m=["消费","品质","生活","品牌","升级"]:l&&t.length<=3?m=["健康","医疗","生命","医药","生物"]:t.length>=8?m=["优选","精选","配置","均衡","多元","全能"]:t.length<=3?m=["聚焦","集中","核心","龙头","精选","优势"]:m=["成长","价值","均衡","轮动","趋势","精选","优选","灵活"];const I=["混合","股票","配置","优选","精选","成长","价值","稳健","进取","灵活"],D=p[Math.floor(Math.random()*p.length)],P=m[Math.floor(Math.random()*m.length)],k=I[Math.floor(Math.random()*I.length)],x=[D+P+k,D+k+P,P+k,D+P],g=x[Math.floor(Math.random()*x.length)],w=["超级","至尊","王者","巅峰","传奇","无敌","神级","霸道"];return w[Math.floor(Math.random()*w.length)]+g+"（您）"}async function Ae(){Be(),await Gt(),Ot();const t=document.getElementById("invest-amount");t&&(t.addEventListener("input",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value&&parseInt(n.target.value)!==o&&(n.target.value=o)}),t.addEventListener("blur",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value=o})),document.getElementById("btn-start").addEventListener("click",Pe),document.getElementById("btn-diagnosis").addEventListener("click",Ce),document.getElementById("btn-restart").addEventListener("click",Fe),document.getElementById("fund-name").addEventListener("input",n=>{M.fundName=n.target.value.trim(),V()});const e=document.getElementById("leverage");e&&e.addEventListener("input",()=>{document.getElementById("leverage-display").textContent=e.value+"x"})}Ae();let pt=null;function je(t,e="info"){const n=document.getElementById("toast-msg");n&&n.remove(),pt&&clearTimeout(pt);const o=e==="error"?"bg-red-500/90":"bg-green-500/90",r=document.createElement("div");r.id="toast-msg",r.className=`fixed top-4 left-1/2 -translate-x-1/2 ${o} text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm`,r.textContent=t,document.body.appendChild(r),pt=setTimeout(()=>{r.style.opacity="0",r.style.transition="opacity .3s",setTimeout(()=>r.remove(),300)},3e3)}function V(){const t=document.getElementById("btn-start");t&&(t.disabled=qt().length<1)}

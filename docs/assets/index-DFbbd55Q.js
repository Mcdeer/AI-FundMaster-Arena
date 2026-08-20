(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();let A=null,O=null,N=null,Fe="pct",Ae=[],je=1e5,ze=1;function _(e,t){if(e==null||isNaN(e))return e;const n=Math.pow(10,t);return Math.round(e*n)/n}function Ze(e,t){const n=e.length;if(n<10)return[];const o=(n-1)/2,a=e.reduce((d,u)=>d+u,0)/n;let s=0,r=0;for(let d=0;d<n;d++)s+=(d-o)*(e[d]-a),r+=(d-o)*(d-o);const i=r!==0?s/r:0,l=e[n-1],c=[];for(let d=1;d<=t;d++){const u=(Math.random()-.5)*Math.abs(i)*d*.5;c.push(_(l+i*d+u,2))}return c}function et(e,t){const n=new Date,o=[],a=e-t;for(let s=0;s<a;s++){const r=new Date(n);r.setDate(r.getDate()-(a-s)),s===0||s===a-1||s%Math.max(1,Math.floor(a/6))===0?o.push(r.getMonth()+1+"/"+r.getDate()):o.push("")}for(let s=0;s<t;s++){const r=new Date(n);r.setDate(r.getDate()+s+1),s===0||s===t-1||s%Math.max(1,Math.floor(t/2))===0?o.push("🔮"+(r.getMonth()+1)+"/"+r.getDate()):o.push("")}return o}function tt(e,t,n,o){const a=document.getElementById(e);a&&(Ae=t,je=n||1e5,ze=o||1,A&&A.dispose(),A=echarts.init(a),Oe())}function Oe(){const e=Ae,t=je,n=ze,o=Fe==="value",a="#4fc3f7",s=["#69f0ae","#f0c060","#b388ff","#ff80ab","#18ffff","#ffab40","#ff5252"],r=[];let i=0,l=0;const c=e.find(h=>h.isUser);c&&(l=c.chartData.length),e.forEach((h,w)=>{h.chartData.length>i&&(i=h.chartData.length)});let d=[],u=-1;if(c){const h=c.chartData;for(let w=0;w<h.length;w++)if((h[w]-100)*n<=-100){u=w;break}if(u<0){const w=Ze(c.chartData,Math.max(1,Math.floor(i*.05)));w.length>0&&(d=w,i=Math.max(i,l+d.length))}}let m=[];const p=e.find(h=>h.isUser&&h.dateLabels);if(p&&p.dateLabels)m=[...p.dateLabels];else{const h=Math.max(0,i-l);m=et(i,h)}if(d.length>0&&m.length>0){const h=m[m.length-1],[w,L]=h.split("/").map(Number);for(let $=1;$<=d.length;$++){const v=new Date(2026,w-1,L);v.setDate(v.getDate()+$);const y=$===1||$===d.length||$%Math.max(1,Math.floor(d.length/3))===0?"🔮"+(v.getMonth()+1)+"/"+v.getDate():"";m.push(y)}}e.forEach((h,w)=>{const L=h.isUser,$=h.isBenchmark,v=h.chartData,y=L?a:s[(w-1)%s.length];let b=[],S=-1;if(o)for(let E=0;E<v.length;E++){if((v[E]-100)*n<=-100){S=E,b.push(0);break}b.push(_(t*n*v[E]/100,0))}else for(let E=0;E<v.length;E++){const C=_((v[E]-100)*n,1);if(C<=-100){S=E,b.push(-100);break}b.push(C)}for(;b.length<i;)b.push(null);let F=[...b];if(L&&d.length>0&&!o)for(let E=0;E<d.length;E++){const C=_((d[E]-100)*n,1);l+E<F.length?F[l+E]=C:F.push(C)}else if(L&&d.length>0&&o)for(let E=0;E<d.length;E++){const C=_(t*n*d[E]/100,0);l+E<F.length?F[l+E]=C:F.push(C)}if(L&&d.length>0&&S<0){const E=F.slice(0,l),C=new Array(l-1).fill(null),ce=E[E.length-1];C.push(ce);for(let K=0;K<d.length;K++){const de=o?_(t*n*d[K]/100,0):_((d[K]-100)*n,1);C.push(de)}r.push({name:h.label,type:"line",data:E,smooth:!0,symbol:"none",lineStyle:{width:4,type:"solid",color:y},itemStyle:{color:y},emphasis:{focus:"series",lineStyle:{width:6}},z:10,endLabel:{show:!0,formatter:h.label,color:y,fontSize:11,offset:[10,0]}}),r.push({name:"预测走势",type:"line",data:C,smooth:!0,symbol:"none",lineStyle:{width:3,type:"dashed",color:y,opacity:.7},itemStyle:{color:y},z:9,silent:!0})}else r.push({name:h.label,type:"line",data:F,smooth:!0,symbol:"none",lineStyle:{width:L?4:$?1.5:2,type:"solid",color:y,opacity:$?.5:1},itemStyle:{color:y},emphasis:{focus:"series",lineStyle:{width:L?6:3}},z:L?10:1,endLabel:L?{show:!0,formatter:h.label,color:y,fontSize:11,offset:[10,0]}:void 0,...S>=0?{markPoint:{data:[{name:"💥",coord:[S,o?0:-100],symbol:"pin",symbolSize:35,itemStyle:{color:"#ff5252"},label:{show:!0,formatter:"💥爆仓",fontSize:14,color:"#ff5252",fontWeight:"bold",offset:[0,-15]}}],animation:!1}}:{}})});const g=o?"总价值（元）":"收益率（%）";let I=1/0,D=-1/0;r.forEach(h=>{h.data&&h.data.forEach(w=>{w!==null&&!isNaN(w)&&(I=Math.min(I,w),D=Math.max(D,w))})});const B=D-I;I=I-B*.1,D=D+B*.1;const k={backgroundColor:"transparent",tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb",fontSize:12},formatter:function(h){const w=h.filter(y=>y.value!==null&&y.value!==void 0&&!y.seriesName.includes("预测"));if(w.length===0)return"";let $='<div style="font-weight:bold;margin-bottom:4px;">'+h[0].axisValue.replace("🔮","预测 ")+"</div>";const v=[...w].sort((y,b)=>(b.value||0)-(y.value||0));for(const y of v){const b=e.find(E=>E.label===y.seriesName&&E.isUser),S=b?"⭐ ":"",F=o?"¥"+Number(y.value).toLocaleString():(y.value>=0?"+":"")+y.value.toFixed(1)+"%";$+='<div style="display:flex;align-items:center;gap:6px;'+(b?"font-weight:bold;":"")+'"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+y.color+';"></span>'+S+y.seriesName+": "+F+"</div>"}return $}},legend:{bottom:0,textStyle:{color:"#9ca3af",fontSize:10},icon:"roundRect",itemWidth:12,itemHeight:8,data:e.map(h=>h.label)},grid:{left:"12%",right:"8%",top:"10%",bottom:"15%"},xAxis:{type:"category",data:m,axisLine:{lineStyle:{color:"#2d3d54"}},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:9,rotate:30},splitLine:{show:!1}},yAxis:{type:"value",name:g,nameLocation:"middle",nameGap:50,nameTextStyle:{color:"#9ca3af",fontSize:12},axisLine:{show:!0,lineStyle:{color:"#2d3d54"}},axisTick:{show:!0,lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,formatter:o?h=>h>=1e4?(h/1e4).toFixed(1)+"万":h.toLocaleString():h=>h.toFixed(0)+"%"},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},min:Math.floor(I),max:Math.ceil(D)},series:r};A.setOption(k,!0);const x=document.getElementById("forecast-section");x&&x.classList.toggle("hidden",d.length===0),window.addEventListener("resize",()=>A==null?void 0:A.resize())}function ke(e){var t,n,o,a,s,r,i,l,c,d,u,m,p,g;Fe=e,A&&(A.dispose(),A=echarts.init(document.getElementById("chart-returns")),Oe()),(t=document.getElementById("chart-mode-pct"))==null||t.classList.toggle("active",e==="pct"),(n=document.getElementById("chart-mode-pct"))==null||n.classList.toggle("bg-neon-blue/20",e==="pct"),(o=document.getElementById("chart-mode-pct"))==null||o.classList.toggle("text-neon-blue",e==="pct"),(a=document.getElementById("chart-mode-pct"))==null||a.classList.toggle("border-neon-blue/30",e==="pct"),(s=document.getElementById("chart-mode-pct"))==null||s.classList.toggle("bg-dark-500/30",e!=="pct"),(r=document.getElementById("chart-mode-pct"))==null||r.classList.toggle("text-gray-400",e!=="pct"),(i=document.getElementById("chart-mode-pct"))==null||i.classList.toggle("border-dark-500",e!=="pct"),(l=document.getElementById("chart-mode-value"))==null||l.classList.toggle("active",e==="value"),(c=document.getElementById("chart-mode-value"))==null||c.classList.toggle("bg-neon-blue/20",e==="value"),(d=document.getElementById("chart-mode-value"))==null||d.classList.toggle("text-neon-blue",e==="value"),(u=document.getElementById("chart-mode-value"))==null||u.classList.toggle("border-neon-blue/30",e==="value"),(m=document.getElementById("chart-mode-value"))==null||m.classList.toggle("bg-dark-500/30",e!=="value"),(p=document.getElementById("chart-mode-value"))==null||p.classList.toggle("text-gray-400",e!=="value"),(g=document.getElementById("chart-mode-value"))==null||g.classList.toggle("border-dark-500",e!=="value")}function nt(e,t,n){const o=document.getElementById(e);if(!o)return;O&&O.dispose(),O=echarts.init(o);const a={backgroundColor:"transparent",tooltip:{backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(124,58,237,0.3)",textStyle:{color:"#e5e7eb"}},radar:{center:["50%","50%"],radius:"65%",indicator:t.dimensions.map(s=>({name:s,max:100})),axisName:{color:"#9ca3af",fontSize:11},splitArea:{areaStyle:{color:["rgba(79,195,247,0.02)","rgba(79,195,247,0.02)"]}},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},axisLine:{lineStyle:{color:"rgba(45,61,84,0.5)"}}},series:[{type:"radar",data:[{value:t.values,name:n,areaStyle:{color:"rgba(124,58,237,0.15)"},lineStyle:{color:"#b388ff",width:2},itemStyle:{color:"#b388ff"},symbol:"circle",symbolSize:5}]}]};O.setOption(a,!0),window.addEventListener("resize",()=>O==null?void 0:O.resize())}function He(){const e=document.getElementById("sector-pie");e&&(N&&N.dispose(),N=echarts.init(e))}function ot(e){if(!N)return;const t=["#4fc3f7","#69f0ae","#f0c060","#ff5252","#b388ff","#ff80ab","#18ffff"],n={backgroundColor:"transparent",tooltip:{trigger:"item",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb"},formatter:"{b}: {c}% ({d}%)"},series:[{type:"pie",radius:["50%","75%"],center:["50%","50%"],emphasis:{label:{fontSize:14,fontWeight:"bold"},scaleSize:8},label:{color:"#9ca3af",fontSize:11,formatter:`{b}
{c}%`},labelLine:{lineStyle:{color:"#4b5563"}},data:e.length>0?e:[{name:"未选择",value:100,itemStyle:{color:"#1f2937"}}],itemStyle:{borderColor:"#0a0e17",borderWidth:2,color:o=>t[o.dataIndex%t.length]}}]};N.setOption(n,!0)}function st(){A==null||A.dispose(),A=null,O==null||O.dispose(),O=null,N==null||N.dispose(),N=null}function $e(e,t){if(e.length<t)return[];const n=new Array(e.length).fill(null);let o=0;for(let a=0;a<e.length;a++)o+=e[a],a>=t&&(o-=e[a-t]),a>=t-1&&(n[a]=parseFloat((o/t).toFixed(2)));return n}function at(e,t=14){if(e.length<t+1)return[];const n=new Array(e.length).fill(null),o=[],a=[];for(let i=1;i<e.length;i++){const l=e[i]-e[i-1];o.push(l>0?l:0),a.push(l<0?-l:0)}let s=o.slice(0,t).reduce((i,l)=>i+l,0)/t,r=a.slice(0,t).reduce((i,l)=>i+l,0)/t;for(let i=t;i<o.length;i++){if(r===0)n[i+1]=100;else{const l=s/r;n[i+1]=parseFloat((100-100/(1+l)).toFixed(1))}s=(s*(t-1)+o[i])/t,r=(r*(t-1)+a[i])/t}return n}let ee=[],R=[],Z="a-share",oe="all",Me=!1,Le=!1,Ee=!1,Re=!1,Ie=!1;function Y(){M.holdings=R.map(e=>({code:e.code,name:e.name,sector:e.sector,market:e.market,weight:e.weight}))}function Ge(){var n;R=[],Y(),Z="a-share",oe="all",M.stocksData&&rt(M.stocksData),Me||(document.querySelectorAll(".market-tab").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".market-tab").forEach(a=>a.classList.remove("active")),o.classList.add("active"),Z=o.dataset.market,document.getElementById("stock-search").value="",V()})}),Me=!0),Ie||((n=document.getElementById("btn-random"))==null||n.addEventListener("click",ct),Ie=!0);const e=document.getElementById("stock-search");if(e&&!Ee){let o=null;e.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(()=>{const a=e.value.trim().toLowerCase();a&&(Z="all",document.querySelectorAll(".market-tab").forEach(s=>s.classList.remove("active"))),V(a)},250)}),Ee=!0}Le||(document.querySelectorAll(".period-btn").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".period-btn").forEach(s=>s.classList.remove("active")),o.classList.add("active");const a=o.dataset.period;a==="custom"?(document.getElementById("custom-period-wrap").classList.remove("hidden"),M.period="custom"):(document.getElementById("custom-period-wrap").classList.add("hidden"),M.period=a)})}),Le=!0);const t=document.getElementById("custom-months");t&&!Re&&(t.addEventListener("input",()=>{M.customMonths=parseInt(t.value)||18}),Re=!0),He(),W()}function rt(e){ee=e.stocks,it(e.sectors),V(),He()}function it(e){const t=document.getElementById("sector-filters");if(!t)return;t.innerHTML="";const n=document.createElement("button");n.className="sector-btn active",n.textContent="全部",n.addEventListener("click",()=>{oe="all",document.querySelectorAll(".sector-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),V()}),t.appendChild(n),e.forEach(o=>{const a=document.createElement("button");a.className="sector-btn",a.textContent=o,a.addEventListener("click",()=>{oe=o,document.querySelectorAll(".sector-btn").forEach(s=>s.classList.remove("active")),a.classList.add("active"),V()}),t.appendChild(a)})}function V(e){const t=document.getElementById("stock-grid");if(!t)return;let n=ee;if(e){const o=e.toLowerCase();n=ee.filter(a=>a.name.toLowerCase().includes(o)||a.code.toLowerCase().includes(o)).slice(0,50)}else Z==="all"&&(Z="a-share"),n=ee.filter(o=>{const a=o.market===Z,s=oe==="all"||o.sector===oe;return a&&s});n.sort((o,a)=>a.marketCap-o.marketCap),t.innerHTML=n.map(o=>{var i;const a=R.find(l=>l.code===o.code),s=o.latestPrice;return`
      <div class="stock-card ${a?"selected":""}" data-code="${o.code}" data-name="${o.name}"
           data-sector="${o.sector}" data-market="${o.market}">
        <div class="flex items-center justify-between mb-1">
          <span class="text-white font-medium text-sm truncate flex-1">${o.name}</span>
          <div class="flex items-center gap-1">
            <button class="stock-detail-btn text-xs text-gray-500 hover:text-neon-blue px-1.5 py-0.5 rounded bg-dark-600/50 transition-colors" data-code="${o.code}" title="查看详情">ℹ️</button>
            ${a?'<span class="text-neon-blue text-xs">✓</span>':""}
          </div>
        </div>
        <div class="text-xs text-gray-500 mb-1">${o.code} · ${o.sector}</div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-400">PE ${((i=o.pe)==null?void 0:i.toFixed(1))||"--"}</span>
          <span class="font-mono text-gray-300">¥${(s==null?void 0:s.toFixed(2))||"--"}</span>
        </div>
      </div>
    `}).join(""),t.querySelectorAll(".stock-card").forEach(o=>{o.addEventListener("click",a=>{a.target.closest(".stock-detail-btn")||qe(o.dataset)})}),t.querySelectorAll(".stock-detail-btn").forEach(o=>{o.addEventListener("click",a=>{a.stopPropagation();const s=o.dataset.code;lt(s)})})}function lt(e){var p,g,I,D,B,k;const t=ee.find(x=>x.code===e);if(!t)return;const n=t.prices.slice(-60),o=Math.min(...n),a=Math.max(...n),s={"a-share":"A股",hk:"港股",us:"美股",index:"指数"},r=n[0],l=((n[n.length-1]-r)/r*100).toFixed(2),c=l>=0?"text-neon-red":"text-neon-green",d=l>=0?"+":"",u=l>=0?"#ff5252":"#69f0ae";for(let x=0;x<n.length;x+=10);const m=document.createElement("div");m.className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm",m.innerHTML=`
    <div class="bg-dark-800 rounded-2xl p-6 max-w-lg w-full mx-4 border border-dark-500 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
      <!-- 头部 -->
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="text-xl font-bold text-white">${t.name}</h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm text-gray-400">${t.code}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-dark-600 text-gray-300">${s[t.market]||t.market}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-dark-600 text-gray-300">${t.sector}</span>
          </div>
        </div>
        <button class="text-gray-500 hover:text-white text-2xl" onclick="this.closest('.fixed').remove()">&times;</button>
      </div>
      
      <!-- 价格信息 -->
      <div class="bg-dark-700/50 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-gray-500 mb-1">最新价格</div>
            <div class="text-2xl font-mono font-bold text-white">¥${((p=t.latestPrice)==null?void 0:p.toFixed(2))||"--"}</div>
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
          <span>最高: ¥${a.toFixed(2)}</span>
        </div>
      </div>
      
      <!-- 关键指标 -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">市盈率 (PE)</div>
          <div class="text-lg font-mono text-white">${((g=t.pe)==null?void 0:g.toFixed(1))||"--"}</div>
          <div class="text-xs text-gray-600">${t.pe>30?"估值偏高":t.pe<15?"估值偏低":"估值合理"}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">市值</div>
          <div class="text-lg font-mono text-white">${(t.marketCap/1e4).toFixed(0)}亿</div>
          <div class="text-xs text-gray-600">${t.marketCap>1e4?"大盘股":t.marketCap>1e3?"中盘股":"小盘股"}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">营收增长</div>
          <div class="text-lg font-mono ${t.revenueGrowth>0?"text-neon-red":"text-neon-green"}">${((I=t.revenueGrowth)==null?void 0:I.toFixed(1))||"--"}%</div>
          <div class="text-xs text-gray-600">${t.revenueGrowth>20?"高增长":t.revenueGrowth>0?"稳健增长":"负增长"}</div>
        </div>
        <div class="bg-dark-700/30 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">ROE</div>
          <div class="text-lg font-mono text-white">${((D=t.roe)==null?void 0:D.toFixed(1))||"--"}%</div>
          <div class="text-xs text-gray-600">${t.roe>15?"优秀":t.roe>10?"良好":"一般"}</div>
        </div>
      </div>
      
      <!-- 技术指标 -->
      <div class="bg-dark-700/30 rounded-lg p-3 mb-4">
        <div class="text-xs text-gray-500 mb-2">📊 技术指标（基于历史模拟数据）</div>
        <div class="grid grid-cols-3 gap-2 text-center" id="tech-indicators-${t.code}">
          <div class="text-xs text-gray-500">正在计算...</div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex gap-3">
        <button class="stock-modal-close flex-1 bg-dark-600/50 text-gray-400 border border-dark-500 rounded-lg py-2.5 text-sm font-medium hover:bg-dark-500 hover:text-white transition-colors">关闭</button>
        <button class="stock-modal-add flex-1 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg py-2.5 text-sm font-medium hover:shadow-lg hover:shadow-neon-blue/20 transition-all" data-code="${t.code}" data-name="${t.name}" data-sector="${t.sector}" data-market="${t.market}">＋ 加入组合</button>
      </div>
    </div>
  `,document.body.appendChild(m),(B=m.querySelector(".stock-modal-close"))==null||B.addEventListener("click",()=>m.remove()),(k=m.querySelector(".stock-modal-add"))==null||k.addEventListener("click",function(){const{code:x,name:h,sector:w,market:L}=this.dataset;qe({code:x,name:h,sector:w,market:L}),m.remove()}),m.addEventListener("click",x=>{x.target===m&&m.remove()}),setTimeout(()=>{const x=document.getElementById(`tech-indicators-${t.code}`);if(!x)return;const h=t.prices.slice(-120),w=$e(h,20),L=$e(h,60),$=at(h,14);h[h.length-1];const v=w[w.length-1],y=L[L.length-1],b=$[$.length-1],S=v>y?"📈 多头排列":"📉 空头排列",F=b>70?"⚠️ 超买":b<30?"💡 超卖":"➖ 中性";x.innerHTML=`
      <div><div class="text-xs text-gray-500">MA20</div><div class="font-mono text-sm ${v>y?"text-neon-red":"text-neon-green"}">${(v==null?void 0:v.toFixed(2))||"--"}</div></div>
      <div><div class="text-xs text-gray-500">RSI(14)</div><div class="font-mono text-sm ${b>70?"text-neon-red":b<30?"text-neon-green":"text-gray-300"}">${(b==null?void 0:b.toFixed(1))||"--"}</div></div>
      <div><div class="text-xs text-gray-500">趋势</div><div class="text-xs">${S}</div><div class="text-xs text-gray-500">${F}</div></div>
    `},100),setTimeout(()=>{const x=document.getElementById("stock-price-chart");if(x&&typeof echarts<"u"){const h=echarts.init(x),w={backgroundColor:"transparent",grid:{left:"3%",right:"3%",top:"5%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:n.map((L,$)=>$+1),axisLine:{lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,interval:9,formatter:L=>`${L}日`},axisTick:{show:!1}},yAxis:{type:"value",scale:!0,axisLine:{show:!1},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:10,formatter:L=>"¥"+L.toFixed(0)},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}}},series:[{data:n,type:"line",smooth:!0,symbol:"none",lineStyle:{width:3,color:u},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:u+"40"},{offset:1,color:u+"00"}])}}],tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:u,textStyle:{color:"#e5e7eb",fontSize:12},formatter:L=>{const $=L[0].value;return`<div style="font-weight:bold">第${L[0].axisValue}天</div><div>价格: ¥${$.toFixed(2)}</div>`}}};h.setOption(w),window.addEventListener("resize",()=>h.resize())}},100),m.addEventListener("click",x=>{x.target===m&&m.remove()})}function qe({code:e,name:t,sector:n,market:o}){var r,i;const a=R.findIndex(l=>l.code===e);if(a>=0)R.splice(a,1);else if(R.length<10)R.push({code:e,name:t,sector:n,market:o,weight:0});else{showToast("最多选择10只成分股","error");return}xe(),Y();const s=(i=(r=document.getElementById("stock-search"))==null?void 0:r.value)==null?void 0:i.trim();V(s||void 0),W(),J(),U()}function xe(){if(R.length===0)return;const e=Math.floor(100/R.length),t=100-e*R.length;R.forEach((o,a)=>{o.weight=e+(a<t?1:0)});const n=R.reduce((o,a)=>o+a.weight,0);n!==100&&R.length>0&&(R[0].weight+=100-n)}function W(){var a;const e=document.getElementById("selected-list"),t=document.getElementById("weight-sum");if(R.length===0){e.innerHTML='<span class="text-gray-500">请从上方选择股票</span>',t.textContent="合计: 0%";return}e.innerHTML=R.map((s,r)=>`
    <div class="selected-item w-full">
      <button class="text-gray-500 hover:text-red-400 text-lg flex-shrink-0"
              data-action="remove" data-index="${r}">✕</button>
      <div class="flex-1 min-w-0">
        <div class="text-white text-sm truncate">${s.name}</div>
        <div class="text-xs text-gray-500">${s.code} · ${s.sector}</div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <input type="range" min="1" max="95" value="${s.weight}"
               class="weight-slider w-16 md:w-24"
               data-action="weight" data-index="${r}" />
        <input type="number" min="1" max="95" value="${s.weight}"
               class="weight-input w-14 bg-dark-700 border border-dark-500 rounded-lg px-1.5 py-1 text-center text-neon-blue font-mono text-sm focus:outline-none focus:border-neon-blue"
               data-action="weight-input" data-index="${r}" />
        <span class="text-neon-blue font-mono text-sm w-8 text-right">%</span>
      </div>
    </div>
  `).join("");const n=R.reduce((s,r)=>s+r.weight,0);t.textContent=`合计: ${n}%`,t.className=n===100?"text-sm font-mono text-neon-green":"text-sm font-mono text-neon-red";const o=((a=document.getElementById("lock-weights"))==null?void 0:a.checked)||!1;e.querySelectorAll('[data-action="weight"]').forEach(s=>{s.addEventListener("input",r=>{const i=parseInt(s.dataset.index);R[i].weight=parseInt(r.target.value);const l=e.querySelector(`[data-action="weight-input"][data-index="${i}"]`);l&&(l.value=r.target.value),o?(Y(),W(),J(),U()):De(i,parseInt(r.target.value))}),s.addEventListener("change",r=>{if(!o)return;const i=parseInt(s.dataset.index);R[i].weight=parseInt(r.target.value),Y(),W(),J(),U()})}),e.querySelectorAll('[data-action="weight-input"]').forEach(s=>{s.addEventListener("change",r=>{const i=parseInt(s.dataset.index);let l=parseInt(r.target.value)||1;l=Math.max(1,Math.min(95,l)),R[i].weight=l;const c=e.querySelector(`[data-action="weight"][data-index="${i}"]`);c&&(c.value=l),o?(Y(),W(),J(),U()):De(i,l)})}),e.querySelectorAll('[data-action="remove"]').forEach(s=>{s.addEventListener("click",()=>{const r=parseInt(s.dataset.index);R.splice(r,1),xe(),Y(),V(),W(),J(),U()})})}function De(e,t){const n=R.filter((r,i)=>i!==e);if(n.length===0)return;R[e].weight=t;const o=100-t,a=n.reduce((r,i)=>r+i.weight,0);if(a===0){const r=Math.floor(o/n.length);n.forEach(l=>l.weight=r);const i=n.reduce((l,c)=>l+c.weight,0);n[0].weight+=o-i}else{const r=o/a;let i=0;n.forEach((d,u)=>{d.weight=Math.max(1,Math.round(d.weight*r)),i+=d.weight});let l=o-i,c=0;for(;l!==0&&c<20;){c++;for(const d of n)if(l>0?(d.weight++,l--):l<0&&d.weight>1&&(d.weight--,l++),l===0)break}l!==0&&n.length>0&&(n[0].weight=Math.max(1,n[0].weight+l))}const s=R.reduce((r,i)=>r+i.weight,0);s!==100&&R.length>0&&(R[0].weight+=100-s),Y(),W(),J(),U()}function J(){const e={};R.forEach(n=>{e[n.sector]=(e[n.sector]||0)+n.weight});const t=Object.entries(e).map(([n,o])=>({name:n,value:o}));ot(t)}function ct(){var n;R=[];const e=4+Math.floor(Math.random()*4),t=[...ee].sort(()=>Math.random()-.5);for(let o=0;o<Math.min(e,t.length);o++){const a=t[o];R.push({code:a.code,name:a.name,sector:a.sector,market:a.market,weight:0})}xe(),document.getElementById("stock-search").value="",Z="a-share",document.querySelectorAll(".market-tab").forEach(o=>o.classList.remove("active")),(n=document.querySelector('[data-market="a-share"]'))==null||n.classList.add("active"),V(),W(),J(),U(),showToast(`🎲 随机选中 ${R.length} 只股票，看看运气如何？`)}function Ne(){return R.map(e=>({code:e.code,weight:e.weight}))}function dt(){return M.period==="custom"?"custom"+(M.customMonths||18):M.period}let Se=!1;function ut(e){var i,l;const{results:t,amount:n,leverage:o}=e,a=n||1e5,s=o||1,r=[...t].sort((c,d)=>c.rank-d.rank);mt(r,a,s),tt("chart-returns",r,a,s),gt(r,a,s),Se||((i=document.getElementById("chart-mode-pct"))==null||i.addEventListener("click",()=>ke("pct")),(l=document.getElementById("chart-mode-value"))==null||l.addEventListener("click",()=>ke("value")),Se=!0)}function mt(e,t,n){const o=document.getElementById("ranking-table");if(!o)return;const a=["🥇","🥈","🥉"];o.innerHTML=e.map((s,r)=>{const i=s.isUser,l=r<3?a[r]:s.rank,c=s.totalReturn>=0?"text-neon-red":"text-neon-green",d=i?"user-highlight":"",u=s.totalReturn*n,m=parseFloat(Math.max(-100,u).toFixed(1)),p=Math.round(t*m/100),g=(m>=0?"+":"")+Number(p).toLocaleString(),I=parseFloat((s.maxDrawdown*n).toFixed(1));let D="";if(!i&&s.holdingsDetail&&s.holdingsDetail.length>0){const B=s.holdingsDetail.map(k=>`<div class="flex justify-between text-xs py-1">
          <span class="text-gray-400">${k.name}</span>
          <span class="text-neon-blue font-mono">${k.weight}%</span>
        </div>`).join("");D=`
        <div class="mt-2 pt-2 border-t border-dark-600/30 holdings-detail hidden" id="holdings-${r}">
          <div class="text-xs text-gray-500 mb-1">持仓成分</div>
          ${B}
        </div>
      `}return`
      <div class="rank-row ${d} animate-slide-up" style="animation-delay: ${r*.08}s">
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
          ${!i&&s.holdingsDetail?`<button class="text-xs text-neon-blue mt-1 hover:underline" onclick="toggleHoldings(${r})">查看持仓</button>`:""}
          ${D}
        </div>
        <div class="text-right flex-shrink-0">
          <div class="font-mono font-bold ${c} text-base">
            ${m>=0?"+":""}${m.toFixed(1)}%
          </div>
          <div class="text-xs ${c} font-mono">
            ${g}元
          </div>
          <div class="text-xs text-gray-500">
            最大回撤 ${I}%
          </div>
        </div>
      </div>
    `}).join(""),window.toggleHoldings||(window.toggleHoldings=function(s){const r=document.getElementById(`holdings-${s}`);r&&r.classList.toggle("hidden")})}function gt(e,t,n){const o=document.getElementById("metrics-table");if(!o)return;const a=["基金","累计收益","年化收益","最大回撤","夏普比率","胜率"],s=e.map(r=>{const i=r.totalReturn>=0?"metric-up":"metric-down",l=r.totalReturn*n,c=parseFloat(Math.max(-100,l).toFixed(1)),d="★".repeat(r.fundRating||0)+"☆".repeat(5-(r.fundRating||0)),u=r.isUser?`
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
            ${a.map(r=>`<th class="px-3 py-2 text-left font-medium whitespace-nowrap cursor-help" title="${ht(r)}">${r}</th>`).join("")}
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
  `}function ht(e){return{基金:"基金名称",累计收益:"回测期内的总收益率",年化收益:"按年计算的收益率",最大回撤:"从高点到低点的最大亏损幅度",夏普比率:"风险调整后收益，>1优秀",胜率:"盈利交易日占比"}[e]||e}window.showMetricDetail||(window.showMetricDetail=function(e){const n={sharpe:{title:"夏普比率 (Sharpe Ratio)",content:`夏普比率 = (年化收益率 - 无风险利率) / 年化波动率

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
• ★☆☆☆☆：<1分，需谨慎`}}[e];n&&alert(`${n.title}

${n.content}`)});function ft(e,t=null){const{styleTag:n,matchPerson:o,matchPersonDesc:a,matchPersonOrg:s,metrics:r,radarData:i,commentary:l}=e,c=document.getElementById("diagnosis-tag");c&&(c.innerHTML=`
      <span class="diagnosis-badge text-xl md:text-2xl animate-fade-in">${n}</span>
    `);const d=document.getElementById("diagnosis-subtitle");d&&(d.innerHTML=`
      <span class="text-gray-400">对标人物：</span>
      <span class="text-neon-blue font-bold">${o}</span>
      <span class="text-gray-500 text-sm"> — ${a}</span>
      ${s?`<span class="text-gray-600 text-sm block">${s}</span>`:""}
    `),nt("chart-radar",i,"你的基金");const u=document.getElementById("commentary-text");u&&(t!=null&&t.results&&t.results.length>0?We(u,t.results,t.errors):t!=null&&t.loading?xt(u):t!=null&&t.errors&&t.errors.length>0?vt(u,l,t.errors):yt(u,l)),wt(r)}function pt(e){const t=document.getElementById("commentary-text");t&&(e.results&&e.results.length>0?We(t,e.results,e.errors):e.errors&&e.errors.length>0&&t.innerHTML.includes("loading-dots")&&bt(t,e.errors))}function We(e,t,n){let o=t.map((s,r)=>{const i=s.model==="Primary API"?"🏢 Primary API":"🌐 Google Gemini";let l=s.text.replace(/\*\*(.+?)\*\*/g,'<strong class="text-neon-blue">$1</strong>').replace(/\*(.+?)\*/g,"<em>$1</em>").split(`

`).map(c=>c.trim()).filter(Boolean).map(c=>`<p style="margin-bottom:10px;line-height:1.8;">${c.replace(/\n/g,"<br>")}</p>`).join("");return`<div class="llm-result mb-3">
      <div class="text-xs text-gray-500 mb-2">${i} 点评</div>
      <div class="text-white leading-relaxed text-sm md:text-base">${l}</div>
    </div>`}).join(t.length>1?'<div style="margin:12px 0;border-top:1px dashed rgba(255,255,255,0.1);"></div>':"");const a=t.map(s=>s.model).join(" + ");o+=`<div class="mt-3 text-right text-xs text-gray-500">🤖 点评由 ${a} 生成 · 仅供参考</div>`,n&&n.length>0&&(o+=`<div class="mt-2 text-right text-xs text-gray-600">
      ⚠️ ${n.map(s=>s.api+"："+s.error).join("；")}
    </div>`),e.innerHTML=o}function xt(e){e.innerHTML=`
    <div class="flex items-center gap-3 py-4">
      <div class="loading-dots flex gap-1">
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style="animation-delay:0.2s"></span>
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style="animation-delay:0.4s"></span>
      </div>
      <span class="text-gray-400 text-sm">AI正在分析你的投资风格...</span>
    </div>
  `}function vt(e,t,n){let o="";if(t){const a=t.split(`

`).map(s=>s.trim()).filter(Boolean);o+=a.map((s,r)=>'<p style="margin-bottom:'+(r<a.length-1?"12px":"0")+';line-height:1.8;">'+s+"</p>").join("")}else o+='<p class="text-gray-400 text-sm">暂无可用的点评内容。</p>';o+='<div class="mt-3 text-right text-xs text-gray-500">📋 离线模板点评 · 仅供参考</div>',o+=`<div class="mt-4 p-3 bg-dark-600/30 rounded-lg border border-dark-500/30">
    <div class="text-xs text-gray-500 mb-2">🔧 API 诊断信息</div>
    <div class="space-y-1">
      ${n.map(a=>`
        <div class="flex items-start gap-2 text-xs">
          <span class="text-red-400 flex-shrink-0">✗</span>
          <div>
            <span class="text-gray-400 font-medium">${a.api}</span>
            <span class="text-gray-500 ml-1">— ${a.error}</span>
          </div>
        </div>
      `).join("")}
    </div>
    <div class="mt-3 pt-2 border-t border-dark-500/20 text-xs text-gray-600">
      <p class="mb-1">💡 提示：</p>
      <ul class="list-disc list-inside space-y-0.5">
        <li>复制 <code class="text-gray-500 bg-dark-500/50 px-1 rounded">config.example.js</code> → <code class="text-gray-500 bg-dark-500/50 px-1 rounded">config.js</code></li>
        <li>填入你的 API 地址和 Key（支持 DeepSeek / 通义千问 / 智谱 等）</li>
        <li>Gemini 需申请 <a href="https://aistudio.google.com/apikey" target="_blank" class="text-neon-blue underline">API Key</a></li>
      </ul>
    </div>
  </div>`,e.innerHTML=o}function yt(e,t){if(!t){e.innerHTML='<p class="text-gray-400 text-sm">暂无可用的点评内容。</p>';return}const n=t.split(`

`).map(o=>o.trim()).filter(Boolean);e.innerHTML=n.map((o,a)=>'<p style="margin-bottom:'+(a<n.length-1?"12px":"0")+';line-height:1.8;">'+o+"</p>").join(""),e.innerHTML+='<div class="mt-3 text-right text-xs text-gray-500">📋 离线模板点评 · 仅供参考</div>'}function bt(e,t){e.innerHTML=`
    <div class="py-2">
      <p class="text-gray-400 text-sm mb-3">AI点评生成失败，请检查API配置后重试。</p>
      <div class="p-3 bg-dark-600/30 rounded-lg border border-dark-500/30">
        <div class="text-xs text-gray-500 mb-2">🔧 错误详情</div>
        ${t.map(n=>`
          <div class="flex items-start gap-2 text-xs mb-1">
            <span class="text-red-400 flex-shrink-0">✗</span>
            <span class="text-gray-400">${n.api}：${n.error}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `}function wt(e){const t=document.getElementById("ai-commentary");if(!t)return;let n=document.getElementById("metrics-summary");n&&n.remove(),n=document.createElement("div"),n.id="metrics-summary";const o=(r,i)=>{if(r==null||isNaN(r))return"-";const l=Math.pow(10,i);return Math.round(r*l)/l},a="★".repeat(e.fundRating||0)+"☆".repeat(5-(e.fundRating||0)),s=e.fundRating>=4?"text-gold-400":e.fundRating>=3?"text-neon-blue":"text-gray-400";n.innerHTML=`
    <div class="mt-4 pt-4 border-t border-dark-600/30">
      <!-- 基金评级卡片 -->
      <div class="bg-dark-700/50 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-400">基金评级</span>
          <span class="text-2xl ${s}">${a}</span>
        </div>
        <div class="flex items-center gap-4 text-xs">
          <span class="text-gray-500">风险等级:</span>
          <span class="px-2 py-1 rounded ${e.riskLevel==="高"?"bg-red-500/20 text-red-400":e.riskLevel==="低"?"bg-green-500/20 text-green-400":"bg-blue-500/20 text-blue-400"}">${e.riskLevel}风险</span>
          ${e.ratingReasons?`<span class="text-gray-500">|</span><span class="text-gray-400">${e.ratingReasons.join("、")}</span>`:""}
        </div>
      </div>
      
      <!-- 核心指标 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">年化收益</div>
          <div class="font-mono font-bold ${e.annualizedReturn>=0?"text-neon-red":"text-neon-green"}">${e.annualizedReturn>=0?"+":""}${o(e.annualizedReturn,1)}%</div>
        </div>
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">最大回撤</div>
          <div class="font-mono font-bold text-neon-blue">${o(e.maxDrawdown,1)}%</div>
        </div>
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">夏普比率</div>
          <div class="font-mono font-bold ${e.sharpeRatio>=1?"text-neon-green":"text-gray-300"}">${o(e.sharpeRatio,2)}</div>
        </div>
        <div class="text-center p-3 bg-dark-700/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">胜率</div>
          <div class="font-mono font-bold text-gray-300">${o(e.winRate,1)}%</div>
        </div>
      </div>
      
      <!-- 专业指标 -->
      <div class="bg-dark-700/30 rounded-xl p-4">
        <div class="text-xs text-gray-500 mb-3">专业风险调整指标</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div class="text-xs text-gray-600 mb-1">索提诺比率</div>
            <div class="font-mono text-sm text-gray-300">${o(e.sortinoRatio,2)}</div>
            <div class="text-xs text-gray-600">只考虑下行风险</div>
          </div>
          <div>
            <div class="text-xs text-gray-600 mb-1">信息比率</div>
            <div class="font-mono text-sm ${e.informationRatio>=.5?"text-neon-green":"text-gray-300"}">${o(e.informationRatio,2)}</div>
            <div class="text-xs text-gray-600">超额收益/跟踪误差</div>
          </div>
          <div>
            <div class="text-xs text-gray-600 mb-1">Calmar比率</div>
            <div class="font-mono text-sm text-gray-300">${o(e.calmarRatio,2)}</div>
            <div class="text-xs text-gray-600">年化收益/最大回撤</div>
          </div>
          <div>
            <div class="text-xs text-gray-600 mb-1">盈亏比</div>
            <div class="font-mono text-sm text-gray-300">${o(e.profitLossRatio,2)}</div>
            <div class="text-xs text-gray-600">平均盈利/平均亏损</div>
          </div>
        </div>
      </div>
    </div>
  `,t.appendChild(n)}const T=252;function z(e,t){const n=Math.pow(10,t);return Math.round(e*n)/n}const kt={"3m":Math.floor(T/4),"6m":Math.floor(T/2),"1y":T,"3y":T*3,"5y":T*5,"10y":T*10};function $t(e){if(e.startsWith("custom")){const t=parseInt(e.replace("custom",""))||18;return Math.floor(T*t/12)}return kt[e]||T}function Ue(e,t,n){var we;const o=Math.min($t(n),T*10),a={};e.stocks.forEach(f=>{a[f.code]=f});const s=[],r=100,i=((we=a[t[0].code])==null?void 0:we.prices.length)||T*5;for(let f=o;f>0;f--){const P=i-f;let se=0;for(const ae of t){const re=a[ae.code];if(!re||P>=re.prices.length)continue;const Je=re.prices[P],Xe=re.prices[i-o],Qe=ae.weight/100;se+=Qe*(Je/Xe)}s.push(parseFloat((r*se).toFixed(4)))}const l=s[s.length-1],c=z((l-r)/r*100,2);let d=0,u=s[0];for(const f of s){f>u&&(u=f);const P=(u-f)/u*100;P>d&&(d=P)}d=z(d,2);const m=o/T,p=z((Math.pow(l/r,1/m)-1)*100,2),g=[];for(let f=1;f<s.length;f++)g.push((s[f]-s[f-1])/s[f-1]);const I=g.reduce((f,P)=>f+P,0)/g.length,D=g.reduce((f,P)=>f+Math.pow(P-I,2),0)/g.length,B=Math.sqrt(D),k=z(B*Math.sqrt(T)*100,2),x=.02,h=k>0?z((p/100-x)/(k/100),2):0,w=g.filter(f=>f<0),L=w.length>0?Math.sqrt(w.reduce((f,P)=>f+Math.pow(P-w.reduce((se,ae)=>se+ae,0)/w.length,2),0)/w.length):0,$=L>0?z((p/100-x)/(L*Math.sqrt(T)),2):0,v=z((p/100-x)/1,2),y=g.map(f=>f-x/T),b=Math.sqrt(y.reduce((f,P)=>f+P*P,0)/y.length)*Math.sqrt(T),S=b>0?z((p/100-x)/b,2):0,F=d>0?z(p/d,2):0,E=g.filter(f=>f>0).length,C=z(E/g.length*100,1),ce=g.filter(f=>f>0).reduce((f,P)=>f+P,0)/g.filter(f=>f>0).length||0,K=Math.abs(g.filter(f=>f<0).reduce((f,P)=>f+P,0)/g.filter(f=>f<0).length)||0,de=K>0?z(ce/K,2):0;let j=0,G=[];h>=1.5?(j+=2,G.push("夏普比率优秀")):h>=1?(j+=1.5,G.push("夏普比率良好")):h>=.5&&(j+=1,G.push("夏普比率一般")),d<=10?(j+=1.5,G.push("回撤控制优秀")):d<=20?(j+=1,G.push("回撤控制良好")):d<=30&&(j+=.5),p>=20?(j+=1.5,G.push("收益表现优秀")):p>=10?(j+=1,G.push("收益表现良好")):p>=5&&(j+=.5),C>=60&&(j+=.5,G.push("胜率较高")),j=Math.min(5,Math.max(1,Math.round(j)));let ue="中";d<=15&&k<=20?ue="低":(d>=30||k>=40)&&(ue="高");const be=Math.max(1,Math.floor(s.length/50)),me=[],ge=[];for(let f=0;f<s.length;f+=be)me.push(s[f]),ge.push(f);(s.length-1)%be!==0&&(me.push(s[s.length-1]),ge.push(s.length-1));const _e=new Date,he=new Date(_e);he.setDate(he.getDate()-o);const Ye=ge.map(f=>{const P=new Date(he);return P.setDate(P.getDate()+f),P.getMonth()+1+"/"+P.getDate()});return{name:"user",label:"你的基金",isUser:!0,totalReturn:c,annualizedReturn:p,annualizedVol:k,maxDrawdown:d,sharpeRatio:h,sortinoRatio:$,treynorRatio:v,informationRatio:S,calmarRatio:F,profitLossRatio:de,winRate:C,fundRating:j,ratingReasons:G,riskLevel:ue,initialValue:r,finalValue:l,chartData:me,dateLabels:Ye,days:o,holdings:t.map(f=>{const P=a[f.code];return{code:f.code,name:(P==null?void 0:P.name)||f.code,weight:f.weight}})}}function Mt(e,t){const n=[];return n.push(...Lt(e,t)),n.push(...Et(e,t)),n}function q(e,t){const n=Math.pow(10,t);return Math.round(e*n)/n}function Lt(e,t){const n=e.stocks,o=n.filter(c=>c.market==="a-share").sort((c,d)=>d.marketCap-c.marketCap).slice(0,20),a=o.map(c=>({code:c.code,weight:q(100/o.length,1)})),s=n.filter(c=>c.market==="a-share"&&(c.sector==="科技"||c.sector==="医药"||c.sector==="新能源")).filter(c=>c.marketCap<5e3).slice(0,15),r=s.map(c=>({code:c.code,weight:q(100/s.length,1)})),i=n.filter(c=>c.market==="us"&&c.sector==="科技").sort((c,d)=>d.marketCap-c.marketCap).slice(0,10),l=i.map(c=>({code:c.code,weight:q(100/i.length,1)}));return[X("benchmark-csi300","沪深300","A股大盘蓝筹基准","🇨🇳",a,e,t),X("benchmark-gem","创业板指","A股成长创新基准","🇨🇳",r,e,t),X("benchmark-nasdaq","纳斯达克100","美股科技龙头基准","🇺🇸",l,e,t)]}function Et(e,t){const n=e.stocks,o=n.filter(u=>u.pe>0&&u.pe<25&&u.dividendYield>2).filter(u=>u.sector==="消费"||u.sector==="金融").sort((u,m)=>m.dividendYield-u.dividendYield).slice(0,8),a=o.map(u=>({code:u.code,weight:q(100/o.length,1)})),s=n.filter(u=>u.revenueGrowth>10).filter(u=>u.sector==="科技"||u.sector==="医药"||u.sector==="新能源").sort((u,m)=>m.revenueGrowth-u.revenueGrowth).slice(0,8),r=s.map(u=>({code:u.code,weight:q(100/s.length,1)})),i=n.map(u=>{const m=u.prices,p=m[m.length-1],g=m[Math.max(0,m.length-63)];return{...u,momentum:q((p-g)/g*100,2)}}).sort((u,m)=>m.momentum-u.momentum).slice(0,8),l=i.map(u=>({code:u.code,weight:q(100/i.length,1)})),c=n.filter(u=>u.roe>5).map(u=>{const m=u.prices,p=m[m.length-1],g=m[Math.max(0,m.length-63)];return{...u,change:q((p-g)/g*100,2)}}).sort((u,m)=>u.change-m.change).slice(0,8),d=c.map(u=>({code:u.code,weight:q(100/c.length,1)}));return[X("ai-value","🐻 价值大师","深度价值投资","🐻",a,e,t),X("ai-growth","🐂 成长猎手","激进成长投资","🐂",r,e,t),X("ai-momentum","🐎 趋势追踪","动量交易策略","🐎",l,e,t),X("ai-reverse","🦉 逆向投资","超跌反转策略","🦉",d,e,t)]}function X(e,t,n,o,a,s,r){const i=Ue(s,a,r);return i.name=e,i.label=t,i.description=n,i.icon=o,i.isUser=!1,i.isBenchmark=e.startsWith("benchmark-"),i.holdingsDetail=a.map(l=>{const c=s.stocks.find(d=>d.code===l.code);return{code:l.code,name:(c==null?void 0:c.name)||l.code,weight:l.weight,sector:(c==null?void 0:c.sector)||"未知",market:(c==null?void 0:c.market)||"未知"}}),i}const ie=[{id:"jiucai",emoji:"🥬",name:"韭菜本菜",matchPerson:"每一个在市场里交过学费的人",personDesc:"初代股民集体回忆",personOrg:"",condition:e=>e.totalReturn<0&&e.concentration>.5},{id:"foxi",emoji:"🧘",name:"佛系躺平派",matchPerson:"但斌",personDesc:"「时间的玫瑰」——买了就当忘了",personOrg:"东方港湾董事长",condition:e=>e.turnover<.3&&e.bluechipRatio>.6},{id:"jiuxiang",emoji:"🍶",name:"酱香科技研究员",matchPerson:"张坤",personDesc:"易方达蓝筹精选掌舵人",personOrg:"易方达基金",condition:e=>(e.sectorWeights.消费||0)>30},{id:"yaoyao",emoji:"💊",name:"医药葛兰分兰",matchPerson:"葛兰",personDesc:"中欧医疗健康，医药赛道信仰者",personOrg:"中欧基金",condition:e=>(e.sectorWeights.医药||0)>40},{id:"ark",emoji:"🚀",name:"ARK中国分K",matchPerson:"Cathie Wood",personDesc:"ARK Invest创始人",personOrg:"ARK Invest",condition:e=>(e.sectorWeights.科技||0)>50&&e.turnover>.5},{id:"buffett",emoji:"👴",name:"巴菲特传人",matchPerson:"Warren Buffett",personDesc:"价值投资灯塔",personOrg:"伯克希尔·哈撒韦",condition:e=>(e.sectorWeights.消费||0)+(e.sectorWeights.金融||0)>50&&e.turnover<.3&&e.roe>15},{id:"diamond",emoji:"🦍",name:"钻石手",matchPerson:"WSB散户大军",personDesc:"「Diamond Hands」——回撤50%也绝不割肉",personOrg:"Reddit r/wallstreetbets",condition:e=>e.maxDrawdown>25&&e.turnover<.3},{id:"wolf",emoji:"🐺",name:"华尔街之狼",matchPerson:"各路游资大佬",personDesc:"高频交易，主打一个刺激",personOrg:"龙虎榜常客",condition:e=>e.turnover>.8},{id:"national",emoji:"🏛️",name:"国家队在逃成员",matchPerson:"社保基金/汇金",personDesc:"银行+央企+蓝筹，稳如泰山",personOrg:"全国社保基金理事会",condition:e=>(e.sectorWeights.金融||0)>40&&e.annualizedVol<20&&e.roe>10},{id:"global",emoji:"🌍",name:"全球宏观玩家",matchPerson:"Ray Dalio",personDesc:"桥水基金创始人",personOrg:"桥水基金",condition:e=>e.crossMarket&&e.marketCount>=3},{id:"growth",emoji:"🌱",name:"成长股猎人",matchPerson:"朱少醒",personDesc:"富国天惠，15年20倍的公募传奇",personOrg:"富国基金",condition:e=>(e.sectorWeights.科技||0)>30&&e.revenueGrowth>20},{id:"balanced",emoji:"⚖️",name:"均衡配置达人",matchPerson:"谢治宇",personDesc:"兴全合润，不偏科的均衡派代表",personOrg:"兴证全球基金",condition:e=>e.maxSectorWeight<35&&e.stockCount>=6}];function te(e,t){if(e==null||isNaN(e))return e;const n=Math.pow(10,t);return Math.round(e*n)/n}function Rt(e,t,n,o){var y;const s=Object.entries(t.sectorWeights||{}).sort((b,S)=>S[1]-b[1])[0]||["未知",0];Object.entries(t.marketWeights||{}).sort((b,S)=>S[1]-b[1]);const r={"a-share":"A股",hk:"港股",us:"美股",index:"指数ETF"},i=[],l={},c={};n.forEach(b=>{const S=o[b.code];S&&(l[S.market]=(l[S.market]||0)+b.weight,c[S.sector]=(c[S.sector]||0)+b.weight)});const d=Object.entries(l).sort((b,S)=>S[1]-b[1]),u=Object.entries(c).sort((b,S)=>S[1]-b[1]),m=(y=d[0])==null?void 0:y[0],p=d.length,g=t.leverage||1,I=t.maxDrawdown>=100||t.totalReturn<=-100,D=g>3,B=t.totalReturn<-50,k=t.totalReturn<-20&&t.totalReturn>=-50,x=t.totalReturn<0&&t.totalReturn>=-20,h=t.totalReturn>=0&&t.totalReturn<10,w=t.totalReturn>=10&&t.totalReturn<50,L=t.totalReturn>=50;let $="";if(I?D?$=`💥 **爆仓警告！** 你使用了${g}x杠杆，最终回撤${t.maxDrawdown.toFixed(1)}%，本金几乎归零。这不是投资，这是赌博！高杠杆+重仓=自杀式操作。`:$=`💥 **巨额亏损！** 最大回撤${t.maxDrawdown.toFixed(1)}%，几乎亏光所有本金。你的选股或择时出现了严重问题。`:B?D?$=`📉 **高杠杆惨案！** ${g}x杠杆放大了亏损，最终收益${t.totalReturn.toFixed(1)}%。杠杆是双刃剑，这次你被割伤了。`:$=`📉 **深度套牢！** 亏损${Math.abs(t.totalReturn).toFixed(1)}%，持仓体验极差。建议重新审视每只股票的基本面。`:k?$=`😰 **投资失利！** 亏损${Math.abs(t.totalReturn).toFixed(1)}%，虽然没到爆仓程度，但也足够肉疼。复盘一下原因？`:x?$=`🤔 **白忙一场！** 亏了${Math.abs(t.totalReturn).toFixed(1)}%，承担了风险却没得到回报。`:h?$=`🙂 **小赚一笔！** 盈利${t.totalReturn.toFixed(1)}%，虽然不多但好歹是正收益。`:w?$=`😊 **稳健盈利！** 收益${t.totalReturn.toFixed(1)}%，回撤${t.maxDrawdown.toFixed(1)}%，这是真正的投资能力！`:L&&(D?$=`🚀 **杠杆暴利！** ${g}x杠杆+${t.totalReturn.toFixed(1)}%收益=暴富神话！但别飘，见好就收。`:$=`🌟 **投资大师！** 收益${t.totalReturn.toFixed(1)}%，这是巴菲特级别的表现！`),i.push($),i.push(`
📊 **持仓诊断**：`),u.length>0){const b=u[0],S=b[1]>60?`重仓${b[0]}(${b[1].toFixed(0)}%)，集中度极高，风险集中。`:b[1]>40?`${b[0]}(${b[1].toFixed(0)}%)占比偏高。`:"行业分布较均衡。";i.push(`• ${S}`)}p===1?i.push(`• 全仓${r[m]||m}，单一市场风险集中。`):i.push(`• 跨${p}个市场配置，分散了风险。`),t.stockCount<=2?i.push(`• 仅${t.stockCount}只标的，集中度极高，押注式投资风险极大。`):t.stockCount>=8?i.push(`• ${t.stockCount}只标的，可能过于分散。`):i.push(`• ${t.stockCount}只标的，集中度适中。`),g>1&&(i.push(`
⚠️ **杠杆分析**（${g}x杠杆）：`),I?i.push(`• **爆仓元凶！** ${g}x杠杆导致回撤放大。没有杠杆最多亏${(100/g).toFixed(0)}%，有了杠杆亏了100%+。`):B?i.push(`• **杠杆放大亏损！** ${g}x杠杆让你的亏损速度加快了${g}倍。`):i.push(`• 使用了${g}x杠杆，放大了收益和风险。`)),i.push(`
📈 **风险收益**：`),i.push(`• 年化收益：${t.annualizedReturn>=0?"+":""}${t.annualizedReturn.toFixed(1)}%`),i.push(`• 最大回撤：${t.maxDrawdown.toFixed(1)}%${t.maxDrawdown>30?"（极高风险）":t.maxDrawdown>20?"（高风险）":t.maxDrawdown>10?"（中等风险）":"（低风险）"}`),i.push(`• 夏普比率：${t.sharpeRatio.toFixed(2)}`),i.push(`
💡 **专属建议**：`);const v=[];return I?(v.push("🚨 立即退出所有杠杆仓位，本金没了就什么都没了。"),v.push("📚 建议先学习《聪明的投资者》等经典书籍。"),v.push("🎮 先用模拟盘练习至少3个月。")):B||k?(v.push("🛑 暂停加仓，不要继续摊低成本。"),v.push("🔍 仔细分析每只股票的买入逻辑。"),D&&v.push("📉 降低杠杆至1x或2x。")):x?v.push("🤔 微调策略，优化选股标准。"):h?v.push("📊 加入债券ETF等低风险资产平滑曲线。"):(w||L)&&v.push("💰 适当减仓，锁定部分利润。"),s[1]>60&&v.push(`🔄 ${s[0]}占比过高，建议减仓分散。`),p===1&&!I&&v.push("🌍 建议配置其他市场分散风险。"),t.maxDrawdown>30&&!I&&v.push("🛡️ 设置止损线（如-15%）并严格执行。"),i.push(...v.map((b,S)=>`${S+1}. ${b}`)),i.push(`
🎯 **总结**：`),I?i.push("这次投资以爆仓告终。记住这次教训，重建本金，重新出发。💪"):B||k?i.push("这次投资虽然亏损，但经验比金钱更重要。🌱"):x?i.push("基本持平，小幅优化就能扭亏为盈。📚"):h?i.push("小赚是不错的开始，继续优化。🐢"):w?i.push("不错的收益！保持并持续优化。🏆"):L&&i.push("卓越的表现！保持学习、控制风险。🌟"),i.join(`
`)}function Ve(e,t,n){const o={};e.stocks.forEach(k=>{o[k.code]=k});const a={},s={};let r=0,i=0,l=0,c=0;t.forEach(k=>{const x=o[k.code];if(!x)return;const h=k.weight/100;a[x.sector]=(a[x.sector]||0)+k.weight,s[x.market]=(s[x.market]||0)+k.weight,r+=x.revenueGrowth*h,i+=x.roe*h,l+=x.pe*h,x.marketCap>3e3&&c++});const d=t.length<=5?.7:t.length<=7?.4:.25,m=(a.科技||0)>40?.6+Math.random()*.2:.2+Math.random()*.3,p={totalReturn:n.totalReturn,annualizedReturn:n.annualizedReturn,annualizedVol:n.annualizedVol,maxDrawdown:n.maxDrawdown,sharpeRatio:n.sharpeRatio,sortinoRatio:n.sortinoRatio,informationRatio:n.informationRatio,calmarRatio:n.calmarRatio,profitLossRatio:n.profitLossRatio,winRate:n.winRate,fundRating:n.fundRating,ratingReasons:n.ratingReasons,riskLevel:n.riskLevel,leverage:n.leverage,sectorWeights:a,marketWeights:s,concentration:d,turnover:m,revenueGrowth:parseFloat(r.toFixed(1)),roe:parseFloat(i.toFixed(2)),pe:parseFloat(l.toFixed(2)),bluechipRatio:parseFloat((c/t.length).toFixed(2)),maxSectorWeight:parseFloat(Math.max(...Object.values(a)).toFixed(1)),stockCount:t.length,crossMarket:Object.keys(s).length>=2,marketCount:Object.keys(s).length};let g=null,I=0;for(const k of ie)if(k.condition(p)){const x=k.id==="jiucai"?5:k.id==="global"?3:1;x>I&&(I=x,g=k)}g||(g=ie.find(k=>k.id==="balanced")||ie[ie.length-1]);const D=Rt(g,p,t,o),B={dimensions:["年化收益","风险控制","行业集中度","跨市场配置","选股ROE"],values:[te(Math.min(100,Math.max(0,p.annualizedReturn+50)),0),te(Math.min(100,Math.max(0,100-p.annualizedVol)),0),te(Math.min(100,Math.max(0,p.maxSectorWeight)),0),te(Math.min(100,Math.max(0,Object.keys(s).length*30)),0),te(Math.min(100,Math.max(0,p.roe*1.5)),0)]};return{styleTag:`${g.emoji} ${g.name}`,matchPerson:g.matchPerson,matchPersonDesc:g.personDesc,matchPersonOrg:g.personOrg||"",styleId:g.id,metrics:p,radarData:B,commentary:D}}const ve=window.LLM_CONFIG||{},It=ve.debugMode||!1,ne=ve.primary||{baseUrl:"",apiKey:"",model:""},Pe=ve.geminiApiKey||"";let Q=null,H=[];function Dt(e){return H=[],Q=Pt(e),Q}async function Be(){if(!Q)return{results:null,errors:[{api:"System",error:"未发起LLM请求"}],loading:!1};let e=null;const t=new Promise(o=>{setTimeout(()=>{o({stillLoading:!0})},100)}),n=await Promise.race([Q,t]);return n&&n.stillLoading?e=await Q:e=n,Q=null,!e||e.length===0?{results:null,errors:[...H],loading:!1}:{results:e,errors:[...H],loading:!1}}function St(){return Q!==null}async function Pt(e){const t=Bt(e),n=[];if(It){const[o,a]=await Promise.allSettled([Ce(t),Te(t)]);o.status==="fulfilled"&&o.value&&n.push({model:"Primary API",text:o.value}),a.status==="fulfilled"&&a.value&&n.push({model:"Google Gemini",text:a.value})}else{let o=await Ce(t);o?n.push({model:"Primary API",text:o}):(o=await Te(t),o&&n.push({model:"Google Gemini",text:o}))}return n.length===0?null:n}function Bt(e){const{styleTag:t,matchPerson:n,matchPersonDesc:o,matchPersonOrg:a,metrics:s}=e,r=Object.entries(s.sectorWeights||{}).map(([l,c])=>`${l}${c.toFixed(0)}%`).join("、"),i=Object.entries(s.marketWeights||{}).map(([l,c])=>`${{"a-share":"A股",hk:"港股",us:"美股",index:"指数ETF"}[l]||l}${c.toFixed(0)}%`).join("、");return`你是资深基金经理，点评以下投资组合（中文，150-200字，分段，用Markdown但不用标题）：

- 风格标签：${t}
- 对标人物：${n}（${o}${a?"，"+a:""}）
- 行业分布：${r}
- 市场分布：${i}
- 年化收益：${s.annualizedReturn}%
- 最大回撤：${s.maxDrawdown}%
- 夏普比率：${s.sharpeRatio}
- 杠杆：${s.leverage||1}x
- 持仓：${s.stockCount}只

要求：幽默风趣，用股民梗，先夸后吐槽，对标人物调侃，给建议，适度用emoji。`}async function Ce(e){var o,a,s,r;if(!ne.baseUrl||!ne.apiKey)return H.push({api:"Primary API",error:"未配置 baseUrl 或 apiKey（请创建 config.js）"}),null;const t=new AbortController,n=setTimeout(()=>t.abort(),15e3);try{const i=await fetch(`${ne.baseUrl}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${ne.apiKey}`},body:JSON.stringify({model:ne.model,messages:[{role:"user",content:e}],max_tokens:500,temperature:.8}),signal:t.signal});if(!i.ok){const d=await i.text().catch(()=>"");return H.push({api:"Primary API",error:`HTTP ${i.status}${d?": "+d.slice(0,200):""}`}),null}const c=(r=(s=(a=(o=(await i.json()).choices)==null?void 0:o[0])==null?void 0:a.message)==null?void 0:s.content)==null?void 0:r.trim();return c||H.push({api:"Primary API",error:"返回内容为空"}),c||null}catch(i){const l=i.name==="AbortError"?"请求超时（15秒）":i.message||"网络错误";return H.push({api:"Primary API",error:l}),console.warn("[LLM] Primary:",i.message),null}finally{clearTimeout(n)}}async function Te(e){var o,a,s,r,i,l;if(!Pe)return H.push({api:"Google Gemini",error:"未配置 API Key"}),null;const t=new AbortController,n=setTimeout(()=>t.abort(),15e3);try{const c=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Pe}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"你是资深基金经理，用中文回复。"+e}]}],generationConfig:{maxOutputTokens:500,temperature:.8}}),signal:t.signal});if(!c.ok){const m=await c.text().catch(()=>"");return H.push({api:"Google Gemini",error:`HTTP ${c.status}${m?": "+m.slice(0,200):""}`}),null}const u=(l=(i=(r=(s=(a=(o=(await c.json()).candidates)==null?void 0:o[0])==null?void 0:a.content)==null?void 0:s.parts)==null?void 0:r[0])==null?void 0:i.text)==null?void 0:l.trim();return u||H.push({api:"Google Gemini",error:"返回内容为空"}),u||null}catch(c){const d=c.name==="AbortError"?"请求超时（15秒）":c.message||"网络错误";return H.push({api:"Google Gemini",error:d}),console.warn("[LLM] Gemini:",c.message),null}finally{clearTimeout(n)}}const M={currentScreen:"builder",fundName:"",holdings:[],period:"1y",customMonths:18,backtestResults:null,stocksData:null,userResult:null,investAmount:1e5,leverage:1};let le=null,fe=null;function Ct(){const e=document.getElementById("particle-canvas");if(!e)return;const t=e.getContext("2d");let n=[];le&&(cancelAnimationFrame(le),le=null),fe&&window.removeEventListener("resize",fe);function o(){e.width=window.innerWidth,e.height=window.innerHeight}o(),fe=o,window.addEventListener("resize",o);class a{constructor(){this.reset()}reset(){this.x=Math.random()*e.width,this.y=Math.random()*e.height,this.size=Math.random()*2+.5,this.speedX=(Math.random()-.5)*.3,this.speedY=(Math.random()-.5)*.3,this.opacity=Math.random()*.5+.1}update(){this.x+=this.speedX,this.y+=this.speedY,(this.x<0||this.x>e.width||this.y<0||this.y>e.height)&&this.reset()}draw(){t.beginPath(),t.arc(this.x,this.y,this.size,0,Math.PI*2),t.fillStyle=`rgba(79, 195, 247, ${this.opacity})`,t.fill()}}for(let r=0;r<80;r++)n.push(new a);function s(){t.clearRect(0,0,e.width,e.height),n.forEach(r=>{r.update(),r.draw()});for(let r=0;r<n.length;r++)for(let i=r+1;i<n.length;i++){const l=n[r].x-n[i].x,c=n[r].y-n[i].y,d=Math.sqrt(l*l+c*c);d<120&&(t.beginPath(),t.moveTo(n[r].x,n[r].y),t.lineTo(n[i].x,n[i].y),t.strokeStyle=`rgba(79, 195, 247, ${.08*(1-d/120)})`,t.lineWidth=.5,t.stroke())}le=requestAnimationFrame(s)}s()}function ye(e){st(),document.querySelectorAll(".screen").forEach(o=>o.classList.remove("active","hidden")),document.querySelectorAll(".screen").forEach(o=>o.classList.add("hidden"));const t=document.getElementById(`screen-${e}`);t&&(t.classList.remove("hidden"),t.classList.add("active"),t.scrollIntoView({behavior:"smooth",block:"start"})),M.currentScreen=e;const n=document.getElementById("header");n&&(n.style.display=e==="builder"?"":"none")}async function Ke(){try{const t=await fetch("./"+"stocks.json");if(!t.ok)throw new Error(`HTTP ${t.status}`);const n=await t.json();return n.stocks.forEach(o=>{o.latestPrice=o.prices[o.prices.length-1]}),M.stocksData=n,M.stocksData}catch(e){return console.error("Failed to load stocks:",e),null}}async function Tt(){var t,n,o,a;const e=document.getElementById("btn-start");e.disabled=!0,e.textContent="⏳ 回测计算中...";try{const s=Ne(),r=dt();let i=parseFloat((t=document.getElementById("invest-amount"))==null?void 0:t.value)||1e5;i=Math.max(100,Math.min(1e8,i));const l=parseFloat((n=document.getElementById("leverage"))==null?void 0:n.value)||1;let c=M.fundName||((a=(o=document.getElementById("fund-name"))==null?void 0:o.value)==null?void 0:a.trim());c||(c=jt(s,M.stocksData)),M.stocksData||await Ke();const d=Ue(M.stocksData,s,r);d.label=c,d.amount=i,d.leverage=l,M.userResult=d,M.holdings=s,M.investAmount=i,M.leverage=l;const u=Mt(M.stocksData,r),m=[d,...u];m.sort((I,D)=>D.totalReturn-I.totalReturn),m.forEach((I,D)=>{I.rank=D+1}),M.backtestResults=m,ye("arena"),ut({fundName:c,period:r,results:m,amount:i,leverage:l});const p={...d,totalReturn:d.totalReturn*l,maxDrawdown:d.maxDrawdown*l},g=Ve(M.stocksData,s,p);g.metrics.leverage=l,Dt(g)}catch(s){Ot("回测失败："+s.message,"error"),e.disabled=!1,e.textContent="⚡ 开始挑战"}}async function Ft(){ye("diagnosis");const e={...M.userResult,totalReturn:M.userResult.totalReturn*M.leverage,maxDrawdown:M.userResult.maxDrawdown*M.leverage},t=Ve(M.stocksData,M.holdings,e);t.metrics.leverage=M.leverage;const n=St();let o={results:null,errors:[],loading:n};n||(o=await Be()),ft(t,o),n&&(o=await Be(),pt(o))}function At(){M.fundName="",M.holdings=[],M.backtestResults=null,M.userResult=null,document.getElementById("fund-name").value="",document.getElementById("btn-start").disabled=!0,ye("builder"),Ge()}function jt(e,t){var $;if(!e||e.length===0)return"我的基金";const n={};t&&t.stocks&&t.stocks.forEach(v=>{n[v.code]=v});const o={},a={};let s=!1,r=!1,i=!1,l=!1;e.forEach(v=>{const y=n[v.code];y&&(o[y.market]=(o[y.market]||0)+v.weight,a[y.sector]=(a[y.sector]||0)+v.weight,y.sector==="科技"&&(s=!0),y.sector==="金融"&&(r=!0),y.sector==="消费"&&(i=!0),y.sector==="医药"&&(l=!0))});const c=Object.entries(o).sort((v,y)=>y[1]-v[1]),d=(($=c[0])==null?void 0:$[0])||"a-share",u=c.length,m={"a-share":["华夏","国泰","南方","易方达","嘉实","博时","广发","富国"],hk:["港股","香港","恒生","中港","沪港深"],us:["纳斯达克","标普","美股","全球","海外"],index:["指数","ETF","被动"]};let p;u>=3?p=["全球","国际","环球","世界","跨市场"]:u===2?p=["沪港深","深港通","AH","中美","跨市场"]:p=m[d]||m["a-share"];let g=[];s&&e.length<=3?g=["创新","科技","成长","新兴","前沿","智能"]:r&&e.length<=3?g=["金融","价值","蓝筹","红利","稳健","精选"]:i&&e.length<=3?g=["消费","品质","生活","品牌","升级"]:l&&e.length<=3?g=["健康","医疗","生命","医药","生物"]:e.length>=8?g=["优选","精选","配置","均衡","多元","全能"]:e.length<=3?g=["聚焦","集中","核心","龙头","精选","优势"]:g=["成长","价值","均衡","轮动","趋势","精选","优选","灵活"];const I=["混合","股票","配置","优选","精选","成长","价值","稳健","进取","灵活"],D=p[Math.floor(Math.random()*p.length)],B=g[Math.floor(Math.random()*g.length)],k=I[Math.floor(Math.random()*I.length)],x=[D+B+k,D+k+B,B+k,D+B],h=x[Math.floor(Math.random()*x.length)],w=["超级","至尊","王者","巅峰","传奇","无敌","神级","霸道"];return w[Math.floor(Math.random()*w.length)]+h+"（您）"}async function zt(){Ct(),await Ke(),Ge();const e=document.getElementById("invest-amount");e&&(e.addEventListener("input",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value&&parseInt(n.target.value)!==o&&(n.target.value=o)}),e.addEventListener("blur",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value=o})),document.getElementById("btn-start").addEventListener("click",Tt),document.getElementById("btn-diagnosis").addEventListener("click",Ft),document.getElementById("btn-restart").addEventListener("click",At),document.getElementById("fund-name").addEventListener("input",n=>{M.fundName=n.target.value.trim(),U()});const t=document.getElementById("leverage");t&&t.addEventListener("input",()=>{document.getElementById("leverage-display").textContent=t.value+"x"})}zt();let pe=null;function Ot(e,t="info"){const n=document.getElementById("toast-msg");n&&n.remove(),pe&&clearTimeout(pe);const o=t==="error"?"bg-red-500/90":"bg-green-500/90",a=document.createElement("div");a.id="toast-msg",a.className=`fixed top-4 left-1/2 -translate-x-1/2 ${o} text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm`,a.textContent=e,document.body.appendChild(a),pe=setTimeout(()=>{a.style.opacity="0",a.style.transition="opacity .3s",setTimeout(()=>a.remove(),300)},3e3)}function U(){const e=document.getElementById("btn-start");e&&(e.disabled=Ne().length<1)}

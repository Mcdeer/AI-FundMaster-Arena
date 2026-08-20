(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();let A=null,O=null,N=null,Ft="pct",At=[],jt=1e5,zt=1;function _(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function Zt(t,e){const n=t.length;if(n<10)return[];const o=(n-1)/2,a=t.reduce((d,u)=>d+u,0)/n;let s=0,r=0;for(let d=0;d<n;d++)s+=(d-o)*(t[d]-a),r+=(d-o)*(d-o);const i=r!==0?s/r:0,l=t[n-1],c=[];for(let d=1;d<=e;d++){const u=(Math.random()-.5)*Math.abs(i)*d*.5;c.push(_(l+i*d+u,2))}return c}function te(t,e){const n=new Date,o=[],a=t-e;for(let s=0;s<a;s++){const r=new Date(n);r.setDate(r.getDate()-(a-s)),s===0||s===a-1||s%Math.max(1,Math.floor(a/6))===0?o.push(r.getMonth()+1+"/"+r.getDate()):o.push("")}for(let s=0;s<e;s++){const r=new Date(n);r.setDate(r.getDate()+s+1),s===0||s===e-1||s%Math.max(1,Math.floor(e/2))===0?o.push("🔮"+(r.getMonth()+1)+"/"+r.getDate()):o.push("")}return o}function ee(t,e,n,o){const a=document.getElementById(t);a&&(At=e,jt=n||1e5,zt=o||1,A&&A.dispose(),A=echarts.init(a),Ot())}function Ot(){const t=At,e=jt,n=zt,o=Ft==="value",a="#4fc3f7",s=["#69f0ae","#f0c060","#b388ff","#ff80ab","#18ffff","#ffab40","#ff5252"],r=[];let i=0,l=0;const c=t.find(h=>h.isUser);c&&(l=c.chartData.length),t.forEach((h,w)=>{h.chartData.length>i&&(i=h.chartData.length)});let d=[],u=-1;if(c){const h=c.chartData;for(let w=0;w<h.length;w++)if((h[w]-100)*n<=-100){u=w;break}if(u<0){const w=Zt(c.chartData,Math.max(1,Math.floor(i*.05)));w.length>0&&(d=w,i=Math.max(i,l+d.length))}}let m=[];const p=t.find(h=>h.isUser&&h.dateLabels);if(p&&p.dateLabels)m=[...p.dateLabels];else{const h=Math.max(0,i-l);m=te(i,h)}if(d.length>0&&m.length>0){const h=m[m.length-1],[w,L]=h.split("/").map(Number);for(let $=1;$<=d.length;$++){const v=new Date(2026,w-1,L);v.setDate(v.getDate()+$);const y=$===1||$===d.length||$%Math.max(1,Math.floor(d.length/3))===0?"🔮"+(v.getMonth()+1)+"/"+v.getDate():"";m.push(y)}}t.forEach((h,w)=>{const L=h.isUser,$=h.isBenchmark,v=h.chartData,y=L?a:s[(w-1)%s.length];let b=[],S=-1;if(o)for(let E=0;E<v.length;E++){if((v[E]-100)*n<=-100){S=E,b.push(0);break}b.push(_(e*n*v[E]/100,0))}else for(let E=0;E<v.length;E++){const C=_((v[E]-100)*n,1);if(C<=-100){S=E,b.push(-100);break}b.push(C)}for(;b.length<i;)b.push(null);let F=[...b];if(L&&d.length>0&&!o)for(let E=0;E<d.length;E++){const C=_((d[E]-100)*n,1);l+E<F.length?F[l+E]=C:F.push(C)}else if(L&&d.length>0&&o)for(let E=0;E<d.length;E++){const C=_(e*n*d[E]/100,0);l+E<F.length?F[l+E]=C:F.push(C)}if(L&&d.length>0&&S<0){const E=F.slice(0,l),C=new Array(l-1).fill(null),dt=E[E.length-1];C.push(dt);for(let K=0;K<d.length;K++){const ut=o?_(e*n*d[K]/100,0):_((d[K]-100)*n,1);C.push(ut)}r.push({name:h.label,type:"line",data:E,smooth:!0,symbol:"none",lineStyle:{width:4,type:"solid",color:y},itemStyle:{color:y},emphasis:{focus:"series",lineStyle:{width:6}},z:10,endLabel:{show:!0,formatter:h.label,color:y,fontSize:11,offset:[10,0]}}),r.push({name:"预测走势",type:"line",data:C,smooth:!0,symbol:"none",lineStyle:{width:3,type:"dashed",color:y,opacity:.7},itemStyle:{color:y},z:9,silent:!0})}else r.push({name:h.label,type:"line",data:F,smooth:!0,symbol:"none",lineStyle:{width:L?4:$?1.5:2,type:"solid",color:y,opacity:$?.5:1},itemStyle:{color:y},emphasis:{focus:"series",lineStyle:{width:L?6:3}},z:L?10:1,endLabel:L?{show:!0,formatter:h.label,color:y,fontSize:11,offset:[10,0]}:void 0,...S>=0?{markPoint:{data:[{name:"💥",coord:[S,o?0:-100],symbol:"pin",symbolSize:35,itemStyle:{color:"#ff5252"},label:{show:!0,formatter:"💥爆仓",fontSize:14,color:"#ff5252",fontWeight:"bold",offset:[0,-15]}}],animation:!1}}:{}})});const g=o?"总价值（元）":"收益率（%）";let I=1/0,D=-1/0;r.forEach(h=>{h.data&&h.data.forEach(w=>{w!==null&&!isNaN(w)&&(I=Math.min(I,w),D=Math.max(D,w))})});const B=D-I;I=I-B*.1,D=D+B*.1;const k={backgroundColor:"transparent",tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb",fontSize:12},formatter:function(h){const w=h.filter(y=>y.value!==null&&y.value!==void 0&&!y.seriesName.includes("预测"));if(w.length===0)return"";let $='<div style="font-weight:bold;margin-bottom:4px;">'+h[0].axisValue.replace("🔮","预测 ")+"</div>";const v=[...w].sort((y,b)=>(b.value||0)-(y.value||0));for(const y of v){const b=t.find(E=>E.label===y.seriesName&&E.isUser),S=b?"⭐ ":"",F=o?"¥"+Number(y.value).toLocaleString():(y.value>=0?"+":"")+y.value.toFixed(1)+"%";$+='<div style="display:flex;align-items:center;gap:6px;'+(b?"font-weight:bold;":"")+'"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+y.color+';"></span>'+S+y.seriesName+": "+F+"</div>"}return $}},legend:{bottom:0,textStyle:{color:"#9ca3af",fontSize:10},icon:"roundRect",itemWidth:12,itemHeight:8,data:t.map(h=>h.label)},grid:{left:"12%",right:"8%",top:"10%",bottom:"15%"},xAxis:{type:"category",data:m,axisLine:{lineStyle:{color:"#2d3d54"}},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:9,rotate:30},splitLine:{show:!1}},yAxis:{type:"value",name:g,nameLocation:"middle",nameGap:50,nameTextStyle:{color:"#9ca3af",fontSize:12},axisLine:{show:!0,lineStyle:{color:"#2d3d54"}},axisTick:{show:!0,lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,formatter:o?h=>h>=1e4?(h/1e4).toFixed(1)+"万":h.toLocaleString():h=>h.toFixed(0)+"%"},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},min:Math.floor(I),max:Math.ceil(D)},series:r};A.setOption(k,!0);const x=document.getElementById("forecast-section");x&&x.classList.toggle("hidden",d.length===0),window.addEventListener("resize",()=>A==null?void 0:A.resize())}function kt(t){var e,n,o,a,s,r,i,l,c,d,u,m,p,g;Ft=t,A&&(A.dispose(),A=echarts.init(document.getElementById("chart-returns")),Ot()),(e=document.getElementById("chart-mode-pct"))==null||e.classList.toggle("active",t==="pct"),(n=document.getElementById("chart-mode-pct"))==null||n.classList.toggle("bg-neon-blue/20",t==="pct"),(o=document.getElementById("chart-mode-pct"))==null||o.classList.toggle("text-neon-blue",t==="pct"),(a=document.getElementById("chart-mode-pct"))==null||a.classList.toggle("border-neon-blue/30",t==="pct"),(s=document.getElementById("chart-mode-pct"))==null||s.classList.toggle("bg-dark-500/30",t!=="pct"),(r=document.getElementById("chart-mode-pct"))==null||r.classList.toggle("text-gray-400",t!=="pct"),(i=document.getElementById("chart-mode-pct"))==null||i.classList.toggle("border-dark-500",t!=="pct"),(l=document.getElementById("chart-mode-value"))==null||l.classList.toggle("active",t==="value"),(c=document.getElementById("chart-mode-value"))==null||c.classList.toggle("bg-neon-blue/20",t==="value"),(d=document.getElementById("chart-mode-value"))==null||d.classList.toggle("text-neon-blue",t==="value"),(u=document.getElementById("chart-mode-value"))==null||u.classList.toggle("border-neon-blue/30",t==="value"),(m=document.getElementById("chart-mode-value"))==null||m.classList.toggle("bg-dark-500/30",t!=="value"),(p=document.getElementById("chart-mode-value"))==null||p.classList.toggle("text-gray-400",t!=="value"),(g=document.getElementById("chart-mode-value"))==null||g.classList.toggle("border-dark-500",t!=="value")}function ne(t,e,n){const o=document.getElementById(t);if(!o)return;O&&O.dispose(),O=echarts.init(o);const a={backgroundColor:"transparent",tooltip:{backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(124,58,237,0.3)",textStyle:{color:"#e5e7eb"}},radar:{center:["50%","50%"],radius:"65%",indicator:e.dimensions.map(s=>({name:s,max:100})),axisName:{color:"#9ca3af",fontSize:11},splitArea:{areaStyle:{color:["rgba(79,195,247,0.02)","rgba(79,195,247,0.02)"]}},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},axisLine:{lineStyle:{color:"rgba(45,61,84,0.5)"}}},series:[{type:"radar",data:[{value:e.values,name:n,areaStyle:{color:"rgba(124,58,237,0.15)"},lineStyle:{color:"#b388ff",width:2},itemStyle:{color:"#b388ff"},symbol:"circle",symbolSize:5}]}]};O.setOption(a,!0),window.addEventListener("resize",()=>O==null?void 0:O.resize())}function Ht(){const t=document.getElementById("sector-pie");t&&(N&&N.dispose(),N=echarts.init(t))}function oe(t){if(!N)return;const e=["#4fc3f7","#69f0ae","#f0c060","#ff5252","#b388ff","#ff80ab","#18ffff"],n={backgroundColor:"transparent",tooltip:{trigger:"item",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb"},formatter:"{b}: {c}% ({d}%)"},series:[{type:"pie",radius:["50%","75%"],center:["50%","50%"],emphasis:{label:{fontSize:14,fontWeight:"bold"},scaleSize:8},label:{color:"#9ca3af",fontSize:11,formatter:`{b}
{c}%`},labelLine:{lineStyle:{color:"#4b5563"}},data:t.length>0?t:[{name:"未选择",value:100,itemStyle:{color:"#1f2937"}}],itemStyle:{borderColor:"#0a0e17",borderWidth:2,color:o=>e[o.dataIndex%e.length]}}]};N.setOption(n,!0)}function se(){A==null||A.dispose(),A=null,O==null||O.dispose(),O=null,N==null||N.dispose(),N=null}function $t(t,e){if(t.length<e)return[];const n=new Array(t.length).fill(null);let o=0;for(let a=0;a<t.length;a++)o+=t[a],a>=e&&(o-=t[a-e]),a>=e-1&&(n[a]=parseFloat((o/e).toFixed(2)));return n}function ae(t,e=14){if(t.length<e+1)return[];const n=new Array(t.length).fill(null),o=[],a=[];for(let i=1;i<t.length;i++){const l=t[i]-t[i-1];o.push(l>0?l:0),a.push(l<0?-l:0)}let s=o.slice(0,e).reduce((i,l)=>i+l,0)/e,r=a.slice(0,e).reduce((i,l)=>i+l,0)/e;for(let i=e;i<o.length;i++){if(r===0)n[i+1]=100;else{const l=s/r;n[i+1]=parseFloat((100-100/(1+l)).toFixed(1))}s=(s*(e-1)+o[i])/e,r=(r*(e-1)+a[i])/e}return n}let tt=[],R=[],Z="a-share",nt="all",Mt=!1,Lt=!1,Et=!1,Rt=!1,It=!1;function Y(){M.holdings=R.map(t=>({code:t.code,name:t.name,sector:t.sector,market:t.market,weight:t.weight}))}function Gt(){var n;R=[],Y(),Z="a-share",nt="all",M.stocksData&&re(M.stocksData),Mt||(document.querySelectorAll(".market-tab").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".market-tab").forEach(a=>a.classList.remove("active")),o.classList.add("active"),Z=o.dataset.market,document.getElementById("stock-search").value="",U()})}),Mt=!0),It||((n=document.getElementById("btn-random"))==null||n.addEventListener("click",ce),It=!0);const t=document.getElementById("stock-search");if(t&&!Et){let o=null;t.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(()=>{const a=t.value.trim().toLowerCase();a&&(Z="all",document.querySelectorAll(".market-tab").forEach(s=>s.classList.remove("active"))),U(a)},250)}),Et=!0}Lt||(document.querySelectorAll(".period-btn").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".period-btn").forEach(s=>s.classList.remove("active")),o.classList.add("active");const a=o.dataset.period;a==="custom"?(document.getElementById("custom-period-wrap").classList.remove("hidden"),M.period="custom"):(document.getElementById("custom-period-wrap").classList.add("hidden"),M.period=a)})}),Lt=!0);const e=document.getElementById("custom-months");e&&!Rt&&(e.addEventListener("input",()=>{M.customMonths=parseInt(e.value)||18}),Rt=!0),Ht(),W()}function re(t){tt=t.stocks,ie(t.sectors),U(),Ht()}function ie(t){const e=document.getElementById("sector-filters");if(!e)return;e.innerHTML="";const n=document.createElement("button");n.className="sector-btn active",n.textContent="全部",n.addEventListener("click",()=>{nt="all",document.querySelectorAll(".sector-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),U()}),e.appendChild(n),t.forEach(o=>{const a=document.createElement("button");a.className="sector-btn",a.textContent=o,a.addEventListener("click",()=>{nt=o,document.querySelectorAll(".sector-btn").forEach(s=>s.classList.remove("active")),a.classList.add("active"),U()}),e.appendChild(a)})}function U(t){const e=document.getElementById("stock-grid");if(!e)return;let n=tt;if(t){const o=t.toLowerCase();n=tt.filter(a=>a.name.toLowerCase().includes(o)||a.code.toLowerCase().includes(o)).slice(0,50)}else Z==="all"&&(Z="a-share"),n=tt.filter(o=>{const a=o.market===Z,s=nt==="all"||o.sector===nt;return a&&s});n.sort((o,a)=>a.marketCap-o.marketCap),e.innerHTML=n.map(o=>{var i;const a=R.find(l=>l.code===o.code),s=o.latestPrice;return`
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
    `}).join(""),e.querySelectorAll(".stock-card").forEach(o=>{o.addEventListener("click",a=>{a.target.closest(".stock-detail-btn")||qt(o.dataset)})}),e.querySelectorAll(".stock-detail-btn").forEach(o=>{o.addEventListener("click",a=>{a.stopPropagation();const s=o.dataset.code;le(s)})})}function le(t){var p,g,I,D,B,k;const e=tt.find(x=>x.code===t);if(!e)return;const n=e.prices.slice(-60),o=Math.min(...n),a=Math.max(...n),s={"a-share":"A股",hk:"港股",us:"美股",index:"指数"},r=n[0],l=((n[n.length-1]-r)/r*100).toFixed(2),c=l>=0?"text-neon-red":"text-neon-green",d=l>=0?"+":"",u=l>=0?"#ff5252":"#69f0ae";for(let x=0;x<n.length;x+=10);const m=document.createElement("div");m.className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm",m.innerHTML=`
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
          <div class="text-lg font-mono text-white">${((g=e.pe)==null?void 0:g.toFixed(1))||"--"}</div>
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
  `,document.body.appendChild(m),(B=m.querySelector(".stock-modal-close"))==null||B.addEventListener("click",()=>m.remove()),(k=m.querySelector(".stock-modal-add"))==null||k.addEventListener("click",function(){const{code:x,name:h,sector:w,market:L}=this.dataset;qt({code:x,name:h,sector:w,market:L}),m.remove()}),m.addEventListener("click",x=>{x.target===m&&m.remove()}),setTimeout(()=>{const x=document.getElementById(`tech-indicators-${e.code}`);if(!x)return;const h=e.prices.slice(-120),w=$t(h,20),L=$t(h,60),$=ae(h,14);h[h.length-1];const v=w[w.length-1],y=L[L.length-1],b=$[$.length-1],S=v>y?"📈 多头排列":"📉 空头排列",F=b>70?"⚠️ 超买":b<30?"💡 超卖":"➖ 中性";x.innerHTML=`
      <div><div class="text-xs text-gray-500">MA20</div><div class="font-mono text-sm ${v>y?"text-neon-red":"text-neon-green"}">${(v==null?void 0:v.toFixed(2))||"--"}</div></div>
      <div><div class="text-xs text-gray-500">RSI(14)</div><div class="font-mono text-sm ${b>70?"text-neon-red":b<30?"text-neon-green":"text-gray-300"}">${(b==null?void 0:b.toFixed(1))||"--"}</div></div>
      <div><div class="text-xs text-gray-500">趋势</div><div class="text-xs">${S}</div><div class="text-xs text-gray-500">${F}</div></div>
    `},100),setTimeout(()=>{const x=document.getElementById("stock-price-chart");if(x&&typeof echarts<"u"){const h=echarts.init(x),w={backgroundColor:"transparent",grid:{left:"3%",right:"3%",top:"5%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:n.map((L,$)=>$+1),axisLine:{lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,interval:9,formatter:L=>`${L}日`},axisTick:{show:!1}},yAxis:{type:"value",scale:!0,axisLine:{show:!1},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:10,formatter:L=>"¥"+L.toFixed(0)},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}}},series:[{data:n,type:"line",smooth:!0,symbol:"none",lineStyle:{width:3,color:u},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:u+"40"},{offset:1,color:u+"00"}])}}],tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:u,textStyle:{color:"#e5e7eb",fontSize:12},formatter:L=>{const $=L[0].value;return`<div style="font-weight:bold">第${L[0].axisValue}天</div><div>价格: ¥${$.toFixed(2)}</div>`}}};h.setOption(w),window.addEventListener("resize",()=>h.resize())}},100),m.addEventListener("click",x=>{x.target===m&&m.remove()})}function qt({code:t,name:e,sector:n,market:o}){var r,i;const a=R.findIndex(l=>l.code===t);if(a>=0)R.splice(a,1);else if(R.length<10)R.push({code:t,name:e,sector:n,market:o,weight:0});else{showToast("最多选择10只成分股","error");return}vt(),Y();const s=(i=(r=document.getElementById("stock-search"))==null?void 0:r.value)==null?void 0:i.trim();U(s||void 0),W(),J(),V()}function vt(){if(R.length===0)return;const t=Math.floor(100/R.length),e=100-t*R.length;R.forEach((o,a)=>{o.weight=t+(a<e?1:0)});const n=R.reduce((o,a)=>o+a.weight,0);n!==100&&R.length>0&&(R[0].weight+=100-n)}function W(){var a;const t=document.getElementById("selected-list"),e=document.getElementById("weight-sum");if(R.length===0){t.innerHTML='<span class="text-gray-500">请从上方选择股票</span>',e.textContent="合计: 0%";return}t.innerHTML=R.map((s,r)=>`
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
  `).join("");const n=R.reduce((s,r)=>s+r.weight,0);e.textContent=`合计: ${n}%`,e.className=n===100?"text-sm font-mono text-neon-green":"text-sm font-mono text-neon-red";const o=((a=document.getElementById("lock-weights"))==null?void 0:a.checked)||!1;t.querySelectorAll('[data-action="weight"]').forEach(s=>{s.addEventListener("input",r=>{const i=parseInt(s.dataset.index);R[i].weight=parseInt(r.target.value);const l=t.querySelector(`[data-action="weight-input"][data-index="${i}"]`);l&&(l.value=r.target.value),o?(Y(),W(),J(),V()):Dt(i,parseInt(r.target.value))}),s.addEventListener("change",r=>{if(!o)return;const i=parseInt(s.dataset.index);R[i].weight=parseInt(r.target.value),Y(),W(),J(),V()})}),t.querySelectorAll('[data-action="weight-input"]').forEach(s=>{s.addEventListener("change",r=>{const i=parseInt(s.dataset.index);let l=parseInt(r.target.value)||1;l=Math.max(1,Math.min(95,l)),R[i].weight=l;const c=t.querySelector(`[data-action="weight"][data-index="${i}"]`);c&&(c.value=l),o?(Y(),W(),J(),V()):Dt(i,l)})}),t.querySelectorAll('[data-action="remove"]').forEach(s=>{s.addEventListener("click",()=>{const r=parseInt(s.dataset.index);R.splice(r,1),vt(),Y(),U(),W(),J(),V()})})}function Dt(t,e){const n=R.filter((r,i)=>i!==t);if(n.length===0)return;R[t].weight=e;const o=100-e,a=n.reduce((r,i)=>r+i.weight,0);if(a===0){const r=Math.floor(o/n.length);n.forEach(l=>l.weight=r);const i=n.reduce((l,c)=>l+c.weight,0);n[0].weight+=o-i}else{const r=o/a;let i=0;n.forEach((d,u)=>{d.weight=Math.max(1,Math.round(d.weight*r)),i+=d.weight});let l=o-i,c=0;for(;l!==0&&c<20;){c++;for(const d of n)if(l>0?(d.weight++,l--):l<0&&d.weight>1&&(d.weight--,l++),l===0)break}l!==0&&n.length>0&&(n[0].weight=Math.max(1,n[0].weight+l))}const s=R.reduce((r,i)=>r+i.weight,0);s!==100&&R.length>0&&(R[0].weight+=100-s),Y(),W(),J(),V()}function J(){const t={};R.forEach(n=>{t[n.sector]=(t[n.sector]||0)+n.weight});const e=Object.entries(t).map(([n,o])=>({name:n,value:o}));oe(e)}function ce(){var n;R=[];const t=4+Math.floor(Math.random()*4),e=[...tt].sort(()=>Math.random()-.5);for(let o=0;o<Math.min(t,e.length);o++){const a=e[o];R.push({code:a.code,name:a.name,sector:a.sector,market:a.market,weight:0})}vt(),document.getElementById("stock-search").value="",Z="a-share",document.querySelectorAll(".market-tab").forEach(o=>o.classList.remove("active")),(n=document.querySelector('[data-market="a-share"]'))==null||n.classList.add("active"),U(),W(),J(),V(),showToast(`🎲 随机选中 ${R.length} 只股票，看看运气如何？`)}function Nt(){return R.map(t=>({code:t.code,weight:t.weight}))}function de(){return M.period==="custom"?"custom"+(M.customMonths||18):M.period}let St=!1;function ue(t){var i,l;const{results:e,amount:n,leverage:o}=t,a=n||1e5,s=o||1,r=[...e].sort((c,d)=>c.rank-d.rank);me(r,a,s),ee("chart-returns",r,a,s),ge(r,a,s),St||((i=document.getElementById("chart-mode-pct"))==null||i.addEventListener("click",()=>kt("pct")),(l=document.getElementById("chart-mode-value"))==null||l.addEventListener("click",()=>kt("value")),St=!0)}function me(t,e,n){const o=document.getElementById("ranking-table");if(!o)return;const a=["🥇","🥈","🥉"];o.innerHTML=t.map((s,r)=>{const i=s.isUser,l=r<3?a[r]:s.rank,c=s.totalReturn>=0?"text-neon-red":"text-neon-green",d=i?"user-highlight":"",u=s.totalReturn*n,m=parseFloat(Math.max(-100,u).toFixed(1)),p=Math.round(e*m/100),g=(m>=0?"+":"")+Number(p).toLocaleString(),I=parseFloat((s.maxDrawdown*n).toFixed(1));let D="";if(!i&&s.holdingsDetail&&s.holdingsDetail.length>0){const B=s.holdingsDetail.map(k=>`<div class="flex justify-between text-xs py-1">
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
    `}).join(""),window.toggleHoldings||(window.toggleHoldings=function(s){const r=document.getElementById(`holdings-${s}`);r&&r.classList.toggle("hidden")})}function ge(t,e,n){const o=document.getElementById("metrics-table");if(!o)return;const a=["基金","累计收益","年化收益","最大回撤","夏普比率","胜率"],s=t.map(r=>{const i=r.totalReturn>=0?"metric-up":"metric-down",l=r.totalReturn*n,c=parseFloat(Math.max(-100,l).toFixed(1)),d="★".repeat(r.fundRating||0)+"☆".repeat(5-(r.fundRating||0)),u=r.isUser?`
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
            ${a.map(r=>`<th class="px-3 py-2 text-left font-medium whitespace-nowrap cursor-help" title="${he(r)}">${r}</th>`).join("")}
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
  `}function he(t){return{基金:"基金名称",累计收益:"回测期内的总收益率",年化收益:"按年计算的收益率",最大回撤:"从高点到低点的最大亏损幅度",夏普比率:"风险调整后收益，>1优秀",胜率:"盈利交易日占比"}[t]||t}window.showMetricDetail||(window.showMetricDetail=function(t){const n={sharpe:{title:"夏普比率 (Sharpe Ratio)",content:`夏普比率 = (年化收益率 - 无风险利率) / 年化波动率

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

${n.content}`)});function fe(t,e=null){const{styleTag:n,matchPerson:o,matchPersonDesc:a,matchPersonOrg:s,metrics:r,radarData:i,commentary:l}=t,c=document.getElementById("diagnosis-tag");c&&(c.innerHTML=`
      <span class="diagnosis-badge text-xl md:text-2xl animate-fade-in">${n}</span>
    `);const d=document.getElementById("diagnosis-subtitle");d&&(d.innerHTML=`
      <span class="text-gray-400">对标人物：</span>
      <span class="text-neon-blue font-bold">${o}</span>
      <span class="text-gray-500 text-sm"> — ${a}</span>
      ${s?`<span class="text-gray-600 text-sm block">${s}</span>`:""}
    `),ne("chart-radar",i,"你的基金");const u=document.getElementById("commentary-text");u&&(e!=null&&e.results&&e.results.length>0?Wt(u,e.results,e.errors):e!=null&&e.loading?xe(u):e!=null&&e.errors&&e.errors.length>0?ve(u,l,e.errors):ye(u,l)),we(r)}function pe(t){const e=document.getElementById("commentary-text");e&&(t.results&&t.results.length>0?Wt(e,t.results,t.errors):t.errors&&t.errors.length>0&&e.innerHTML.includes("loading-dots")&&be(e,t.errors))}function Wt(t,e,n){let o=e.map((s,r)=>{const i=s.model==="Primary API"?"🏢 Primary API":"🌐 Google Gemini";let l=s.text.replace(/\*\*(.+?)\*\*/g,'<strong class="text-neon-blue">$1</strong>').replace(/\*(.+?)\*/g,"<em>$1</em>").split(`

`).map(c=>c.trim()).filter(Boolean).map(c=>`<p style="margin-bottom:10px;line-height:1.8;">${c.replace(/\n/g,"<br>")}</p>`).join("");return`<div class="llm-result mb-3">
      <div class="text-xs text-gray-500 mb-2">${i} 点评</div>
      <div class="text-white leading-relaxed text-sm md:text-base">${l}</div>
    </div>`}).join(e.length>1?'<div style="margin:12px 0;border-top:1px dashed rgba(255,255,255,0.1);"></div>':"");const a=e.map(s=>s.model).join(" + ");o+=`<div class="mt-3 text-right text-xs text-gray-500">🤖 点评由 ${a} 生成 · 仅供参考</div>`,n&&n.length>0&&(o+=`<div class="mt-2 text-right text-xs text-gray-600">
      ⚠️ ${n.map(s=>s.api+"："+s.error).join("；")}
    </div>`),t.innerHTML=o}function xe(t){t.innerHTML=`
    <div class="flex items-center gap-3 py-4">
      <div class="loading-dots flex gap-1">
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style="animation-delay:0.2s"></span>
        <span class="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style="animation-delay:0.4s"></span>
      </div>
      <span class="text-gray-400 text-sm">AI正在分析你的投资风格...</span>
    </div>
  `}function ve(t,e,n){let o="";if(e){const a=e.split(`

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
  </div>`,t.innerHTML=o}function ye(t,e){if(!e){t.innerHTML='<p class="text-gray-400 text-sm">暂无可用的点评内容。</p>';return}const n=e.split(`

`).map(o=>o.trim()).filter(Boolean);t.innerHTML=n.map((o,a)=>'<p style="margin-bottom:'+(a<n.length-1?"12px":"0")+';line-height:1.8;">'+o+"</p>").join(""),t.innerHTML+='<div class="mt-3 text-right text-xs text-gray-500">📋 离线模板点评 · 仅供参考</div>'}function be(t,e){t.innerHTML=`
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
  `}function we(t){const e=document.getElementById("ai-commentary");if(!e)return;let n=document.getElementById("metrics-summary");n&&n.remove(),n=document.createElement("div"),n.id="metrics-summary";const o=(r,i)=>{if(r==null||isNaN(r))return"-";const l=Math.pow(10,i);return Math.round(r*l)/l},a="★".repeat(t.fundRating||0)+"☆".repeat(5-(t.fundRating||0)),s=t.fundRating>=4?"text-gold-400":t.fundRating>=3?"text-neon-blue":"text-gray-400";n.innerHTML=`
    <div class="mt-4 pt-4 border-t border-dark-600/30">
      <!-- 基金评级卡片 -->
      <div class="bg-dark-700/50 rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-400">基金评级</span>
          <span class="text-2xl ${s}">${a}</span>
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
  `,e.appendChild(n)}const T=252;function z(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}const ke={"3m":Math.floor(T/4),"6m":Math.floor(T/2),"1y":T,"3y":T*3,"5y":T*5,"10y":T*10};function $e(t){if(t.startsWith("custom")){const e=parseInt(t.replace("custom",""))||18;return Math.floor(T*e/12)}return ke[t]||T}function Vt(t,e,n){var wt;const o=Math.min($e(n),T*10),a={};t.stocks.forEach(f=>{a[f.code]=f});const s=[],r=100,i=((wt=a[e[0].code])==null?void 0:wt.prices.length)||T*5;for(let f=o;f>0;f--){const P=i-f;let ot=0;for(const st of e){const at=a[st.code];if(!at||P>=at.prices.length)continue;const Jt=at.prices[P],Xt=at.prices[i-o],Qt=st.weight/100;ot+=Qt*(Jt/Xt)}s.push(parseFloat((r*ot).toFixed(4)))}const l=s[s.length-1],c=z((l-r)/r*100,2);let d=0,u=s[0];for(const f of s){f>u&&(u=f);const P=(u-f)/u*100;P>d&&(d=P)}d=z(d,2);const m=o/T,p=z((Math.pow(l/r,1/m)-1)*100,2),g=[];for(let f=1;f<s.length;f++)g.push((s[f]-s[f-1])/s[f-1]);const I=g.reduce((f,P)=>f+P,0)/g.length,D=g.reduce((f,P)=>f+Math.pow(P-I,2),0)/g.length,B=Math.sqrt(D),k=z(B*Math.sqrt(T)*100,2),x=.02,h=k>0?z((p/100-x)/(k/100),2):0,w=g.filter(f=>f<0),L=w.length>0?Math.sqrt(w.reduce((f,P)=>f+Math.pow(P-w.reduce((ot,st)=>ot+st,0)/w.length,2),0)/w.length):0,$=L>0?z((p/100-x)/(L*Math.sqrt(T)),2):0,v=z((p/100-x)/1,2),y=g.map(f=>f-x/T),b=Math.sqrt(y.reduce((f,P)=>f+P*P,0)/y.length)*Math.sqrt(T),S=b>0?z((p/100-x)/b,2):0,F=d>0?z(p/d,2):0,E=g.filter(f=>f>0).length,C=z(E/g.length*100,1),dt=g.filter(f=>f>0).reduce((f,P)=>f+P,0)/g.filter(f=>f>0).length||0,K=Math.abs(g.filter(f=>f<0).reduce((f,P)=>f+P,0)/g.filter(f=>f<0).length)||0,ut=K>0?z(dt/K,2):0;let j=0,G=[];h>=1.5?(j+=2,G.push("夏普比率优秀")):h>=1?(j+=1.5,G.push("夏普比率良好")):h>=.5&&(j+=1,G.push("夏普比率一般")),d<=10?(j+=1.5,G.push("回撤控制优秀")):d<=20?(j+=1,G.push("回撤控制良好")):d<=30&&(j+=.5),p>=20?(j+=1.5,G.push("收益表现优秀")):p>=10?(j+=1,G.push("收益表现良好")):p>=5&&(j+=.5),C>=60&&(j+=.5,G.push("胜率较高")),j=Math.min(5,Math.max(1,Math.round(j)));let mt="中";d<=15&&k<=20?mt="低":(d>=30||k>=40)&&(mt="高");const bt=Math.max(1,Math.floor(s.length/50)),gt=[],ht=[];for(let f=0;f<s.length;f+=bt)gt.push(s[f]),ht.push(f);(s.length-1)%bt!==0&&(gt.push(s[s.length-1]),ht.push(s.length-1));const _t=new Date,ft=new Date(_t);ft.setDate(ft.getDate()-o);const Yt=ht.map(f=>{const P=new Date(ft);return P.setDate(P.getDate()+f),P.getMonth()+1+"/"+P.getDate()});return{name:"user",label:"你的基金",isUser:!0,totalReturn:c,annualizedReturn:p,annualizedVol:k,maxDrawdown:d,sharpeRatio:h,sortinoRatio:$,treynorRatio:v,informationRatio:S,calmarRatio:F,profitLossRatio:ut,winRate:C,fundRating:j,ratingReasons:G,riskLevel:mt,initialValue:r,finalValue:l,chartData:gt,dateLabels:Yt,days:o,holdings:e.map(f=>{const P=a[f.code];return{code:f.code,name:(P==null?void 0:P.name)||f.code,weight:f.weight}})}}function Me(t,e){const n=[];return n.push(...Le(t,e)),n.push(...Ee(t,e)),n}function q(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}function Le(t,e){const n=t.stocks,o=n.filter(c=>c.market==="a-share").sort((c,d)=>d.marketCap-c.marketCap).slice(0,20),a=o.map(c=>({code:c.code,weight:q(100/o.length,1)})),s=n.filter(c=>c.market==="a-share"&&(c.sector==="科技"||c.sector==="医药"||c.sector==="新能源")).filter(c=>c.marketCap<5e3).slice(0,15),r=s.map(c=>({code:c.code,weight:q(100/s.length,1)})),i=n.filter(c=>c.market==="us"&&c.sector==="科技").sort((c,d)=>d.marketCap-c.marketCap).slice(0,10),l=i.map(c=>({code:c.code,weight:q(100/i.length,1)}));return[X("benchmark-csi300","沪深300","A股大盘蓝筹基准","🇨🇳",a,t,e),X("benchmark-gem","创业板指","A股成长创新基准","🇨🇳",r,t,e),X("benchmark-nasdaq","纳斯达克100","美股科技龙头基准","🇺🇸",l,t,e)]}function Ee(t,e){const n=t.stocks,o=n.filter(u=>u.pe>0&&u.pe<25&&u.dividendYield>2).filter(u=>u.sector==="消费"||u.sector==="金融").sort((u,m)=>m.dividendYield-u.dividendYield).slice(0,8),a=o.map(u=>({code:u.code,weight:q(100/o.length,1)})),s=n.filter(u=>u.revenueGrowth>10).filter(u=>u.sector==="科技"||u.sector==="医药"||u.sector==="新能源").sort((u,m)=>m.revenueGrowth-u.revenueGrowth).slice(0,8),r=s.map(u=>({code:u.code,weight:q(100/s.length,1)})),i=n.map(u=>{const m=u.prices,p=m[m.length-1],g=m[Math.max(0,m.length-63)];return{...u,momentum:q((p-g)/g*100,2)}}).sort((u,m)=>m.momentum-u.momentum).slice(0,8),l=i.map(u=>({code:u.code,weight:q(100/i.length,1)})),c=n.filter(u=>u.roe>5).map(u=>{const m=u.prices,p=m[m.length-1],g=m[Math.max(0,m.length-63)];return{...u,change:q((p-g)/g*100,2)}}).sort((u,m)=>u.change-m.change).slice(0,8),d=c.map(u=>({code:u.code,weight:q(100/c.length,1)}));return[X("ai-value","🐻 价值大师","深度价值投资","🐻",a,t,e),X("ai-growth","🐂 成长猎手","激进成长投资","🐂",r,t,e),X("ai-momentum","🐎 趋势追踪","动量交易策略","🐎",l,t,e),X("ai-reverse","🦉 逆向投资","超跌反转策略","🦉",d,t,e)]}function X(t,e,n,o,a,s,r){const i=Vt(s,a,r);return i.name=t,i.label=e,i.description=n,i.icon=o,i.isUser=!1,i.isBenchmark=t.startsWith("benchmark-"),i.holdingsDetail=a.map(l=>{const c=s.stocks.find(d=>d.code===l.code);return{code:l.code,name:(c==null?void 0:c.name)||l.code,weight:l.weight,sector:(c==null?void 0:c.sector)||"未知",market:(c==null?void 0:c.market)||"未知"}}),i}const rt=[{id:"jiucai",emoji:"🥬",name:"韭菜本菜",matchPerson:"每一个在市场里交过学费的人",personDesc:"初代股民集体回忆",personOrg:"",condition:t=>t.totalReturn<0&&t.concentration>.5},{id:"foxi",emoji:"🧘",name:"佛系躺平派",matchPerson:"但斌",personDesc:"「时间的玫瑰」——买了就当忘了",personOrg:"东方港湾董事长",condition:t=>t.turnover<.3&&t.bluechipRatio>.6},{id:"jiuxiang",emoji:"🍶",name:"酱香科技研究员",matchPerson:"张坤",personDesc:"易方达蓝筹精选掌舵人",personOrg:"易方达基金",condition:t=>(t.sectorWeights.消费||0)>30},{id:"yaoyao",emoji:"💊",name:"医药葛兰分兰",matchPerson:"葛兰",personDesc:"中欧医疗健康，医药赛道信仰者",personOrg:"中欧基金",condition:t=>(t.sectorWeights.医药||0)>40},{id:"ark",emoji:"🚀",name:"ARK中国分K",matchPerson:"Cathie Wood",personDesc:"ARK Invest创始人",personOrg:"ARK Invest",condition:t=>(t.sectorWeights.科技||0)>50&&t.turnover>.5},{id:"buffett",emoji:"👴",name:"巴菲特传人",matchPerson:"Warren Buffett",personDesc:"价值投资灯塔",personOrg:"伯克希尔·哈撒韦",condition:t=>(t.sectorWeights.消费||0)+(t.sectorWeights.金融||0)>50&&t.turnover<.3&&t.roe>15},{id:"diamond",emoji:"🦍",name:"钻石手",matchPerson:"WSB散户大军",personDesc:"「Diamond Hands」——回撤50%也绝不割肉",personOrg:"Reddit r/wallstreetbets",condition:t=>t.maxDrawdown>25&&t.turnover<.3},{id:"wolf",emoji:"🐺",name:"华尔街之狼",matchPerson:"各路游资大佬",personDesc:"高频交易，主打一个刺激",personOrg:"龙虎榜常客",condition:t=>t.turnover>.8},{id:"national",emoji:"🏛️",name:"国家队在逃成员",matchPerson:"社保基金/汇金",personDesc:"银行+央企+蓝筹，稳如泰山",personOrg:"全国社保基金理事会",condition:t=>(t.sectorWeights.金融||0)>40&&t.annualizedVol<20&&t.roe>10},{id:"global",emoji:"🌍",name:"全球宏观玩家",matchPerson:"Ray Dalio",personDesc:"桥水基金创始人",personOrg:"桥水基金",condition:t=>t.crossMarket&&t.marketCount>=3},{id:"growth",emoji:"🌱",name:"成长股猎人",matchPerson:"朱少醒",personDesc:"富国天惠，15年20倍的公募传奇",personOrg:"富国基金",condition:t=>(t.sectorWeights.科技||0)>30&&t.revenueGrowth>20},{id:"balanced",emoji:"⚖️",name:"均衡配置达人",matchPerson:"谢治宇",personDesc:"兴全合润，不偏科的均衡派代表",personOrg:"兴证全球基金",condition:t=>t.maxSectorWeight<35&&t.stockCount>=6}];function et(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function Re(t,e,n,o){var y;const s=Object.entries(e.sectorWeights||{}).sort((b,S)=>S[1]-b[1])[0]||["未知",0];Object.entries(e.marketWeights||{}).sort((b,S)=>S[1]-b[1]);const r={"a-share":"A股",hk:"港股",us:"美股",index:"指数ETF"},i=[],l={},c={};n.forEach(b=>{const S=o[b.code];S&&(l[S.market]=(l[S.market]||0)+b.weight,c[S.sector]=(c[S.sector]||0)+b.weight)});const d=Object.entries(l).sort((b,S)=>S[1]-b[1]),u=Object.entries(c).sort((b,S)=>S[1]-b[1]),m=(y=d[0])==null?void 0:y[0],p=d.length,g=e.leverage||1,I=e.maxDrawdown>=100||e.totalReturn<=-100,D=g>3,B=e.totalReturn<-50,k=e.totalReturn<-20&&e.totalReturn>=-50,x=e.totalReturn<0&&e.totalReturn>=-20,h=e.totalReturn>=0&&e.totalReturn<10,w=e.totalReturn>=10&&e.totalReturn<50,L=e.totalReturn>=50;let $="";if(I?D?$=`💥 **爆仓警告！** 你使用了${g}x杠杆，最终回撤${e.maxDrawdown.toFixed(1)}%，本金几乎归零。这不是投资，这是赌博！高杠杆+重仓=自杀式操作。`:$=`💥 **巨额亏损！** 最大回撤${e.maxDrawdown.toFixed(1)}%，几乎亏光所有本金。你的选股或择时出现了严重问题。`:B?D?$=`📉 **高杠杆惨案！** ${g}x杠杆放大了亏损，最终收益${e.totalReturn.toFixed(1)}%。杠杆是双刃剑，这次你被割伤了。`:$=`📉 **深度套牢！** 亏损${Math.abs(e.totalReturn).toFixed(1)}%，持仓体验极差。建议重新审视每只股票的基本面。`:k?$=`😰 **投资失利！** 亏损${Math.abs(e.totalReturn).toFixed(1)}%，虽然没到爆仓程度，但也足够肉疼。复盘一下原因？`:x?$=`🤔 **白忙一场！** 亏了${Math.abs(e.totalReturn).toFixed(1)}%，承担了风险却没得到回报。`:h?$=`🙂 **小赚一笔！** 盈利${e.totalReturn.toFixed(1)}%，虽然不多但好歹是正收益。`:w?$=`😊 **稳健盈利！** 收益${e.totalReturn.toFixed(1)}%，回撤${e.maxDrawdown.toFixed(1)}%，这是真正的投资能力！`:L&&(D?$=`🚀 **杠杆暴利！** ${g}x杠杆+${e.totalReturn.toFixed(1)}%收益=暴富神话！但别飘，见好就收。`:$=`🌟 **投资大师！** 收益${e.totalReturn.toFixed(1)}%，这是巴菲特级别的表现！`),i.push($),i.push(`
📊 **持仓诊断**：`),u.length>0){const b=u[0],S=b[1]>60?`重仓${b[0]}(${b[1].toFixed(0)}%)，集中度极高，风险集中。`:b[1]>40?`${b[0]}(${b[1].toFixed(0)}%)占比偏高。`:"行业分布较均衡。";i.push(`• ${S}`)}p===1?i.push(`• 全仓${r[m]||m}，单一市场风险集中。`):i.push(`• 跨${p}个市场配置，分散了风险。`),e.stockCount<=2?i.push(`• 仅${e.stockCount}只标的，集中度极高，押注式投资风险极大。`):e.stockCount>=8?i.push(`• ${e.stockCount}只标的，可能过于分散。`):i.push(`• ${e.stockCount}只标的，集中度适中。`),g>1&&(i.push(`
⚠️ **杠杆分析**（${g}x杠杆）：`),I?i.push(`• **爆仓元凶！** ${g}x杠杆导致回撤放大。没有杠杆最多亏${(100/g).toFixed(0)}%，有了杠杆亏了100%+。`):B?i.push(`• **杠杆放大亏损！** ${g}x杠杆让你的亏损速度加快了${g}倍。`):i.push(`• 使用了${g}x杠杆，放大了收益和风险。`)),i.push(`
📈 **风险收益**：`),i.push(`• 年化收益：${e.annualizedReturn>=0?"+":""}${e.annualizedReturn.toFixed(1)}%`),i.push(`• 最大回撤：${e.maxDrawdown.toFixed(1)}%${e.maxDrawdown>30?"（极高风险）":e.maxDrawdown>20?"（高风险）":e.maxDrawdown>10?"（中等风险）":"（低风险）"}`),i.push(`• 夏普比率：${e.sharpeRatio.toFixed(2)}`),i.push(`
💡 **专属建议**：`);const v=[];return I?(v.push("🚨 立即退出所有杠杆仓位，本金没了就什么都没了。"),v.push("📚 建议先学习《聪明的投资者》等经典书籍。"),v.push("🎮 先用模拟盘练习至少3个月。")):B||k?(v.push("🛑 暂停加仓，不要继续摊低成本。"),v.push("🔍 仔细分析每只股票的买入逻辑。"),D&&v.push("📉 降低杠杆至1x或2x。")):x?v.push("🤔 微调策略，优化选股标准。"):h?v.push("📊 加入债券ETF等低风险资产平滑曲线。"):(w||L)&&v.push("💰 适当减仓，锁定部分利润。"),s[1]>60&&v.push(`🔄 ${s[0]}占比过高，建议减仓分散。`),p===1&&!I&&v.push("🌍 建议配置其他市场分散风险。"),e.maxDrawdown>30&&!I&&v.push("🛡️ 设置止损线（如-15%）并严格执行。"),i.push(...v.map((b,S)=>`${S+1}. ${b}`)),i.push(`
🎯 **总结**：`),I?i.push("这次投资以爆仓告终。记住这次教训，重建本金，重新出发。💪"):B||k?i.push("这次投资虽然亏损，但经验比金钱更重要。🌱"):x?i.push("基本持平，小幅优化就能扭亏为盈。📚"):h?i.push("小赚是不错的开始，继续优化。🐢"):w?i.push("不错的收益！保持并持续优化。🏆"):L&&i.push("卓越的表现！保持学习、控制风险。🌟"),i.join(`
`)}function Ut(t,e,n){const o={};t.stocks.forEach(k=>{o[k.code]=k});const a={},s={};let r=0,i=0,l=0,c=0;e.forEach(k=>{const x=o[k.code];if(!x)return;const h=k.weight/100;a[x.sector]=(a[x.sector]||0)+k.weight,s[x.market]=(s[x.market]||0)+k.weight,r+=x.revenueGrowth*h,i+=x.roe*h,l+=x.pe*h,x.marketCap>3e3&&c++});const d=e.length<=5?.7:e.length<=7?.4:.25,m=(a.科技||0)>40?.6+Math.random()*.2:.2+Math.random()*.3,p={totalReturn:n.totalReturn,annualizedReturn:n.annualizedReturn,annualizedVol:n.annualizedVol,maxDrawdown:n.maxDrawdown,sharpeRatio:n.sharpeRatio,sortinoRatio:n.sortinoRatio,informationRatio:n.informationRatio,calmarRatio:n.calmarRatio,profitLossRatio:n.profitLossRatio,winRate:n.winRate,fundRating:n.fundRating,ratingReasons:n.ratingReasons,riskLevel:n.riskLevel,leverage:n.leverage,sectorWeights:a,marketWeights:s,concentration:d,turnover:m,revenueGrowth:parseFloat(r.toFixed(1)),roe:parseFloat(i.toFixed(2)),pe:parseFloat(l.toFixed(2)),bluechipRatio:parseFloat((c/e.length).toFixed(2)),maxSectorWeight:parseFloat(Math.max(...Object.values(a)).toFixed(1)),stockCount:e.length,crossMarket:Object.keys(s).length>=2,marketCount:Object.keys(s).length};let g=null,I=0;for(const k of rt)if(k.condition(p)){const x=k.id==="jiucai"?5:k.id==="global"?3:1;x>I&&(I=x,g=k)}g||(g=rt.find(k=>k.id==="balanced")||rt[rt.length-1]);const D=Re(g,p,e,o),B={dimensions:["年化收益","风险控制","行业集中度","跨市场配置","选股ROE"],values:[et(Math.min(100,Math.max(0,p.annualizedReturn+50)),0),et(Math.min(100,Math.max(0,100-p.annualizedVol)),0),et(Math.min(100,Math.max(0,p.maxSectorWeight)),0),et(Math.min(100,Math.max(0,Object.keys(s).length*30)),0),et(Math.min(100,Math.max(0,p.roe*1.5)),0)]};return{styleTag:`${g.emoji} ${g.name}`,matchPerson:g.matchPerson,matchPersonDesc:g.personDesc,matchPersonOrg:g.personOrg||"",styleId:g.id,metrics:p,radarData:B,commentary:D}}const ct=window.LLM_CONFIG||{},Ie=ct.debugMode||!1,it=ct.primary||ct.eastmoney||{baseUrl:"",apiKey:"",model:""},Pt=ct.geminiApiKey||"";let Q=null,H=[];function De(t){return H=[],Q=Pe(t),Q}async function Bt(){if(!Q)return{results:null,errors:[{api:"System",error:"未发起LLM请求"}],loading:!1};let t=null;const e=new Promise(o=>{setTimeout(()=>{o({stillLoading:!0})},100)}),n=await Promise.race([Q,e]);return n&&n.stillLoading?t=await Q:t=n,Q=null,!t||t.length===0?{results:null,errors:[...H],loading:!1}:{results:t,errors:[...H],loading:!1}}function Se(){return Q!==null}async function Pe(t){const e=Be(t),n=[];if(Ie){const[o,a]=await Promise.allSettled([Ct(e),Tt(e)]);o.status==="fulfilled"&&o.value&&n.push({model:"Primary API",text:o.value}),a.status==="fulfilled"&&a.value&&n.push({model:"Google Gemini",text:a.value})}else{let o=await Ct(e);o?n.push({model:"Primary API",text:o}):(o=await Tt(e),o&&n.push({model:"Google Gemini",text:o}))}return n.length===0?null:n}function Be(t){const{styleTag:e,matchPerson:n,matchPersonDesc:o,matchPersonOrg:a,metrics:s}=t,r=Object.entries(s.sectorWeights||{}).map(([l,c])=>`${l}${c.toFixed(0)}%`).join("、"),i=Object.entries(s.marketWeights||{}).map(([l,c])=>`${{"a-share":"A股",hk:"港股",us:"美股",index:"指数ETF"}[l]||l}${c.toFixed(0)}%`).join("、");return`你是资深基金经理，点评以下投资组合（中文，150-200字，分段，用Markdown但不用标题）：

- 风格标签：${e}
- 对标人物：${n}（${o}${a?"，"+a:""}）
- 行业分布：${r}
- 市场分布：${i}
- 年化收益：${s.annualizedReturn}%
- 最大回撤：${s.maxDrawdown}%
- 夏普比率：${s.sharpeRatio}
- 杠杆：${s.leverage||1}x
- 持仓：${s.stockCount}只

要求：幽默风趣，用股民梗，先夸后吐槽，对标人物调侃，给建议，适度用emoji。`}function Ce(t){if(!t)return"";const e=[/最终回答[：:]\s*/,/最终点评[：:]\s*/,/以下是点评[：:]\s*/,/点评如下[：:]\s*/,/回复[：:]\s*\n/];for(const a of e){const s=t.match(a);if(s){const r=t.slice(s.index+s[0].length).trim();if(r.length>50)return r}}const n=t.split(/\n\n+/).filter(a=>a.trim());if(n.length>=3)for(let a=n.length-1;a>=0;a--){const s=n[a].trim();if(!/^(我们|首先|需要|用户|任务|好的|让我|我来|根据|这个|以上|下面|那么|所以|因此|总之|现在)/.test(s)&&s.length>30)return n.slice(a).join(`

`)}const o=t.replace(/^.*?我们需要.*?\n/s,"").trim();return o.length>50?o:t.trim()}async function Ct(t){var a,s;if(!it.apiKey)return H.push({api:"Primary API",error:"未配置 apiKey（请创建 config.js）"}),null;const e=it.baseUrl||"/api",n=new AbortController,o=setTimeout(()=>n.abort(),3e4);try{const r=await fetch(`${e}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${it.apiKey}`},body:JSON.stringify({model:it.model,messages:[{role:"system",content:"你是资深基金经理。直接输出点评正文，禁止输出思考过程、分析步骤或自言自语。"},{role:"user",content:t}],max_tokens:2e3,temperature:.8}),signal:n.signal});if(!r.ok){const d=await r.text().catch(()=>"");return H.push({api:"Primary API",error:`HTTP ${r.status}${d?": "+d.slice(0,200):""}`}),null}const l=(s=(a=(await r.json()).choices)==null?void 0:a[0])==null?void 0:s.message;let c=((l==null?void 0:l.content)||"").trim();return!c&&(l!=null&&l.reasoning_content)&&(c=Ce(l.reasoning_content)),c||H.push({api:"Primary API",error:"返回内容为空"}),c||null}catch(r){const i=r.name==="AbortError"?"请求超时（15秒）":r.message||"网络错误";return H.push({api:"Primary API",error:i}),console.warn("[LLM] Primary:",r.message),null}finally{clearTimeout(o)}}async function Tt(t){var o,a,s,r,i,l;if(!Pt)return H.push({api:"Google Gemini",error:"未配置 API Key"}),null;const e=new AbortController,n=setTimeout(()=>e.abort(),15e3);try{const c=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Pt}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"你是资深基金经理，用中文回复。"+t}]}],generationConfig:{maxOutputTokens:500,temperature:.8}}),signal:e.signal});if(!c.ok){const m=await c.text().catch(()=>"");return H.push({api:"Google Gemini",error:`HTTP ${c.status}${m?": "+m.slice(0,200):""}`}),null}const u=(l=(i=(r=(s=(a=(o=(await c.json()).candidates)==null?void 0:o[0])==null?void 0:a.content)==null?void 0:s.parts)==null?void 0:r[0])==null?void 0:i.text)==null?void 0:l.trim();return u||H.push({api:"Google Gemini",error:"返回内容为空"}),u||null}catch(c){const d=c.name==="AbortError"?"请求超时（15秒）":c.message||"网络错误";return H.push({api:"Google Gemini",error:d}),console.warn("[LLM] Gemini:",c.message),null}finally{clearTimeout(n)}}const M={currentScreen:"builder",fundName:"",holdings:[],period:"1y",customMonths:18,backtestResults:null,stocksData:null,userResult:null,investAmount:1e5,leverage:1};let lt=null,pt=null;function Te(){const t=document.getElementById("particle-canvas");if(!t)return;const e=t.getContext("2d");let n=[];lt&&(cancelAnimationFrame(lt),lt=null),pt&&window.removeEventListener("resize",pt);function o(){t.width=window.innerWidth,t.height=window.innerHeight}o(),pt=o,window.addEventListener("resize",o);class a{constructor(){this.reset()}reset(){this.x=Math.random()*t.width,this.y=Math.random()*t.height,this.size=Math.random()*2+.5,this.speedX=(Math.random()-.5)*.3,this.speedY=(Math.random()-.5)*.3,this.opacity=Math.random()*.5+.1}update(){this.x+=this.speedX,this.y+=this.speedY,(this.x<0||this.x>t.width||this.y<0||this.y>t.height)&&this.reset()}draw(){e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fillStyle=`rgba(79, 195, 247, ${this.opacity})`,e.fill()}}for(let r=0;r<80;r++)n.push(new a);function s(){e.clearRect(0,0,t.width,t.height),n.forEach(r=>{r.update(),r.draw()});for(let r=0;r<n.length;r++)for(let i=r+1;i<n.length;i++){const l=n[r].x-n[i].x,c=n[r].y-n[i].y,d=Math.sqrt(l*l+c*c);d<120&&(e.beginPath(),e.moveTo(n[r].x,n[r].y),e.lineTo(n[i].x,n[i].y),e.strokeStyle=`rgba(79, 195, 247, ${.08*(1-d/120)})`,e.lineWidth=.5,e.stroke())}lt=requestAnimationFrame(s)}s()}function yt(t){se(),document.querySelectorAll(".screen").forEach(o=>o.classList.remove("active","hidden")),document.querySelectorAll(".screen").forEach(o=>o.classList.add("hidden"));const e=document.getElementById(`screen-${t}`);e&&(e.classList.remove("hidden"),e.classList.add("active"),e.scrollIntoView({behavior:"smooth",block:"start"})),M.currentScreen=t;const n=document.getElementById("header");n&&(n.style.display=t==="builder"?"":"none")}async function Kt(){try{const e=await fetch("./"+"stocks.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);const n=await e.json();return n.stocks.forEach(o=>{o.latestPrice=o.prices[o.prices.length-1]}),M.stocksData=n,M.stocksData}catch(t){return console.error("Failed to load stocks:",t),null}}async function Fe(){var e,n,o,a;const t=document.getElementById("btn-start");t.disabled=!0,t.textContent="⏳ 回测计算中...";try{const s=Nt(),r=de();let i=parseFloat((e=document.getElementById("invest-amount"))==null?void 0:e.value)||1e5;i=Math.max(100,Math.min(1e8,i));const l=parseFloat((n=document.getElementById("leverage"))==null?void 0:n.value)||1;let c=M.fundName||((a=(o=document.getElementById("fund-name"))==null?void 0:o.value)==null?void 0:a.trim());c||(c=ze(s,M.stocksData)),M.stocksData||await Kt();const d=Vt(M.stocksData,s,r);d.label=c,d.amount=i,d.leverage=l,M.userResult=d,M.holdings=s,M.investAmount=i,M.leverage=l;const u=Me(M.stocksData,r),m=[d,...u];m.sort((I,D)=>D.totalReturn-I.totalReturn),m.forEach((I,D)=>{I.rank=D+1}),M.backtestResults=m,yt("arena"),ue({fundName:c,period:r,results:m,amount:i,leverage:l});const p={...d,totalReturn:d.totalReturn*l,maxDrawdown:d.maxDrawdown*l},g=Ut(M.stocksData,s,p);g.metrics.leverage=l,De(g)}catch(s){He("回测失败："+s.message,"error"),t.disabled=!1,t.textContent="⚡ 开始挑战"}}async function Ae(){yt("diagnosis");const t={...M.userResult,totalReturn:M.userResult.totalReturn*M.leverage,maxDrawdown:M.userResult.maxDrawdown*M.leverage},e=Ut(M.stocksData,M.holdings,t);e.metrics.leverage=M.leverage;const n=Se();let o={results:null,errors:[],loading:n};n||(o=await Bt()),fe(e,o),n&&(o=await Bt(),pe(o))}function je(){M.fundName="",M.holdings=[],M.backtestResults=null,M.userResult=null,document.getElementById("fund-name").value="",document.getElementById("btn-start").disabled=!0,yt("builder"),Gt()}function ze(t,e){var $;if(!t||t.length===0)return"我的基金";const n={};e&&e.stocks&&e.stocks.forEach(v=>{n[v.code]=v});const o={},a={};let s=!1,r=!1,i=!1,l=!1;t.forEach(v=>{const y=n[v.code];y&&(o[y.market]=(o[y.market]||0)+v.weight,a[y.sector]=(a[y.sector]||0)+v.weight,y.sector==="科技"&&(s=!0),y.sector==="金融"&&(r=!0),y.sector==="消费"&&(i=!0),y.sector==="医药"&&(l=!0))});const c=Object.entries(o).sort((v,y)=>y[1]-v[1]),d=(($=c[0])==null?void 0:$[0])||"a-share",u=c.length,m={"a-share":["华夏","国泰","南方","易方达","嘉实","博时","广发","富国"],hk:["港股","香港","恒生","中港","沪港深"],us:["纳斯达克","标普","美股","全球","海外"],index:["指数","ETF","被动"]};let p;u>=3?p=["全球","国际","环球","世界","跨市场"]:u===2?p=["沪港深","深港通","AH","中美","跨市场"]:p=m[d]||m["a-share"];let g=[];s&&t.length<=3?g=["创新","科技","成长","新兴","前沿","智能"]:r&&t.length<=3?g=["金融","价值","蓝筹","红利","稳健","精选"]:i&&t.length<=3?g=["消费","品质","生活","品牌","升级"]:l&&t.length<=3?g=["健康","医疗","生命","医药","生物"]:t.length>=8?g=["优选","精选","配置","均衡","多元","全能"]:t.length<=3?g=["聚焦","集中","核心","龙头","精选","优势"]:g=["成长","价值","均衡","轮动","趋势","精选","优选","灵活"];const I=["混合","股票","配置","优选","精选","成长","价值","稳健","进取","灵活"],D=p[Math.floor(Math.random()*p.length)],B=g[Math.floor(Math.random()*g.length)],k=I[Math.floor(Math.random()*I.length)],x=[D+B+k,D+k+B,B+k,D+B],h=x[Math.floor(Math.random()*x.length)],w=["超级","至尊","王者","巅峰","传奇","无敌","神级","霸道"];return w[Math.floor(Math.random()*w.length)]+h+"（您）"}async function Oe(){Te(),await Kt(),Gt();const t=document.getElementById("invest-amount");t&&(t.addEventListener("input",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value&&parseInt(n.target.value)!==o&&(n.target.value=o)}),t.addEventListener("blur",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value=o})),document.getElementById("btn-start").addEventListener("click",Fe),document.getElementById("btn-diagnosis").addEventListener("click",Ae),document.getElementById("btn-restart").addEventListener("click",je),document.getElementById("fund-name").addEventListener("input",n=>{M.fundName=n.target.value.trim(),V()});const e=document.getElementById("leverage");e&&e.addEventListener("input",()=>{document.getElementById("leverage-display").textContent=e.value+"x"})}Oe();let xt=null;function He(t,e="info"){const n=document.getElementById("toast-msg");n&&n.remove(),xt&&clearTimeout(xt);const o=e==="error"?"bg-red-500/90":"bg-green-500/90",a=document.createElement("div");a.id="toast-msg",a.className=`fixed top-4 left-1/2 -translate-x-1/2 ${o} text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm`,a.textContent=t,document.body.appendChild(a),xt=setTimeout(()=>{a.style.opacity="0",a.style.transition="opacity .3s",setTimeout(()=>a.remove(),300)},3e3)}function V(){const t=document.getElementById("btn-start");t&&(t.disabled=Nt().length<1)}

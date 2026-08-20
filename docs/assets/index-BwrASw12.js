(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();let A=null,O=null,N=null,Ft="pct",Pt=[],Tt=1e5,At=1;function Y(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function Jt(t,e){const n=t.length;if(n<10)return[];const o=(n-1)/2,i=t.reduce((d,u)=>d+u,0)/n;let a=0,s=0;for(let d=0;d<n;d++)a+=(d-o)*(t[d]-i),s+=(d-o)*(d-o);const r=s!==0?a/s:0,l=t[n-1],c=[];for(let d=1;d<=e;d++){const u=(Math.random()-.5)*Math.abs(r)*d*.5;c.push(Y(l+r*d+u,2))}return c}function Xt(t,e){const n=new Date,o=[],i=t-e;for(let a=0;a<i;a++){const s=new Date(n);s.setDate(s.getDate()-(i-a)),a===0||a===i-1||a%Math.max(1,Math.floor(i/6))===0?o.push(s.getMonth()+1+"/"+s.getDate()):o.push("")}for(let a=0;a<e;a++){const s=new Date(n);s.setDate(s.getDate()+a+1),a===0||a===e-1||a%Math.max(1,Math.floor(e/2))===0?o.push("🔮"+(s.getMonth()+1)+"/"+s.getDate()):o.push("")}return o}function Qt(t,e,n,o){const i=document.getElementById(t);i&&(Pt=e,Tt=n||1e5,At=o||1,A&&A.dispose(),A=echarts.init(i),jt())}function jt(){const t=Pt,e=Tt,n=At,o=Ft==="value",i="#4fc3f7",a=["#69f0ae","#f0c060","#b388ff","#ff80ab","#18ffff","#ffab40","#ff5252"],s=[];let r=0,l=0;const c=t.find(h=>h.isUser);c&&(l=c.chartData.length),t.forEach((h,w)=>{h.chartData.length>r&&(r=h.chartData.length)});let d=[],u=-1;if(c){const h=c.chartData;for(let w=0;w<h.length;w++)if((h[w]-100)*n<=-100){u=w;break}if(u<0){const w=Jt(c.chartData,Math.max(1,Math.floor(r*.05)));w.length>0&&(d=w,r=Math.max(r,l+d.length))}}let m=[];const p=t.find(h=>h.isUser&&h.dateLabels);if(p&&p.dateLabels)m=[...p.dateLabels];else{const h=Math.max(0,r-l);m=Xt(r,h)}if(d.length>0&&m.length>0){const h=m[m.length-1],[w,L]=h.split("/").map(Number);for(let $=1;$<=d.length;$++){const v=new Date(2026,w-1,L);v.setDate(v.getDate()+$);const y=$===1||$===d.length||$%Math.max(1,Math.floor(d.length/3))===0?"🔮"+(v.getMonth()+1)+"/"+v.getDate():"";m.push(y)}}t.forEach((h,w)=>{const L=h.isUser,$=h.isBenchmark,v=h.chartData,y=L?i:a[(w-1)%a.length];let b=[],I=-1;if(o)for(let E=0;E<v.length;E++){if((v[E]-100)*n<=-100){I=E,b.push(0);break}b.push(Y(e*n*v[E]/100,0))}else for(let E=0;E<v.length;E++){const F=Y((v[E]-100)*n,1);if(F<=-100){I=E,b.push(-100);break}b.push(F)}for(;b.length<r;)b.push(null);let T=[...b];if(L&&d.length>0&&!o)for(let E=0;E<d.length;E++){const F=Y((d[E]-100)*n,1);l+E<T.length?T[l+E]=F:T.push(F)}else if(L&&d.length>0&&o)for(let E=0;E<d.length;E++){const F=Y(e*n*d[E]/100,0);l+E<T.length?T[l+E]=F:T.push(F)}if(L&&d.length>0&&I<0){const E=T.slice(0,l),F=new Array(l-1).fill(null),rt=E[E.length-1];F.push(rt);for(let U=0;U<d.length;U++){const lt=o?Y(e*n*d[U]/100,0):Y((d[U]-100)*n,1);F.push(lt)}s.push({name:h.label,type:"line",data:E,smooth:!0,symbol:"none",lineStyle:{width:4,type:"solid",color:y},itemStyle:{color:y},emphasis:{focus:"series",lineStyle:{width:6}},z:10,endLabel:{show:!0,formatter:h.label,color:y,fontSize:11,offset:[10,0]}}),s.push({name:"预测走势",type:"line",data:F,smooth:!0,symbol:"none",lineStyle:{width:3,type:"dashed",color:y,opacity:.7},itemStyle:{color:y},z:9,silent:!0})}else s.push({name:h.label,type:"line",data:T,smooth:!0,symbol:"none",lineStyle:{width:L?4:$?1.5:2,type:"solid",color:y,opacity:$?.5:1},itemStyle:{color:y},emphasis:{focus:"series",lineStyle:{width:L?6:3}},z:L?10:1,endLabel:L?{show:!0,formatter:h.label,color:y,fontSize:11,offset:[10,0]}:void 0,...I>=0?{markPoint:{data:[{name:"💥",coord:[I,o?0:-100],symbol:"pin",symbolSize:35,itemStyle:{color:"#ff5252"},label:{show:!0,formatter:"💥爆仓",fontSize:14,color:"#ff5252",fontWeight:"bold",offset:[0,-15]}}],animation:!1}}:{}})});const g=o?"总价值（元）":"收益率（%）";let S=1/0,D=-1/0;s.forEach(h=>{h.data&&h.data.forEach(w=>{w!==null&&!isNaN(w)&&(S=Math.min(S,w),D=Math.max(D,w))})});const C=D-S;S=S-C*.1,D=D+C*.1;const k={backgroundColor:"transparent",tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb",fontSize:12},formatter:function(h){const w=h.filter(y=>y.value!==null&&y.value!==void 0&&!y.seriesName.includes("预测"));if(w.length===0)return"";let $='<div style="font-weight:bold;margin-bottom:4px;">'+h[0].axisValue.replace("🔮","预测 ")+"</div>";const v=[...w].sort((y,b)=>(b.value||0)-(y.value||0));for(const y of v){const b=t.find(E=>E.label===y.seriesName&&E.isUser),I=b?"⭐ ":"",T=o?"¥"+Number(y.value).toLocaleString():(y.value>=0?"+":"")+y.value.toFixed(1)+"%";$+='<div style="display:flex;align-items:center;gap:6px;'+(b?"font-weight:bold;":"")+'"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+y.color+';"></span>'+I+y.seriesName+": "+T+"</div>"}return $}},legend:{bottom:0,textStyle:{color:"#9ca3af",fontSize:10},icon:"roundRect",itemWidth:12,itemHeight:8,data:t.map(h=>h.label)},grid:{left:"12%",right:"8%",top:"10%",bottom:"15%"},xAxis:{type:"category",data:m,axisLine:{lineStyle:{color:"#2d3d54"}},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:9,rotate:30},splitLine:{show:!1}},yAxis:{type:"value",name:g,nameLocation:"middle",nameGap:50,nameTextStyle:{color:"#9ca3af",fontSize:12},axisLine:{show:!0,lineStyle:{color:"#2d3d54"}},axisTick:{show:!0,lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,formatter:o?h=>h>=1e4?(h/1e4).toFixed(1)+"万":h.toLocaleString():h=>h.toFixed(0)+"%"},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},min:Math.floor(S),max:Math.ceil(D)},series:s};A.setOption(k,!0);const x=document.getElementById("forecast-section");x&&x.classList.toggle("hidden",d.length===0),window.addEventListener("resize",()=>A==null?void 0:A.resize())}function wt(t){var e,n,o,i,a,s,r,l,c,d,u,m,p,g;Ft=t,A&&(A.dispose(),A=echarts.init(document.getElementById("chart-returns")),jt()),(e=document.getElementById("chart-mode-pct"))==null||e.classList.toggle("active",t==="pct"),(n=document.getElementById("chart-mode-pct"))==null||n.classList.toggle("bg-neon-blue/20",t==="pct"),(o=document.getElementById("chart-mode-pct"))==null||o.classList.toggle("text-neon-blue",t==="pct"),(i=document.getElementById("chart-mode-pct"))==null||i.classList.toggle("border-neon-blue/30",t==="pct"),(a=document.getElementById("chart-mode-pct"))==null||a.classList.toggle("bg-dark-500/30",t!=="pct"),(s=document.getElementById("chart-mode-pct"))==null||s.classList.toggle("text-gray-400",t!=="pct"),(r=document.getElementById("chart-mode-pct"))==null||r.classList.toggle("border-dark-500",t!=="pct"),(l=document.getElementById("chart-mode-value"))==null||l.classList.toggle("active",t==="value"),(c=document.getElementById("chart-mode-value"))==null||c.classList.toggle("bg-neon-blue/20",t==="value"),(d=document.getElementById("chart-mode-value"))==null||d.classList.toggle("text-neon-blue",t==="value"),(u=document.getElementById("chart-mode-value"))==null||u.classList.toggle("border-neon-blue/30",t==="value"),(m=document.getElementById("chart-mode-value"))==null||m.classList.toggle("bg-dark-500/30",t!=="value"),(p=document.getElementById("chart-mode-value"))==null||p.classList.toggle("text-gray-400",t!=="value"),(g=document.getElementById("chart-mode-value"))==null||g.classList.toggle("border-dark-500",t!=="value")}function Zt(t,e,n){const o=document.getElementById(t);if(!o)return;O&&O.dispose(),O=echarts.init(o);const i={backgroundColor:"transparent",tooltip:{backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(124,58,237,0.3)",textStyle:{color:"#e5e7eb"}},radar:{center:["50%","50%"],radius:"65%",indicator:e.dimensions.map(a=>({name:a,max:100})),axisName:{color:"#9ca3af",fontSize:11},splitArea:{areaStyle:{color:["rgba(79,195,247,0.02)","rgba(79,195,247,0.02)"]}},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}},axisLine:{lineStyle:{color:"rgba(45,61,84,0.5)"}}},series:[{type:"radar",data:[{value:e.values,name:n,areaStyle:{color:"rgba(124,58,237,0.15)"},lineStyle:{color:"#b388ff",width:2},itemStyle:{color:"#b388ff"},symbol:"circle",symbolSize:5}]}]};O.setOption(i,!0),window.addEventListener("resize",()=>O==null?void 0:O.resize())}function zt(){const t=document.getElementById("sector-pie");t&&(N&&N.dispose(),N=echarts.init(t))}function te(t){if(!N)return;const e=["#4fc3f7","#69f0ae","#f0c060","#ff5252","#b388ff","#ff80ab","#18ffff"],n={backgroundColor:"transparent",tooltip:{trigger:"item",backgroundColor:"rgba(17,24,39,0.95)",borderColor:"rgba(79,195,247,0.3)",textStyle:{color:"#e5e7eb"},formatter:"{b}: {c}% ({d}%)"},series:[{type:"pie",radius:["50%","75%"],center:["50%","50%"],emphasis:{label:{fontSize:14,fontWeight:"bold"},scaleSize:8},label:{color:"#9ca3af",fontSize:11,formatter:`{b}
{c}%`},labelLine:{lineStyle:{color:"#4b5563"}},data:t.length>0?t:[{name:"未选择",value:100,itemStyle:{color:"#1f2937"}}],itemStyle:{borderColor:"#0a0e17",borderWidth:2,color:o=>e[o.dataIndex%e.length]}}]};N.setOption(n,!0)}function ee(){A==null||A.dispose(),A=null,O==null||O.dispose(),O=null,N==null||N.dispose(),N=null}function kt(t,e){if(t.length<e)return[];const n=new Array(t.length).fill(null);let o=0;for(let i=0;i<t.length;i++)o+=t[i],i>=e&&(o-=t[i-e]),i>=e-1&&(n[i]=parseFloat((o/e).toFixed(2)));return n}function ne(t,e=14){if(t.length<e+1)return[];const n=new Array(t.length).fill(null),o=[],i=[];for(let r=1;r<t.length;r++){const l=t[r]-t[r-1];o.push(l>0?l:0),i.push(l<0?-l:0)}let a=o.slice(0,e).reduce((r,l)=>r+l,0)/e,s=i.slice(0,e).reduce((r,l)=>r+l,0)/e;for(let r=e;r<o.length;r++){if(s===0)n[r+1]=100;else{const l=a/s;n[r+1]=parseFloat((100-100/(1+l)).toFixed(1))}a=(a*(e-1)+o[r])/e,s=(s*(e-1)+i[r])/e}return n}let Q=[],R=[],X="a-share",et="all",$t=!1,Mt=!1,Lt=!1,Et=!1,Rt=!1;function _(){M.holdings=R.map(t=>({code:t.code,name:t.name,sector:t.sector,market:t.market,weight:t.weight}))}function Ot(){var n;R=[],_(),X="a-share",et="all",M.stocksData&&oe(M.stocksData),$t||(document.querySelectorAll(".market-tab").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".market-tab").forEach(i=>i.classList.remove("active")),o.classList.add("active"),X=o.dataset.market,document.getElementById("stock-search").value="",V()})}),$t=!0),Rt||((n=document.getElementById("btn-random"))==null||n.addEventListener("click",ie),Rt=!0);const t=document.getElementById("stock-search");if(t&&!Lt){let o=null;t.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(()=>{const i=t.value.trim().toLowerCase();i&&(X="all",document.querySelectorAll(".market-tab").forEach(a=>a.classList.remove("active"))),V(i)},250)}),Lt=!0}Mt||(document.querySelectorAll(".period-btn").forEach(o=>{o.addEventListener("click",()=>{document.querySelectorAll(".period-btn").forEach(a=>a.classList.remove("active")),o.classList.add("active");const i=o.dataset.period;i==="custom"?(document.getElementById("custom-period-wrap").classList.remove("hidden"),M.period="custom"):(document.getElementById("custom-period-wrap").classList.add("hidden"),M.period=i)})}),Mt=!0);const e=document.getElementById("custom-months");e&&!Et&&(e.addEventListener("input",()=>{M.customMonths=parseInt(e.value)||18}),Et=!0),zt(),W()}function oe(t){Q=t.stocks,ae(t.sectors),V(),zt()}function ae(t){const e=document.getElementById("sector-filters");if(!e)return;e.innerHTML="";const n=document.createElement("button");n.className="sector-btn active",n.textContent="全部",n.addEventListener("click",()=>{et="all",document.querySelectorAll(".sector-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),V()}),e.appendChild(n),t.forEach(o=>{const i=document.createElement("button");i.className="sector-btn",i.textContent=o,i.addEventListener("click",()=>{et=o,document.querySelectorAll(".sector-btn").forEach(a=>a.classList.remove("active")),i.classList.add("active"),V()}),e.appendChild(i)})}function V(t){const e=document.getElementById("stock-grid");if(!e)return;let n=Q;if(t){const o=t.toLowerCase();n=Q.filter(i=>i.name.toLowerCase().includes(o)||i.code.toLowerCase().includes(o)).slice(0,50)}else X==="all"&&(X="a-share"),n=Q.filter(o=>{const i=o.market===X,a=et==="all"||o.sector===et;return i&&a});n.sort((o,i)=>i.marketCap-o.marketCap),e.innerHTML=n.map(o=>{var r;const i=R.find(l=>l.code===o.code),a=o.latestPrice;return`
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
    `}).join(""),e.querySelectorAll(".stock-card").forEach(o=>{o.addEventListener("click",i=>{i.target.closest(".stock-detail-btn")||Ht(o.dataset)})}),e.querySelectorAll(".stock-detail-btn").forEach(o=>{o.addEventListener("click",i=>{i.stopPropagation();const a=o.dataset.code;se(a)})})}function se(t){var p,g,S,D,C,k;const e=Q.find(x=>x.code===t);if(!e)return;const n=e.prices.slice(-60),o=Math.min(...n),i=Math.max(...n),a={"a-share":"A股",hk:"港股",us:"美股",index:"指数"},s=n[0],l=((n[n.length-1]-s)/s*100).toFixed(2),c=l>=0?"text-neon-red":"text-neon-green",d=l>=0?"+":"",u=l>=0?"#ff5252":"#69f0ae";for(let x=0;x<n.length;x+=10);const m=document.createElement("div");m.className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm",m.innerHTML=`
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
          <span>最高: ¥${i.toFixed(2)}</span>
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
          <div class="text-lg font-mono ${e.revenueGrowth>0?"text-neon-red":"text-neon-green"}">${((S=e.revenueGrowth)==null?void 0:S.toFixed(1))||"--"}%</div>
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
  `,document.body.appendChild(m),(C=m.querySelector(".stock-modal-close"))==null||C.addEventListener("click",()=>m.remove()),(k=m.querySelector(".stock-modal-add"))==null||k.addEventListener("click",function(){const{code:x,name:h,sector:w,market:L}=this.dataset;Ht({code:x,name:h,sector:w,market:L}),m.remove()}),m.addEventListener("click",x=>{x.target===m&&m.remove()}),setTimeout(()=>{const x=document.getElementById(`tech-indicators-${e.code}`);if(!x)return;const h=e.prices.slice(-120),w=kt(h,20),L=kt(h,60),$=ne(h,14);h[h.length-1];const v=w[w.length-1],y=L[L.length-1],b=$[$.length-1],I=v>y?"📈 多头排列":"📉 空头排列",T=b>70?"⚠️ 超买":b<30?"💡 超卖":"➖ 中性";x.innerHTML=`
      <div><div class="text-xs text-gray-500">MA20</div><div class="font-mono text-sm ${v>y?"text-neon-red":"text-neon-green"}">${(v==null?void 0:v.toFixed(2))||"--"}</div></div>
      <div><div class="text-xs text-gray-500">RSI(14)</div><div class="font-mono text-sm ${b>70?"text-neon-red":b<30?"text-neon-green":"text-gray-300"}">${(b==null?void 0:b.toFixed(1))||"--"}</div></div>
      <div><div class="text-xs text-gray-500">趋势</div><div class="text-xs">${I}</div><div class="text-xs text-gray-500">${T}</div></div>
    `},100),setTimeout(()=>{const x=document.getElementById("stock-price-chart");if(x&&typeof echarts<"u"){const h=echarts.init(x),w={backgroundColor:"transparent",grid:{left:"3%",right:"3%",top:"5%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:n.map((L,$)=>$+1),axisLine:{lineStyle:{color:"#2d3d54"}},axisLabel:{color:"#6b7280",fontSize:10,interval:9,formatter:L=>`${L}日`},axisTick:{show:!1}},yAxis:{type:"value",scale:!0,axisLine:{show:!1},axisTick:{show:!1},axisLabel:{color:"#6b7280",fontSize:10,formatter:L=>"¥"+L.toFixed(0)},splitLine:{lineStyle:{color:"rgba(45,61,84,0.3)"}}},series:[{data:n,type:"line",smooth:!0,symbol:"none",lineStyle:{width:3,color:u},areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:u+"40"},{offset:1,color:u+"00"}])}}],tooltip:{trigger:"axis",backgroundColor:"rgba(17,24,39,0.95)",borderColor:u,textStyle:{color:"#e5e7eb",fontSize:12},formatter:L=>{const $=L[0].value;return`<div style="font-weight:bold">第${L[0].axisValue}天</div><div>价格: ¥${$.toFixed(2)}</div>`}}};h.setOption(w),window.addEventListener("resize",()=>h.resize())}},100),m.addEventListener("click",x=>{x.target===m&&m.remove()})}function Ht({code:t,name:e,sector:n,market:o}){var s,r;const i=R.findIndex(l=>l.code===t);if(i>=0)R.splice(i,1);else if(R.length<10)R.push({code:t,name:e,sector:n,market:o,weight:0});else{showToast("最多选择10只成分股","error");return}pt(),_();const a=(r=(s=document.getElementById("stock-search"))==null?void 0:s.value)==null?void 0:r.trim();V(a||void 0),W(),K(),G()}function pt(){if(R.length===0)return;const t=Math.floor(100/R.length),e=100-t*R.length;R.forEach((o,i)=>{o.weight=t+(i<e?1:0)});const n=R.reduce((o,i)=>o+i.weight,0);n!==100&&R.length>0&&(R[0].weight+=100-n)}function W(){var i;const t=document.getElementById("selected-list"),e=document.getElementById("weight-sum");if(R.length===0){t.innerHTML='<span class="text-gray-500">请从上方选择股票</span>',e.textContent="合计: 0%";return}t.innerHTML=R.map((a,s)=>`
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
  `).join("");const n=R.reduce((a,s)=>a+s.weight,0);e.textContent=`合计: ${n}%`,e.className=n===100?"text-sm font-mono text-neon-green":"text-sm font-mono text-neon-red";const o=((i=document.getElementById("lock-weights"))==null?void 0:i.checked)||!1;t.querySelectorAll('[data-action="weight"]').forEach(a=>{a.addEventListener("input",s=>{const r=parseInt(a.dataset.index);R[r].weight=parseInt(s.target.value);const l=t.querySelector(`[data-action="weight-input"][data-index="${r}"]`);l&&(l.value=s.target.value),o?(_(),W(),K(),G()):St(r,parseInt(s.target.value))}),a.addEventListener("change",s=>{if(!o)return;const r=parseInt(a.dataset.index);R[r].weight=parseInt(s.target.value),_(),W(),K(),G()})}),t.querySelectorAll('[data-action="weight-input"]').forEach(a=>{a.addEventListener("change",s=>{const r=parseInt(a.dataset.index);let l=parseInt(s.target.value)||1;l=Math.max(1,Math.min(95,l)),R[r].weight=l;const c=t.querySelector(`[data-action="weight"][data-index="${r}"]`);c&&(c.value=l),o?(_(),W(),K(),G()):St(r,l)})}),t.querySelectorAll('[data-action="remove"]').forEach(a=>{a.addEventListener("click",()=>{const s=parseInt(a.dataset.index);R.splice(s,1),pt(),_(),V(),W(),K(),G()})})}function St(t,e){const n=R.filter((s,r)=>r!==t);if(n.length===0)return;R[t].weight=e;const o=100-e,i=n.reduce((s,r)=>s+r.weight,0);if(i===0){const s=Math.floor(o/n.length);n.forEach(l=>l.weight=s);const r=n.reduce((l,c)=>l+c.weight,0);n[0].weight+=o-r}else{const s=o/i;let r=0;n.forEach((d,u)=>{d.weight=Math.max(1,Math.round(d.weight*s)),r+=d.weight});let l=o-r,c=0;for(;l!==0&&c<20;){c++;for(const d of n)if(l>0?(d.weight++,l--):l<0&&d.weight>1&&(d.weight--,l++),l===0)break}l!==0&&n.length>0&&(n[0].weight=Math.max(1,n[0].weight+l))}const a=R.reduce((s,r)=>s+r.weight,0);a!==100&&R.length>0&&(R[0].weight+=100-a),_(),W(),K(),G()}function K(){const t={};R.forEach(n=>{t[n.sector]=(t[n.sector]||0)+n.weight});const e=Object.entries(t).map(([n,o])=>({name:n,value:o}));te(e)}function ie(){var n;R=[];const t=4+Math.floor(Math.random()*4),e=[...Q].sort(()=>Math.random()-.5);for(let o=0;o<Math.min(t,e.length);o++){const i=e[o];R.push({code:i.code,name:i.name,sector:i.sector,market:i.market,weight:0})}pt(),document.getElementById("stock-search").value="",X="a-share",document.querySelectorAll(".market-tab").forEach(o=>o.classList.remove("active")),(n=document.querySelector('[data-market="a-share"]'))==null||n.classList.add("active"),V(),W(),K(),G(),showToast(`🎲 随机选中 ${R.length} 只股票，看看运气如何？`)}function qt(){return R.map(t=>({code:t.code,weight:t.weight}))}function re(){return M.period==="custom"?"custom"+(M.customMonths||18):M.period}let Dt=!1;function le(t){var r,l;const{results:e,amount:n,leverage:o}=t,i=n||1e5,a=o||1,s=[...e].sort((c,d)=>c.rank-d.rank);ce(s,i,a),Qt("chart-returns",s,i,a),de(s,i,a),Dt||((r=document.getElementById("chart-mode-pct"))==null||r.addEventListener("click",()=>wt("pct")),(l=document.getElementById("chart-mode-value"))==null||l.addEventListener("click",()=>wt("value")),Dt=!0)}function ce(t,e,n){const o=document.getElementById("ranking-table");if(!o)return;const i=["🥇","🥈","🥉"];o.innerHTML=t.map((a,s)=>{const r=a.isUser,l=s<3?i[s]:a.rank,c=a.totalReturn>=0?"text-neon-red":"text-neon-green",d=r?"user-highlight":"",u=a.totalReturn*n,m=parseFloat(Math.max(-100,u).toFixed(1)),p=Math.round(e*m/100),g=(m>=0?"+":"")+Number(p).toLocaleString(),S=parseFloat((a.maxDrawdown*n).toFixed(1));let D="";if(!r&&a.holdingsDetail&&a.holdingsDetail.length>0){const C=a.holdingsDetail.map(k=>`<div class="flex justify-between text-xs py-1">
          <span class="text-gray-400">${k.name}</span>
          <span class="text-neon-blue font-mono">${k.weight}%</span>
        </div>`).join("");D=`
        <div class="mt-2 pt-2 border-t border-dark-600/30 holdings-detail hidden" id="holdings-${s}">
          <div class="text-xs text-gray-500 mb-1">持仓成分</div>
          ${C}
        </div>
      `}return`
      <div class="rank-row ${d} animate-slide-up" style="animation-delay: ${s*.08}s">
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
          ${!r&&a.holdingsDetail?`<button class="text-xs text-neon-blue mt-1 hover:underline" onclick="toggleHoldings(${s})">查看持仓</button>`:""}
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
            最大回撤 ${S}%
          </div>
        </div>
      </div>
    `}).join(""),window.toggleHoldings||(window.toggleHoldings=function(a){const s=document.getElementById(`holdings-${a}`);s&&s.classList.toggle("hidden")})}function de(t,e,n){const o=document.getElementById("metrics-table");if(!o)return;const i=["基金","累计收益","年化收益","最大回撤","夏普比率","胜率"],a=t.map(s=>{const r=s.totalReturn>=0?"metric-up":"metric-down",l=s.totalReturn*n,c=parseFloat(Math.max(-100,l).toFixed(1)),d="★".repeat(s.fundRating||0)+"☆".repeat(5-(s.fundRating||0)),u=s.isUser?`
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
            <div class="font-mono text-gold-400">${d}</div>
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
        <td class="px-3 py-2.5 font-mono text-sm ${r}">${c>=0?"+":""}${c.toFixed(1)}%</td>
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
            ${i.map(s=>`<th class="px-3 py-2 text-left font-medium whitespace-nowrap cursor-help" title="${ue(s)}">${s}</th>`).join("")}
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
  `}function ue(t){return{基金:"基金名称",累计收益:"回测期内的总收益率",年化收益:"按年计算的收益率",最大回撤:"从高点到低点的最大亏损幅度",夏普比率:"风险调整后收益，>1优秀",胜率:"盈利交易日占比"}[t]||t}window.showMetricDetail||(window.showMetricDetail=function(t){const n={sharpe:{title:"夏普比率 (Sharpe Ratio)",content:`夏普比率 = (年化收益率 - 无风险利率) / 年化波动率

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

${n.content}`)});function me(t){const{styleTag:e,matchPerson:n,matchPersonDesc:o,matchPersonOrg:i,metrics:a,radarData:s,commentary:r}=t,l=document.getElementById("diagnosis-tag");l&&(l.innerHTML=`
      <span class="diagnosis-badge text-xl md:text-2xl animate-fade-in">${e}</span>
    `);const c=document.getElementById("diagnosis-subtitle");c&&(c.innerHTML=`
      <span class="text-gray-400">对标人物：</span>
      <span class="text-neon-blue font-bold">${n}</span>
      <span class="text-gray-500 text-sm"> — ${o}</span>
      ${i?`<span class="text-gray-600 text-sm block">${i}</span>`:""}
    `),Zt("chart-radar",s,"你的基金");const d=document.getElementById("commentary-text");if(d){if(t.aiResults&&t.aiResults.length>0){let u=t.aiResults.map(p=>p.html).join('<div style="margin:16px 0;border-top:1px dashed rgba(255,255,255,0.1);"></div>');const m=t.aiResults.map(p=>p.model).join(" + ");u+='<div style="margin-top:12px;text-align:right;font-size:11px;color:#6b7280;">🤖 点评由 '+m+" 生成 · 仅供参考</div>",d.innerHTML=u}else if(r){const u=r.split(`

`).map(m=>m.trim()).filter(Boolean);d.innerHTML=u.map((m,p)=>'<p style="margin-bottom:'+(p<u.length-1?"12px":"0")+';line-height:1.8;">'+m+"</p>").join(""),d.innerHTML+='<div style="margin-top:12px;text-align:right;font-size:11px;color:#6b7280;">📋 离线模板点评 · 仅供参考</div>'}}ge(a)}function ge(t){const e=document.getElementById("ai-commentary");if(!e)return;let n=document.getElementById("metrics-summary");n&&n.remove(),n=document.createElement("div"),n.id="metrics-summary";const o=(s,r)=>{if(s==null||isNaN(s))return"-";const l=Math.pow(10,r);return Math.round(s*l)/l},i="★".repeat(t.fundRating||0)+"☆".repeat(5-(t.fundRating||0)),a=t.fundRating>=4?"text-gold-400":t.fundRating>=3?"text-neon-blue":"text-gray-400";n.innerHTML=`
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
  `,e.appendChild(n)}const P=252;function z(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}const he={"3m":Math.floor(P/4),"6m":Math.floor(P/2),"1y":P,"3y":P*3,"5y":P*5,"10y":P*10};function fe(t){if(t.startsWith("custom")){const e=parseInt(t.replace("custom",""))||18;return Math.floor(P*e/12)}return he[t]||P}function Nt(t,e,n){var bt;const o=Math.min(fe(n),P*10),i={};t.stocks.forEach(f=>{i[f.code]=f});const a=[],s=100,r=((bt=i[e[0].code])==null?void 0:bt.prices.length)||P*5;for(let f=o;f>0;f--){const B=r-f;let nt=0;for(const ot of e){const at=i[ot.code];if(!at||B>=at.prices.length)continue;const Yt=at.prices[B],_t=at.prices[r-o],Kt=ot.weight/100;nt+=Kt*(Yt/_t)}a.push(parseFloat((s*nt).toFixed(4)))}const l=a[a.length-1],c=z((l-s)/s*100,2);let d=0,u=a[0];for(const f of a){f>u&&(u=f);const B=(u-f)/u*100;B>d&&(d=B)}d=z(d,2);const m=o/P,p=z((Math.pow(l/s,1/m)-1)*100,2),g=[];for(let f=1;f<a.length;f++)g.push((a[f]-a[f-1])/a[f-1]);const S=g.reduce((f,B)=>f+B,0)/g.length,D=g.reduce((f,B)=>f+Math.pow(B-S,2),0)/g.length,C=Math.sqrt(D),k=z(C*Math.sqrt(P)*100,2),x=.02,h=k>0?z((p/100-x)/(k/100),2):0,w=g.filter(f=>f<0),L=w.length>0?Math.sqrt(w.reduce((f,B)=>f+Math.pow(B-w.reduce((nt,ot)=>nt+ot,0)/w.length,2),0)/w.length):0,$=L>0?z((p/100-x)/(L*Math.sqrt(P)),2):0,v=z((p/100-x)/1,2),y=g.map(f=>f-x/P),b=Math.sqrt(y.reduce((f,B)=>f+B*B,0)/y.length)*Math.sqrt(P),I=b>0?z((p/100-x)/b,2):0,T=d>0?z(p/d,2):0,E=g.filter(f=>f>0).length,F=z(E/g.length*100,1),rt=g.filter(f=>f>0).reduce((f,B)=>f+B,0)/g.filter(f=>f>0).length||0,U=Math.abs(g.filter(f=>f<0).reduce((f,B)=>f+B,0)/g.filter(f=>f<0).length)||0,lt=U>0?z(rt/U,2):0;let j=0,H=[];h>=1.5?(j+=2,H.push("夏普比率优秀")):h>=1?(j+=1.5,H.push("夏普比率良好")):h>=.5&&(j+=1,H.push("夏普比率一般")),d<=10?(j+=1.5,H.push("回撤控制优秀")):d<=20?(j+=1,H.push("回撤控制良好")):d<=30&&(j+=.5),p>=20?(j+=1.5,H.push("收益表现优秀")):p>=10?(j+=1,H.push("收益表现良好")):p>=5&&(j+=.5),F>=60&&(j+=.5,H.push("胜率较高")),j=Math.min(5,Math.max(1,Math.round(j)));let ct="中";d<=15&&k<=20?ct="低":(d>=30||k>=40)&&(ct="高");const yt=Math.max(1,Math.floor(a.length/50)),dt=[],ut=[];for(let f=0;f<a.length;f+=yt)dt.push(a[f]),ut.push(f);(a.length-1)%yt!==0&&(dt.push(a[a.length-1]),ut.push(a.length-1));const Vt=new Date,mt=new Date(Vt);mt.setDate(mt.getDate()-o);const Ut=ut.map(f=>{const B=new Date(mt);return B.setDate(B.getDate()+f),B.getMonth()+1+"/"+B.getDate()});return{name:"user",label:"你的基金",isUser:!0,totalReturn:c,annualizedReturn:p,annualizedVol:k,maxDrawdown:d,sharpeRatio:h,sortinoRatio:$,treynorRatio:v,informationRatio:I,calmarRatio:T,profitLossRatio:lt,winRate:F,fundRating:j,ratingReasons:H,riskLevel:ct,initialValue:s,finalValue:l,chartData:dt,dateLabels:Ut,days:o,holdings:e.map(f=>{const B=i[f.code];return{code:f.code,name:(B==null?void 0:B.name)||f.code,weight:f.weight}})}}function pe(t,e){const n=[];return n.push(...xe(t,e)),n.push(...ve(t,e)),n}function q(t,e){const n=Math.pow(10,e);return Math.round(t*n)/n}function xe(t,e){const n=t.stocks,o=n.filter(c=>c.market==="a-share").sort((c,d)=>d.marketCap-c.marketCap).slice(0,20),i=o.map(c=>({code:c.code,weight:q(100/o.length,1)})),a=n.filter(c=>c.market==="a-share"&&(c.sector==="科技"||c.sector==="医药"||c.sector==="新能源")).filter(c=>c.marketCap<5e3).slice(0,15),s=a.map(c=>({code:c.code,weight:q(100/a.length,1)})),r=n.filter(c=>c.market==="us"&&c.sector==="科技").sort((c,d)=>d.marketCap-c.marketCap).slice(0,10),l=r.map(c=>({code:c.code,weight:q(100/r.length,1)}));return[J("benchmark-csi300","🇨🇳 沪深300","A股大盘蓝筹基准","🇨🇳",i,t,e),J("benchmark-gem","🇨🇳 创业板指","A股成长创新基准","🇨🇳",s,t,e),J("benchmark-nasdaq","🇺🇸 纳斯达克100","美股科技龙头基准","🇺🇸",l,t,e)]}function ve(t,e){const n=t.stocks,o=n.filter(u=>u.pe>0&&u.pe<25&&u.dividendYield>2).filter(u=>u.sector==="消费"||u.sector==="金融").sort((u,m)=>m.dividendYield-u.dividendYield).slice(0,8),i=o.map(u=>({code:u.code,weight:q(100/o.length,1)})),a=n.filter(u=>u.revenueGrowth>10).filter(u=>u.sector==="科技"||u.sector==="医药"||u.sector==="新能源").sort((u,m)=>m.revenueGrowth-u.revenueGrowth).slice(0,8),s=a.map(u=>({code:u.code,weight:q(100/a.length,1)})),r=n.map(u=>{const m=u.prices,p=m[m.length-1],g=m[Math.max(0,m.length-63)];return{...u,momentum:q((p-g)/g*100,2)}}).sort((u,m)=>m.momentum-u.momentum).slice(0,8),l=r.map(u=>({code:u.code,weight:q(100/r.length,1)})),c=n.filter(u=>u.roe>5).map(u=>{const m=u.prices,p=m[m.length-1],g=m[Math.max(0,m.length-63)];return{...u,change:q((p-g)/g*100,2)}}).sort((u,m)=>u.change-m.change).slice(0,8),d=c.map(u=>({code:u.code,weight:q(100/c.length,1)}));return[J("ai-value","🐻 价值大师","深度价值投资","🐻",i,t,e),J("ai-growth","🐂 成长猎手","激进成长投资","🐂",s,t,e),J("ai-momentum","🐎 趋势追踪","动量交易策略","🐎",l,t,e),J("ai-reverse","🦉 逆向投资","超跌反转策略","🦉",d,t,e)]}function J(t,e,n,o,i,a,s){const r=Nt(a,i,s);return r.name=t,r.label=e,r.description=n,r.icon=o,r.isUser=!1,r.isBenchmark=o==="📊",r.holdingsDetail=i.map(l=>{const c=a.stocks.find(d=>d.code===l.code);return{code:l.code,name:(c==null?void 0:c.name)||l.code,weight:l.weight,sector:(c==null?void 0:c.sector)||"未知",market:(c==null?void 0:c.market)||"未知"}}),r}const st=[{id:"jiucai",emoji:"🥬",name:"韭菜本菜",matchPerson:"每一个在市场里交过学费的人",personDesc:"初代股民集体回忆",personOrg:"",condition:t=>t.totalReturn<0&&t.concentration>.5},{id:"foxi",emoji:"🧘",name:"佛系躺平派",matchPerson:"但斌",personDesc:"「时间的玫瑰」——买了就当忘了",personOrg:"东方港湾董事长",condition:t=>t.turnover<.3&&t.bluechipRatio>.6},{id:"jiuxiang",emoji:"🍶",name:"酱香科技研究员",matchPerson:"张坤",personDesc:"易方达蓝筹精选掌舵人",personOrg:"易方达基金",condition:t=>(t.sectorWeights.消费||0)>30},{id:"yaoyao",emoji:"💊",name:"医药葛兰分兰",matchPerson:"葛兰",personDesc:"中欧医疗健康，医药赛道信仰者",personOrg:"中欧基金",condition:t=>(t.sectorWeights.医药||0)>40},{id:"ark",emoji:"🚀",name:"ARK中国分K",matchPerson:"Cathie Wood",personDesc:"ARK Invest创始人",personOrg:"ARK Invest",condition:t=>(t.sectorWeights.科技||0)>50&&t.turnover>.5},{id:"buffett",emoji:"👴",name:"巴菲特传人",matchPerson:"Warren Buffett",personDesc:"价值投资灯塔",personOrg:"伯克希尔·哈撒韦",condition:t=>(t.sectorWeights.消费||0)+(t.sectorWeights.金融||0)>50&&t.turnover<.3&&t.roe>15},{id:"diamond",emoji:"🦍",name:"钻石手",matchPerson:"WSB散户大军",personDesc:"「Diamond Hands」——回撤50%也绝不割肉",personOrg:"Reddit r/wallstreetbets",condition:t=>t.maxDrawdown>25&&t.turnover<.3},{id:"wolf",emoji:"🐺",name:"华尔街之狼",matchPerson:"各路游资大佬",personDesc:"高频交易，主打一个刺激",personOrg:"龙虎榜常客",condition:t=>t.turnover>.8},{id:"national",emoji:"🏛️",name:"国家队在逃成员",matchPerson:"社保基金/汇金",personDesc:"银行+央企+蓝筹，稳如泰山",personOrg:"全国社保基金理事会",condition:t=>(t.sectorWeights.金融||0)>40&&t.annualizedVol<20&&t.roe>10},{id:"global",emoji:"🌍",name:"全球宏观玩家",matchPerson:"Ray Dalio",personDesc:"桥水基金创始人",personOrg:"桥水基金",condition:t=>t.crossMarket&&t.marketCount>=3},{id:"growth",emoji:"🌱",name:"成长股猎人",matchPerson:"朱少醒",personDesc:"富国天惠，15年20倍的公募传奇",personOrg:"富国基金",condition:t=>(t.sectorWeights.科技||0)>30&&t.revenueGrowth>20},{id:"balanced",emoji:"⚖️",name:"均衡配置达人",matchPerson:"谢治宇",personDesc:"兴全合润，不偏科的均衡派代表",personOrg:"兴证全球基金",condition:t=>t.maxSectorWeight<35&&t.stockCount>=6}];function Z(t,e){if(t==null||isNaN(t))return t;const n=Math.pow(10,e);return Math.round(t*n)/n}function ye(t,e,n,o){var y;const a=Object.entries(e.sectorWeights||{}).sort((b,I)=>I[1]-b[1])[0]||["未知",0];Object.entries(e.marketWeights||{}).sort((b,I)=>I[1]-b[1]);const s={"a-share":"A股",hk:"港股",us:"美股",index:"指数ETF"},r=[],l={},c={};n.forEach(b=>{const I=o[b.code];I&&(l[I.market]=(l[I.market]||0)+b.weight,c[I.sector]=(c[I.sector]||0)+b.weight)});const d=Object.entries(l).sort((b,I)=>I[1]-b[1]),u=Object.entries(c).sort((b,I)=>I[1]-b[1]),m=(y=d[0])==null?void 0:y[0],p=d.length,g=e.leverage||1,S=e.maxDrawdown>=100||e.totalReturn<=-100,D=g>3,C=e.totalReturn<-50,k=e.totalReturn<-20&&e.totalReturn>=-50,x=e.totalReturn<0&&e.totalReturn>=-20,h=e.totalReturn>=0&&e.totalReturn<10,w=e.totalReturn>=10&&e.totalReturn<50,L=e.totalReturn>=50;let $="";if(S?D?$=`💥 **爆仓警告！** 你使用了${g}x杠杆，最终回撤${e.maxDrawdown.toFixed(1)}%，本金几乎归零。这不是投资，这是赌博！高杠杆+重仓=自杀式操作。`:$=`💥 **巨额亏损！** 最大回撤${e.maxDrawdown.toFixed(1)}%，几乎亏光所有本金。你的选股或择时出现了严重问题。`:C?D?$=`📉 **高杠杆惨案！** ${g}x杠杆放大了亏损，最终收益${e.totalReturn.toFixed(1)}%。杠杆是双刃剑，这次你被割伤了。`:$=`📉 **深度套牢！** 亏损${Math.abs(e.totalReturn).toFixed(1)}%，持仓体验极差。建议重新审视每只股票的基本面。`:k?$=`😰 **投资失利！** 亏损${Math.abs(e.totalReturn).toFixed(1)}%，虽然没到爆仓程度，但也足够肉疼。复盘一下原因？`:x?$=`🤔 **白忙一场！** 亏了${Math.abs(e.totalReturn).toFixed(1)}%，承担了风险却没得到回报。`:h?$=`🙂 **小赚一笔！** 盈利${e.totalReturn.toFixed(1)}%，虽然不多但好歹是正收益。`:w?$=`😊 **稳健盈利！** 收益${e.totalReturn.toFixed(1)}%，回撤${e.maxDrawdown.toFixed(1)}%，这是真正的投资能力！`:L&&(D?$=`🚀 **杠杆暴利！** ${g}x杠杆+${e.totalReturn.toFixed(1)}%收益=暴富神话！但别飘，见好就收。`:$=`🌟 **投资大师！** 收益${e.totalReturn.toFixed(1)}%，这是巴菲特级别的表现！`),r.push($),r.push(`
📊 **持仓诊断**：`),u.length>0){const b=u[0],I=b[1]>60?`重仓${b[0]}(${b[1].toFixed(0)}%)，集中度极高，风险集中。`:b[1]>40?`${b[0]}(${b[1].toFixed(0)}%)占比偏高。`:"行业分布较均衡。";r.push(`• ${I}`)}p===1?r.push(`• 全仓${s[m]||m}，单一市场风险集中。`):r.push(`• 跨${p}个市场配置，分散了风险。`),e.stockCount<=2?r.push(`• 仅${e.stockCount}只标的，集中度极高，押注式投资风险极大。`):e.stockCount>=8?r.push(`• ${e.stockCount}只标的，可能过于分散。`):r.push(`• ${e.stockCount}只标的，集中度适中。`),g>1&&(r.push(`
⚠️ **杠杆分析**（${g}x杠杆）：`),S?r.push(`• **爆仓元凶！** ${g}x杠杆导致回撤放大。没有杠杆最多亏${(100/g).toFixed(0)}%，有了杠杆亏了100%+。`):C?r.push(`• **杠杆放大亏损！** ${g}x杠杆让你的亏损速度加快了${g}倍。`):r.push(`• 使用了${g}x杠杆，放大了收益和风险。`)),r.push(`
📈 **风险收益**：`),r.push(`• 年化收益：${e.annualizedReturn>=0?"+":""}${e.annualizedReturn.toFixed(1)}%`),r.push(`• 最大回撤：${e.maxDrawdown.toFixed(1)}%${e.maxDrawdown>30?"（极高风险）":e.maxDrawdown>20?"（高风险）":e.maxDrawdown>10?"（中等风险）":"（低风险）"}`),r.push(`• 夏普比率：${e.sharpeRatio.toFixed(2)}`),r.push(`
💡 **专属建议**：`);const v=[];return S?(v.push("🚨 立即退出所有杠杆仓位，本金没了就什么都没了。"),v.push("📚 建议先学习《聪明的投资者》等经典书籍。"),v.push("🎮 先用模拟盘练习至少3个月。")):C||k?(v.push("🛑 暂停加仓，不要继续摊低成本。"),v.push("🔍 仔细分析每只股票的买入逻辑。"),D&&v.push("📉 降低杠杆至1x或2x。")):x?v.push("🤔 微调策略，优化选股标准。"):h?v.push("📊 加入债券ETF等低风险资产平滑曲线。"):(w||L)&&v.push("💰 适当减仓，锁定部分利润。"),a[1]>60&&v.push(`🔄 ${a[0]}占比过高，建议减仓分散。`),p===1&&!S&&v.push("🌍 建议配置其他市场分散风险。"),e.maxDrawdown>30&&!S&&v.push("🛡️ 设置止损线（如-15%）并严格执行。"),r.push(...v.map((b,I)=>`${I+1}. ${b}`)),r.push(`
🎯 **总结**：`),S?r.push("这次投资以爆仓告终。记住这次教训，重建本金，重新出发。💪"):C||k?r.push("这次投资虽然亏损，但经验比金钱更重要。🌱"):x?r.push("基本持平，小幅优化就能扭亏为盈。📚"):h?r.push("小赚是不错的开始，继续优化。🐢"):w?r.push("不错的收益！保持并持续优化。🏆"):L&&r.push("卓越的表现！保持学习、控制风险。🌟"),r.join(`
`)}function Wt(t,e,n){const o={};t.stocks.forEach(k=>{o[k.code]=k});const i={},a={};let s=0,r=0,l=0,c=0;e.forEach(k=>{const x=o[k.code];if(!x)return;const h=k.weight/100;i[x.sector]=(i[x.sector]||0)+k.weight,a[x.market]=(a[x.market]||0)+k.weight,s+=x.revenueGrowth*h,r+=x.roe*h,l+=x.pe*h,x.marketCap>3e3&&c++});const d=e.length<=5?.7:e.length<=7?.4:.25,m=(i.科技||0)>40?.6+Math.random()*.2:.2+Math.random()*.3,p={totalReturn:n.totalReturn,annualizedReturn:n.annualizedReturn,annualizedVol:n.annualizedVol,maxDrawdown:n.maxDrawdown,sharpeRatio:n.sharpeRatio,sortinoRatio:n.sortinoRatio,informationRatio:n.informationRatio,calmarRatio:n.calmarRatio,profitLossRatio:n.profitLossRatio,winRate:n.winRate,fundRating:n.fundRating,ratingReasons:n.ratingReasons,riskLevel:n.riskLevel,leverage:n.leverage,sectorWeights:i,marketWeights:a,concentration:d,turnover:m,revenueGrowth:parseFloat(s.toFixed(1)),roe:parseFloat(r.toFixed(2)),pe:parseFloat(l.toFixed(2)),bluechipRatio:parseFloat((c/e.length).toFixed(2)),maxSectorWeight:parseFloat(Math.max(...Object.values(i)).toFixed(1)),stockCount:e.length,crossMarket:Object.keys(a).length>=2,marketCount:Object.keys(a).length};let g=null,S=0;for(const k of st)if(k.condition(p)){const x=k.id==="jiucai"?5:k.id==="global"?3:1;x>S&&(S=x,g=k)}g||(g=st.find(k=>k.id==="balanced")||st[st.length-1]);const D=ye(g,p,e,o),C={dimensions:["年化收益","风险控制","行业集中度","跨市场配置","选股ROE"],values:[Z(Math.min(100,Math.max(0,p.annualizedReturn+50)),0),Z(Math.min(100,Math.max(0,100-p.annualizedVol)),0),Z(Math.min(100,Math.max(0,p.maxSectorWeight)),0),Z(Math.min(100,Math.max(0,Object.keys(a).length*30)),0),Z(Math.min(100,Math.max(0,p.roe*1.5)),0)]};return{styleTag:`${g.emoji} ${g.name}`,matchPerson:g.matchPerson,matchPersonDesc:g.personDesc,matchPersonOrg:g.personOrg||"",styleId:g.id,metrics:p,radarData:C,commentary:D}}const xt=window.LLM_CONFIG||{},be=xt.debugMode||!1,gt=xt.eastmoney||{baseUrl:"https://dd-ai-api.eastmoney.com/v1",apiKey:"sk-dd",model:"gpt-4o-mini"},It=xt.geminiApiKey||"";let tt=null;function we(t){return tt=$e(t),tt}async function ke(){if(tt){const t=await tt;return tt=null,t}return null}async function $e(t){const e=Me(t),n=[];if(be){const[o,i]=await Promise.allSettled([Bt(e),Ct(e)]);o.status==="fulfilled"&&o.value&&n.push({model:"Eastmoney AI (gpt-4o-mini)",text:o.value}),i.status==="fulfilled"&&i.value&&n.push({model:"Google Gemini",text:i.value})}else{let o=await Bt(e);o?n.push({model:"Eastmoney AI",text:o}):(o=await Ct(e),o&&n.push({model:"Google Gemini",text:o}))}return n.length===0?null:n}function Me(t){const{styleTag:e,matchPerson:n,matchPersonDesc:o,matchPersonOrg:i,metrics:a}=t,s=Object.entries(a.sectorWeights||{}).map(([l,c])=>`${l}${c.toFixed(0)}%`).join("、"),r=Object.entries(a.marketWeights||{}).map(([l,c])=>`${{"a-share":"A股",hk:"港股",us:"美股",index:"指数ETF"}[l]||l}${c.toFixed(0)}%`).join("、");return`你是资深基金经理，点评以下投资组合（中文，150-200字，分段，用Markdown但不用标题）：

- 风格标签：${e}
- 对标人物：${n}（${o}${i?"，"+i:""}）
- 行业分布：${s}
- 市场分布：${r}
- 年化收益：${a.annualizedReturn}%
- 最大回撤：${a.maxDrawdown}%
- 夏普比率：${a.sharpeRatio}
- 杠杆：${a.leverage||1}x
- 持仓：${a.stockCount}只

要求：幽默风趣，用股民梗，先夸后吐槽，对标人物调侃，给建议，适度用emoji。`}async function Bt(t){var o,i,a,s;const e=new AbortController,n=setTimeout(()=>e.abort(),2e4);try{const r=await fetch(`${gt.baseUrl}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${gt.apiKey}`},body:JSON.stringify({model:gt.model,messages:[{role:"user",content:t}],max_tokens:500,temperature:.8}),signal:e.signal});if(!r.ok)throw new Error(`HTTP ${r.status}`);return((s=(a=(i=(o=(await r.json()).choices)==null?void 0:o[0])==null?void 0:i.message)==null?void 0:a.content)==null?void 0:s.trim())||null}catch(r){return console.warn("[LLM] Eastmoney:",r.message),null}finally{clearTimeout(n)}}async function Ct(t){var o,i,a,s,r,l;if(!It)return null;const e=new AbortController,n=setTimeout(()=>e.abort(),2e4);try{const c=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${It}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"你是资深基金经理，用中文回复。"+t}]}],generationConfig:{maxOutputTokens:500,temperature:.8}}),signal:e.signal});if(!c.ok)throw new Error(`HTTP ${c.status}`);return((l=(r=(s=(a=(i=(o=(await c.json()).candidates)==null?void 0:o[0])==null?void 0:i.content)==null?void 0:a.parts)==null?void 0:s[0])==null?void 0:r.text)==null?void 0:l.trim())||null}catch(c){return console.warn("[LLM] Gemini:",c.message),null}finally{clearTimeout(n)}}function Le(t){return t?t.replace(/\*\*(.+?)\*\*/g,'<strong class="text-neon-blue">$1</strong>').replace(/\*(.+?)\*/g,"<em>$1</em>").split(`

`).map(e=>e.trim()).filter(Boolean).map(e=>`<p style="margin-bottom:10px;line-height:1.8;">${e.replace(/\n/g,"<br>")}</p>`).join(""):""}const M={currentScreen:"builder",fundName:"",holdings:[],period:"1y",customMonths:18,backtestResults:null,stocksData:null,userResult:null,investAmount:1e5,leverage:1};let it=null,ht=null;function Ee(){const t=document.getElementById("particle-canvas");if(!t)return;const e=t.getContext("2d");let n=[];it&&(cancelAnimationFrame(it),it=null),ht&&window.removeEventListener("resize",ht);function o(){t.width=window.innerWidth,t.height=window.innerHeight}o(),ht=o,window.addEventListener("resize",o);class i{constructor(){this.reset()}reset(){this.x=Math.random()*t.width,this.y=Math.random()*t.height,this.size=Math.random()*2+.5,this.speedX=(Math.random()-.5)*.3,this.speedY=(Math.random()-.5)*.3,this.opacity=Math.random()*.5+.1}update(){this.x+=this.speedX,this.y+=this.speedY,(this.x<0||this.x>t.width||this.y<0||this.y>t.height)&&this.reset()}draw(){e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fillStyle=`rgba(79, 195, 247, ${this.opacity})`,e.fill()}}for(let s=0;s<80;s++)n.push(new i);function a(){e.clearRect(0,0,t.width,t.height),n.forEach(s=>{s.update(),s.draw()});for(let s=0;s<n.length;s++)for(let r=s+1;r<n.length;r++){const l=n[s].x-n[r].x,c=n[s].y-n[r].y,d=Math.sqrt(l*l+c*c);d<120&&(e.beginPath(),e.moveTo(n[s].x,n[s].y),e.lineTo(n[r].x,n[r].y),e.strokeStyle=`rgba(79, 195, 247, ${.08*(1-d/120)})`,e.lineWidth=.5,e.stroke())}it=requestAnimationFrame(a)}a()}function vt(t){ee(),document.querySelectorAll(".screen").forEach(o=>o.classList.remove("active","hidden")),document.querySelectorAll(".screen").forEach(o=>o.classList.add("hidden"));const e=document.getElementById(`screen-${t}`);e&&(e.classList.remove("hidden"),e.classList.add("active"),e.scrollIntoView({behavior:"smooth",block:"start"})),M.currentScreen=t;const n=document.getElementById("header");n&&(n.style.display=t==="builder"?"":"none")}async function Gt(){try{const e=await fetch("./"+"stocks.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);const n=await e.json();return n.stocks.forEach(o=>{o.latestPrice=o.prices[o.prices.length-1]}),M.stocksData=n,M.stocksData}catch(t){return console.error("Failed to load stocks:",t),null}}async function Re(){var e,n,o,i;const t=document.getElementById("btn-start");t.disabled=!0,t.textContent="⏳ 回测计算中...";try{const a=qt(),s=re();let r=parseFloat((e=document.getElementById("invest-amount"))==null?void 0:e.value)||1e5;r=Math.max(100,Math.min(1e8,r));const l=parseFloat((n=document.getElementById("leverage"))==null?void 0:n.value)||1;let c=M.fundName||((i=(o=document.getElementById("fund-name"))==null?void 0:o.value)==null?void 0:i.trim());c||(c=Ie(a,M.stocksData)),M.stocksData||await Gt();const d=Nt(M.stocksData,a,s);d.label=c,d.amount=r,d.leverage=l,M.userResult=d,M.holdings=a,M.investAmount=r,M.leverage=l;const u=pe(M.stocksData,s),m=[d,...u];m.sort((S,D)=>D.totalReturn-S.totalReturn),m.forEach((S,D)=>{S.rank=D+1}),M.backtestResults=m,vt("arena"),le({fundName:c,period:s,results:m,amount:r,leverage:l});const p={...d,totalReturn:d.totalReturn*l,maxDrawdown:d.maxDrawdown*l},g=Wt(M.stocksData,a,p);g.metrics.leverage=l,we(g)}catch(a){Ce("回测失败："+a.message,"error"),t.disabled=!1,t.textContent="⚡ 开始挑战"}}async function Se(){vt("diagnosis");const t={...M.userResult,totalReturn:M.userResult.totalReturn*M.leverage,maxDrawdown:M.userResult.maxDrawdown*M.leverage},e=Wt(M.stocksData,M.holdings,t);e.metrics.leverage=M.leverage;const n=await ke();n&&n.length>0&&(e.aiResults=n.map(o=>({model:o.model,html:Le(o.text)}))),me(e)}function De(){M.fundName="",M.holdings=[],M.backtestResults=null,M.userResult=null,document.getElementById("fund-name").value="",document.getElementById("btn-start").disabled=!0,vt("builder"),Ot()}function Ie(t,e){var $;if(!t||t.length===0)return"我的基金";const n={};e&&e.stocks&&e.stocks.forEach(v=>{n[v.code]=v});const o={},i={};let a=!1,s=!1,r=!1,l=!1;t.forEach(v=>{const y=n[v.code];y&&(o[y.market]=(o[y.market]||0)+v.weight,i[y.sector]=(i[y.sector]||0)+v.weight,y.sector==="科技"&&(a=!0),y.sector==="金融"&&(s=!0),y.sector==="消费"&&(r=!0),y.sector==="医药"&&(l=!0))});const c=Object.entries(o).sort((v,y)=>y[1]-v[1]),d=(($=c[0])==null?void 0:$[0])||"a-share",u=c.length,m={"a-share":["华夏","国泰","南方","易方达","嘉实","博时","广发","富国"],hk:["港股","香港","恒生","中港","沪港深"],us:["纳斯达克","标普","美股","全球","海外"],index:["指数","ETF","被动"]};let p;u>=3?p=["全球","国际","环球","世界","跨市场"]:u===2?p=["沪港深","深港通","AH","中美","跨市场"]:p=m[d]||m["a-share"];let g=[];a&&t.length<=3?g=["创新","科技","成长","新兴","前沿","智能"]:s&&t.length<=3?g=["金融","价值","蓝筹","红利","稳健","精选"]:r&&t.length<=3?g=["消费","品质","生活","品牌","升级"]:l&&t.length<=3?g=["健康","医疗","生命","医药","生物"]:t.length>=8?g=["优选","精选","配置","均衡","多元","全能"]:t.length<=3?g=["聚焦","集中","核心","龙头","精选","优势"]:g=["成长","价值","均衡","轮动","趋势","精选","优选","灵活"];const S=["混合","股票","配置","优选","精选","成长","价值","稳健","进取","灵活"],D=p[Math.floor(Math.random()*p.length)],C=g[Math.floor(Math.random()*g.length)],k=S[Math.floor(Math.random()*S.length)],x=[D+C+k,D+k+C,C+k,D+C],h=x[Math.floor(Math.random()*x.length)],w=["超级","至尊","王者","巅峰","传奇","无敌","神级","霸道"];return w[Math.floor(Math.random()*w.length)]+h+"（您）"}async function Be(){Ee(),await Gt(),Ot();const t=document.getElementById("invest-amount");t&&(t.addEventListener("input",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value&&parseInt(n.target.value)!==o&&(n.target.value=o)}),t.addEventListener("blur",n=>{let o=parseInt(n.target.value)||1e5;o=Math.max(100,Math.min(1e8,o)),n.target.value=o})),document.getElementById("btn-start").addEventListener("click",Re),document.getElementById("btn-diagnosis").addEventListener("click",Se),document.getElementById("btn-restart").addEventListener("click",De),document.getElementById("fund-name").addEventListener("input",n=>{M.fundName=n.target.value.trim(),G()});const e=document.getElementById("leverage");e&&e.addEventListener("input",()=>{document.getElementById("leverage-display").textContent=e.value+"x"})}Be();let ft=null;function Ce(t,e="info"){const n=document.getElementById("toast-msg");n&&n.remove(),ft&&clearTimeout(ft);const o=e==="error"?"bg-red-500/90":"bg-green-500/90",i=document.createElement("div");i.id="toast-msg",i.className=`fixed top-4 left-1/2 -translate-x-1/2 ${o} text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm`,i.textContent=t,document.body.appendChild(i),ft=setTimeout(()=>{i.style.opacity="0",i.style.transition="opacity .3s",setTimeout(()=>i.remove(),300)},3e3)}function G(){const t=document.getElementById("btn-start");t&&(t.disabled=qt().length<1)}

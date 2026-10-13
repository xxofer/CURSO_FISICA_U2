/* Interfaz de la Unidad 2. El dibujo se hace en el navegador; C, Q y U se calculan en Python (ver app.py y fisica.py). */
const $=i=>document.getElementById(i),K=8.99,E0=8.854e-12;
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const eng=(x,u)=>{if(!isFinite(x))return'—';if(x===0)return'0 '+u;const p=[[1e-12,'p'],[1e-9,'n'],[1e-6,'µ'],[1e-3,'m'],[1,''],[1e3,'k'],[1e6,'M'],[1e9,'G']];let a=Math.abs(x),c=p[0];for(const q of p)if(a>=q[0])c=q;return(+(x/c[0]).toPrecision(4))+' '+c[1]+u};
const num=(x,d=3)=>(+x.toFixed(d)).toString().replace('.',',');
const outs=(id,a)=>$(id).innerHTML=a.map(([l,v])=>`<div><span>${l}</span><strong>${v}</strong></div>`).join('');
/* Tabs */
const upd={t4:()=>cap(),t5:()=>en()};
function show(id){document.querySelectorAll('section').forEach(s=>s.hidden=s.id!==id);document.querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-selected',b.dataset.t===id));upd[id]()}
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>show(b.dataset.t));

/* Unidad 2: capacitores */
const cc=$('cc'),k2=cc.getContext('2d');const post=async(u,b)=>{try{const r=await fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});if(!r.ok)return null;return await r.json()}catch(e){return null}};
let Cs=0;
async function cap(){const a=+$('sa').value,dd=+$('sd').value,k=+$('sk').value;$('sal').textContent=a+' cm²';$('sdl').textContent=num(dd/10,1)+' mm';
 const r=await post('/api/capacitancia',{A_cm2:a,d_mm:dd/10,kappa:k});
 if(!r)return;Cs=r.C;
 const ink=css('--ink'),pos=css('--pos'),neg=css('--neg');
 const w=60+300*Math.sqrt(+$('sa').value/500),gp=10+.8*$('sd').value,cx=320,cy=150,top=cy-gp/2,bot=cy+gp/2;
 k2.fillStyle=css('--panel');k2.fillRect(0,0,640,300);
 if(k>1){k2.fillStyle=css('--acc');k2.globalAlpha=Math.min(.55,.12+Math.log10(k)*.25);k2.fillRect(cx-w/2,top,w,gp);k2.globalAlpha=1}
 k2.fillStyle=ink;k2.fillRect(cx-w/2,top-8,w,8);k2.fillRect(cx-w/2,bot,w,8);
 const n=Math.min(24,4+Math.round(3*Math.log10(1+Cs*1e12)));k2.font='bold 14px system-ui';k2.textAlign='center';
 for(let i=0;i<n;i++){const x=cx-w/2+(i+.5)*w/n;k2.fillStyle=pos;k2.fillText('+',x,top-14);k2.fillStyle=neg;k2.fillText('−',x,bot+24);
  k2.strokeStyle=ink;k2.globalAlpha=.5;k2.beginPath();k2.moveTo(x,top+3);k2.lineTo(x,bot-3);k2.moveTo(x-3,bot-8);k2.lineTo(x,bot-3);k2.lineTo(x+3,bot-8);k2.stroke();k2.globalAlpha=1}
 k2.fillStyle=css('--mut');k2.font='13px system-ui';k2.textAlign='left';k2.fillText('d = '+num($('sd').value/10,1)+' mm',cx+w/2+12,cy+4);k2.textAlign='center';k2.fillText('A = '+$('sa').value+' cm²',cx,bot+52);
 outs('cco',[['Capacitancia C',eng(r.C,'F')],['C en vacío',eng(r.C0,'F')],['Factor C/C₀',num(r.factor,4)+'×'],['Carga a 12 V',eng(r.Q12,'C')]])}
['sa','sd','sk'].forEach(i=>$(i).oninput=cap);
$('toE').onclick=()=>{let u=[[1e-3,'1e-3'],[1e-6,'1e-6'],[1e-9,'1e-9'],[1e-12,'1e-12']].find(p=>Cs>=p[0]*.999)||[1e-12,'1e-12'];$('eu').value=u[1];$('ec').value=+(Cs/u[0]).toPrecision(5);show('t5')};

/* Unidad 2: energía */
const ce=$('ce'),e2=ce.getContext('2d');
async function en(){const C=+$('ec').value*+$('eu').value,V=+$('ev').value;
 const r=await post('/api/energia',{C,V});
 if(!r){outs('eo',[['Aviso','Ingresa una capacitancia mayor que 0 y un voltaje válido.']]);return}
 outs('eo',[['Carga Q = C·V',eng(r.Q,'C')],['U = ½·C·V²',eng(r.U1,'J')],['U = ½·Q·V',eng(r.U2,'J')],['U = Q²/(2C)',eng(r.U3,'J')],['U a doble voltaje',eng(r.U_doble,'J')]]);
 const w=640,h=240,m=48,Vm=r.Vmax,Um=Math.max(r.curva.U[r.curva.U.length-1],1e-30),U1=r.U1,X=v=>m+v/Vm*(w-m-16),Y=u=>h-30-u/Um*(h-50),ink=css('--ink'),mu=css('--mut');
 e2.fillStyle=css('--panel');e2.fillRect(0,0,w,h);e2.strokeStyle=css('--line');e2.beginPath();e2.moveTo(m,10);e2.lineTo(m,h-30);e2.lineTo(w-10,h-30);e2.stroke();
 e2.strokeStyle=css('--acc');e2.lineWidth=2.5;e2.beginPath();r.curva.V.forEach((v,i)=>e2[i?'lineTo':'moveTo'](X(v),Y(r.curva.U[i])));e2.stroke();
 e2.fillStyle=css('--pos');e2.beginPath();e2.arc(X(Math.abs(V)),Y(U1),6,0,7);e2.fill();
 e2.fillStyle=mu;e2.font='12px system-ui';e2.textAlign='center';e2.fillText('Voltaje (0 a '+eng(Vm,'V')+')',w/2,h-8);e2.save();e2.translate(14,h/2);e2.rotate(-Math.PI/2);e2.fillText('Energía U (máx '+eng(Um,'J')+')',0,0);e2.restore()}
['ec','eu','ev'].forEach(i=>$(i).oninput=en);
show('t4');

export default `{function JSONCrush(e){let t=[];for(let e=127;--e;)(e>=48&&e<=57||e>=65&&e<=90||e>=97&&e<=122||"-_.!~*'()".includes(String.fromCharCode(e)))&&t.push(String.fromCharCode(e));for(let e=32;e<255;++e){let r=String.fromCharCode(e);"\\"==r||t.includes(r)||t.unshift(r)}const r=((e,t)=>{let r=t.length,n="";const i=e=>encodeURI(encodeURIComponent(e)).replace(/%../g,"i").length,l=e=>{let t=e.charCodeAt(0),r=e.charCodeAt(e.length-1);return t>=56320&&t<=57343||r>=55296&&r<=56319};let a={};for(let t=2;t<50;t++)for(let r=0;r<e.length-t;++r){let n=e.substr(r,t);if(a[n])continue;if(l(n))continue;let i=1;for(let l=e.indexOf(n,r+t);l>=0;++i)l=e.indexOf(n,l+t);i>1&&(a[n]=i)}for(;;){for(;r--&&e.includes(t[r]););if(r<0)break;let l,o=t[r],s=0,p=i(o);for(let e in a){let t=a[e],r=(t-1)*i(e)-(t+1)*p;n.length||(r-=i("")),r<=0?delete a[e]:r>s&&(l=e,s=r)}if(!l)break;e=e.split(l).join(o)+o+l,n=o+n;let c={};for(let t in a){let r=t.split(l).join(o),n=0;for(let t=e.indexOf(r);t>=0;++n)t=e.indexOf(r,t+r.length);n>1&&(c[r]=n)}a=c}return{a:e,b:n}})(e=JSONCrushSwap(e=e.replace(new RegExp("","g"),"")),t);let n=r.a;return r.b.length&&(n+=""+r.b),encodeURIComponent(n)}function JSONCrushSwap(e,t=1){const r=[['"',"'"],["':","!"],[",'","~"],["}",")","\\","\\"],["{","(","\\","\\"]],n=(e,t)=>{let r=new RegExp((t[2]?t[2]:"")+t[0]+"|"+(t[3]?t[3]:"")+t[1],"g");return e.replace(r,e=>e===t[0]?t[1]:t[0])};if(t)for(let t=0;t<r.length;++t)e=n(e,r[t]);else for(let t=r.length;t--;)e=n(e,r[t]);return e}const{slot:e,ship:t,deck:r,airunit:n}=temp1.model,i=e=>[...Array(e)].map((e,t)=>t),l=t=>{if(!e._map[t])return;const{mstID:r,level:n,skillLevel:i}=e._map[t];return{masterId:r,improvement:n||void 0,proficiency:[0,10,25,40,55,70,85,100][i]||void 0}},a=e=>{if(!t._map[e])return;const{_o:r,gradeUpLuck:n,gradeUpTaikyu:a,gradeUpTaisen:o}=t._map[e],s=i(r.api_slotnum).map(e=>l(r.api_slot[e])),p=l(r.api_slot_ex);let c;return p&&s.push(p),(n||a||o)&&(c={hp:a,asw:o,luck:n}),{masterId:r.api_ship_id,level:r.api_lv,equipments:s,increased:c}},o=e=>{const t=r._map[e+1];return{ships:t?t._o.api_ship.map(a):[]}},s=Math.max(...Object.keys(n._dic)),p=n._dic[s],c=e=>p&&p[e]?{equipments:p[e].squadrons.map(e=>l(e.mem_id))}:{equipments:[]},u=new URL("https://kcjervis.github.io/jervis"),d=JSONCrush(JSON.stringify({name:r._map[1].name,side:"Player",fleetType:["Single","CarrierTaskForce","SurfaceTaskForce","TransportEscort"][r.combined.type],fleets:i(4).map(o),landBase:i(3).map(c)}));u.searchParams.set("crushed",d),open(u.href)}`.replace(
  /\\/g,
  "\\\\"
)

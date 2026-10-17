(function(){
const form=document.getElementById('quote-form'),pkg=document.getElementById('package'),vehicle=document.getElementById('vehicle'),details=document.getElementById('quote-details');
const vehicles={sedan:{name:'Sedan',price:125,size:0},midsize:{name:'Mid-size SUV',price:150,size:1},fullsize:{name:'Full-size SUV',price:175,size:2}};
const extras={headlights:{name:'Headlight polishing',min:50,max:50},carpet:{name:'Full carpet shampoo',min:50,max:75},seats:{name:'Full seat shampoo',min:50,max:50}};
const result=document.getElementById('quote-result');
let previousQuote='';
result.addEventListener('animationend',function(event){if(event.target===result&&event.animationName==='quote-renew')result.classList.remove('quote-refresh');});
function update(){
const v=vehicles[vehicle.value];
const adjusted=Object.fromEntries(Object.entries(extras).map(([id,x])=>[id,{...x,min:x.min+v.size*25,max:x.max+v.size*25}]));
Object.entries(adjusted).forEach(([id,x])=>{document.getElementById('label-'+id).textContent=x.name+' · $'+x.min+(x.max!==x.min?'–$'+x.max:'');});
const chosen=Array.from(form.querySelectorAll('input:checked')).map(el=>adjusted[el.value]);
const low=chosen.reduce((n,x)=>n+x.min,v.price),high=chosen.reduce((n,x)=>n+x.max,v.price);
const list=chosen.map(x=>'<li>'+x.name+': $'+x.min+(x.max!==x.min?'–$'+x.max:'')+'</li>').join('');
if(pkg.value==='disaster'){
details.innerHTML='<div class="price" style="font-size:29px">Personal estimate required</div><p>Disaster Detail · '+v.name+'</p><p>Call or arrange an in-person estimate. Standard package starting prices do not apply.</p>'+(list?'<p>Requested extras to discuss (not a total):</p><ul>'+list+'</ul>':'');
}else{
details.innerHTML='<div class="price"><small>Starting-price guide</small>$'+low+(low!==high?'–$'+high:'')+'</div><p><strong>Standard Interior · '+v.name+'</strong><br>Full deep clean with spot shampoo.</p><ul><li>Package starting price: $'+v.price+'</li>'+list+'</ul>';
}
const nextQuote=details.innerHTML;
if(previousQuote && previousQuote!==nextQuote && document.documentElement.dataset.motion!=='off'){
result.classList.remove('quote-refresh');
void result.offsetWidth;
result.classList.add('quote-refresh');
}
previousQuote=nextQuote;
}
form.addEventListener('change',update);
form.addEventListener('submit',function(e){e.preventDefault();});
document.querySelectorAll('.package-choice').forEach(a=>a.addEventListener('click',function(){pkg.value='standard';vehicle.value=a.dataset.vehicle;update();}));
update();
})();

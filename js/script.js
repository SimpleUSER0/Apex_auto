'use strict';
document.documentElement.classList.add('js');
const $=selector=>document.querySelector(selector),$$=selector=>[...document.querySelectorAll(selector)];
const menu=$('#primary-nav'),toggle=$('.menu-toggle');
function closeMenu(restore=false){menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','მენიუს გახსნა');if(restore)toggle.focus();}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';menu.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'მენიუს დახურვა':'მენიუს გახსნა');});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true')closeMenu(true);});
matchMedia('(min-width:1200px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const openers=new WeakMap();
function openDialog(dialog,opener){closeMenu();openers.set(dialog,opener||document.activeElement);dialog.showModal();document.body.classList.add('is-locked');}
$$('dialog').forEach(dialog=>{
 dialog.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
 dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
 dialog.addEventListener('close',()=>{document.body.classList.remove('is-locked');const opener=openers.get(dialog);if(opener?.isConnected)opener.focus({preventScroll:true});});
});
const booking=$('#booking-dialog'),form=$('#booking-form'),success=$('.form-success'),error=$('.field-error');
function today(){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tbilisi',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day;}
function clearBooking(){form.reset();form.querySelectorAll('input,select,textarea').forEach(el=>el.setCustomValidity(''));error.textContent='';form.hidden=false;success.hidden=true;form.elements.date.min=today();}
clearBooking();
$$('[data-book]').forEach(button=>button.addEventListener('click',()=>{clearBooking();form.elements.service.value=button.dataset.book||'';openDialog(booking,button);}));
booking.addEventListener('close',clearBooking);
form.querySelectorAll('input,select,textarea').forEach(el=>{el.addEventListener('input',()=>{el.setCustomValidity('');error.textContent='';});el.addEventListener('change',()=>{el.setCustomValidity('');error.textContent='';});});
function invalid(field,text){field.setCustomValidity(text);error.textContent=text;field.reportValidity();field.focus();return false;}
form.addEventListener('submit',event=>{
 event.preventDefault();form.querySelectorAll('input,select,textarea').forEach(el=>el.setCustomValidity(''));error.textContent='';
 const name=form.elements.name,phone=form.elements.phone,service=form.elements.service,date=form.elements.date;
 if(!name.value.trim())return invalid(name,'გთხოვ, მიუთითე შენი სახელი.');
 const digits=phone.value.replace(/\D/g,'');if(!/^[+()\d\s-]+$/.test(phone.value)||digits.length<7||digits.length>15)return invalid(phone,'გთხოვ, მიუთითე ტელეფონის ნომერი 7–15 ციფრით.');
 if(!service.value)return invalid(service,'აირჩიე სასურველი მომსახურება.');
 const selected=date.value,minDate=today();date.min=minDate;
 if(!selected||date.validity.badInput||selected<minDate)return invalid(date,'შეარჩიე დღევანდელი ან მომავალი თარიღი.');
 form.reset();form.hidden=true;success.hidden=false;success.focus();
 // Demo only: no fetch, email, WhatsApp, localStorage or real reservation.
});
const placeholderCopy={
 phone:'დასაზუსტებელია: რეალური ბიზნესის ტელეფონი. ეს დემო ღილაკია — ზარი არ განხორციელდება.',
 whatsapp:'დასაზუსტებელია: რეალური ბიზნესის WhatsApp-ის ნომერი. ეს დემო ღილაკია — ჩატი არ გაიხსნება და შეტყობინება არ გაიგზავნება.',
 maps:'დასაზუსტებელია: რეალური ბიზნესის მისამართი და Google Maps-ის ბმული. დემო რუკა კონკრეტულ ადგილს არ ასახავს.',
 instagram:'დასაზუსტებელია: რეალური ბიზნესის Instagram-ის ოფიციალური გვერდი. ანგარიშის ბმული დემოში არ არის მითითებული.',
 facebook:'დასაზუსტებელია: რეალური ბიზნესის Facebook-ის ოფიციალური გვერდი. ანგარიშის ბმული დემოში არ არის მითითებული.'
};
$$('[data-placeholder]').forEach(button=>button.addEventListener('click',()=>{$('#info-description').textContent=placeholderCopy[button.dataset.placeholder];openDialog($('#info-dialog'),button);}));
const range=$('#compare-range');
function updateComparison(){$('.comparison').style.setProperty('--split',range.value+'%');$('#compare-value').textContent=range.value+'%';range.setAttribute('aria-valuetext',range.value+' პროცენტი');}
range.addEventListener('input',updateComparison);
const compareImage=$('.comparison-images');
function moveDivider(event){const rect=compareImage.getBoundingClientRect();range.value=String(Math.round(Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100))));updateComparison();}
compareImage.addEventListener('pointerdown',event=>{if(event.button!==0)return;compareImage.setPointerCapture(event.pointerId);moveDivider(event);});
compareImage.addEventListener('pointermove',event=>{if(compareImage.hasPointerCapture(event.pointerId))moveDivider(event);});
compareImage.addEventListener('pointerup',event=>{if(compareImage.hasPointerCapture(event.pointerId))compareImage.releasePointerCapture(event.pointerId);});
const gallery=$$('[data-gallery]'),lightbox=$('#lightbox');let current=0;
function showPhoto(index){current=(index+gallery.length)%gallery.length;const item=gallery[current];$('#lightbox-image').src=item.href;$('#lightbox-image').alt=item.querySelector('img').alt;$('#lightbox-caption').textContent=item.dataset.caption;$('#lightbox-count').textContent=(current+1)+' / '+gallery.length;}
gallery.forEach((item,index)=>item.addEventListener('click',event=>{event.preventDefault();showPhoto(index);openDialog(lightbox,item);}));
$('#photo-prev').addEventListener('click',()=>showPhoto(current-1));$('#photo-next').addEventListener('click',()=>showPhoto(current+1));
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showPhoto(current+(event.key==='ArrowRight'?1:-1));}});
let startX=0,startY=0;const photo=$('#lightbox-image');photo.addEventListener('touchstart',event=>{startX=event.changedTouches[0].clientX;startY=event.changedTouches[0].clientY;},{passive:true});photo.addEventListener('touchend',event=>{const dx=event.changedTouches[0].clientX-startX,dy=event.changedTouches[0].clientY-startY;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))showPhoto(current+(dx<0?1:-1));},{passive:true});
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){document.documentElement.classList.add('motion-enabled');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)menu.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}),{rootMargin:'-15% 0px -65% 0px'});$$('main>section[id]').forEach(el=>observer.observe(el));}
$('#year').textContent=new Date().getFullYear();

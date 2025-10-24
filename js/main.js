// Minimal helpers shared by partner pages

// Calendar demo (time slots + capacity)
export function initCalendar(opts = {}) {
  const calGrid = document.getElementById('calGrid');
  const slotList = document.getElementById('slotList');
  const monthSel = document.getElementById('monthSel');
  const yearSel = document.getElementById('yearSel');
  const saveSlotBtn = document.getElementById('saveSlot');
  const addSlotBtn = document.getElementById('addSlotBtn');
  const blockDayBtn = document.getElementById('blockDay');
  const slotStart = document.getElementById('slotStart');
  const slotEnd = document.getElementById('slotEnd');
  const slotCap = document.getElementById('slotCap');

  if (!calGrid) return;

  const now = new Date();
  let state = { year: now.getFullYear(), month: now.getMonth(), slots:{} };
  let selectedKey = null;

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  months.forEach((m,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=m; monthSel.appendChild(o); });
  for(let y=state.year-1; y<=state.year+1; y++){ const o=document.createElement('option'); o.value=y; o.textContent=y; yearSel.appendChild(o); }
  monthSel.value = state.month; yearSel.value = state.year;

  function renderCalendar(){
    calGrid.innerHTML='';
    const first = new Date(state.year, state.month, 1);
    const offset = (first.getDay()+6)%7; // Monday=0
    const days = new Date(state.year, state.month+1, 0).getDate();
    for(let i=0;i<offset;i++){ calGrid.appendChild(document.createElement('div')); }
    for(let d=1; d<=days; d++){
      const key = `${state.year}-${String(state.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const day = document.createElement('div'); day.className='day'; day.dataset.key=key;
      const head = document.createElement('div'); head.className='d'; head.textContent=d; day.appendChild(head);
      const items = state.slots[key]||[];
      items.forEach(s=>{
        const row = document.createElement('div'); row.className='slot';
        row.innerHTML = `<span>${s.start}–${s.end}</span><span class="cap">${s.cap}</span>`;
        const del = document.createElement('button'); del.textContent='×';
        del.onclick=(e)=>{ e.stopPropagation(); state.slots[key]=items.filter(x=>x!==s); renderCalendar(); if(selectedKey===key) renderSlotList(key); };
        row.appendChild(del); day.appendChild(row);
      });
      day.onclick=()=>{ selectedKey=key; renderSlotList(key); };
      calGrid.appendChild(day);
    }
  }

  function renderSlotList(key){
    const items = state.slots[key]||[];
    if(items.length===0){
      slotList.textContent=`No time slots added for ${key}.`;
    } else {
      slotList.innerHTML = `<strong>${key}</strong>` + items.map(s=>`<div class="slot"><span>${s.start}–${s.end}</span><span class="cap">${s.cap}</span></div>`).join('');
    }
  }

  saveSlotBtn.onclick=()=>{
    if(!selectedKey){ alert('Select a calendar date first.'); return; }
    if(!slotStart.value || !slotEnd.value || !slotCap.value){ alert('Enter start, end and max bookings.'); return; }
    state.slots[selectedKey]=state.slots[selectedKey]||[];
    state.slots[selectedKey].push({start:slotStart.value,end:slotEnd.value,cap:slotCap.value});
    slotStart.value=''; slotEnd.value=''; slotCap.value='';
    renderCalendar(); renderSlotList(selectedKey);
  };
  addSlotBtn.onclick=()=>{ alert('Select a date, enter start/end and capacity, then click “Save slot”.'); };
  blockDayBtn.onclick=()=>{ if(!selectedKey){ alert('Select a date to block.'); return; } state.slots[selectedKey]=[]; renderCalendar(); renderSlotList(selectedKey); };
  monthSel.onchange=()=>{ state.month=+monthSel.value; renderCalendar(); };
  yearSel.onchange=()=>{ state.year=+yearSel.value; renderCalendar(); };

  renderCalendar();
}

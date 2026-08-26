document.addEventListener("DOMContentLoaded",()=>{
  "use strict";
  const grid=document.querySelector("#resource-grid");
  if(!grid)return;
  const search=document.querySelector("#resource-search");
  const category=document.querySelector("#resource-category");
  const chips=[...document.querySelectorAll(".filter-chip")];
  const empty=document.querySelector("#resource-empty");
  const emptyCohort=document.querySelector("#resource-empty-cohort");
  const modal=document.querySelector("#preview-modal");
  const frame=document.querySelector("#preview-frame");
  const title=document.querySelector("#preview-title");
  const open=document.querySelector("#preview-open");
  const close=document.querySelector("#preview-close");
  const resources=Array.isArray(window.CCIRC_RESOURCES)?window.CCIRC_RESOURCES:[];
  let currentCohort="all";
  let timer=null;
  let lastFocused=null;
  let savedScrollY=0;
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const previewUrl=url=>{try{const u=new URL(url);u.searchParams.set("type","view");return u.toString()}catch{return url}};
  const labels={"1st":"第一屆","2nd":"第二屆","3rd":"第三屆"};

  function render(){
    const q=(search?.value||"").trim().toLowerCase();
    const list=resources.filter(x=>(!q||`${x.title||""} ${x.category||""} ${x.desc||""}`.toLowerCase().includes(q))&&(currentCohort==="all"||x.cohort===currentCohort)&&(!category||category.value==="all"||x.category===category.value));
    grid.innerHTML=list.map(x=>{
      const index=resources.indexOf(x);
      return `<article class="card resource-card"><div class="tags"><span class="tag">${labels[x.cohort]||esc(x.cohort)||"未分類"}</span><span class="tag">${esc(x.category||"教材")}</span></div><h3>${esc(x.title||"未命名筆記")}</h3><p>${esc(x.desc||"")}</p><div class="actions"><button class="small-btn primary preview-btn" type="button" data-index="${index}">預覽筆記</button><a class="small-btn" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">開啟 HackMD ↗</a></div></article>`;
    }).join("");
    const cohortIsEmptyByData=currentCohort!=="all"&&!resources.some(x=>x.cohort===currentCohort);
    if(empty)empty.hidden=!(list.length===0&&!cohortIsEmptyByData);
    if(emptyCohort)emptyCohort.hidden=!cohortIsEmptyByData;
    grid.querySelectorAll(".preview-btn").forEach(btn=>btn.addEventListener("click",()=>openPreview(resources[Number(btn.dataset.index)])));
  }

  function openPreview(item){
    if(!item||!modal||!frame)return;
    lastFocused=document.activeElement;
    savedScrollY=window.scrollY;
    title.textContent=item.title||"HackMD 筆記預覽";
    open.href=item.url||"#";
    frame.title=`HackMD 筆記預覽：${item.title||""}`;
    delete frame.dataset.loaded;
    clearFallback();
    if(timer)clearTimeout(timer);
    document.body.classList.add("modal-is-open");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    frame.src="about:blank";
    requestAnimationFrame(()=>{frame.src=previewUrl(item.url)});
    timer=setTimeout(()=>{if(modal.classList.contains("open")&&!frame.dataset.loaded)showFallback()},12000);
    window.requestAnimationFrame(()=>close?.focus({preventScroll:true}));
  }
  function clearFallback(){modal?.querySelector(".preview-fallback")?.remove()}
  function showFallback(){
    if(!modal||modal.querySelector(".preview-fallback"))return;
    const fallback=document.createElement("div");
    fallback.className="preview-fallback";
    fallback.innerHTML="<strong>筆記預覽載入較慢</strong><span>如果 HackMD 尚未完成載入，可以直接開啟完整筆記閱讀。</span>";
    modal.querySelector(".modal-box")?.insertBefore(fallback,modal.querySelector(".modal-foot"));
  }
  function closePreview(){
    if(!modal)return;
    if(timer)clearTimeout(timer);
    clearFallback();
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-is-open");
    frame.src="about:blank";
    if(Math.abs(window.scrollY-savedScrollY)>1)window.scrollTo(0,savedScrollY);
    if(lastFocused&&typeof lastFocused.focus==="function")lastFocused.focus({preventScroll:true});
    lastFocused=null;
  }
  frame?.addEventListener("load",()=>{frame.dataset.loaded="true";if(timer)clearTimeout(timer);clearFallback()});
  [search,category].filter(Boolean).forEach(el=>el.addEventListener(el.tagName==="INPUT"?"input":"change",render));
  chips.forEach(chip=>chip.addEventListener("click",()=>{
    chips.forEach(c=>c.classList.remove("active"));
    chip.classList.add("active");
    currentCohort=chip.dataset.cohort||"all";
    render();
  }));
  close?.addEventListener("click",closePreview);
  modal?.addEventListener("click",e=>{if(e.target===modal)closePreview()});
  modal?.addEventListener("wheel",e=>{if(e.target===modal)e.preventDefault()},{passive:false});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal?.classList.contains("open")){e.preventDefault();closePreview()}});
  render();
});


(function () {
  const css = document.createElement('style');
  css.textContent = '.b-toc .toc-cont .tc-t{text-align:center;font-weight:700;font-size:1.25em;padding-top:29px;margin:0 0 15px}.b-toc .toc-cont .toc-h{margin-bottom:0}';
  document.head.appendChild(css);
  const _tu = tblUnsplit;
  tblUnsplit = function () { $$('#flow .toc-cont').forEach(x => x.remove()); return _tu.apply(this, arguments); };
  const NAME = { '': 'สารบัญ', tbl: 'สารบัญตาราง', fig: 'สารบัญรูปภาพ' };
  window.tocSplit = function (el) {
    $$('.toc-cont', el).forEach(x => x.remove());
    const flow = $('#flow'), fr = flow.getBoundingClientRect(), z = (fr.height / flow.offsetHeight) || 1, P = PAGE_H + PAGE_G;
    const b = byId(el.dataset.id), k = doc.blocks.indexOf(b), pv = doc.blocks[k - 1];
    const pt = pv && pv.t === 'pjch' ? plainText(pv.title || '').trim() : '';
    const ttl = (/^สารบัญ/.test(pt) ? pt : NAME[(b && b.kind) || '']) + ' (ต่อ)';
    const hd = $('.toc-h', el), head = hd ? hd.innerHTML : '<span>เรื่อง</span><span>หน้า</span>';
    $$('.toc-r', el).forEach(r => {
      const rc = r.getBoundingClientRect(), y = (rc.top - fr.top) / z, h = rc.height / z, p = Math.floor(y / P), re = p * P + PAGE_H - BOT;
      if (y + h <= re) return;
      const c = document.createElement('div'); c.className = 'toc-cont'; c.contentEditable = 'false';
      c.innerHTML = '<div class="tc-t">' + esc(ttl) + '</div><div class="toc-h">' + head + '</div>';
      c.style.marginTop = Math.max(0, (p + 1) * P + TOP - y) + 'px';
      r.parentNode.insertBefore(c, r);
    });
  };
})();

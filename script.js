const $ = i => document.getElementById(i);
let arr = [5, 2, 9, 1, 7, 3, 8], steps = [], idx = 0, timer = null, algo = 'selection';
const INFO = {
    selection: ['Selection Sort', 'Darek pass ma baaki rahela bhaag maathi sauthi nano number shodhi ne aagal ni jagya e swap kare chhe.', 'Time O(n²), swap ochha (max n-1)'],
    bubble: ['Bubble Sort', 'Aajubaaju na be number sarkhave chhe; jo moda hoy to swap. Darek pass ma sauthi moto number chhelle pahonche chhe.', 'Time O(n²), best case O(n) (already sorted)'],
    insertion: ['Insertion Sort', 'Jem patta ramta vakhate hath ma patta goThavo chho: darek navo number sorted bhaag ma yogya jagya e goThavay chhe.', 'Time O(n²), nana ke lagbhag sorted array mate saru'],
    merge: ['Merge Sort', 'Array ne vahenchi ne nana bhaag banave chhe, pachhi be sorted bhaag ne bhegi ne mergeri sorted banave chhe.', 'Time O(n log n), extra space O(n)'],
    quick: ['Quick Sort', 'Ek pivot pasand kare chhe; pivot thi nana ek bajue, moda biji bajue. Pachhi banne bhaag par same kaam.', 'Average O(n log n), worst O(n²)'],
    heap: ['Heap Sort', 'Pehla max-heap banave chhe (parent hamesha bachha thi moto). Root (sauthi moto) ne chhelle mukine heap fari sudhare chhe.', 'Time O(n log n), extra space O(1)'],
    cycle: ['Cycle Sort', 'Darek number nu sachu sthan gani ne tya mukay chhe; je number bahar nikle te aagal na cycle ma mukay chhe. Write ochha thay chhe.', 'Time O(n²), memory write minimum'],
    merge3: ['3-way Merge Sort', 'Array ne 2 nahi 3 bhaag ma vahenche chhe, pachhi 3 sorted bhaag ma thi sauthi nano number lai ne merge kare chhe.', 'Time O(n log n), depth log base 3 (n)']
};
const ALG = {
    selection(a, S, r, sw) {
        const n = a.length; for (let i = 0; i < n - 1; i++) {
            let m = i; r({ p: m }, `Pass ${i + 1}: index ${i} thi baaki bhaag ma minimum shodhvu chhe.`);
            for (let j = i + 1; j < n; j++) { r({ c: [j], p: m }, `${a[j]} ne current minimum ${a[m]} sathe sarkhavyo.`); if (a[j] < a[m]) { m = j; r({ p: m }, `${a[m]} navo minimum male chhe.`) } }
            if (m != i) { sw(i, m); r({ w: [i, m] }, `Minimum ${a[i]} ne index ${i} par swap karyo.`) } S.add(i); r({}, `Index ${i} sorted thai gayo.`)
        }
    },
    bubble(a, S, r, sw) {
        const n = a.length; for (let i = 0; i < n - 1; i++) {
            let f = false; for (let j = 0; j < n - 1 - i; j++) { r({ c: [j, j + 1] }, `${a[j]} ane ${a[j + 1]} sarkhavyo.`); if (a[j] > a[j + 1]) { sw(j, j + 1); f = true; r({ w: [j, j + 1] }, `Pehlo moto hato, etle swap karyo.`) } }
            S.add(n - 1 - i); r({}, `${a[n - 1 - i]} potani sachi jagya e pahonchi gayo.`); if (!f) { r({}, 'Ek pan swap na thayo, etle array pehlathi sorted chhe.'); break }
        }
    },
    insertion(a, S, r, sw) {
        const n = a.length; S.add(0); r({}, `Pehlo number ${a[0]} ekalo sorted gani lo.`); for (let i = 1; i < n; i++) {
            r({ p: i }, `${a[i]} (key) ne sorted bhaag ma yogya jagya e mukvo chhe.`); let j = i;
            while (j > 0) { r({ c: [j - 1, j], p: j }, `${a[j - 1]} ane ${a[j]} sarkhavyo.`); if (a[j - 1] > a[j]) { sw(j - 1, j); r({ w: [j - 1, j], p: j - 1 }, `${a[j]} moto hato, jamna taraf khasyo.`); j-- } else { r({ p: j }, `Jagya mali gayi, aagal nano number chhe.`); break } }
            S.add(i); r({}, `Index 0 thi ${i} sudhi sorted.`)
        }
    },
    merge(a, S, r) {
        const n = a.length; const ms = (l, h) => {
            if (l >= h) return; const m = (l + h) >> 1; r({ lo: l, hi: h }, `Bhaag [${l}..${h}] ne vahenchyo: [${l}..${m}] ane [${m + 1}..${h}].`); ms(l, m); ms(m + 1, h);
            const L = a.slice(l, m + 1), R = a.slice(m + 1, h + 1); let i = 0, j = 0, k = l; r({ lo: l, hi: h }, `Have [${L}] ane [${R}] ne merge karvana.`);
            while (i < L.length && j < R.length) { const x = L[i] <= R[j] ? L[i++] : R[j++]; a[k] = x; r({ lo: l, hi: h, w: [k] }, `Banne ma nano ${x} chhe, index ${k} par mukyo.`); k++ }
            while (i < L.length) { a[k] = L[i++]; r({ lo: l, hi: h, w: [k] }, `Left nu bachelu ${a[k]} index ${k} par mukyo.`); k++ }
            while (j < R.length) { a[k] = R[j++]; r({ lo: l, hi: h, w: [k] }, `Right nu bachelu ${a[k]} index ${k} par mukyo.`); k++ }
        }; ms(0, n - 1)
    },
    merge3(a, S, r) {
        const n = a.length; const ts = (l, h) => {
            if (l >= h) return; const c = h - l + 1, m1 = l + Math.ceil(c / 3) - 1, m2 = l + Math.ceil(2 * c / 3) - 1;
            r({ lo: l, hi: h }, `Bhaag [${l}..${h}] ne 3 bhaag ma vahenchyo: [${l}..${m1}], [${m1 + 1}..${m2}], [${m2 + 1}..${h}].`); ts(l, m1); ts(m1 + 1, m2); ts(m2 + 1, h);
            const P = [a.slice(l, m1 + 1), a.slice(m1 + 1, m2 + 1), a.slice(m2 + 1, h + 1)], q = [0, 0, 0]; r({ lo: l, hi: h }, `Have 3 sorted bhaag [${P.map(p => p.join(' ')).join('] [')}] ne merge karvana.`);
            for (let k = l; k <= h; k++) { let b = -1; for (let t = 0; t < 3; t++)if (q[t] < P[t].length && (b < 0 || P[t][q[t]] < P[b][q[b]])) b = t; const x = P[b][q[b]++]; a[k] = x; r({ lo: l, hi: h, w: [k] }, `3 bhaag na aagal na number ma sauthi nano ${x} chhe, index ${k} par mukyo.`) }
        }; ts(0, n - 1)
    },
    quick(a, S, r, sw) {
        const n = a.length; const qs = (l, h) => {
            if (l > h) return; if (l == h) { S.add(l); r({ lo: l, hi: h }, `Ek j number ${a[l]} bachyo, te sorted chhe.`); return }
            const pv = a[h]; let i = l; r({ lo: l, hi: h, p: h }, `Pivot = ${pv} (chhello number). Bhaag [${l}..${h}].`);
            for (let j = l; j < h; j++) { r({ lo: l, hi: h, p: h, c: [j] }, `${a[j]} ne pivot ${pv} sathe sarkhavyo.`); if (a[j] < pv) { if (i != j) { sw(i, j); r({ lo: l, hi: h, p: h, w: [i, j] }, `${a[i]} pivot thi nano chhe, nana vala bhaag ma lavyo.`) } i++ } }
            sw(i, h); S.add(i); r({ lo: l, hi: h, w: [i, h] }, `Pivot ${pv} ne sachi jagya (index ${i}) e mukyo. Left badha nana, right badha moda.`); qs(l, i - 1); qs(i + 1, h)
        }; qs(0, n - 1)
    },
    heap(a, S, r, sw) {
        const n = a.length; const hp = (sz, i) => {
            while (true) {
                let m = i, L = 2 * i + 1, R = L + 1; if (L < sz && a[L] > a[m]) m = L; if (R < sz && a[R] > a[m]) m = R;
                r({ hi: sz - 1, c: [i, L, R].filter(x => x < sz) }, `Parent ${a[i]} ne tena bachha sathe sarkhavyo.`); if (m == i) break; sw(i, m); r({ hi: sz - 1, w: [i, m] }, `Bachho moto hato, parent sathe swap karyo.`); i = m
            }
        };
        r({}, 'Pehla max-heap banavvo chhe: chhella parent thi shuru karine upar tak.'); for (let i = (n >> 1) - 1; i >= 0; i--)hp(n, i); r({}, `Max-heap taiyar. Root ${a[0]} sauthi moto chhe.`);
        for (let e = n - 1; e > 0; e--) { sw(0, e); S.add(e); r({ hi: e - 1, w: [0, e] }, `Root (sauthi moto) ne index ${e} par mukyo, te sorted.`); hp(e, 0) } S.add(0)
    },
    cycle(a, S, r) {
        const n = a.length; for (let cs = 0; cs < n - 1; cs++) {
            let it = a[cs], pos = cs; for (let i = cs + 1; i < n; i++)if (a[i] < it) pos++;
            if (pos == cs) { S.add(cs); r({ p: cs }, `${it} pehla thi j sachi jagya e chhe.`); continue }
            r({ p: cs }, `Cycle shuru: ${it} thi nana ${pos - cs} number chhe, etle ${it} nu sachu sthan index ${pos}.`);
            while (it == a[pos]) pos++;[it, a[pos]] = [a[pos], it]; S.add(pos); r({ w: [pos], p: cs }, `${a[pos]} index ${pos} par mukyo; have hath ma ${it} chhe.`);
            while (pos != cs) { pos = cs; for (let i = cs + 1; i < n; i++)if (a[i] < it) pos++; while (it == a[pos]) pos++;[it, a[pos]] = [a[pos], it]; S.add(pos); r({ w: [pos], p: cs }, `${a[pos]} index ${pos} par mukyo; have hath ma ${it} chhe.`) }
            S.add(cs); r({}, 'Cycle purun thayu.')
        }
    }
};
ALG.merge3 = ALG.merge3;
function gen() {
    steps = []; idx = 0; const a = arr.slice(), S = new Set();
    const r = (o, m) => steps.push({ a: a.slice(), c: [], w: [], p: -1, lo: 0, hi: a.length - 1, s: [...S], m, ...o });
    const sw = (i, j) => { [a[i], a[j]] = [a[j], a[i]] }; r({}, `Shuruaat: [${a.join(', ')}]. "Aagal" dabavo athva Play karo.`);
    if (a.length > 1) ALG[algo](a, S, r, sw); a.forEach((_, i) => S.add(i)); r({ lo: 0, hi: a.length - 1 }, `Sorting purun! Final: [${a.join(', ')}]`); draw()
}
function draw() {
    const st = steps[idx], n = st.a.length, mx = Math.max(...st.a, 1);
    $('stage').innerHTML = st.a.map((v, i) => {
        let k = st.w.includes(i) ? 'w' : st.p === i ? 'p' : st.c.includes(i) ? 'c' : st.s.includes(i) ? 's' : ''; if (i < st.lo || i > st.hi) k += ' d';
        return `<div class="bar ${k}" style="height:${Math.max(6, v / mx * 100)}%"><span>${v}</span></div>`
    }).join('');
    $('idx').innerHTML = st.a.map((_, i) => `<i>${i}</i>`).join(''); $('msg').textContent = st.m; $('cnt').textContent = `Step ${idx + 1} / ${steps.length}`;
    $('prev').disabled = idx == 0; $('next').disabled = idx == steps.length - 1; if (idx == steps.length - 1) stop()
}
function stop() { clearInterval(timer); timer = null; $('play').textContent = 'Play' }
function play() {
    if (timer) return stop(); if (idx == steps.length - 1) idx = 0; $('play').textContent = 'Pause';
    const tick = () => { if (idx < steps.length - 1) { idx++; draw() } else stop() }; const ms = 1100 - $('spd').value * 100; timer = setInterval(tick, ms)
}
function pick(a) { arr = a; stop(); gen() }
function parse() { const v = $('inp').value.split(/[\s,]+/).map(Number).filter(x => Number.isFinite(x) && x >= 1 && x <= 99).map(Math.round).slice(0, 15); return v.length ? v : null }
function sync() { $('inp').value = arr.join(', ') }
function setAlgo(k) {
    algo = k; stop(); document.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.k == k));
    $('an').textContent = INFO[k][0]; $('ad').textContent = INFO[k][1]; $('ac').textContent = INFO[k][2]; gen()
}
$('chips').innerHTML = Object.keys(INFO).map(k => `<button class="chip" data-k="${k}" aria-pressed="false">${INFO[k][0]}</button>`).join('');
$('chips').onclick = e => { if (e.target.dataset.k) setAlgo(e.target.dataset.k) };
$('set').onclick = () => { const v = parse(); if (v) { pick(v); sync() } else $('msg').textContent = '1 thi 99 na valid numbers lakho, comma thi alag karine.' };
$('shuf').onclick = () => { const v = (parse() || arr).slice(); for (let i = v.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[v[i], v[j]] = [v[j], v[i]] } pick(v); sync() };
$('rnd').onclick = () => { const n = 6 + Math.floor(Math.random() * 5); pick(Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 99))); sync() };
$('next').onclick = () => { stop(); if (idx < steps.length - 1) { idx++; draw() } }; $('prev').onclick = () => { stop(); if (idx > 0) { idx--; draw() } };
$('rst').onclick = () => { stop(); idx = 0; draw() }; $('play').onclick = play; $('spd').oninput = () => { if (timer) { stop(); play() } };
document.addEventListener('keydown', e => { if (e.target.tagName == 'INPUT') return; if (e.key == 'ArrowRight') $('next').click(); if (e.key == 'ArrowLeft') $('prev').click(); if (e.key == ' ') { e.preventDefault(); play() } });
setAlgo('selection');

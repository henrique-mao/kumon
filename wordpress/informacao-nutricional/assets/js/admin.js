/* Informação Nutricional — meta box (abas, cálculo de porção / %VD, alertas "Alto em"). */
(function () {
	'use strict';

	var root = document.querySelector('.inn-admin');
	if (!root || !window.InfoNutriAdmin) {
		return;
	}
	var cfg = window.InfoNutriAdmin;

	function num(v) {
		v = String(v || '').trim();
		if (v === '') {
			return null;
		}
		if (v.indexOf(',') !== -1) {
			v = v.replace(/\./g, '').replace(',', '.');
		}
		var n = parseFloat(v.replace(/[^0-9.\-]/g, ''));
		return isNaN(n) ? null : n;
	}

	function fmt(n) {
		if (n === null) {
			return '';
		}
		var d = (Math.abs(n) >= 10 || Math.floor(n) === n) ? 0 : 1;
		return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: d });
	}

	/* Abas ------------------------------------------------------------- */
	root.querySelectorAll('.inn-admin-tabs button').forEach(function (btn) {
		btn.addEventListener('click', function () {
			root.querySelectorAll('.inn-admin-tabs button').forEach(function (b) {
				b.classList.toggle('is-active', b === btn);
			});
			root.querySelectorAll('.inn-admin-panel').forEach(function (p) {
				p.classList.toggle('is-active', p.getAttribute('data-panel') === btn.getAttribute('data-tab'));
			});
		});
	});

	/* Cálculos ---------------------------------------------------------- */
	var unitSel = root.querySelector('[data-inn="unidade"]');
	var portionInput = root.querySelector('[data-inn="porcao"]');

	function base(key) {
		var row = root.querySelector('tr[data-nutrient="' + key + '"]');
		return row ? num(row.querySelector('[data-inn="base"]').value) : null;
	}

	function update() {
		var unit = unitSel.value;
		var portion = num(portionInput.value);

		root.querySelectorAll('[data-inn-unit]').forEach(function (el) {
			el.textContent = unit;
		});

		root.querySelectorAll('tr[data-nutrient]').forEach(function (row) {
			var key = row.getAttribute('data-nutrient');
			var def = cfg.nutrients[key];
			var b = num(row.querySelector('[data-inn="base"]').value);
			var manualInput = row.querySelector('[data-inn="manual"]');
			var calc = (b !== null && portion !== null) ? b * portion / 100 : null;
			manualInput.placeholder = calc !== null ? fmt(calc) : '';
			var value = num(manualInput.value);
			if (value === null) {
				value = calc;
			}
			var vdCell = row.querySelector('[data-inn="vd"]');
			if (def.vd) {
				vdCell.textContent = value !== null ? Math.round(value / def.vd * 100) + '%' : '—';
			}
		});

		updateAlerts();
	}

	/* Alertas "ALTO EM" -------------------------------------------------- */
	function updateAlerts() {
		var modeEl = root.querySelector('[data-inn="alerta_modo"]:checked');
		var auto = !modeEl || modeEl.value === 'auto';
		var state = unitSel.value === 'ml' ? 'liquid' : 'solid';
		var active = [];

		Object.keys(cfg.alerts).forEach(function (key) {
			var def = cfg.alerts[key];
			var cb = root.querySelector('[data-inn-alert="' + key + '"]');
			if (auto) {
				var v = base(def.nutrient);
				cb.checked = v !== null && v >= def[state];
			}
			cb.disabled = auto;
			if (cb.checked) {
				active.push(key);
			}
		});

		var preview = root.querySelector('[data-inn-preview]');
		if (preview) {
			preview.querySelectorAll('[data-alert]').forEach(function (el) {
				el.style.display = active.indexOf(el.getAttribute('data-alert')) === -1 ? 'none' : '';
			});
			preview.style.display = active.length ? '' : 'none';
		}
	}

	root.addEventListener('input', update);
	root.addEventListener('change', update);
	update();

	/* Outros nutrientes ------------------------------------------------- */
	var tbody = root.querySelector('[data-inn-extras]');
	var tpl = document.getElementById('inn-extra-template');
	var counter = tbody ? tbody.children.length : 0;

	var addBtn = root.querySelector('[data-inn-add-extra]');
	if (addBtn && tpl) {
		addBtn.addEventListener('click', function () {
			var html = tpl.innerHTML.replace(/__i__/g, String(counter++));
			tbody.insertAdjacentHTML('beforeend', html);
		});
	}

	root.addEventListener('click', function (e) {
		var rm = e.target.closest('[data-inn-remove-extra]');
		if (rm) {
			e.preventDefault();
			rm.closest('tr').remove();
		}
	});
})();

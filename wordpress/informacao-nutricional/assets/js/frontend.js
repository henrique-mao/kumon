/* Informação Nutricional — abas acessíveis (funciona também no editor do Elementor). */
(function () {
	'use strict';

	function activate(tab) {
		var list = tab.closest('.inn-tabs');
		var ficha = tab.closest('.inn-ficha');
		if (!list || !ficha) {
			return;
		}
		list.querySelectorAll('.inn-tabs__tab').forEach(function (t) {
			var on = t === tab;
			t.classList.toggle('is-active', on);
			t.setAttribute('aria-selected', on ? 'true' : 'false');
			t.setAttribute('tabindex', on ? '0' : '-1');
			var panel = document.getElementById(t.getAttribute('aria-controls'));
			if (panel) {
				panel.classList.toggle('is-active', on);
			}
		});
	}

	function mark() {
		document.querySelectorAll('.inn-ficha--abas:not(.inn-js)').forEach(function (el) {
			if (el.querySelector('.inn-tabs')) {
				el.classList.add('inn-js');
			}
		});
	}

	document.addEventListener('click', function (e) {
		var tab = e.target.closest && e.target.closest('.inn-tabs__tab');
		if (tab) {
			activate(tab);
		}
	});

	document.addEventListener('keydown', function (e) {
		var tab = e.target.closest && e.target.closest('.inn-tabs__tab');
		if (!tab || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End')) {
			return;
		}
		var tabs = Array.prototype.slice.call(tab.closest('.inn-tabs').querySelectorAll('.inn-tabs__tab'));
		var i = tabs.indexOf(tab);
		if (e.key === 'ArrowRight') { i = (i + 1) % tabs.length; }
		if (e.key === 'ArrowLeft') { i = (i - 1 + tabs.length) % tabs.length; }
		if (e.key === 'Home') { i = 0; }
		if (e.key === 'End') { i = tabs.length - 1; }
		e.preventDefault();
		tabs[i].focus();
		activate(tabs[i]);
	});

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', mark);
	} else {
		mark();
	}

	// Elementor: re-aplica após renderizar widgets no editor/preview.
	window.addEventListener('elementor/frontend/init', function () {
		if (window.elementorFrontend && window.elementorFrontend.hooks) {
			window.elementorFrontend.hooks.addAction('frontend/element_ready/infonutri.default', mark);
		}
	});
})();

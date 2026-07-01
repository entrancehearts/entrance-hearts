/* sounds.js — Web Audio API sound effects for EntranceHearts
 * EHSound.play('like' | 'pass' | 'super' | 'match')
 * EHSound.toggle() — persists in localStorage (eh_sounds: 'on'|'off')
 */
const EHSound = (function () {
  'use strict';
  let ctx = null;
  let enabled = localStorage.getItem('eh_sounds') !== 'off';

  function ctx_() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playLike() {
    const c = ctx_(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(440, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(880, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.28, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.32);
    o.start(); o.stop(c.currentTime + 0.32);
  }

  function playPass() {
    const c = ctx_(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(340, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(190, c.currentTime + 0.18);
    g.gain.setValueAtTime(0.18, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.28);
    o.start(); o.stop(c.currentTime + 0.28);
  }

  function playSuper() {
    const c = ctx_(); if (!c) return;
    [[523, 0], [659, 0.07], [784, 0.14], [1047, 0.21]].forEach(([freq, delay]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sine'; o.frequency.value = freq;
      const t = c.currentTime + delay;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.22, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
      o.start(t); o.stop(t + 0.28);
    });
  }

  function playMatch() {
    const c = ctx_(); if (!c) return;
    [[440, 0], [554, 0.11], [659, 0.22], [880, 0.33]].forEach(([freq, delay]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type = 'sine'; o.frequency.value = freq;
      const t = c.currentTime + delay;
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      o.start(t); o.stop(t + 0.42);
    });
  }

  return {
    play(name) {
      if (!enabled) return;
      try {
        if (name === 'like')       playLike();
        else if (name === 'pass')  playPass();
        else if (name === 'super') playSuper();
        else if (name === 'match') playMatch();
      } catch(e) {}
    },
    toggle() {
      enabled = !enabled;
      localStorage.setItem('eh_sounds', enabled ? 'on' : 'off');
      return enabled;
    },
    isEnabled() { return enabled; }
  };
})();

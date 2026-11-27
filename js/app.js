/**
 * ============================================================================
 * 全站交互引擎 (js/app.js) — 郜维佳个人导演作品集
 * 功能：
 * 1. Splash Gate 开屏 + Hash 路由 + 五列百叶窗转场
 * 2. 首页粘性首屏 + 胶片条切换 + Mia's Wild Wonderland 双集独立按钮
 * 3. 页面内嵌影院播放器 + 弹窗影院播放器统一控制器
 *    （播放/暂停、后退10s、前进10s、可拖拽进度条与悬浮时间气泡、选集、音量滑块、倍速、画中画、全屏）
 * 4. 仓库内网页版成片直出（H.264 转码，原生 video 播放）
 * ============================================================================
 */
(function () {
  'use strict';

  const DATA = window.PORTFOLIO_DATA;
  if (!DATA) return;

  const { site, works } = DATA;

  const SVG = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>',
    back10: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 8v5l3 2"/></svg>',
    fwd10: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M12 8v5l-3 2"/></svg>',
    vol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
    pip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><rect x="12" y="11" width="8" height="6" rx="1" fill="currentColor"/></svg>',
    fsEnter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
    fsExit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>'
  };

  const state = {
    activeWorkIndex: 0,
    worksFilter: 'all',
    worksView: 'list',
    route: '#/',
    isTransitioning: false,
    scriptPageIndex: 0,
    lightboxStills: [],
    lightboxIndex: 0,
    gateReady: false,
    gateRaf: null,
    gateProgressRaf: null,
    gateLoadTimer: null,
    gateAutoExitTimer: null,
    inlinePlayerCtrl: null,
    modalPlayerCtrl: null
  };

  // DOM 缓存
  const $app = document.getElementById('app');
  const $gate = document.getElementById('gate');
  const $gateCanvas = document.getElementById('gate-canvas');
  const $gateEnter = document.getElementById('gate-enter');
  const $gateNum = document.getElementById('gate-num');
  const $gateStatus = document.getElementById('gate-status');
  const $gateBarFill = document.getElementById('gate-bar-fill');

  const $hdrWhere = document.getElementById('hdr-where');
  const $menuToggle = document.getElementById('menu-toggle');
  const $drawer = document.getElementById('drawer');
  const $drawerScrim = document.getElementById('drawer-scrim');
  const $drawerWorks = document.getElementById('drawer-works');
  const $replayGateBtn = document.getElementById('replay-gate-btn');

  const $tr = document.getElementById('transition');
  const $trEn = document.getElementById('tr-en');
  const $trCn = document.getElementById('tr-cn');

  const $player = document.getElementById('player');
  const $playerNum = document.getElementById('player-num');
  const $playerTitle = document.getElementById('player-title');
  const $playerEn = document.getElementById('player-en');
  const $playerQualityBadge = document.getElementById('player-quality-badge');
  const $playerEps = document.getElementById('player-eps');
  const $playerClose = document.getElementById('player-close');
  const $modalPlayerMount = document.getElementById('modal-player-mount');

  const $lightbox = document.getElementById('lightbox');
  const $lbImg = document.getElementById('lb-img');
  const $lbCap = document.getElementById('lb-cap');
  const $lbClose = document.getElementById('lb-close');
  const $lbPrev = document.getElementById('lb-prev');
  const $lbNext = document.getElementById('lb-next');

  const $toast = document.getElementById('toast');
  let toastTimer = null;

  /* ========================================================================
     基础工具函数
     ======================================================================== */

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setAccent(work) {
    const target = work || works[0];
    document.documentElement.style.setProperty('--accent', target.accent);
    document.documentElement.style.setProperty('--accent-rgb', target.accentRgb);
  }

  function showToast(msg) {
    $toast.textContent = msg;
    $toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $toast.classList.remove('is-show'), 2200);
  }

  function formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${pad2(m)}:${pad2(s)}`;
  }

  const isWeChat = /MicroMessenger/i.test(navigator.userAgent || '');

  function syncAppViewportHeight() {
    document.documentElement.style.setProperty('--app-vh', `${window.innerHeight}px`);
  }

  syncAppViewportHeight();
  window.addEventListener('resize', syncAppViewportHeight, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(syncAppViewportHeight, 120), { passive: true });

  function wakePreviewVideo() {
    const $vid = document.getElementById('home-preview-video');
    if ($vid && $vid.paused) {
      $vid.play().catch(() => {});
    }
  }

  document.addEventListener('WeixinJSBridgeReady', wakePreviewVideo, false);
  window.addEventListener('touchstart', wakePreviewVideo, { once: true, passive: true });

  // 自动回退仅用于浏览器不支持 HEVC 10-bit 时
  function bindVideoWithFallback($video, primarySrc, fallbackSrc) {
    $video.setAttribute('playsinline', '');
    $video.setAttribute('webkit-playsinline', 'true');
    $video.setAttribute('x5-playsinline', 'true');
    $video.setAttribute('x5-video-player-type', 'h5-page');
    $video.setAttribute('t7-video-player-type', 'inline');
    $video.dataset.usedFallback = '0';
    $video.src = primarySrc;
    $video.onerror = () => {
      if (fallbackSrc && $video.dataset.usedFallback !== '1') {
        $video.dataset.usedFallback = '1';
        $video.src = fallbackSrc;
        $video.load();
        $video.play().catch(() => {});
      }
    };
  }

  function hydrateChromeTexts() {
    document.title = `${site.nameCn} ${site.nameEn} · ${site.roleCn}`;
    document.getElementById('gate-wordmask-text').textContent = site.nameCn;
    document.getElementById('gate-brand').textContent = `${site.nameCn} ${site.nameEn}`;
    document.getElementById('gate-count').textContent = `SELECTED FILMS · ${pad2(works.length)}`;
    document.getElementById('gate-sub').textContent = `${site.roleCn} — ${site.roleEn}`;
    document.getElementById('gate-cue').textContent = site.heroCue;

    document.getElementById('hdr-logo-cn').textContent = site.nameCn;
    document.getElementById('hdr-logo-en').textContent = site.nameEn;
    document.getElementById('drawer-count').textContent = `${pad2(works.length)} FILMS`;
    document.getElementById('drawer-foot-name').textContent = `${site.nameCn} ${site.nameEn}`;
    document.getElementById('drawer-foot-role').textContent = site.roleCn;

    const worksMenuCn = document.querySelector('.note-link[data-route="#/works"] .note-cn');
    if (worksMenuCn) worksMenuCn.textContent = `作品 · ${pad2(works.length)}`;

    $drawerWorks.innerHTML = works
      .map(
        (w) => `
        <a href="#/work/${w.slug}" data-route="#/work/${w.slug}" class="note-work-item">
          <span>${w.num}</span>
          <em>${escapeHtml(w.title)}${w.episodes && w.episodes.length ? ` (${w.episodes.length}集)` : ''}</em>
        </a>`
      )
      .join('');
  }

  /* ========================================================================
     播放源：仓库内网页版成片（media/）/ 暂无片源
     说明：成片以 H.264 转码后随仓库发布，线上直接用原生 <video> + 自研影院控制栏。
     ======================================================================== */

  function resolveWorkMediaMode(work) {
    const mode = window.PORTFOLIO_MEDIA_MODE || (site.media && site.media.mode) || 'local';
    if (mode === 'none') return 'none';
    return work.video ? 'local' : 'none';
  }

  function playSourceBadge(work) {
    return work.video ? work.resolution || '高清正片' : '即将上线';
  }

  /* 首屏自动播放的静音预览：手机 / 省流量 / 2G-3G 下不自动拉正片，
     先给一张海报，用户点击后再进播放器（移动端最贵的一次请求就是那个 13 MB 的视频）。 */
  function shouldAutoplayHeroVideo() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
    if (conn.saveData) return false;
    if (/slow-2g|2g|3g/.test(conn.effectiveType || '')) return false;
    return window.matchMedia('(min-width: 860px)').matches;
  }

  /* ---- 尚未挂载片源时的占位控制器 ---- */
  function createUnavailableController($mount, work, options) {
    const media = site.media || {};
    let curEpIndex = options.epIndex || 0;

    function posterFor(idx) {
      const ep = work.episodes && work.episodes[idx];
      return (ep && ep.thumb) || work.poster || (work.stills && work.stills[0]) || '';
    }

    function render() {
      const poster = posterFor(curEpIndex);
      $mount.innerHTML = `
        <div class="cinema-player is-placeholder is-landscape-stage">
          <div class="cinema-stage"${poster ? ` style="background-image:url('${poster}')"` : ''}>
            <div class="ph-scrim" aria-hidden="true"></div>
            <div class="ph-box">
              <span class="ph-kicker">UPCOMING · 即将上线</span>
              <p class="ph-title">${escapeHtml(media.placeholderTitle || '影片即将上线')}</p>
              <p class="ph-desc">${escapeHtml(media.placeholderDesc || '成片正在挂载，稍后可在此直接观看。')}</p>
            </div>
          </div>
        </div>
      `;
    }

    render();

    return {
      loadEpisode: (epIdx) => {
        curEpIndex = epIdx || 0;
        render();
        if (typeof options.onEpisodeChange === 'function') options.onEpisodeChange(curEpIndex);
      },
      seekBy: () => {},
      togglePlay: () => showToast('影片即将上线'),
      pause: () => {},
      destroy: () => {
        $mount.innerHTML = '';
      },
      getVideoEl: () => null,
      getEpisodeIndex: () => curEpIndex
    };
  }

  /* ========================================================================
     通用影院级内嵌/弹窗播放器控制器
     ======================================================================== */

  function createCinemaPlayerController($mount, work, opts) {
    const options = opts || {};
    const mode = resolveWorkMediaMode(work);
    if (mode === 'none') return createUnavailableController($mount, work, options);
    return createNativeVideoController($mount, work, options);
  }

  function createNativeVideoController($mount, work, opts) {
    const options = opts || {};
    const isModal = Boolean(options.isModal);
    const initialEp = options.epIndex || 0;
    const isVert = work.aspect === '9:16';

    $mount.innerHTML = `
      <div class="cinema-player is-paused ${isVert ? 'is-vertical-stage' : 'is-landscape-stage'}" tabindex="0">
        <div class="cinema-stage">
          <video class="cinema-video" playsinline webkit-playsinline="true" x5-playsinline="true" x5-video-player-type="h5-page" preload="none"></video>
          <button type="button" class="cinema-center-play" aria-label="播放影片">${SVG.play}</button>
          <div class="cinema-hud" aria-live="polite"></div>
        </div>
        <div class="vctrl">
          <div class="vctrl-progress" role="slider" aria-label="播放进度">
            <div class="vctrl-hover-time">00:00</div>
            <div class="vctrl-track">
              <div class="vctrl-buffer"></div>
              <div class="vctrl-fill"><i class="vctrl-thumb"></i></div>
            </div>
          </div>
          <div class="vctrl-row">
            <div class="vctrl-left">
              <button type="button" class="vc-btn vc-btn-primary vc-play" aria-label="播放或暂停">${SVG.play}<span class="vc-btn-label">播放</span></button>
              <button type="button" class="vc-btn vc-back" aria-label="后退 10 秒">${SVG.back10}<span>-10s</span></button>
              <button type="button" class="vc-btn vc-fwd" aria-label="前进 10 秒">${SVG.fwd10}<span>+10s</span></button>
              <span class="vctrl-time">00:00 / 00:00</span>
            </div>
            <div class="vctrl-right">
              <span class="vctrl-badge">${escapeHtml(work.resolution || '高清正片')}</span>
              <div class="vctrl-vol">
                <button type="button" class="vc-btn vc-mute" aria-label="静音或取消静音">${SVG.vol}</button>
                <input type="range" class="vctrl-vol-range" min="0" max="1" step="0.05" value="1" aria-label="音量调节" />
              </div>
              <div class="vctrl-speed-wrap">
                <button type="button" class="vc-btn vc-speed-btn" aria-label="倍速切换">1.0x</button>
                <div class="vctrl-speed-menu">
                  <button type="button" data-rate="0.75">0.75x</button>
                  <button type="button" data-rate="1" class="is-active">1.0x</button>
                  <button type="button" data-rate="1.25">1.25x</button>
                  <button type="button" data-rate="1.5">1.5x</button>
                  <button type="button" data-rate="2">2.0x</button>
                </div>
              </div>
              <button type="button" class="vc-btn vctrl-pip-btn vc-pip" aria-label="画中画">${SVG.pip}<span class="vc-btn-label">画中画</span></button>
              <button type="button" class="vc-btn vc-fs" aria-label="全屏播放">${SVG.fsEnter}<span class="vc-btn-label">全屏</span></button>
            </div>
          </div>
        </div>
      </div>
    `;

    const $root = $mount.querySelector('.cinema-player');
    const $stage = $root.querySelector('.cinema-stage');
    const $video = $root.querySelector('.cinema-video');
    const $centerPlay = $root.querySelector('.cinema-center-play');
    const $hud = $root.querySelector('.cinema-hud');
    const $progress = $root.querySelector('.vctrl-progress');
    const $hoverTime = $root.querySelector('.vctrl-hover-time');
    const $buffer = $root.querySelector('.vctrl-buffer');
    const $fill = $root.querySelector('.vctrl-fill');
    const $playBtn = $root.querySelector('.vc-play');
    const $backBtn = $root.querySelector('.vc-back');
    const $fwdBtn = $root.querySelector('.vc-fwd');
    const $time = $root.querySelector('.vctrl-time');
    const $muteBtn = $root.querySelector('.vc-mute');
    const $volRange = $root.querySelector('.vctrl-vol-range');
    const $speedBtn = $root.querySelector('.vc-speed-btn');
    const $speedMenu = $root.querySelector('.vctrl-speed-menu');
    const $pipBtn = $root.querySelector('.vc-pip');
    const $fsBtn = $root.querySelector('.vc-fs');

    let curEpIndex = initialEp;
    let hudTimer = null;
    let idleTimer = null;
    let isScrubbing = false;

    function showHud(text) {
      $hud.textContent = text;
      $hud.classList.add('is-show');
      clearTimeout(hudTimer);
      hudTimer = setTimeout(() => $hud.classList.remove('is-show'), 950);
    }

    function wake() {
      $root.classList.remove('is-idle');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!$video.paused && document.fullscreenElement === $root) {
          $root.classList.add('is-idle');
        }
      }, 2400);
    }

    function loadEpisode(epIdx, autoPlay) {
      curEpIndex = epIdx || 0;
      const ep = work.episodes && work.episodes[curEpIndex];
      const src = ep ? ep.video : work.video;
      const poster = ep && ep.thumb ? ep.thumb : work.poster || work.stills[0];

      $video.poster = poster || '';
      bindVideoWithFallback($video, src, ep ? null : work.fallbackVideo);
      $fill.style.width = '0%';
      $buffer.style.width = '0%';
      $time.textContent = `00:00 / ${ep ? ep.duration : '00:00'}`;

      if (typeof options.onEpisodeChange === 'function') {
        options.onEpisodeChange(curEpIndex);
      }

      if (autoPlay) {
        $video.play().catch(() => {
          $root.classList.add('is-paused');
        });
      } else {
        $root.classList.add('is-paused');
      }
    }

    function pauseOtherVideos() {
      const $homeVid = document.getElementById('home-preview-video');
      $homeVid?.pause();
      if (!isModal && state.modalPlayerCtrl) {
        state.modalPlayerCtrl.pause();
      }
      if (isModal && state.inlinePlayerCtrl) {
        state.inlinePlayerCtrl.pause();
      }
    }

    function togglePlay() {
      if ($video.paused) {
        pauseOtherVideos();
        $video.play().catch(() => {});
      } else {
        $video.pause();
      }
    }

    function seekBy(deltaSec) {
      const dur = Number.isFinite($video.duration) ? $video.duration : 9999;
      $video.currentTime = Math.min(dur, Math.max(0, ($video.currentTime || 0) + deltaSec));
      showHud(deltaSec < 0 ? `⏪ 后退 ${Math.abs(deltaSec)} 秒` : `⏩ 前进 ${deltaSec} 秒`);
    }

    function updateFsBtnLabel(isFs) {
      $fsBtn.innerHTML = isFs
        ? `${SVG.fsExit}<span class="vc-btn-label">退出全屏</span>`
        : `${SVG.fsEnter}<span class="vc-btn-label">全屏</span>`;
    }

    function toggleFullscreen() {
      // 若处于网页伪全屏（iOS Safari / 微信内置浏览器兼容态），直接退出
      if ($root.classList.contains('is-pseudo-fs')) {
        $root.classList.remove('is-pseudo-fs', 'is-idle');
        document.body.classList.remove('no-scroll');
        updateFsBtnLabel(false);
        return;
      }

      if (document.fullscreenElement === $root || document.webkitFullscreenElement === $root) {
        (document.exitFullscreen || document.webkitExitFullscreen)?.call(document)?.catch?.(() => {});
        return;
      }

      const reqFs = $root.requestFullscreen || $root.webkitRequestFullscreen;
      if (reqFs && !isWeChat) {
        try {
          const p = reqFs.call($root);
          if (p && typeof p.catch === 'function') {
            p.catch(() => {
              $root.classList.add('is-pseudo-fs');
              document.body.classList.add('no-scroll');
              updateFsBtnLabel(true);
            });
          }
          return;
        } catch (err) {
          // 降级到网页伪全屏，保留完整前进/后退/选集控制栏
        }
      }

      // iPhone Safari & 微信内置浏览器走全视口伪全屏，保证内嵌控制栏全部可见可点
      $root.classList.add('is-pseudo-fs');
      document.body.classList.add('no-scroll');
      updateFsBtnLabel(true);
    }

    $stage.addEventListener('click', (e) => {
      if (e.target === $centerPlay || $centerPlay.contains(e.target)) {
        togglePlay();
        return;
      }
      togglePlay();
    });

    $stage.addEventListener('dblclick', (e) => {
      e.preventDefault();
      toggleFullscreen();
    });

    $playBtn.addEventListener('click', togglePlay);
    $backBtn.addEventListener('click', () => seekBy(-10));
    $fwdBtn.addEventListener('click', () => seekBy(10));

    $video.addEventListener('play', () => {
      pauseOtherVideos();
      $root.classList.remove('is-paused');
      $playBtn.innerHTML = `${SVG.pause}<span class="vc-btn-label">暂停</span>`;
      wake();
    });

    $video.addEventListener('pause', () => {
      $root.classList.add('is-paused');
      $root.classList.remove('is-idle');
      $playBtn.innerHTML = `${SVG.play}<span class="vc-btn-label">播放</span>`;
    });

    $video.addEventListener('loadedmetadata', () => {
      $time.textContent = `${formatTime($video.currentTime)} / ${formatTime($video.duration)}`;
    });

    $video.addEventListener('timeupdate', () => {
      if (isScrubbing) return;
      const dur = $video.duration || 0;
      const cur = $video.currentTime || 0;
      const pct = dur > 0 ? (cur / dur) * 100 : 0;
      $fill.style.width = `${pct}%`;
      $time.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
    });

    $video.addEventListener('progress', () => {
      const dur = $video.duration || 0;
      if (dur > 0 && $video.buffered.length > 0) {
        const end = $video.buffered.end($video.buffered.length - 1);
        $buffer.style.width = `${Math.min(100, (end / dur) * 100)}%`;
      }
    });

    // 进度条拖拽与悬停时间预览
    function scrubToClientX(clientX) {
      const rect = $progress.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      $fill.style.width = `${ratio * 100}%`;
      if (Number.isFinite($video.duration)) {
        $video.currentTime = ratio * $video.duration;
        $time.textContent = `${formatTime($video.currentTime)} / ${formatTime($video.duration)}`;
      }
    }

    $progress.addEventListener('mousedown', (e) => {
      isScrubbing = true;
      $progress.classList.add('is-scrubbing');
      scrubToClientX(e.clientX);
    });

    $progress.addEventListener(
      'touchstart',
      (e) => {
        if (!e.touches[0]) return;
        isScrubbing = true;
        $progress.classList.add('is-scrubbing');
        scrubToClientX(e.touches[0].clientX);
      },
      { passive: true }
    );

    window.addEventListener('mousemove', (e) => {
      if (isScrubbing) scrubToClientX(e.clientX);
    });

    window.addEventListener(
      'touchmove',
      (e) => {
        if (isScrubbing && e.touches[0]) scrubToClientX(e.touches[0].clientX);
      },
      { passive: true }
    );

    window.addEventListener('mouseup', () => {
      if (!isScrubbing) return;
      isScrubbing = false;
      $progress.classList.remove('is-scrubbing');
    });

    window.addEventListener('touchend', () => {
      if (!isScrubbing) return;
      isScrubbing = false;
      $progress.classList.remove('is-scrubbing');
    });

    $progress.addEventListener('mousemove', (e) => {
      const rect = $progress.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      $hoverTime.style.left = `${ratio * 100}%`;
      if (Number.isFinite($video.duration)) {
        $hoverTime.textContent = formatTime(ratio * $video.duration);
        $hoverTime.classList.add('is-show');
      }
    });

    $progress.addEventListener('mouseleave', () => {
      $hoverTime.classList.remove('is-show');
    });

    // 音量
    $muteBtn.addEventListener('click', () => {
      $video.muted = !$video.muted;
      $muteBtn.innerHTML = $video.muted || $video.volume === 0 ? SVG.mute : SVG.vol;
      $volRange.value = $video.muted ? '0' : String($video.volume);
      showHud($video.muted ? '🔇 已静音' : `🔊 音量 ${Math.round($video.volume * 100)}%`);
    });

    $volRange.addEventListener('input', () => {
      const v = Number($volRange.value);
      $video.volume = v;
      $video.muted = v === 0;
      $muteBtn.innerHTML = v === 0 ? SVG.mute : SVG.vol;
    });

    // 倍速切换
    $speedBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      $speedMenu.classList.toggle('is-open');
    });

    $speedMenu.querySelectorAll('[data-rate]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rate = Number(btn.getAttribute('data-rate')) || 1;
        $video.playbackRate = rate;
        $speedBtn.textContent = `${rate}x`;
        $speedMenu.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b === btn));
        $speedMenu.classList.remove('is-open');
        showHud(`⚡ 倍速 ${rate}x`);
      });
    });

    document.addEventListener('click', () => $speedMenu.classList.remove('is-open'));

    // 画中画
    $pipBtn.addEventListener('click', async () => {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled && $video.requestPictureInPicture) {
          await $video.requestPictureInPicture();
        } else {
          showToast('当前浏览器暂不支持画中画');
        }
      } catch (err) {
        showToast('请先开始播放再开启画中画');
      }
    });

    // 全屏
    $fsBtn.addEventListener('click', toggleFullscreen);
    const onNativeFsChange = () => {
      const isFs = document.fullscreenElement === $root || document.webkitFullscreenElement === $root;
      if (!isFs && !$root.classList.contains('is-pseudo-fs')) {
        $root.classList.remove('is-idle');
      }
      updateFsBtnLabel(isFs || $root.classList.contains('is-pseudo-fs'));
    };
    document.addEventListener('fullscreenchange', onNativeFsChange);
    document.addEventListener('webkitfullscreenchange', onNativeFsChange);

    $root.addEventListener('mousemove', wake, { passive: true });
    $root.addEventListener('touchstart', wake, { passive: true });
    $root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $root.classList.contains('is-pseudo-fs')) {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekBy(-10);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekBy(10);
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    });

    loadEpisode(initialEp, Boolean(options.autoPlay));

    return {
      loadEpisode,
      seekBy,
      togglePlay,
      pause: () => $video.pause(),
      destroy: () => {
        $video.pause();
        $video.removeAttribute('src');
        $video.load();
      },
      getVideoEl: () => $video,
      getEpisodeIndex: () => curEpIndex
    };
  }

  /* ========================================================================
     1. 开屏引导页 (Splash Gate)
     ======================================================================== */

  function initGateCanvas() {
    if (!$gateCanvas || !$gateCanvas.getContext) return;
    const ctx = $gateCanvas.getContext('2d');
    const thumbs = works.map((w) => {
      const img = new Image();
      img.src = w.thumb || w.poster || w.stills[0] || '';
      return img;
    });

    function resize() {
      // 手机上把 canvas 像素比压到 1.5，减少开屏动画的填充开销
      const cap = window.innerWidth < 860 ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, cap);
      $gateCanvas.width = window.innerWidth * dpr;
      $gateCanvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let t = 0;
    function draw() {
      t += 0.25;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-0.18);
      ctx.translate(-w * 0.72, -h * 0.65);

      const cols = 4;
      const cardW = Math.max(190, w * 0.24);
      const cardH = cardW * 0.62;
      const gap = 22;

      for (let r = 0; r < 4; r++) {
        const offsetX = ((r % 2 === 0 ? 1 : -1) * t) % (cardW + gap);
        for (let c = -1; c < cols + 2; c++) {
          const idx = (r * cols + Math.abs(c)) % thumbs.length;
          const img = thumbs[idx];
          const x = c * (cardW + gap) + offsetX;
          const y = r * (cardH + gap);

          ctx.fillStyle = '#141416';
          ctx.fillRect(x, y, cardW, cardH);

          if (img && img.complete && img.naturalWidth > 0) {
            ctx.globalAlpha = 0.52;
            ctx.drawImage(img, x, y, cardW, cardH);
            ctx.globalAlpha = 1;
          }
          ctx.strokeStyle = 'rgba(239,233,223,0.08)';
          ctx.strokeRect(x, y, cardW, cardH);
        }
      }
      ctx.restore();

      if (!$gate.classList.contains('is-hidden')) {
        state.gateRaf = requestAnimationFrame(draw);
      }
    }

    state.gateRaf = requestAnimationFrame(draw);
  }

  /* ========================================================================
     开屏进度：按真实网络下载字节推进，加载完才允许进入；
     最多等 GATE_TIMEOUT_MS，超时直接放行。
     ======================================================================== */

  const GATE_TIMEOUT_MS = 30000;
  const GATE_MIN_MS = 500; // 命中缓存时也至少走完一次进度，避免闪一下

  /* 首屏真正需要的图：开屏拼贴缩略图 + 当前作品首帧（其余图懒加载，不拖住开屏） */
  function gatePreloadList() {
    const list = [];
    const seen = new Set();
    const add = (src) => {
      if (!src) return;
      let abs = '';
      try {
        abs = new URL(src, window.location.href).href;
      } catch (err) {
        return;
      }
      if (seen.has(abs)) return;
      seen.add(abs);
      list.push({ src, abs });
    };
    works.forEach((w) => add(w.thumb || w.poster));
    const cur = works[state.activeWorkIndex] || works[0];
    add(cur && cur.stills && cur.stills[0]);
    return list;
  }

  /* 从 Resource Timing 取这张图实际下载的字节数（取不到就按 0 计，后面用平均值兜底） */
  function resourceBytes(absUrl) {
    try {
      const entries = performance.getEntriesByName(absUrl);
      const e = entries[entries.length - 1];
      if (!e) return 0;
      return e.encodedBodySize || e.decodedBodySize || e.transferSize || 0;
    } catch (err) {
      return 0;
    }
  }

  function runSplashGate(forceShow) {
    const seen = sessionStorage.getItem('portfolio_gate_seen') === '1';
    if (seen && !forceShow) {
      $gate.classList.add('is-hidden');
      $gate.setAttribute('aria-hidden', 'true');
      return;
    }

    // 重看开屏时清掉上一次的定时器与动画帧
    clearTimeout(state.gateLoadTimer);
    clearTimeout(state.gateAutoExitTimer);
    if (state.gateProgressRaf) cancelAnimationFrame(state.gateProgressRaf);

    $gate.classList.remove('is-hidden', 'is-leaving');
    $gate.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    state.gateReady = false;

    $gateEnter.disabled = true;
    $gateEnter.classList.remove('is-ready');
    $gateEnter.querySelector('.gate-enter-label').textContent = '正在载入';
    $gateEnter.querySelector('.gate-enter-en').textContent = 'LOADING';
    $gateStatus.textContent = 'LOADING · 正在读取作品';

    const items = gatePreloadList().map((a) => ({ ...a, settled: false, bytes: 0 }));
    const startedAt = performance.now();
    let settledCount = 0;
    let knownBytes = 0;
    let finished = false;
    let finishReason = '';
    let display = 0;
    let target = 0;

    /* HTML/CSS/JS 就绪占 5%，图片下载占 5%–99%。
       已下载字节 / 预估总字节；未完成的按已完成平均值估，越接近完成越准 */
    const BASE_PCT = 5;
    function estimateProgress() {
      if (!items.length) return 99;
      const pending = items.length - settledCount;
      const avg = settledCount > 0 ? knownBytes / settledCount : 48 * 1024;
      const total = knownBytes + pending * avg;
      const ratio = total > 0 ? knownBytes / total : 0;
      return Math.min(99, BASE_PCT + ratio * (99 - BASE_PCT));
    }

    function paint() {
      const p = Math.round(display);
      $gateNum.innerHTML = `${pad2(p)}<small>%</small>`;
      $gateBarFill.style.width = `${display}%`;
    }

    function applyReady() {
      if (state.gateReady) return;
      state.gateReady = true;
      $gateEnter.disabled = false;
      $gateEnter.classList.add('is-ready');
      $gateEnter.querySelector('.gate-enter-label').textContent = '进入作品集';
      $gateEnter.querySelector('.gate-enter-en').textContent = 'ENTER';
      $gateStatus.textContent =
        finishReason === 'timeout' ? 'READY · 已就绪（超时放行）' : 'READY · 已就绪';
      if (finishReason === 'timeout') {
        state.gateAutoExitTimer = setTimeout(dismissGate, 700);
      }
    }

    function tick() {
      const diff = target - display;
      display += Math.abs(diff) < 0.2 ? diff : diff * 0.18;
      if (finished && display > 99.6) display = 100;
      paint();
      if (finished && display >= 100) {
        if (performance.now() - startedAt >= GATE_MIN_MS) {
          applyReady();
          return;
        }
      }
      state.gateProgressRaf = requestAnimationFrame(tick);
    }

    function finish(reason) {
      if (finished) return;
      finished = true;
      finishReason = reason;
      clearTimeout(state.gateLoadTimer);
      target = 100;
      // 后台标签页里 requestAnimationFrame 会暂停，用定时器兜底解锁，避免永远进不去
      setTimeout(() => {
        if (state.gateReady) return;
        display = 100;
        paint();
        applyReady();
      }, GATE_MIN_MS + 1200);
    }

    function settle(item) {
      if (item.settled) return;
      item.settled = true;
      settledCount += 1;
      item.bytes = resourceBytes(item.abs);
      knownBytes += item.bytes;
      if (settledCount >= items.length) {
        finish('loaded');
        return;
      }
      if (finished) return;
      target = estimateProgress();
      $gateStatus.textContent = `LOADING · 正在读取作品 ${settledCount}/${items.length}`;
    }

    // 先把网络请求发出去，再画开屏，保证进度条一出现就有真实下载在跑
    if (!items.length) {
      finish('loaded');
    } else {
      target = estimateProgress();
      $gateStatus.textContent = `LOADING · 正在读取作品 0/${items.length}`;
      items.forEach((item) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => settle(item);
        img.onerror = () => settle(item); // 失败也算结束，不卡住开屏
        img.src = item.src;
      });
    }

    initGateCanvas();
    paint();
    state.gateProgressRaf = requestAnimationFrame(tick);
    state.gateLoadTimer = setTimeout(() => finish('timeout'), GATE_TIMEOUT_MS);
  }

  function dismissGate() {
    if (!state.gateReady || $gate.classList.contains('is-leaving')) return;
    sessionStorage.setItem('portfolio_gate_seen', '1');
    $gate.classList.add('is-leaving');
    $gate.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    setTimeout(() => {
      $gate.classList.add('is-hidden');
      if (state.gateRaf) cancelAnimationFrame(state.gateRaf);
    }, 900);
  }

  $gateEnter.addEventListener('click', dismissGate);
  $replayGateBtn.addEventListener('click', () => {
    closeDrawer();
    runSplashGate(true);
  });

  /* ========================================================================
     2. 抽屉菜单控制
     ======================================================================== */

  function openDrawer() {
    $drawer.classList.add('is-open');
    $drawerScrim.classList.add('is-open');
    $menuToggle.classList.add('is-open');
    $menuToggle.setAttribute('aria-expanded', 'true');
    $drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeDrawer() {
    $drawer.classList.remove('is-open');
    $drawerScrim.classList.remove('is-open');
    $menuToggle.classList.remove('is-open');
    $menuToggle.setAttribute('aria-expanded', 'false');
    $drawer.setAttribute('aria-hidden', 'true');
    if (!$player.classList.contains('is-open') && !$lightbox.classList.contains('is-open')) {
      document.body.classList.remove('no-scroll');
    }
  }

  $menuToggle.addEventListener('click', () => {
    if ($drawer.classList.contains('is-open')) closeDrawer();
    else openDrawer();
  });

  $drawerScrim.addEventListener('click', closeDrawer);

  /* ========================================================================
     3. 路由与五列百叶窗转场
     ======================================================================== */

  function parseRoute(hash) {
    const clean = hash && hash.startsWith('#') ? hash : '#/';
    if (clean === '#/works') return { type: 'works' };
    if (clean === '#/about') return { type: 'about' };
    if (clean.startsWith('#/work/')) {
      const slug = clean.slice('#/work/'.length);
      const idx = works.findIndex((w) => w.slug === slug);
      return { type: 'work', index: idx >= 0 ? idx : 0 };
    }
    return { type: 'home' };
  }

  function getTransitionLabels(targetHash) {
    const parsed = parseRoute(targetHash);
    if (parsed.type === 'works') return { en: 'WORKS', cn: '全部作品索引' };
    if (parsed.type === 'about') return { en: 'ABOUT', cn: '郜维佳 · 导演简介与联系' };
    if (parsed.type === 'work') {
      const w = works[parsed.index];
      return { en: w.enTitle, cn: w.title };
    }
    return { en: 'HOME', cn: '精选剧目首页' };
  }

  function navigateTo(targetHash, skipTransition) {
    const normalized = targetHash.startsWith('#') ? targetHash : `#${targetHash}`;
    if (normalized === state.route && !skipTransition) {
      closeDrawer();
      return;
    }

    closeDrawer();

    if (skipTransition || state.isTransitioning) {
      window.location.hash = normalized;
      renderRoute(normalized);
      return;
    }

    state.isTransitioning = true;
    const labels = getTransitionLabels(normalized);
    $trEn.textContent = labels.en;
    $trCn.textContent = labels.cn;

    $tr.classList.remove('is-revealing');
    $tr.classList.add('is-active');

    requestAnimationFrame(() => {
      $tr.classList.add('is-covering');
    });

    setTimeout(() => {
      if (window.location.hash !== normalized) {
        window.location.hash = normalized;
      }
      renderRoute(normalized);
      window.scrollTo({ top: 0, behavior: 'instant' });

      $tr.classList.remove('is-covering');
      $tr.classList.add('is-revealing');

      setTimeout(() => {
        $tr.classList.remove('is-active', 'is-revealing');
        state.isTransitioning = false;
      }, 620);
    }, 580);
  }

  function updateHeaderAndDrawerActive(parsed) {
    document.querySelectorAll('.note-link').forEach((el) => el.classList.remove('is-active'));
    if (parsed.type === 'works') {
      $hdrWhere.textContent = 'INDEX · 作品';
      document.querySelector('.note-link[data-route="#/works"]')?.classList.add('is-active');
    } else if (parsed.type === 'about') {
      $hdrWhere.textContent = 'ABOUT · 关于';
      document.querySelector('.note-link[data-route="#/about"]')?.classList.add('is-active');
    } else if (parsed.type === 'work') {
      const w = works[parsed.index];
      $hdrWhere.textContent = `FILM ${w.num} · 详情`;
    } else {
      $hdrWhere.textContent = 'HOME · 精选';
      document.querySelector('.note-link[data-route="#/"]')?.classList.add('is-active');
    }
  }

  function destroyInlinePlayer() {
    if (state.inlinePlayerCtrl) {
      state.inlinePlayerCtrl.destroy();
      state.inlinePlayerCtrl = null;
    }
  }

  function renderRoute(hash) {
    destroyInlinePlayer();
    state.route = hash || '#/';
    const parsed = parseRoute(state.route);
    updateHeaderAndDrawerActive(parsed);

    if (parsed.type === 'works') {
      renderWorksPage();
    } else if (parsed.type === 'about') {
      renderAboutPage();
    } else if (parsed.type === 'work') {
      state.activeWorkIndex = parsed.index;
      renderWorkDetailPage(works[parsed.index]);
    } else {
      renderHomePage(works[state.activeWorkIndex]);
    }
  }

  /* ========================================================================
     4. 详情 7 大板块渲染 (新增：内嵌正片播放器 + 原有 6 大板块)
     ======================================================================== */

  function renderWorkBodyHtml(work, nextWork) {
    const hasEps = work.episodes && work.episodes.length > 0;

    const inlineEpButtons = hasEps
      ? work.episodes
          .map(
            (ep, idx) => `
            <button type="button" class="player-ep-btn ${idx === 0 ? 'is-active' : ''}" data-inline-ep="${idx}">
              ${escapeHtml(ep.shortLabel || ep.num)} · ${escapeHtml(ep.num)} (${escapeHtml(ep.duration)})
            </button>`
          )
          .join('')
      : '';

    const inlineWatchHtml = `
      <section class="sec watch-sec" id="inline-watch-sec">
        <div class="sec-head">
          <h2>正片播放 · 内嵌影院</h2>
          <div class="watch-head-right">
            <span>${escapeHtml(playSourceBadge(work))} · ${escapeHtml(work.duration)}</span>
            <button type="button" class="ep-mini-btn" id="open-modal-player-btn">影院浮窗模式 ↗</button>
          </div>
        </div>
        <div class="inline-player-shell">
          <div class="inline-player-topbar">
            <div class="inline-player-meta">
              <span class="player-num" style="font-size:20px">${work.num}</span>
              <span class="inline-player-title">${escapeHtml(work.title)}</span>
              <span class="vctrl-badge">${escapeHtml(playSourceBadge(work))}</span>
            </div>
            <div class="inline-player-eps" id="inline-player-eps">${inlineEpButtons}</div>
          </div>
          <div id="inline-player-mount"></div>
        </div>
      </section>
    `;

    const creditsHtml = work.credits
      .map(
        (c) => `
        <div class="credit-row">
          <dt>${escapeHtml(c.role)}</dt>
          <dd>${escapeHtml(c.name)}</dd>
        </div>`
      )
      .join('');

    const platformHtml = work.platformNote
      ? `<div class="platform-banner"><i class="platform-dot"></i><span>${escapeHtml(work.platformNote)}</span></div>`
      : '';

    const episodesHtml = hasEps
      ? `
      <section class="sec">
        <div class="sec-head">
          <h2>分集观看 · 双集连播</h2>
          <span>EPISODES · ${pad2(work.episodes.length)}</span>
        </div>
        <div class="eps">
          ${work.episodes
            .map(
              (ep, idx) => `
            <button type="button" class="ep ${ep.thumb ? 'ep-thumb-card' : ''}" data-play-ep="${idx}">
              ${ep.thumb ? `<div class="ep-thumb"><img src="${ep.thumb}" alt="${escapeHtml(ep.title)}" loading="lazy" /></div>` : `<span class="ep-num">${escapeHtml(ep.num)}</span>`}
              <div>
                <div class="ep-num" style="font-size:20px;margin-bottom:4px">${escapeHtml(ep.num)} · ${escapeHtml(ep.shortLabel || '')}</div>
                <div class="ep-title">${escapeHtml(ep.title)}</div>
                <div class="ep-sub">${escapeHtml(ep.enTitle)} · 时长 ${escapeHtml(ep.duration)}</div>
              </div>
              <span class="ep-play" aria-label="播放 ${escapeHtml(ep.title)}">▶</span>
            </button>`
            )
            .join('')}
        </div>
      </section>`
      : '';

    const posterHtml = work.poster
      ? `
      <section class="sec poster-sec">
        <div class="poster-grid">
          <div class="poster-frame">
            <img src="${work.poster}" alt="${escapeHtml(work.title)} 主视觉海报" loading="lazy" />
          </div>
          <div>
            <div class="poster-watermark" aria-hidden="true">POSTER</div>
            <p class="poster-caption">${escapeHtml(work.posterCaption || work.logline)}</p>
          </div>
        </div>
      </section>`
      : '';

    const isVert = work.aspect === '9:16';
    const stillsHtml = `
      <section class="sec">
        <div class="sec-head">
          <h2>原画实拍剧照</h2>
          <span>STILLS · ${pad2(work.stills.length)}</span>
        </div>
        <div class="stills-track ${isVert ? 'is-vertical' : ''}" id="stills-track">
          ${work.stills
            .map(
              (src, idx) => `
            <div class="still-card" data-still-idx="${idx}" role="button" tabindex="0" aria-label="查看大图第 ${idx + 1} 张">
              <img src="${src}" alt="${escapeHtml(work.title)} 剧照 ${idx + 1}" loading="lazy" />
              <span class="still-idx">${pad2(idx + 1)}</span>
            </div>`
            )
            .join('')}
        </div>
        <div class="stills-nav">
          <button type="button" class="circle-btn" id="stills-prev" aria-label="向左滑动剧照">←</button>
          <button type="button" class="circle-btn" id="stills-next" aria-label="向右滑动剧照">→</button>
          <div class="stills-bar"><i id="stills-bar-thumb"></i></div>
          <span class="stills-tip">拖动或左右滑动浏览 · 点击查看大图</span>
        </div>
      </section>`;

    const scriptHtml =
      work.scriptPages && work.scriptPages.length
        ? `
      <section class="sec">
        <div class="script-grid">
          <div class="script-aside">
            <span class="eyebrow">SCREENPLAY · 导演手记</span>
            <h2 style="margin:0;font-family:var(--f-serif);font-size:clamp(24px,2.4vw,34px);">从文字到影像</h2>
            <p>翻阅导演分场手记与剧本节选，对照成片中的调度、景别与情绪节拍。</p>
            <div class="script-src">${escapeHtml(work.scriptSource || '')}</div>
            <div class="script-controls">
              <button type="button" class="circle-btn" id="script-prev" aria-label="上一页剧本">←</button>
              <span class="script-pager" id="script-pager">01 / ${pad2(work.scriptPages.length)}</span>
              <button type="button" class="circle-btn" id="script-next" aria-label="下一页剧本">→</button>
            </div>
          </div>
          <div class="book-stage">
            <div class="book">
              <div class="book-edge" aria-hidden="true"></div>
              <article class="book-page" id="book-page"></article>
            </div>
          </div>
        </div>
      </section>`
        : '';

    const nextBg = nextWork.stills[0] || nextWork.poster || '';
    const nextHtml = `
      <section class="next" id="next-work-card" data-next-slug="${nextWork.slug}" role="button" tabindex="0" aria-label="浏览下一部作品 ${escapeHtml(nextWork.title)}">
        <img class="next-bg" src="${nextBg}" alt="" />
        <div class="next-scrim"></div>
        <div class="next-inner">
          <div class="next-eyebrow">NEXT · 下一部 · ${nextWork.num}</div>
          <h2 class="next-title">${escapeHtml(nextWork.title)}</h2>
          <div class="next-en">${escapeHtml(nextWork.enTitle)}</div>
        </div>
        <div class="next-bar"><i></i></div>
      </section>`;

    return `
      ${inlineWatchHtml}
      <section class="sec intro">
        <div class="intro-grid">
          <div>
            <div class="intro-bar"></div>
            <blockquote class="intro-quote">${escapeHtml(work.quote)}</blockquote>
            <div class="intro-tag">${escapeHtml(work.quoteEn)}</div>
          </div>
          <div class="intro-body">
            ${work.synopsis.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
            <dl class="credits">${creditsHtml}</dl>
            ${platformHtml}
          </div>
        </div>
      </section>
      ${episodesHtml}
      ${posterHtml}
      ${stillsHtml}
      ${scriptHtml}
      ${nextHtml}
      ${renderFooterHtml()}
    `;
  }

  function renderFooterHtml() {
    const icpHtml = site.icp
      ? `<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="foot-icp">${escapeHtml(site.icp)}</a>`
      : '';
    return `
      <footer class="foot">
        <div class="foot-left">
          <span>${escapeHtml(site.copyright)}</span>
          <span>手机 ${escapeHtml(site.contact.phone)}</span>
          <span>邮箱 ${escapeHtml(site.contact.email)}</span>
          ${icpHtml}
        </div>
        <nav class="foot-nav" aria-label="页脚导航">
          <a href="#/" data-route="#/">首页</a>
          <a href="#/works" data-route="#/works">作品</a>
          <a href="#/about" data-route="#/about">关于</a>
        </nav>
      </footer>
    `;
  }

  function bindWorkBodyEvents(work, onNextWork) {
    // 挂载页面内嵌影院播放器
    const $inlineMount = document.getElementById('inline-player-mount');
    if ($inlineMount) {
      state.inlinePlayerCtrl = createCinemaPlayerController($inlineMount, work, {
        isModal: false,
        epIndex: 0,
        autoPlay: false,
        onEpisodeChange: (epIdx) => {
          document.querySelectorAll('[data-inline-ep]').forEach((btn, i) => {
            btn.classList.toggle('is-active', i === epIdx);
          });
        }
      });

      document.querySelectorAll('[data-inline-ep]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const epIdx = Number(btn.getAttribute('data-inline-ep')) || 0;
          state.inlinePlayerCtrl?.loadEpisode(epIdx, true);
        });
      });

      document.getElementById('open-modal-player-btn')?.addEventListener('click', () => {
        const curIdx = state.inlinePlayerCtrl ? state.inlinePlayerCtrl.getEpisodeIndex() : 0;
        openPlayer(work, curIdx);
      });
    }

    // 分集卡片按钮（直接拉起影院弹窗播放对应集，同时同步内嵌播放器）
    document.querySelectorAll('[data-play-ep]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const epIdx = Number(btn.getAttribute('data-play-ep')) || 0;
        openPlayer(work, epIdx);
      });
    });

    // 剧照画廊拖拽 + 点击灯箱
    const $track = document.getElementById('stills-track');
    const $thumb = document.getElementById('stills-bar-thumb');
    if ($track) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let hasDragged = false;

      const syncBar = () => {
        const maxScroll = $track.scrollWidth - $track.clientWidth;
        if (maxScroll <= 0 || !$thumb) return;
        const ratio = $track.scrollLeft / maxScroll;
        $thumb.style.left = `${ratio * 72}%`;
      };

      $track.addEventListener('scroll', syncBar, { passive: true });

      $track.addEventListener('mousedown', (e) => {
        isDown = true;
        hasDragged = false;
        startX = e.pageX - $track.offsetLeft;
        scrollLeft = $track.scrollLeft;
        $track.classList.add('is-dragging');
      });

      window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        $track.classList.remove('is-dragging');
      });

      $track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - $track.offsetLeft;
        const delta = x - startX;
        if (Math.abs(delta) > 6) hasDragged = true;
        $track.scrollLeft = scrollLeft - delta * 1.25;
      });

      $track.querySelectorAll('.still-card').forEach((card) => {
        card.addEventListener('click', () => {
          if (hasDragged) {
            hasDragged = false;
            return;
          }
          const idx = Number(card.getAttribute('data-still-idx')) || 0;
          openLightbox(work.stills, idx);
        });
      });

      document.getElementById('stills-prev')?.addEventListener('click', () => {
        $track.scrollBy({ left: -$track.clientWidth * 0.65, behavior: 'smooth' });
      });
      document.getElementById('stills-next')?.addEventListener('click', () => {
        $track.scrollBy({ left: $track.clientWidth * 0.65, behavior: 'smooth' });
      });
    }

    // 3D 剧本翻页
    if (work.scriptPages && work.scriptPages.length) {
      state.scriptPageIndex = 0;
      renderScriptPage(work, 0);

      document.getElementById('script-prev')?.addEventListener('click', () => {
        flipScriptPage(work, -1);
      });
      document.getElementById('script-next')?.addEventListener('click', () => {
        flipScriptPage(work, 1);
      });
    }

    // 下一部
    const $next = document.getElementById('next-work-card');
    if ($next) {
      $next.addEventListener('click', onNextWork);
    }
  }

  function renderScriptPage(work, pageIndex) {
    const $page = document.getElementById('book-page');
    const $pager = document.getElementById('script-pager');
    if (!$page || !work.scriptPages.length) return;

    const page = work.scriptPages[pageIndex];
    const total = work.scriptPages.length;
    if ($pager) $pager.textContent = `${pad2(pageIndex + 1)} / ${pad2(total)}`;

    const blocksHtml = page.blocks
      .map((b) => {
        if (b.type === 'scene') return `<div class="sp-scene">${escapeHtml(b.text)}</div>`;
        if (b.type === 'action') return `<div class="sp-action">${escapeHtml(b.text)}</div>`;
        if (b.type === 'char') return `<div class="sp-char">${escapeHtml(b.text)}</div>`;
        if (b.type === 'paren') return `<div class="sp-paren">${escapeHtml(b.text)}</div>`;
        if (b.type === 'dia') return `<div class="sp-dia">${escapeHtml(b.text)}</div>`;
        if (b.type === 'trans') return `<div class="sp-trans">${escapeHtml(b.text)}</div>`;
        return `<div>${escapeHtml(b.text)}</div>`;
      })
      .join('');

    $page.innerHTML = `
      <div class="book-page-head">
        <span>${escapeHtml(work.enTitle)}</span>
        <span>PAGE ${pad2(pageIndex + 1)}</span>
      </div>
      <div class="book-content">${blocksHtml}</div>
      <div class="book-page-foot">${escapeHtml(work.director)} · DIRECTOR NOTE</div>
    `;
  }

  function flipScriptPage(work, delta) {
    const total = work.scriptPages.length;
    const nextIdx = (state.scriptPageIndex + delta + total) % total;
    const $page = document.getElementById('book-page');
    if (!$page) return;

    const animClass = delta > 0 ? 'is-flipping-next' : 'is-flipping-prev';
    $page.classList.add(animClass);
    setTimeout(() => {
      state.scriptPageIndex = nextIdx;
      renderScriptPage(work, nextIdx);
      $page.classList.remove(animClass);
    }, 220);
  }

  /* ========================================================================
     5. 首页视图 (#/)
     ======================================================================== */

  function renderHomePage(work) {
    destroyInlinePlayer();
    setAccent(work);
    const isVert = work.aspect === '9:16';
    const nextIdx = (state.activeWorkIndex + 1) % works.length;
    const nextWork = works[nextIdx];
    const thumbBg = work.stills[0] || work.poster || '';
    const hasEps = work.episodes && work.episodes.length > 0;
    const previewMode = resolveWorkMediaMode(work);
    const heroVideo = previewMode === 'local' && shouldAutoplayHeroVideo();

    const filmstripHtml = works
      .map(
        (w, i) => `
        <button type="button" class="fs-item ${i === state.activeWorkIndex ? 'is-active' : ''}" data-fs-idx="${i}" aria-label="切换至 ${escapeHtml(w.title)}">
          <img src="${w.thumb || w.poster || w.stills[0]}" alt="" loading="lazy" decoding="async" />
          <span>${w.num}</span>
        </button>`
      )
      .join('');

    const titleHtml =
      work.primaryLang === 'en'
        ? `<div class="home-en">${escapeHtml(work.subTitleCn || work.enTitle)}</div>
           <h1 class="home-title is-en">${escapeHtml(work.title)}</h1>`
        : `<div class="home-en">${escapeHtml(work.enTitle)}</div>
           <h1 class="home-title">${escapeHtml(work.title)}</h1>`;

    const actionButtonsHtml = hasEps
      ? `<div class="hero-ep-btns">
          ${work.episodes
            .map(
              (ep, idx) => `
            <button type="button" class="btn ${idx === 0 ? 'btn-accent' : 'btn-ep-alt'}" data-hero-ep="${idx}">
              <span>▶ 播放${escapeHtml(ep.shortLabel || ep.num)} ${escapeHtml(ep.num)}</span>
            </button>`
            )
            .join('')}
        </div>`
      : `<button type="button" class="btn btn-accent" id="home-watch-btn">
          <span>▶ ${previewMode === 'local' ? '观看影片（高清）' : '在线观看影片'}</span>
        </button>`;

    $app.innerHTML = `
      <div class="home-wrap">
        <section class="home" id="home-hero">
          <div class="home-glow"></div>
          <div class="home-media ${isVert ? 'is-vertical' : 'is-landscape'}">
            <div class="pv-bg-blur" style="background-image:url('${thumbBg}')"></div>
            <div class="pv ${isVert ? 'is-vertical' : ''}">
              ${
                heroVideo
                  ? `<video id="home-preview-video" poster="${thumbBg}" muted loop playsinline autoplay preload="metadata"></video>`
                  : `<button type="button" class="pv-poster" id="home-poster-btn" aria-label="播放 ${escapeHtml(work.title)}">
                       <img src="${thumbBg}" alt="${escapeHtml(work.title)} 主视觉" />
                       <span class="pv-poster-play" aria-hidden="true">▶</span>
                       <span class="pv-poster-tip">${previewMode === 'none' ? '影片即将上线' : '点击播放正片'}</span>
                     </button>`
              }
            </div>
          </div>
          <div class="home-scrim"></div>
          <div class="home-dim" id="home-dim"></div>

          <div class="home-info">
            <div class="home-meta">
              <span class="home-idx">${work.num} —— ${pad2(works.length)}</span>
              <span class="chip">${escapeHtml(work.category)}</span>
              ${hasEps ? `<span class="chip chip-multi">共 ${work.episodes.length} 集 · EP01 + EP02</span>` : ''}
              <span class="chip chip-aspect">${escapeHtml(work.aspect)} · ${escapeHtml(work.duration)}</span>
            </div>
            ${titleHtml}
            <p class="home-logline">${escapeHtml(work.logline)}</p>
            <div class="home-actions">
              ${actionButtonsHtml}
              <a href="#/work/${work.slug}" data-route="#/work/${work.slug}" class="link-arrow">
                作品详情 →
              </a>
            </div>
          </div>

          <div class="home-progress" aria-hidden="true">
            <span class="home-progress-cur">${work.num}</span>
            <span class="home-progress-line"></span>
            <span class="home-progress-total">${pad2(works.length)}</span>
          </div>

          <div class="filmstrip-wrap">
            <button type="button" class="fs-arrow" id="fs-prev" aria-label="上一部作品">←</button>
            <div class="filmstrip" id="filmstrip">${filmstripHtml}</div>
            <button type="button" class="fs-arrow" id="fs-next" aria-label="下一部作品">→</button>
          </div>

          <button type="button" class="home-scroll" id="home-scroll-btn">
            <span class="mouse-icon"><i></i></span>
            <span>向下滚动 · 内嵌正片播放与详情</span>
          </button>
        </section>

        <div class="home-body" id="home-body">
          <div class="home-handle" aria-hidden="true"></div>
          ${renderWorkBodyHtml(work, nextWork)}
        </div>
      </div>
    `;

    const $vid = document.getElementById('home-preview-video');
    if ($vid) {
      bindVideoWithFallback($vid, work.video, work.fallbackVideo);
      $vid.play().catch(() => {});
    }

    document.getElementById('home-poster-btn')?.addEventListener('click', () => openPlayer(work, 0));

    document.getElementById('home-watch-btn')?.addEventListener('click', () => openPlayer(work, 0));

    document.querySelectorAll('[data-hero-ep]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-hero-ep')) || 0;
        openPlayer(work, idx);
      });
    });

    document.getElementById('home-scroll-btn')?.addEventListener('click', () => {
      document.getElementById('home-body')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('fs-prev')?.addEventListener('click', () => {
      switchHomeWork((state.activeWorkIndex - 1 + works.length) % works.length);
    });
    document.getElementById('fs-next')?.addEventListener('click', () => {
      switchHomeWork((state.activeWorkIndex + 1) % works.length);
    });

    document.querySelectorAll('[data-fs-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-fs-idx'));
        if (idx !== state.activeWorkIndex) switchHomeWork(idx);
      });
    });

    const $filmstrip = document.getElementById('filmstrip');
    const activeFs = document.querySelector('.fs-item.is-active');
    if ($filmstrip && activeFs) {
      const targetLeft = activeFs.offsetLeft - ($filmstrip.clientWidth - activeFs.clientWidth) / 2;
      $filmstrip.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }

    // 手机端左右滑动切剧手势（鸿蒙 / iOS / 安卓 / 微信通用）
    const $homeHero = document.getElementById('home-hero');
    if ($homeHero) {
      let touchStartX = 0;
      let touchStartY = 0;
      $homeHero.addEventListener(
        'touchstart',
        (e) => {
          if (!e.touches[0]) return;
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        },
        { passive: true }
      );
      $homeHero.addEventListener(
        'touchend',
        (e) => {
          if (!e.changedTouches[0]) return;
          if (e.target.closest('.filmstrip')) return;
          const dx = e.changedTouches[0].clientX - touchStartX;
          const dy = e.changedTouches[0].clientY - touchStartY;
          if (Math.abs(dx) > 54 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            if (dx < 0) switchHomeWork((state.activeWorkIndex + 1) % works.length);
            else switchHomeWork((state.activeWorkIndex - 1 + works.length) % works.length);
          }
        },
        { passive: true }
      );
    }

    bindWorkBodyEvents(work, () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => switchHomeWork(nextIdx), 260);
    });
  }

  function switchHomeWork(nextIndex) {
    state.activeWorkIndex = nextIndex;
    renderHomePage(works[nextIndex]);
  }

  window.addEventListener(
    'scroll',
    () => {
      const $hero = document.getElementById('home-hero');
      const $dim = document.getElementById('home-dim');
      if (!$hero || !$dim) return;
      const h = $hero.offsetHeight || window.innerHeight;
      const ratio = Math.min(1, Math.max(0, window.scrollY / h));
      $hero.style.transform = `scale(${1 - ratio * 0.045})`;
      $dim.style.opacity = String(ratio * 0.55);
    },
    { passive: true }
  );

  /* ========================================================================
     6. 独立作品详情页 (#/work/<slug>)
     ======================================================================== */

  function renderWorkDetailPage(work) {
    destroyInlinePlayer();
    setAccent(work);
    const idx = works.findIndex((w) => w.slug === work.slug);
    const prevWork = works[(idx - 1 + works.length) % works.length];
    const nextWork = works[(idx + 1) % works.length];
    const heroBg = work.stills[0] || work.poster || '';
    const hasEps = work.episodes && work.episodes.length > 0;

    const detailEpButtons = hasEps
      ? `<div class="hero-ep-btns" style="margin-top:24px">
          ${work.episodes
            .map(
              (ep, i) => `
            <button type="button" class="btn ${i === 0 ? 'btn-accent' : 'btn-ep-alt'}" data-detail-ep="${i}">
              <span>▶ ${escapeHtml(ep.shortLabel || ep.num)} ${escapeHtml(ep.num)} (${escapeHtml(ep.duration)})</span>
            </button>`
            )
            .join('')}
        </div>`
      : '';

    $app.innerHTML = `
      <article class="work-detail">
        <section class="work-hero">
          <div class="work-hero-bg"><img src="${heroBg}" alt="" /></div>
          <div class="work-hero-scrim"></div>

          <div class="work-crumb">
            <a href="#/works" data-route="#/works">← 全部作品 · ${work.num} / ${pad2(works.length)}</a>
            <div class="work-crumb-nav">
              <a href="#/work/${prevWork.slug}" data-route="#/work/${prevWork.slug}">上一部</a>
              <span>/</span>
              <a href="#/work/${nextWork.slug}" data-route="#/work/${nextWork.slug}">下一部</a>
            </div>
          </div>

          <div class="work-hero-info">
            <div>
              <div class="home-meta">
                <span class="chip">${escapeHtml(work.category)}</span>
                ${hasEps ? `<span class="chip chip-multi">共 ${work.episodes.length} 集 · 双集项目</span>` : ''}
                <span class="chip chip-aspect">${escapeHtml(work.aspect)} · ${escapeHtml(work.resolution || '原画')}</span>
              </div>
              <h1 class="work-hero-title">${escapeHtml(work.title)}</h1>
              <div class="work-hero-en">${escapeHtml(work.subTitleCn || work.enTitle)}</div>
              <p class="work-hero-logline">${escapeHtml(work.logline)}</p>
              <div class="work-meta-grid">
                <div class="work-meta-item">
                  <label>DURATION</label>
                  <span>${escapeHtml(work.duration)}</span>
                </div>
                <div class="work-meta-item">
                  <label>FORMAT</label>
                  <span>${escapeHtml(work.aspect)} · ${escapeHtml(work.resolution || '原画')}</span>
                </div>
                <div class="work-meta-item">
                  <label>DIRECTOR</label>
                  <span>${escapeHtml(work.director)}</span>
                </div>
              </div>
              ${detailEpButtons}
            </div>

            <div class="play-big-wrap">
              <button type="button" class="play-big" id="detail-play-btn" aria-label="播放正片">▶</button>
              <span class="play-big-label">${hasEps ? '播放第一集 EP01' : '播放正片'}</span>
            </div>
          </div>
        </section>

        <div class="work-body">
          ${renderWorkBodyHtml(work, nextWork)}
        </div>
      </article>
    `;

    document.getElementById('detail-play-btn')?.addEventListener('click', () => openPlayer(work, 0));
    document.querySelectorAll('[data-detail-ep]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const epIdx = Number(btn.getAttribute('data-detail-ep')) || 0;
        openPlayer(work, epIdx);
      });
    });

    bindWorkBodyEvents(work, () => navigateTo(`#/work/${nextWork.slug}`));
  }

  /* ========================================================================
     7. 作品索引页 (#/works) — 列表悬停解码 + 海报墙双视图（含双集独立按钮）
     ======================================================================== */

  function scrambleText(el, targetText) {
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let frame = 0;
    const totalFrames = 14;
    clearInterval(el._scrambleTimer);
    el._scrambleTimer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      el.textContent = targetText
        .split('')
        .map((ch, idx) => {
          if (ch === ' ') return ' ';
          if (idx / targetText.length < progress) return ch;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');
      if (frame >= totalFrames) {
        clearInterval(el._scrambleTimer);
        el.textContent = targetText;
      }
    }, 24);
  }

  function renderWorksPreviewHtml(w) {
    if (!w) return '';
    const cover = w.poster || w.stills[0] || '';
    const hasEps = w.episodes && w.episodes.length > 0;
    const playBtns = hasEps
      ? w.episodes
          .map(
            (ep, i) =>
              `<button type="button" class="btn ${i === 0 ? 'btn-accent' : 'btn-ep-alt'}" data-preview-play="${w.id}" data-preview-ep="${i}">▶ 播放${escapeHtml(ep.shortLabel || ep.num)} ${escapeHtml(ep.num)}</button>`
          )
          .join('')
      : `<button type="button" class="btn btn-accent" data-preview-play="${w.id}" data-preview-ep="0">▶ 立即播放</button>`;

    return `
      <div class="works-poster-stage">
        <span class="works-poster-badge">${w.num} · ${escapeHtml(w.aspect)} · ${escapeHtml(w.resolution || '原画')}</span>
        <a href="#/work/${w.slug}" data-route="#/work/${w.slug}" class="works-poster-link" aria-label="查看 ${escapeHtml(w.title)} 详情">
          <img src="${cover}" alt="${escapeHtml(w.title)} 海报" class="works-poster-img" />
        </a>
      </div>
      <div class="works-preview-meta">
        <div class="works-preview-sub">${escapeHtml(w.category)} · ${escapeHtml(w.duration)}</div>
        <h2 class="works-preview-title">${escapeHtml(w.title)}</h2>
        <p class="works-preview-desc">${escapeHtml(w.logline)}</p>
        <div class="works-preview-actions">
          ${playBtns}
          <a href="#/work/${w.slug}" data-route="#/work/${w.slug}" class="link-arrow">作品详情 →</a>
        </div>
      </div>
    `;
  }

  function renderWorksPage() {
    destroyInlinePlayer();
    const cats = site.categories || [
      { key: 'all', label: '全部' },
      { key: 'overseas', label: '海外剧' },
      { key: 'comic', label: '漫剧' },
      { key: 'live', label: '真人剧' },
      { key: 'mv', label: 'MV' }
    ];
    const countOf = (key) => (key === 'all' ? works.length : works.filter((w) => w.categoryKey === key).length);
    const filtered = works.filter((w) => state.worksFilter === 'all' || w.categoryKey === state.worksFilter);
    const previewWork = filtered[0] || works[0];
    setAccent(previewWork);
    const initialBg = previewWork.stills[0] || previewWork.poster || '';

    const listHtml = `
      <div class="works-list-wrap">
        <aside class="works-preview" id="works-preview" aria-label="当前作品海报预览">
          ${renderWorksPreviewHtml(previewWork)}
        </aside>
        <div class="works-list" id="works-list">
          ${filtered
            .map((w, idx) => {
              const hasEps = w.episodes && w.episodes.length > 0;
              const thumb = w.poster || w.stills[0] || '';
              const epBtns = hasEps
                ? w.episodes
                    .map(
                      (ep, i) =>
                        `<button type="button" class="ep-mini-btn" data-works-play="${w.id}" data-works-ep="${i}">▶ ${escapeHtml(ep.num)}</button>`
                    )
                    .join('')
                : `<span class="wl-cat">${escapeHtml(w.category)} · ${escapeHtml(w.aspect)}</span>`;
              return `
              <div class="wl-row ${idx === 0 ? 'is-selected' : ''}" data-work-id="${w.id}">
                <span class="wl-num">${w.num}</span>
                <a href="#/work/${w.slug}" data-route="#/work/${w.slug}" class="wl-mobile-thumb" aria-hidden="true">
                  <img src="${thumb}" alt="" loading="lazy" />
                </a>
                <a href="#/work/${w.slug}" data-route="#/work/${w.slug}">
                  <div class="wl-en" data-en="${escapeHtml(w.enTitle)}">${escapeHtml(w.enTitle)}</div>
                  <div class="wl-cn">${escapeHtml(w.title)}${w.subTitleCn ? ` · ${escapeHtml(w.subTitleCn)}` : ''}</div>
                </a>
                <div class="wl-actions">${epBtns}</div>
              </div>`;
            })
            .join('')}
        </div>
      </div>`;

    const wallHtml = `
      <div class="works-wall">
        ${filtered
          .map((w) => {
            const hasPoster = Boolean(w.poster);
            const cover = w.poster || w.stills[0];
            const isLand = w.aspect === '16:9';
            const hasEps = w.episodes && w.episodes.length > 0;
            const epQuickRow = hasEps
              ? `<div class="wall-ep-row">
                  ${w.episodes
                    .map(
                      (ep, i) =>
                        `<button type="button" class="ep-mini-btn" data-works-play="${w.id}" data-works-ep="${i}">▶ ${escapeHtml(ep.shortLabel || ep.num)} ${escapeHtml(ep.num)}</button>`
                    )
                    .join('')}
                </div>`
              : '';
            return `
            <div class="wall-card" data-work-id="${w.id}">
              <a href="#/work/${w.slug}" data-route="#/work/${w.slug}" class="wall-poster ${hasPoster ? '' : 'gen'} ${isLand ? 'is-landscape-cover' : ''}">
                ${isLand ? `<span class="wall-poster-blur" style="background-image:url('${cover}')" aria-hidden="true"></span>` : ''}
                <img src="${cover}" alt="${escapeHtml(w.title)}" loading="lazy" />
              </a>
              <div class="wall-meta">
                <a href="#/work/${w.slug}" data-route="#/work/${w.slug}" class="wall-title">${escapeHtml(w.title)}</a>
                <span class="wall-cat">${hasEps ? '2 集连播' : escapeHtml(w.category)}</span>
              </div>
              ${epQuickRow}
            </div>`;
          })
          .join('')}
      </div>`;

    $app.innerHTML = `
      <div class="works-page">
        <div class="works-bg"><img id="works-bg-img" src="${initialBg}" alt="" /></div>
        <div class="works-giant" id="works-giant" aria-hidden="true">
          <div class="works-giant-cn">作品</div>
          <div class="works-giant-en">WORKS</div>
        </div>

        <div class="works-shell">
          <div class="works-head">
            <span class="eyebrow">SELECTED WORKS · ${pad2(works.length)}</span>
            <div class="works-controls">
              <div class="filter-pills">
                ${cats
                  .map(
                    (c) =>
                      `<button type="button" class="pill ${state.worksFilter === c.key ? 'is-active' : ''}" data-filter="${c.key}">${escapeHtml(c.label)} ${pad2(countOf(c.key))}</button>`
                  )
                  .join('')}
              </div>
              <div class="view-switch ${state.worksView === 'wall' ? 'is-wall' : ''}" id="view-switch">
                <span class="view-switch-thumb" aria-hidden="true"></span>
                <button type="button" class="${state.worksView === 'list' ? 'is-active' : ''}" data-view="list">列表</button>
                <button type="button" class="${state.worksView === 'wall' ? 'is-active' : ''}" data-view="wall">海报墙</button>
              </div>
            </div>
          </div>

          ${state.worksView === 'list' ? listHtml : wallHtml}
        </div>
      </div>
      ${renderFooterHtml()}
    `;

    document.querySelector('.works-head')?.addEventListener('click', (e) => {
      const filterBtn = e.target.closest('[data-filter]');
      if (filterBtn) {
        const nextFilter = filterBtn.getAttribute('data-filter');
        if (nextFilter && nextFilter !== state.worksFilter) {
          state.worksFilter = nextFilter;
          renderWorksPage();
        }
        return;
      }
      const viewBtn = e.target.closest('[data-view]');
      if (viewBtn) {
        const nextView = viewBtn.getAttribute('data-view');
        if (nextView && nextView !== state.worksView) {
          state.worksView = nextView;
          renderWorksPage();
        }
      }
    });

    // 快捷分集播放按钮（如 Mia's Wild Wonderland EP01 / EP02）
    document.querySelectorAll('[data-works-play]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-works-play');
        const epIdx = Number(btn.getAttribute('data-works-ep')) || 0;
        const w = works.find((item) => item.id === id);
        if (w) openPlayer(w, epIdx);
      });
    });

    const $list = document.getElementById('works-list');
    const $preview = document.getElementById('works-preview');
    const $bgImg = document.getElementById('works-bg-img');
    const $giant = document.getElementById('works-giant');

    function bindPreviewPlayBtns() {
      $preview?.querySelectorAll('[data-preview-play]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-preview-play');
          const epIdx = Number(btn.getAttribute('data-preview-ep')) || 0;
          const w = works.find((item) => item.id === id);
          if (w) openPlayer(w, epIdx);
        });
      });
    }

    bindPreviewPlayBtns();

    if ($list) {
      let lastPreviewId = previewWork.id;
      const activateRow = (row) => {
        const id = row.getAttribute('data-work-id');
        const w = works.find((item) => item.id === id);
        if (!w) return;
        $list.querySelectorAll('.wl-row').forEach((r) => r.classList.toggle('is-selected', r === row));
        setAccent(w);
        if ($bgImg) $bgImg.src = w.stills[0] || w.poster || '';
        const $en = row.querySelector('.wl-en');
        if ($en && lastPreviewId !== id) scrambleText($en, $en.getAttribute('data-en'));
        if ($preview && lastPreviewId !== id) {
          lastPreviewId = id;
          $preview.innerHTML = renderWorksPreviewHtml(w);
          bindPreviewPlayBtns();
        }
      };

      $list.querySelectorAll('.wl-row').forEach((row) => {
        row.addEventListener('mouseenter', () => {
          $list.classList.add('is-hovering');
          $giant?.classList.add('is-lit');
          activateRow(row);
        });
        row.addEventListener('focusin', () => activateRow(row));
      });

      $list.addEventListener('mouseleave', () => {
        $list.classList.remove('is-hovering');
        $giant?.classList.remove('is-lit');
      });
    }
  }

  /* ========================================================================
     8. 关于与联系页 (#/about)
     ======================================================================== */

  function renderAboutPage() {
    destroyInlinePlayer();
    setAccent(works[state.activeWorkIndex]);
    const trackCats = (site.categories || []).filter((c) => c.key !== 'all');
    const qrTip = isWeChat ? '微信内长按二维码可直接识别添加好友' : site.contact.qrCaption;

    $app.innerHTML = `
      <div class="about-page">
        <section class="about-hero">
          <h1 class="about-name">${escapeHtml(site.nameCn)}</h1>
          <div class="about-subbar">
            <span>${escapeHtml(site.roleCn)}</span>
            <span>${escapeHtml(site.roleEn)}</span>
          </div>
        </section>

        <section class="about-intro">
          <div class="about-intro-lead">${escapeHtml(site.introLead)}</div>
          <div class="about-intro-desc">${escapeHtml(site.introDesc)}</div>
        </section>

        <section class="stats">
          ${site.stats
            .map(
              (st, idx) => `
            <div class="stat-item">
              <div class="stat-num" data-count-to="${st.value}" id="stat-num-${idx}">00</div>
              <div class="stat-label">${escapeHtml(st.label)}</div>
              <div class="stat-sub">${escapeHtml(st.sub)}</div>
            </div>`
            )
            .join('')}
        </section>

        <section class="forms">
          ${trackCats
            .map((cat) => {
              const items = works.filter((w) => w.categoryKey === cat.key);
              return `
              <div class="form-col">
                <div class="form-head">
                  <h3>${escapeHtml(cat.label)}</h3>
                  <span>${escapeHtml(cat.en)} · ${pad2(items.length)}</span>
                </div>
                <div class="form-list">
                  ${items
                    .map(
                      (w) => `
                    <a href="#/work/${w.slug}" data-route="#/work/${w.slug}" class="form-link">
                      <span>${w.num} · ${escapeHtml(w.title)}${w.episodes ? `（${w.episodes.length} 集）` : ''}</span>
                      <span>${escapeHtml(w.duration)} →</span>
                    </a>`
                    )
                    .join('')}
                </div>
              </div>`;
            })
            .join('')}
        </section>

        <section class="contact">
          <div class="eyebrow">${escapeHtml(site.contact.eyebrow)}</div>
          <h2 class="contact-headline">${escapeHtml(site.contact.headlinePrefix)}<span>${escapeHtml(site.contact.headlineAccent)}</span></h2>
          <div class="contact-wrap">
            <div class="contact-rows">
              <div class="contact-row">
                <label>创作者</label>
                <span class="contact-val">${escapeHtml(site.nameCn)} · ${escapeHtml(site.age)} 岁</span>
              </div>
              <div class="contact-row">
                <label>手机号</label>
                <span class="contact-val">${escapeHtml(site.contact.phone)}</span>
                <a href="tel:${escapeHtml(site.contact.phone)}" class="copy-btn">拨打</a>
                <button type="button" class="copy-btn" data-copy="${escapeHtml(site.contact.phone)}">复制</button>
              </div>
              <div class="contact-row">
                <label>QQ 邮箱</label>
                <span class="contact-val">${escapeHtml(site.contact.email)}</span>
                <button type="button" class="copy-btn" data-copy="${escapeHtml(site.contact.email)}">复制</button>
              </div>
              <div class="contact-row">
                <label>微信</label>
                <span class="contact-val">${escapeHtml(site.contact.wechatHint)}</span>
              </div>
            </div>
            <div class="contact-qr">
              <div class="contact-qr-card" id="about-qr-zoom" role="button" tabindex="0" aria-label="点击放大微信二维码">
                <img src="${site.contact.qrImage}" alt="郜维佳微信加好友二维码" />
              </div>
              <span>${escapeHtml(qrTip)}</span>
              <span class="contact-wechat-tip">手机端长按图片或点击放大保存</span>
            </div>
          </div>
        </section>

        ${renderFooterHtml()}
      </div>
    `;

    document.querySelectorAll('[data-count-to]').forEach((el) => {
      const target = Number(el.getAttribute('data-count-to')) || 0;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 18));
      const timer = setInterval(() => {
        current = Math.min(target, current + step);
        el.textContent = pad2(current);
        if (current >= target) clearInterval(timer);
      }, 36);
    });

    document.getElementById('about-qr-zoom')?.addEventListener('click', () => {
      openLightbox([site.contact.qrImage], 0);
    });

    document.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy');
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
          } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          showToast(`已复制：${text}`);
        } catch (err) {
          showToast(`请手动复制：${text}`);
        }
      });
    });
  }

  /* ========================================================================
     9. 全屏影院弹窗播放器 (.player)
     ======================================================================== */

  function openPlayer(work, epIndex) {
    state.inlinePlayerCtrl?.pause();
    const $homeVid = document.getElementById('home-preview-video');
    $homeVid?.pause();

    $playerNum.textContent = work.num;
    $playerTitle.textContent = work.title;
    $playerEn.textContent = work.subTitleCn || work.enTitle;
    $playerQualityBadge.textContent = playSourceBadge(work);

    const hasEps = work.episodes && work.episodes.length > 0;
    if (hasEps) {
      $playerEps.innerHTML = work.episodes
        .map(
          (ep, idx) => `
          <button type="button" class="player-ep-btn ${idx === (epIndex || 0) ? 'is-active' : ''}" data-ep-switch="${idx}">
            ${escapeHtml(ep.shortLabel || ep.num)} · ${escapeHtml(ep.num)} (${escapeHtml(ep.duration)})
          </button>`
        )
        .join('');
    } else {
      $playerEps.innerHTML = '';
    }

    if (state.modalPlayerCtrl) {
      state.modalPlayerCtrl.destroy();
      state.modalPlayerCtrl = null;
    }

    state.modalPlayerCtrl = createCinemaPlayerController($modalPlayerMount, work, {
      isModal: true,
      epIndex: epIndex || 0,
      autoPlay: true,
      onEpisodeChange: (idx) => {
        $playerEps.querySelectorAll('.player-ep-btn').forEach((b, i) => b.classList.toggle('is-active', i === idx));
      }
    });

    if (hasEps) {
      $playerEps.querySelectorAll('[data-ep-switch]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.getAttribute('data-ep-switch')) || 0;
          state.modalPlayerCtrl?.loadEpisode(idx, true);
        });
      });
    }

    $player.classList.add('is-open');
    $player.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closePlayer() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    if (state.modalPlayerCtrl) {
      state.modalPlayerCtrl.destroy();
      state.modalPlayerCtrl = null;
    }
    $modalPlayerMount.innerHTML = '';
    $player.classList.remove('is-open');
    $player.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');

    const $homeVid = document.getElementById('home-preview-video');
    $homeVid?.play().catch(() => {});
  }

  $playerClose.addEventListener('click', closePlayer);

  /* ========================================================================
     10. 剧照 / 二维码灯箱 (.lightbox)
     ======================================================================== */

  function openLightbox(stills, index) {
    state.lightboxStills = stills;
    state.lightboxIndex = index;
    updateLightbox();
    $lightbox.classList.add('is-open');
    $lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function updateLightbox() {
    const total = state.lightboxStills.length;
    if (!total) return;
    $lbImg.src = state.lightboxStills[state.lightboxIndex];
    $lbCap.textContent = `${pad2(state.lightboxIndex + 1)} / ${pad2(total)}`;
  }

  function closeLightbox() {
    $lightbox.classList.remove('is-open');
    $lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  $lbClose.addEventListener('click', closeLightbox);
  $lbPrev.addEventListener('click', () => {
    const total = state.lightboxStills.length;
    state.lightboxIndex = (state.lightboxIndex - 1 + total) % total;
    updateLightbox();
  });
  $lbNext.addEventListener('click', () => {
    const total = state.lightboxStills.length;
    state.lightboxIndex = (state.lightboxIndex + 1) % total;
    updateLightbox();
  });

  // 灯箱支持手机端左右滑动切图
  let lbTouchX = 0;
  $lightbox.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches[0]) lbTouchX = e.touches[0].clientX;
    },
    { passive: true }
  );
  $lightbox.addEventListener(
    'touchend',
    (e) => {
      if (!e.changedTouches[0] || state.lightboxStills.length <= 1) return;
      const dx = e.changedTouches[0].clientX - lbTouchX;
      if (Math.abs(dx) > 48) {
        if (dx < 0) $lbNext.click();
        else $lbPrev.click();
      }
    },
    { passive: true }
  );
  $lightbox.addEventListener('click', (e) => {
    if (e.target === $lightbox) closeLightbox();
  });

  /* ========================================================================
     11. 全局点击代理 & 键盘快捷键
     ======================================================================== */

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-route]');
    if (!link) return;
    const target = link.getAttribute('data-route');
    if (!target) return;
    e.preventDefault();
    navigateTo(target);
  });

  window.addEventListener('hashchange', () => {
    if (!state.isTransitioning) {
      renderRoute(window.location.hash || '#/');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!$gate.classList.contains('is-hidden')) {
      if (e.key === 'Enter') dismissGate();
      return;
    }

    if (e.key === 'Escape') {
      if ($player.classList.contains('is-open')) closePlayer();
      else if ($lightbox.classList.contains('is-open')) closeLightbox();
      else if ($drawer.classList.contains('is-open')) closeDrawer();
      return;
    }

    if ($player.classList.contains('is-open') && state.modalPlayerCtrl) {
      if (e.key === ' ') {
        e.preventDefault();
        state.modalPlayerCtrl.togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        state.modalPlayerCtrl.seekBy(-10);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        state.modalPlayerCtrl.seekBy(10);
      }
      return;
    }

    if ($lightbox.classList.contains('is-open')) {
      if (e.key === 'ArrowLeft') $lbPrev.click();
      else if (e.key === 'ArrowRight') $lbNext.click();
    }
  });

  /* ========================================================================
     12. 启动初始化
     ======================================================================== */

  hydrateChromeTexts();
  runSplashGate(false);
  renderRoute(window.location.hash || '#/');
})();

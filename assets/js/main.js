/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		$wrapper._parallax(0.925);

	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

	// Intro.
		var $intro = $('#intro');

		if ($intro.length > 0) {

			// Hack: Fix flex min-height on IE.
				if (browser.name == 'ie') {
					$window.on('resize.ie-intro-fix', function() {

						var h = $intro.height();

						if (h > $window.height())
							$intro.css('height', 'auto');
						else
							$intro.css('height', h);

					}).trigger('resize.ie-intro-fix');
				}

			// Hide intro on scroll (> small).
				breakpoints.on('>small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'bottom',
						top: '25vh',
						bottom: '-50vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

				});

			// Hide intro on scroll (<= small).
				breakpoints.on('<=small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'middle',
						top: '15vh',
						bottom: '-15vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

			});

		}

})(jQuery);

ready(function() {
	initializeBackground();
  });
  
  var resizeTimeout;
  var resizeCooldown = 500;
  var lastResizeTime = Date.now();
  function initializeBackground() {
	canvas = document.getElementById("stars");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	window.addEventListener("resize", function() {
	  if (Date.now() - lastResizeTime < resizeCooldown && resizeTimeout) {
		clearTimeout(resizeTimeout);
		delete resizeTimeout;
	  }
  
	  lastResizeTime = Date.now();
	  canvas.style.display = "none";
	  resizeTimeout = setTimeout(function() {
		fadeIn(canvas, 500);
		initializeStars();
	  }, 500);
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	});
	initializeStars();
	(window.requestAnimationFrame && requestAnimationFrame(paintLoop)) ||
	  setTimeout(paintLoop, ms);
  }
  
  var canvas;
  var stars = [];
  
  function rand(max) {
	return Math.random() * max;
  }
  
  function Star(canvas, size, speed) {
	this.ctx = canvas.getContext("2d");
	this.size = size;
	this.speed = speed;
	this.x = rand(window.innerWidth);
	this.y = rand(window.innerHeight);
  }
  
  Star.prototype.animate = function(delta) {
	this.x += this.speed * delta;
	this.y -= this.speed * delta;
	if (this.y < 0) {
	  this.y = window.innerHeight;
	}
	if (this.x > window.innerWidth) {
	  this.x = 0;
	}
	this.ctx.fillStyle = "#ffffff";
	this.ctx.fillRect(this.x, this.y, this.size, this.size);
  };
  
  function initializeStars() {
	var winArea = window.innerWidth * window.innerHeight;
	var smallStarsDensity = 0.0001;
	var mediumStarsDensity = 0.00005;
	var largeStarsDensity = 0.00002;
	var smallStarsCount = winArea * smallStarsDensity;
	var mediumStarsCount = winArea * mediumStarsDensity;
	var largeStarsCount = winArea * largeStarsDensity;
	stars = [];
	for (var i = 0; i < smallStarsCount; i++) {
	  stars.push(new Star(canvas, 1, 30));
	}
  
	for (var i = 0; i < mediumStarsCount; i++) {
	  stars.push(new Star(canvas, 2, 20));
	}
  
	for (var i = 0; i < largeStarsCount; i++) {
	  stars.push(new Star(canvas, 3, 10));
	}
  }
  
  function drawStars(delta) {
	for (var i = 0; i < stars.length; i++) {
	  stars[i].animate(delta);
	}
  }
  
  var ms = 16;
  var lastPaintTime = 0;
  function paintLoop(timestamp) {
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	var delta =
	  (window.requestAnimationFrame ? timestamp - lastPaintTime : ms) / 1000;
	if(delta > 0.05){
	  delta = 0.05;
	}
	drawStars(delta);
	(window.requestAnimationFrame && requestAnimationFrame(paintLoop)) ||
	  setTimeout(paintLoop, ms);
	lastPaintTime = timestamp;
  }
  
  function fadeIn(element, duration, callback) {
	element.style.opacity = 0;
	element.style.display = "block";
  
	var startTime = Date.now();
	var tick = function() {
	  var newOpacity = (Date.now() - startTime) / duration;
	  if (newOpacity > 1) {
		newOpacity = 1;
		callback && callback();
	  } else {
		(window.requestAnimationFrame && requestAnimationFrame(tick)) ||
		  setTimeout(tick, 16);
	  }
  
	  element.style.opacity = newOpacity;
	};
	tick();
  }
  
  //http://youmightnotneedjquery.com/
  function ready(fn) {
	if (
	  document.attachEvent
		? document.readyState === "complete"
		: document.readyState !== "loading"
	) {
	  fn();
	} else {
	  document.addEventListener("DOMContentLoaded", fn);
	}
  }

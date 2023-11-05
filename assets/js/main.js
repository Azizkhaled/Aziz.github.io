/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

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
  
  
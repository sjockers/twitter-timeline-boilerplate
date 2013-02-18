/**
 * super-simple twitter timeline boilerplate
 */

(function($) {

	//
	// -- Private ------------------------------------------------------------------------------------------------------------------
	//
	
	var tweetTemplate = '<li class="tweet"><p>CONTENT</p><div class="time">TIME</div></li>'; 

	var $container = null;

	/**
		* load some tweets using the user_timeline API
		* documentation: https://dev.twitter.com/docs/api/1/get/statuses/user_timeline
		* @param {string} twitter user name (screen name with or without the @-prefix)

		*/
	function loadTimeline(user) {
		$.ajax({
			url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				screen_name: user,

				include_rts: true,				

				include_entities: true
			},			
			success: displayTimeline
		});
	};

	function loadSearch(query) {
		$.ajax({
			url: 'http://search.twitter.com/search.json',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				q: query,
				include_rts: true,
				include_entities: true
			},			
			success: displaySearchResults
		});
	};

	/**
		* add tweets to the DOM using a simple template
		* @param {object} data returned from Twitter API
		*/
	function displayTimeline(data) {
		$container.fadeOut(150, function() {
			$container.empty();
			for (var i = 0; i < data.length; i++) {
				var tweet = $(tweetTemplate
					.replace('CONTENT', ify.clean(data[i].text))
					.replace('TIME', timeAgo(data[i].created_at)));
				
				console.log(data);

				var tweetHeader = $("<div/>").addClass("tweetHead");
				tweetHeader.append(positionPicture(data[i].user.profile_image_url));
				tweetHeader.append(formatName(data[i].user.name));
				

				if(data.retweeted == true){
					$("li").addClass("retweeted");
				}

				tweet.prepend(tweetHeader);

				$container.append(tweet);
				$container.fadeIn(150);
			};
		});
	};

	function displaySearchResults(data) {	
		$container.fadeOut(150, function() {
			var results = data.results;
			$container.empty();
			for (var i = 0; i < results.length; i++) {
				var tweet = $(tweetTemplate
					.replace('CONTENT', ify.clean(results[i].text))
					.replace('TIME', timeAgo(results[i].created_at)));
				
				var tweetHeader = $("<div/>").addClass("tweetHead");
				tweetHeader.append(positionPicture(results[i].profile_image_url));
				tweetHeader.append(formatName(results[i].from_user_name));
				

				if(data.retweeted == true){
					$("li").addClass("retweeted");
				}

				//tweet.prepend(positionPicture(results[i].profile_image_url));
				//tweet.prepend(formatName(results[i].from_user_name));

				tweet.prepend(tweetHeader);
				$container.append(tweet);
				$container.fadeIn(150);
			};
		});
	}

	function formatName(name) {
		return $("<h3/>").text(name);
	}


	function positionPicture(profPicUrl){ 
		return $("<img/>").attr("src", profPicUrl);
	}
	

	
	

	//
	// -- Private utility functions ------------------------------------------------------------------------------------------------------------------
	//	the following two functions are helpers for formatting entries. You probably shouldn't change any of that code.
		
	/**
		* relative time calculator
		* borrowed from http://twitter.com/javascripts/widgets/widget.js
		* @param {string} twitter date string returned from Twitter API
		* @return {string} relative time like "2 minutes ago"
		*/
	function timeAgo(dateString) {
			var rightNow = new Date();
			var then = new Date(dateString);
	
			if ($.browser.msie) {
				// IE can't parse these crazy Ruby dates
				then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
			}
	
			var diff = rightNow - then;
	
			var second = 1000,
					minute = second * 60,
					hour = minute * 60,
					day = hour * 24,
					week = day * 7;
	
			if (isNaN(diff) || diff < 0) {
				return ""; // return blank string if unknown
			}
	
			if (diff < second * 2) {
				// within 2 seconds
				return "right now";
			}
	
			if (diff < minute) {
				return Math.floor(diff / second) + " seconds ago";
			}
	
			if (diff < minute * 2) {
				return "about 1 minute ago";
			}
	
			if (diff < hour) {
				return Math.floor(diff / minute) + " minutes ago";
			}
	
			if (diff < hour * 2) {
				return "about 1 hour ago";
			}
	
			if (diff < day) {
				return	Math.floor(diff / hour) + " hours ago";
			}
	
			if (diff > day && diff < day * 2) {
				return "yesterday";
			}
	
			if (diff < day * 365) {
				return Math.floor(diff / day) + " days ago";
			}
	
			else {
				return "over a year ago";
			}
	
		};
	
	
		/**
			* The Twitalinkahashifyer!
			* borrowed from http://twitter.com/javascripts/widgets/widget.js
			* more info: http://dustindiaz.com/linkified-tweets
			* Usage:
			* ify.clean('your tweet text');
			*/
		var ify = {
			link: function(tweet) {
				return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
					var http = m2.match(/w/) ? 'http://' : '';
					return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
				});
			},

			at: function(tweet) {
				return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
					return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
				});
			},

			list: function(tweet) {
				return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
					return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
				});
			},

			hash: function(tweet) {
				return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
					return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
				});
			},

			clean: function(tweet) {
				return this.hash(this.at(this.list(this.link(tweet))));
			}
		}



	//
	// -- Public ------------------------------------------------------------------------------------------------------------------
	//

	/**
		* Initialize the timeline (public)
		* @param {string} twitter user name (scren name with or without the @-prefix)		
		*/	
	$.fn.twitterTimeline = function(options) {
		$container = $(this);
		if (options.mode == "timeline")
			loadTimeline(options.user);
		else if (options.mode == "search")
			loadSearch(options.query);
	};
	

})(jQuery);


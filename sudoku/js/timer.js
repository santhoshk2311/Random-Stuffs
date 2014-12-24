/*
 *  Timer Class.
 */
function Timer(timerCmp) {
	var _seconds=0;
	var _minutes=0;
	var _hours=0;
	var _timerId;
	var publicTimerMethods;
	var _timerCmp = timerCmp;

	var addSecond = function() {
		var textContent;
		_seconds++;
		if (_seconds >= 60) {
			_seconds = 0;
			_minutes++;
	        if (_minutes >= 60) {
	            _minutes = 0;
	            _hours++;
	        }
		}
		textContent = (_hours ? (_hours > 9 ? _hours : "0" + _hours) : "00") + 
			":" + (_minutes ? (_minutes > 9 ? _minutes : "0" + _minutes) : "00") +
			":" + (_seconds > 9 ? _seconds : "0" + _seconds);

		_timerCmp.text(textContent);
		publicTimerMethods.runTimer();	
	};

	publicTimerMethods = {	
		runTimer: function() {
			_timerId = setTimeout(addSecond, 1000);
		},
		pauseTimer: function() {
			if (_timerId)
				clearTimeout(_timerId);
		},
		stopTimer: function() {
			if (_timerId) {
				clearTimeout(_timerId);
				_timerId = undefined;
				_timerCmp = '';
			}
		}
	};
	return publicTimerMethods;
}
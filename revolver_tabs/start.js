var _remainingTimeDisplayer;

function RemainingTimeDisplayer() {

    this.currentTick = 0;
    this.tickMax = 15;
    this.timerElement;
    this.timer;

    var formatSeconds = function(seconds) {
        if(seconds < 10) {
            return '0' + seconds;
        }
        return '' + seconds; 
    }
    
    function displayTimer(timerElement, tick, tickMax) {
        var seconds = tickMax - tick - 1;
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        timerElement.innerHTML = '' + minutes + ':' + formatSeconds(seconds);
    }
    
    function next(value, valueMax) {
        return (value + 1) % valueMax; 
    }
    
    function doTick(timerElement, currentTick, tickMax) {
        //console.log('tick %d', currentTick);
        displayTimer(timerElement, currentTick, tickMax);
    
        var nextTick = next(currentTick, tickMax);
        currentTick = nextTick;
    
        return {
            currentTick: currentTick,
        }
    }
    
    
    this._tick = function(timerElement) {
        var that = this;
        return function() {
            nextState = doTick(timerElement, that.currentTick, that.tickMax)
            that.currentTick = nextState.currentTick;
            if (that.currentTick < that.tickMax) {
                that.timer = setTimeout(that._tick(timerElement), 1000);
            } else {
                that.stop();
            }
        }
    }
    
    function setTimerStyle(timerElement) {
        timerElement.style.position =  'fixed';
        timerElement.style.fontSize =  '2em';
        timerElement.style.backgroundColor =  'white';
        timerElement.style.borderLeftStyle = 'solid';
        timerElement.style.borderLeftColor = 'black';
        timerElement.style.borderTopStyle = 'solid';
        timerElement.style.borderTopColor = 'black';
        timerElement.style.padding =  '10px';
        timerElement.style.bottom =  '0px';
        timerElement.style.right =  '0px';
        timerElement.style.opacity =  '0.5';
        timerElement.style.zIndex =  '10000';
        timerElement.style.fontFamily = 'serif';
        timerElement.style.visibility = "visible";
    }
    
    function setTimerVisible(timerElement, visible) {
        if(visible) {
            timerElement.style.opacity = "0.8";
        }
        else {
            timerElement.style.opacity = "0.1";
        }
    }
    
    this.start = function(timelapse) {
        //console.log('Start');
        this.timerElement = document.createElement("div");
        this.timerElement.id = "revolver-timer";
        document.body.appendChild(this.timerElement);
        this.timerElement.onmouseover = this.timerElement.onmousemove = function() {
          setTimerVisible(this, true);
        }
        this.timerElement.onmouseout = function() {
          setTimerVisible(this, false);
        }
        
        setTimerStyle(this.timerElement);
        setTimerVisible(this.timerElement, false);
        this.currentTick = 0;
        this.tickMax = timelapse;
        this._tick(this.timerElement)(); 
    }
    
    this.stop = function() {
        //console.log('Stop');
        this.timerElement.remove();
        clearTimeout(this.timer);
    }
    
    return this;
}


chrome.runtime.sendMessage({method: "getSettings"}, function(response) {
    var settings = response.data;
    if('seconds' in settings) {
        _remainingTimeDisplayer = new RemainingTimeDisplayer();
        var seconds = settings.seconds;
        _remainingTimeDisplayer.start(seconds);
    }
});

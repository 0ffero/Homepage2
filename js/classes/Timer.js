let Timer = class {
    constructor() {
        let options = vars.App.options;
        this.position = options.timerPosition;
        this.defaultTimerMinutes = options.timerMinutes;
        this.dTM = options.timerMinutes;

        this.gID = vars.getElementByID;
        this.init();
    }

    init() {
        this.initUI();
        this.initTimerMinutes();
        this.initDraggable();
        this.initCurrentTimeContainer();
    }

    initCurrentTimeContainer(init=true) {
        let cTC = this.currentTimeContainer;

        init && this.updateCurrentTime(); // first set the date/time

        let cStyle = this.container.style;
        let top = cStyle.top.replace('px','')*1+196;
        let left = cStyle.left.replace('px','')*1;
        cTC.style.top = `${top}px`;
        cTC.style.left = `${left}px`;
    }

    initDraggable() {
        this.dragContainer(this.container);
    }

    initTimerMinutes() {
        setTimeout(()=> {
            if (this.dTM) {
                let incType = this.dTM>60 ? 'm10' : 'm'
                this.dTM && this.timerIncDec(incType,'inc');
                this.dTM -= incType==='m' ? 1 : 10;
                if (this.dTM) this.initTimerMinutes();
            }
        }, 1000/60);
    }
    
    initUI() {
        let gID = this.gID;
        this.container = gID('timerContainer');
        let top = this.position.top;
        let left = this.position.left;
        if (top || left) {
            this.container.style.top = `${top}px`;
            this.container.style.left = `${left}px`;
        };

        this.tC_setContainer = gID('tC_setContainer');
        this.tC_hVal = gID('tC_hVal');
        this.tC_m10Val = gID('tC_m10Val');
        this.tC_mVal = gID('tC_mVal');

        this.tC_countdownContainer = gID('tC_countdownContainer');
        this.tC_timeRemaining = gID('tC_timeRemaining');

        this.currentTimeContainer = gID('currentTimeContainer');
    }


    dragContainer(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            let top = elmnt.offsetTop - pos2;
            let left = elmnt.offsetLeft - pos1;
            elmnt.style.top = `${top}px`;
            elmnt.style.left = `${left}px`;
            vars.App.timerClass.initCurrentTimeContainer(false);

            vars.localStorage.saveTimerXYPosition(top,left);
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    getHMFromMinutes(minutes) {
        let hours = minutes/60|0;
        minutes = minutes%60;
        return { h: hours, m: minutes };
    }

    getHMSFromSeconds(seconds) {
        let h=0, m=0;
        let s = seconds;
        s>=3600 && (h=s/3600|0,s=s%3600);
        s>=60 && (m=s/60|0,s=s%60);
        s = s|0;
        return {h: h, m: m, s: s};
    }

    getTimerInMinutes() {
        return (this.tC_hVal.innerHTML*1*60) + (this.tC_m10Val.innerHTML*1*10) + this.tC_mVal.innerHTML*1;
    }

    moveContainerOntoScreen() {
        let div = vars.App.timerClass.container;
        let left = div.style.left.replace('px','')*1;
        let dY = left + (410)-window.innerWidth;
        if (dY>0) { div.style.left = `${left-dY}px`; };
        this.initCurrentTimeContainer(false);
    }

    reset() {
        this.stopTimeout();
        this.showCountdown(false);
        vars.audio.stopSound('siren');
        vars.getElementByID('s_siren').currentTime=0;
        this.container.className = '';
        document.title = 'Homepage 2';
    }

    showCountdown(show=true) {
        if (show) {
            this.tC_countdownContainer.className = 'tC_countdownContainer_slideUp';
            this.tC_setContainer.className = 'tC_setContainer_slideUp';
            return;
        };

        this.tC_countdownContainer.className = '';
        this.tC_setContainer.className = '';
    }

    startCountdown() {
        let minutes = this.getTimerInMinutes();
        if (!minutes) return false;

        vars.App.setTimerMinutes(minutes); // save the minutes for next time the page is loaded

        this.showCountdown();

        let sT = this.startTime = new Date();
        this.endTime = sT.setMinutes(sT.getMinutes()+minutes);

        // start the timeout
        this.timerUpdate();
    }

    stopTimeout() {
        clearTimeout(this.timeout);
        delete(this.timeout);
        delete(this.startTime);
        delete(this.endTime);
    }

    timerIncDec(which,incDec) {
        let inc=0;
        switch (which) {
            case 'h': inc=60; break;
            case 'm10': inc=10; break;
            case 'm': inc=1; break;
            default: console.warn(`Invalid which (${which})`); debugger; return; break;
        };

        incDec==='dec' && (inc*=-1);

        let minutes = this.getTimerInMinutes();
        minutes += inc;
        minutes<0 && (minutes=0);
        minutes>9*60+59 && (minutes=9*60+59);
        // convert back to hm
        let HM = this.getHMFromMinutes(minutes);
        // update the divs
        let m = HM.m.toString().padStart(2,'0');
        let tm = m[0];
        m = m[1];
        // convert the minutes into 2 separate numbers
        this.tC_hVal.innerHTML = HM.h;
        this.tC_m10Val.innerHTML = tm;
        this.tC_mVal.innerHTML = m;
    }

    timerUpdate() {
        // get seconds until end time
        let deltaSeconds = (this.endTime - new Date())/1000;
        // show time remaining
        let HMS = this.getHMSFromSeconds(deltaSeconds);
        if (deltaSeconds<=0) {
            this.stopTimeout();
            this.updateCountDownDiv(HMS);
            // set the alarm off!
            vars.audio.playSound('siren');
            // flash the background
            this.container.className = 'timerContainer_flash';
            return;
        };

        if (deltaSeconds<=5 && vars.App.screenSaver.current===-10) { // screensaver is visible and timer has less than 5s left, hide it
            vars.App.screenSaver.reset();
            vars.App.sleep();
        };

        // update the UI
        this.updateCountDownDiv(HMS);

        this.timeout = setTimeout(()=> {
            vars.App.timerClass.timerUpdate();
        }, 1000);
    }

    updateCountDownDiv(HMS,init=false) {
        let h = HMS.h;
        let m = HMS.m.toString().padStart(2,'0');
        let s = HMS.s.toString().padStart(2,'0');

        let text = `${h}:${m}:${s}`;
        this.tC_timeRemaining.innerHTML = text;

        // update the window title
        !init && this.updateWindowTitle(text);
    }

    updateCurrentTime() {
        // THE TIMER CLASS DEALS WITH UPDATING THE APP, AS WELL AS ITSELF, SO, FIRST...
        // do other updates
        vars.App.update();

        // NOW DEAL WITH THE ACTUAL CLOCK
        let d = new Date();
        let lS = d.toLocaleString().replace(',','').split(' ');
        let date = lS[0].split('/');
        if (!this.currentDate) {
            let month = convertFromIntToMonthNameShort(date[1]*1);
            date[1] = month;
            date = date.join(' ');
            this.currentDate = date;
        };
        let time = lS[1];
        this.currentTimeContainer.innerHTML = `${this.currentDate} - ${time}`;

        // our last test is an alert to show up when Im going to bed (at 2am)
        // Note: Im converting the time to a string then coverting it to a number
        // so, 20000 is actually 2am (53000 is 5:30am and 144500 is 2:45pm)
        let lastAlertDate = vars.localStorage.getLastAlertDate();
        let dateNow = lS[0].split('/').reverse().join('')*1;
        if (lastAlertDate<dateNow && !vars.App.endOfDayMsgShown) {
            let t = lS[1].split(':').join('')*1;
            if (t>20000 && t<43000) {
                vars.App.endOfDayMsgShown=true;
                alert(vars.App.endOfDayMsg);
                vars.localStorage.saveLastAlertDate(dateNow);
            };
        };

        setTimeout(()=> {
            this.updateCurrentTime();
        },1000);
    }
    
    updateWindowTitle(text) {
        document.title = `Timer: ${text}`;
    }
}
var vars = {

    version: "1.0",

    getElementByID(id) {
        if (!id) return false;

        return document.getElementById(id);
    },

    localStorage: {
        pre: 'h2',

        init: ()=> {
            let lS = window.localStorage;
            let lV = vars.localStorage;

            if (!lS[`${lV.pre}_theme`]) {
                lS[`${lV.pre}_theme`] = 'light';
            };
            vars.UI.theme = lS[`${lV.pre}_theme`];

            if (!lS[`${lV.pre}_timerDefaultMinutes`]) {
                lS[`${lV.pre}_timerDefaultMinutes`] = 0;
            };
            vars.App.options.timerMinutes = lS[`${lV.pre}_timerDefaultMinutes`]*1;

            if (!lS[`${lV.pre}_timerPosition`]) {
                lS[`${lV.pre}_timerPosition`] = JSON.stringify(vars.App.options.timerPosition);
            };
            vars.App.options.timerPosition = JSON.parse(lS[`${lV.pre}_timerPosition`]);

            if (!lS[`${lV.pre}_lastSeen`]) {
                lS[`${lV.pre}_lastSeen`] = 0;
            };
            vars.App.options.lastSeen = lS[`${lV.pre}_lastSeen`]*1;

            if (!lS[`${lV.pre}_ytwatching`]) {
                lS[`${lV.pre}_ytwatching`] = '[]';
            };
            vars.App.ytWatchingList = JSON.parse(lS[`${lV.pre}_ytwatching`]);

            if (!lS[`${lV.pre}_lastAlertDate`]) {
                lS[`${lV.pre}_lastAlertDate`] = 0;
            };
        },

        getLastAlertDate: ()=> {
            let lS = window.localStorage;
            let lV = vars.localStorage;
            return lS[`${lV.pre}_lastAlertDate`]*1;
        },

        saveCurrentYTPositions: ()=> {
            let lS = window.localStorage;
            let lV = vars.localStorage;

            // save ytwatchinglist
            lS[`${lV.pre}_ytwatching`] = JSON.stringify(vars.App.ytWatchingList);
        },

        saveLastAlertDate: (lastAlertDate)=> {
            let lS = window.localStorage;
            let lV = vars.localStorage;
            lS[`${lV.pre}_lastAlertDate`] = lastAlertDate;
        },

        saveLastSeen: ()=> {
            let lS = window.localStorage;
            let lV = vars.localStorage;

            let d = new Date();
            let lastSeen = vars.App.options.lastSeen = d.toLocaleDateString().split('/').reverse().join('')*1;
            lS[`${lV.pre}_lastSeen`] = lastSeen;
        },

        saveTimerDefaultMinutes: ()=> {
            let lS = window.localStorage;
            let lV = vars.localStorage;

            lS[`${lV.pre}_timerDefaultMinutes`] = vars.App.options.timerMinutes;
        },

        saveTimerXYPosition: (top,left)=> {
            let tP = vars.App.options.timerPosition = { top: top, left: left };
            let lS = window.localStorage;
            let lV = vars.localStorage;

            lS[`${lV.pre}_timerPosition`] = JSON.stringify(tP);
        },

        setAsWatched: (crc)=> {
            // get the current ytwatchinglist
            let aV = vars.App;
            let wL = aV.ytWatchingList;
            let index = wL.findIndex(f=>f.crc===crc);
            aV.ytWatchingList[index].complete = true;

            vars.localStorage.saveCurrentYTPositions();
        }
    },

    preInits: ()=> {
        vars.localStorage.init();
        vars.App.getYoutubeVideoList(); // get the list of youtube videos ive downloaded
    },

    init: ()=> {
        vars.App.init();
    },

    
    App: {
        buttons: [
            { image: "1337x.png",             text: "1337x",                  type: "dl",         vpn: true,    url: "https://1337x.to/top-100" },
            { image: "adobecolour.png",       text: "Adobe Colour",           type: "dev",        vpn: false,   url: "https://color.adobe.com/create/color-wheel" },
            { image: "amazon.png",            text: "Amazon",                 type: "shop",       vpn: false,   url: "https://www.amazon.co.uk" },
            { image: "audiobookplayer.png",   text: "Audio Book Player 2",    type: "media",      vpn: false,   url: "http://offero04.gw/Apps/aBP/current/" },
            { image: "cex.png",               text: "CEX",                    type: "shop",       vpn: false,   url: "https://uk.webuy.com/" },
            { image: "cloch.png",             text: "Cloch Housing",          type: "contact",    vpn: false,   url: "https://my.clochhousing.org.uk/auth/login?r=dashboard" },
            { image: "dodi.png",              text: "DODI",                   type: "dl",         vpn: true,    url: "https://dodi-repacks.site/" },
            { image: "ebay.png",              text: "E-Bay",                  type: "shop",       vpn: false,   url: "https://www.ebay.co.uk" },
            { image: "facebook.png",          text: "Facebook",               type: "social",     vpn: false,   url: "https://www.facebook.com" },
            { image: "fitgirl.png",           text: "Fitgirl",                type: "dl",         vpn: true,    url: "https://fitgirl-repacks.site/" },
            { image: "google.png",            text: "Google",                 type: "google",     vpn: false,   url: "https://www.google.co.uk" },
            { image: "googleimages.png",      text: "Google Images",          type: "google",     vpn: false,   url: "https://images.google.co.uk" },
            { image: "googlemail.png",        text: "Google Mail",            type: "google",     vpn: false,   url: "https://mail.google.com/mail/u/0/#inbox" },
            { image: "googlemaps.png",        text: "Google Maps",            type: "google",     vpn: false,   url: "https://maps.google.co.uk" },
            { image: "hurawatch.png",         text: "Hura Watch",             type: "media",      vpn: false,   url: "https://hurawatch.cc/" },
            { image: "imdb.png",              text: "IMDB",                   type: "misc",       vpn: false,   url: "https://www.imdb.com" },
            { image: "jellyfin.png",          text: "Jellyfin",               type: "media",      vpn: false,   url: "http://offero04.gw:8096/web/index.html#!/home.html" },
            { image: "jobadmin.png",          text: "Job Admin",              type: "media",      vpn: false,   url: "http://offero04.io/jobadmin/current/" },
            { image: "magnetdl.png",          text: "MagnetDL",               type: "dl",         vpn: true,    url: "https://www.magnetdl.com/" },
            { image: "money.png",             text: "Diary",                  type: "internal",   vpn: false,   url: "" },
            { image: "mvplayer.png",          text: "MV Player",              type: "media",      vpn: false,   url: "http://offero04.gw/Apps/mvplayer/current/" },
            { image: "myanonymouse.png",      text: "My Anonymouse",          type: "dl",         vpn: true,    url: "https://www.myanonamouse.net/login.php?returnto=%2Ftor%2Fbrowse.php" },
            { image: "patientaccess.png",     text: "Patient Access",         type: "contact",    vpn: false,   url: "https://account.patientaccess.com/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dpkce_patientaccess_web%26redirect_uri%3Dhttps%253A%252F%252Fapp.patientaccess.com%252Fsignin-callback%26response_type%3Dcode%26scope%3Dopenid%2520profile%2520patientaccess_api%26state%3D7eafcd21aa07492e9d9f0b77537e520b%26code_challenge%3DXXsSJaJeUb0uGjlzyGw3TrkS3m7E32dSLen7KGrr4UE%26code_challenge_method%3DS256%26response_mode%3Dquery%26titleType%3Ddefault" },
            { image: "rarbg.png",             text: "RarBG",                  type: "dl",         vpn: true,    url: "https://rargb.to/" },
            { image: "tesco.png",             text: "Tesco",                  type: "shop",       vpn: false,   url: "https://www.tesco.com" },
            { image: "torrentday.png",        text: "Torrent Day",            type: "dl",         vpn: true,    url: "https://tday.love/t" },
            { image: "tsb.png",               text: "TSB",                    type: "",           vpn: false,   url: "https://internetbanking.tsb.co.uk/personal/logon/login/#/login" },
            { image: "yify.png",              text: "YIFY",                   type: "dl",         vpn: true,    url: "https://yts.rs/" },
            { image: "ytdlp.png",             text: "Youtube Downloader",     type: "internal",   vpn: false,   url: "" },
            { image: "ytvids.png",            text: "Youtube Videos",         type: "internal",   vpn: false,   url: "" },
            { image: "youtube.png",           text: "Youtube",                type: "media",      vpn: false,   url: "https://www.youtube.com" }
        ],

        endOfDayMsgShown: false,
        endOfDayMsg: `Take your tablets!`,
        
        IP: '???.???.???.???',
        options: {
            timerMinutes: 0,
            timerPosition: { top: 0, left: 0 }
        },
        screenSaver: {
            timer: null,
            max: 30,
            current: null,

            reset: ()=> {
                let sS = vars.App.screenSaver;
                sS.current=sS.max;
            },

            start: ()=> {
                let sS = vars.App.screenSaver;
                sS.current = sS.max;
                sS.timer = setInterval(()=> {
                    if (sS.current===-10) return;
                    sS.current--;
                    if (sS.current<=0) {
                        sS.current=-10;
                        vars.App.sleep();
                    };
                }, 1000);
            }
        },
        vmIP: '86.',
        vpn: false,
        ytCRCs: [],

        init: ()=> {
            console.log(`%cInit: App`,'color: #30ff30');
            vars.UI.init();
            vars.App.timerClass = new Timer();

            vars.input.init();

            vars.App.screenSaver.start();

            let h = new Date().getHours();
            if (h>=20 || h<8) { vars.App.darkenSwitch() };
        },

        checkForVPN: ()=> {
            let aV = vars.App;

            aV.testingAfterClick=true;
            vars.UI.newPopUpMessage(`Checking for VPN.`)
            aV.getCurrentIP(aV.testingAfterClick);
        },

        darkenSwitch: ()=> {
            // note that the darkn switch code has been moved to v.a.sleep()
            let divs = [...document.getElementsByClassName('button')];
            divs.forEach((c)=> {
                let darken = !c.classList.contains('button_dark') ? true : false;
                darken ? c.classList.add('button_dark') : c.classList.remove('button_dark')
            });
        },

        extendDiaryEntry: (dateID,event)=> {
            // stop the background click from executing
            event.preventDefault();
            event.cancelBubble=true;
            vars.UI.diary.class.extendDiaryEntry(dateID);
        },

        getPreCalculatedCRC: (fileName)=> {
            let data = vars.App.ytCRCs.find(yt=>yt.fileName===fileName);
            return data ? data.crc : crc32(fileName);
        },

        getCurrentIP: ()=> {
            let x = new HTTPRequest();
            x.getCurrentIP();
        },

        getYoutubeVideoList: ()=> {
            let x = new HTTPRequest();
            x.getYoutubeVideoList();
        },

        openURL: (which)=> {
            switch (which) {
                case 'dim':
                    window.open('https://app.destinyitemmanager.com/4611686018467971358/d2/inventory','_blank');
                break;

                case 'phpmyadmin':
                    window.open('http://localhost/phpmyadmin/index.php?route=/','_blank');
                break;

                case 'plesk':
                    window.open('https://93017d1.online-server.cloud:8443/login_up.php?success_redirect_url=%2Fsmb%2Fdatabase%2Flist%2FdomainId%2F2','_blank');
                break;

                case 'scotia':
                    window.open('http://offero04.io/scotiajobadmin/','_blank');
                break;

                case 'unicode':
                    window.open('http://offero04.gw/Utils/unicode/','_blank');
                break;

                case 'errgw':
                    window.open('http://offero04.gw/errorlog.php','_blank');
                break;

                default:
                    // unknown which
                    debugger;
                break;
            };
        },

        saveCurrentYTPosition: (crc,percent)=> {
            let aV = vars.App;
            let wL = aV.ytWatchingList;

            let index = wL.findIndex(f=>f.crc===crc);
            if (index===-1) { // doesnt exists yet, add it
                aV.ytWatchingList.push({ crc: crc, percent: percent, complete: false });
            } else { // already exists
                aV.ytWatchingList[index].percent = percent;
            };

            vars.localStorage.saveCurrentYTPositions();
        },

        saveDiaryEntry: ()=> {
            vars.UI.diary.class.saveDiaryEntry();
        },

        setTimerMinutes: (minutes)=> {
            vars.App.options.timerMinutes = minutes;
            vars.localStorage.saveTimerDefaultMinutes();
        },

        showAIChat: (show=true)=> {
            let div = vars.getElementByID('AIChatContainer');
            div.className = show ? 'AIChatContainerShow' : '';
        },

        showDiaryIfNotSeen: ()=> {
            let d = new Date();
            if (d.toLocaleDateString().split('/').reverse().join('')*1!==vars.App.options.lastSeen && d.getHours()>=9) {
                vars.localStorage.saveLastSeen();
                setTimeout(()=> {
                    vars.UI.diary.class.showSwitch(); // show the diary
                },500);
            };
        },

        showDiaryPopUp: ()=> {
            vars.UI.diary.class.showDiaryPopUp();
        },

        showInputType: (event,type,date)=> {
            vars.UI.diary.class.showInputType(event,type,date);
        },

        showOtherButtons: ()=> {
            let ui = vars.UI;
            !ui.otherButtons && (ui.otherButtons = new UI_OtherButtons());

            // switch its visibility
            let container = ui.otherButtons.container;
            let className = container.className ? '' : 'hidden';
            container.className = className;
        },

        showYTDLP: ()=> {
            let cssClass = 'newYTDLContainerShow';
            let div = vars.getElementByID('newYTDLContainer');
            div.classList.contains(cssClass) ? div.classList.remove(cssClass) : div.classList.add(cssClass);
        },

        sleep: ()=> {
            let div = vars.getElementByID('darkenContainer');
            div.className = !div.className ? 'dC_show' : '';
        },

        timerIncDec: (which,incDec)=> {
            vars.App.timerClass.timerIncDec(which,incDec);
        },

        timerReset: ()=> {
            vars.App.timerClass.reset();
        },

        timerStart: ()=> {
            vars.App.timerClass.startCountdown();
        },

        update: ()=> {
            // if the youtube video player is currently playing a video, update it
            if (vars.UI.youtubeVideoList && vars.UI.youtubeVideoList.class.videoPlayer) {
                vars.UI.youtubeVideoList.class.update();
            };
        },

        youtubeVideoListClick: (fileName)=> {
            vars.UI.youtubeVideoList.class.clickYTRow(fileName);
        }
    },

    audio: {
        playSound: (which)=> {
            let snd;
            switch (which) {
                case 'whooshIn': case 'whooshOut':
                    snd = vars.getElementByID(`s_${which}`);
                    snd.play();
                break;

                case 'siren':
                    snd = vars.getElementByID('s_siren')
                break;
            };

            snd && snd.play();
        },

        stopSound: (which)=> {
            let snd;
            switch (which) {
                case 'siren':
                    snd = vars.getElementByID('s_siren')
                break;
            };

            (snd && !snd.paused) && snd.pause();
        }
    },

    input: {
        combo: '',
        combos: [
            { combo: 'dim', do: `vars.App.openURL('dim')` },
            { combo: 'enable', do: `vars.App.showOtherButtons()` },
            { combo: 'dark', do: `vars.App.darkenSwitch()` },
            { combo: 'php', do: `vars.App.openURL('phpmyadmin')` },
            { combo: 'plesk', do: `vars.App.openURL('plesk')` },
            { combo: 'scotia', do: `vars.App.openURL('scotia')` },
            { combo: 'uni', do: `vars.App.openURL('unicode')` },
            { combo: 'errgw', do: `vars.App.openURL('errgw')` },
            { combo: '???', do: `vars.App.showAIChat()` }
        ],
        comboLoad: [],

        init: ()=> {
            // init combos system
            window.addEventListener('keyup', (e)=> {
                let iV = vars.input;
                iV.combo += e.key.toLowerCase();

                let comboI = iV.combos.findIndex(c=>c.combo.startsWith(iV.combo));
                if (comboI>-1) {
                    let combo = iV.combos.find(c=>c.combo === iV.combo);
                    if (combo) {
                        iV.combo = '';
                        eval (combo.do);
                    };
                    return;
                };
                
                iV.combo = comboI>-1 ? e.key : ''; // no combos start with the current combo. clear the combo
            });

            // add mouse move check for screensaver
            window.addEventListener('mousemove', (e)=> {
                let sS = vars.App.screenSaver;
                if (sS.current===-10) { // the screensaver is currently visible
                    vars.App.sleep(); // hide the screensaver div
                };
                sS.reset(); // reset the timeout
            });
        },

        addURLToComboList: (url,deleteIfFound=true)=> {
            let valid = vars.UI.mainPage.class.addURLToComboList(url,deleteIfFound);
            return valid;
        },

        buttonClickMain: (e,url)=> {
            vars.UI.mainPage.class.buttonClickMain(url);
        },

        buttonClickOthers: (which)=> {
            vars.UI.otherButtons.click(which);
        },

        comboLoadAll: ()=> {
            vars.UI.mainPage.class.comboLoadAll();
        },

        dealWithRightClick: (e)=> {
            e.preventDefault();
            let buttonDiv;
            if ([...e.target.classList].includes('button')) {
                buttonDiv = e.target;
                buttonDiv.classList.add('hlMPButton');
            } else {
                debugger;
                let buttonDiv = null;
                let c = 0;
                let parentNode = e.target.parentNode;
                while (!parentNode.classList.contains('button')) {
                    parentNode = parentNode.parentNode;
                    buttonDiv = parentNode;
                    if (c===5) break;
                    c++;
                };
                (c!==5 && !buttonDiv.classList.contains('hlMPButton')) && buttonDiv.classList.add('hlMPButton');
            };

            let parent = e.target.parentElement;
            let pIndex = 1;
            while ((!parent.dataset || !parent.dataset['url']) && pIndex<=3) {
                parent=parent.parentElement;
                if (!buttonDiv && [...parent.classList].includes('button')) { // change the bg color
                    parent.classList.add('hlMPButton');
                    buttonDiv = parent;
                };
                pIndex++;
            };

            if (!parent.dataset || !parent.dataset['url']) return;

            let url =  parent.dataset['url'];

            let added = vars.input.addURLToComboList(url);
            if (!added) { // the url was removed, unhighlight the button
                buttonDiv.classList.remove('hlMPButton');
            };

            return true;
        }
    },

    UI: {
        theme: 'light',
        themes: ['light'],
        diaryHeadings: ['destiny','family','space'],
        diaryHeading: 'space',

        init: ()=> {
            console.log(`%cInit: UI`,'color: #30ff30');
            let ui = vars.UI;

            ui.diary = new UI('diary');
            ui.smallPopUp = new UI('smallPopUp');
            ui.mainPage = new UI('mainPage');

            vars.UI.resizeMainContainer();

            vars.App.getCurrentIP();
        },

        buildYoutubeVideoList: ()=> {
            vars.UI.youtubeVideoList = new UI('youtubeVideoList');
        },

        newPopUpMessage: (msg)=> {
            vars.UI.smallPopUp.class.setMsgAndShow(msg);
        },

        resizeMainContainer: ()=> {
            let scale = window.innerWidth/2560;
            let mPC = vars.getElementByID('mainPageContainer')
            mPC.style.zoom=scale;
        },

        updateCurrentIP() {
            let aV = vars.App;
            let className = '';
            let vpn = false;

            !aV.IP.startsWith(aV.vmIP) && (className = 'cIPC_vpn', vpn = true);

            aV.vpn = vpn;
            let tAC = vars.App.testingAfterClick;
            if (tAC && vpn) {
                vars.UI.newPopUpMessage(`VPN is enabled. Loading URL(s)`);
                // load the url (its been added to the combo list)
                vars.input.comboLoadAll();
            } else if (tAC && !vpn) {
                vars.UI.newPopUpMessage(`<div class="error">VPN is NOT enabled.<br/>Unable to load the URL!</div>`);
            };
            vars.App.testingAfterClick && delete(vars.App.testingAfterClick); // first, destroy the var

            // update the UI
            let cIPC = vars.getElementByID('currentIPContainer');
            cIPC.innerHTML = `IP: ${aV.IP}`;
            cIPC.className = className;
        }
    }
};

window.addEventListener('contextmenu', (e)=> {
    vars.input.dealWithRightClick(e);
});

window.addEventListener('resize', ()=> {
    vars.UI.resizeMainContainer();
    vars.App.timerClass.moveContainerOntoScreen();
});

vars.preInits();
vars.init();
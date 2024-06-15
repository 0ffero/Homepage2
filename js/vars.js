var vars = {

    version: "0.91",

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
        },

        saveCurrentYTPositions: ()=> {
            let lS = window.localStorage;
            let lV = vars.localStorage;

            // save ytwatchinglist
            lS[`${lV.pre}_ytwatching`] = JSON.stringify(vars.App.ytWatchingList);
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
            { image: "cex.png",               text: "CEX",                    type: "shop",       vpn: false,   url: "https://uk.webuy.com/" },
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
            { image: "magnetdl.png",          text: "MagnetDL",               type: "dl",         vpn: true,    url: "https://www.magnetdl.com/" },
            { image: "money.png",             text: "Diary",                  type: "internal",   vpn: false,   url: "" },
            { image: "myanonymouse.png",      text: "My Anonymouse",          type: "dl",         vpn: true,    url: "https://www.myanonamouse.net/login.php?returnto=%2Ftor%2Fbrowse.php" },
            { image: "rarbg.png",             text: "RarBG",                  type: "dl",         vpn: true,    url: "https://rargb.to/" },
            { image: "tesco.png",             text: "Tesco",                  type: "shop",       vpn: false,   url: "https://www.tesco.com" },
            { image: "torrentday.png",        text: "Torrent Day",            type: "dl",         vpn: true,    url: "https://tday.love/t" },
            { image: "yify.png",              text: "YIFY",                   type: "dl",         vpn: true,    url: "https://yts.rs/" },
            { image: "ytdl.png",              text: "Youtube Downloader",     type: "internal",   vpn: false,   url: "" },
            { image: "youtube.png",           text: "Youtube",                type: "media",      vpn: false,   url: "https://www.youtube.com/feed/subscriptions" }
        ],
        IP: '???.???.???.???',
        vmIP: '86.',
        vpn: false,
        ytCRCs: [],
        options: {
            timerMinutes: 0,
            timerPosition: { top: 0, left: 0 }
        },

        init: ()=> {
            console.log(`%cInit: App`,'color: #30ff30');
            vars.UI.init();
            vars.App.timerClass = new Timer();

            vars.input.init();
        },

        checkForVPN: ()=> {
            let aV = vars.App;

            aV.testingAfterClick=true;
            vars.UI.newPopUpMessage(`Checking for VPN.`)
            aV.getCurrentIP(aV.testingAfterClick);
        },

        darkenSwitch: ()=> {
            let div = vars.getElementByID('darkenContainer');
            div.className = !div.className ? 'dC_show' : '';
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
                // example. remove 
                case 'google':
                    window.open('https://google.co.uk','_blank');
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
            // example combo
            { combo: 'google', do: `vars.App.openURL('google')` }
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
            if ([...e.target.classList].includes('button')) { // user clicked on the button div
                buttonDiv = e.target;
                !buttonDiv.classList.contains('hlMPButton') && buttonDiv.classList.add('hlMPButton');
            } else { // user clicked on a parent of the button div
                let buttonDiv = null;
                let c = 0;
                let parentNode = e.target.parentNode;
                while (!parentNode.classList.contains('button')) {
                    parentNode = parentNode.parentNode;
                    buttonDiv = parentNode;
                    if (c>5) break;
                    c++;
                };
                !buttonDiv.classList.contains('hlMPButton') && buttonDiv.classList.add('hlMPButton');
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
            ui.ytdlp = new YoutubeDownlaoder();

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
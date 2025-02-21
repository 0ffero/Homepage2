let HTTPRequest = class {
    constructor() {

    }

    doRequest(url,_post=null,rsFn) {
        let method = !_post ? 'GET' : 'POST';

        let http = new XMLHttpRequest();
        http.open(method, url, true);
        
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                let rs = JSON.parse(http.responseText);
                rsFn(rs);
            };
        };

        // DO THE REQUEST
        _post ? http.send(_post) : http.send();
    }

    getCurrentIP() {
        let url = 'http://offero04.io/homepage2/current/endpoints/getCurrentIP.php';
        this.doRequest(url,null,this.getCurrentIPHandler);
    }
    getCurrentIPHandler(rs) {
        if (rs.ERROR) {
            vars.UI.newPopUpMessage(`<div class="error">${rs.ERROR}</div>`);
            return;
        };

        vars.App.IP = rs.currentip;
        vars.UI.updateCurrentIP();
    }

    getDiaryEntries(startDate, endDate) {
        let url = 'endpoints/getInAndOutDetails.php';
        let handler = this.getDiaryEntriesHandler;
        startDate = encodeURIComponent(startDate);
        endDate = encodeURIComponent(endDate);

        let post = `startDate=${startDate}&endDate=${endDate}`;
        this.doRequest(url,post,handler);
    }

    getDiaryEntriesHandler(rs) {
        if (rs.ERROR) {
            vars.UI.newPopUpMessage(`<div class="error">${rs.ERROR}</div>`);
            return false;
        };

        vars.UI.newPopUpMessage(rs.messages.join('<br/>'));
        
        // now fill the diary entries
        vars.App.diary = arraySortByKey(rs['notes'], 'date');
        vars.App.money = arraySortByKey(rs['money'], 'date');

        let diary = vars.UI.diary.class;
        diary.addAllDiaryEntriesToDivs();
        diary.addBalancesToDivs();

        // show the diary if the user hasnt seen it today
        vars.App.showDiaryIfNotSeen();
    }

    getYoutubeVideoList() {
        let url = 'http://offero04.gw/Apps/ytvideoslist/getYoutubeVideoList.php';
        let handler = this.getYoutubeVideoListHandler;
        this.doRequest(url,null,handler);
    }

    getYoutubeVideoListHandler(rs) {
        if (rs.ERROR) {
            vars.UI.newPopUpMessage(`<div class="error">${rs.ERROR}</div>`);
            return false;
        };

        vars.App.youtubeVideoList = rs.youtubeVideos;
        vars.UI.buildYoutubeVideoList();
    }

    saveBalanceReset(date,balance) {
        let url = 'endpoints/saveBalanceReset.php';
        let handler = this.saveBalanceResetHandler;
        date = encodeURIComponent(date);
        balance = encodeURIComponent(balance);

        let post = `date=${date}&balance=${balance}`;
        this.doRequest(url,post,handler);
    }

    saveBalanceResetHandler(rs) {
        if (rs.ERROR) {
            vars.UI.newPopUpMessage(`<div class="error">${rs.ERROR}</div>`);
            return false;
        };

        // balance reset was done successfully
        // add the new balance to money
        let date = rs.date*1;
        let balance = rs.balance*1;
        let details = { 'type': 'Balance Reset', 'amount': balance };
        let aV = vars.App;

        let index = aV.money.findIndex(m=>m.date===rs.date*1);
        if (index>-1) {
            let money = aV.money[index];
            money.notes.push(details);
            // make sure that any OTHER notes on this date are ignored
            money.notes.forEach((n,i)=> {
                if (n.deduction!==undefined) {
                    delete(aV.money[index].notes[i].deduction);
                };
            });
        } else {
            let notes = [];
            notes.push({ type: 'Balance Reset', amount: balance });
            aV.money.push({ date: date, notes: notes });
        };
        
        vars.UI.diary.class.rebuildDiary();
        rs.messages.push('Rebuilding Diary');
        vars.UI.newPopUpMessage(rs.messages.join('<br/>'));
    }

    saveDiaryEntryNote(date,notes) {
        let url = 'endpoints/saveDiaryNote.php';
        let handler = this.saveDiaryEntryNoteHandler;
        date = encodeURIComponent(date);
        notes = encodeURIComponent(JSON.stringify(notes));

        let post = `date=${date}&notes=${notes}`;
        this.doRequest(url,post,handler);
    }

    saveDiaryEntryNoteHandler(rs) {
        if (rs.ERROR) {
            vars.UI.newPopUpMessage(`<div class="error">${rs.ERROR}</div>`);
            return false;
        };

        // everything went well
        let date = rs.date*1;
        let notes = rs.notes;
        // add the notes to the UI
        let diaryClass = vars.UI.diary.class;
        diaryClass.addSavedDiaryEntries(date,notes);

        diaryClass.addedSavedDiaryEntries_checkForNewDeductions(date,notes);
        diaryClass.rebuildDiary();
    }
};
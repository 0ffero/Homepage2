let UI_Diary = class {
    constructor() {
        this.gID = vars.getElementByID;

        this.dateRange = 6; // in months + and -
        this.overdraftAmount = 370;

        this.init();
    }
    
    init() {
        this.initMonthImageNames();

        let gID = this.gID;
        
        this.container = gID('diaryContainer');

        this.diaryView = gID('diaryView');

        this.initShowDiaryNotePopUp();

        this.initPopUp();

        this.currentCash = 0;
        this.dates = [];
        this.generateDateRange();

        // now request the diary entries fromt he server
        let x = new HTTPRequest();
        x.getDiaryEntries(this.startDate,this.endDate);

    }

    initMonthImageNames() {
        let imageFolder = vars.UI.diaryHeading;
        let monthList = [];
        for (let m=1; m<=12; m++) {
            let monthShort = convertFromIntToMonthNameShort(m);
            let monthLong  = convertFromIntToMonthNameLong(m);

            monthList.push({ src: `./assets/images/monthheaders/${imageFolder}/${monthShort.toLowerCase()}.jpg`, monthShort: monthShort, monthLong: monthLong });
        };

        this.monthImageNames = monthList;
    }

    initPopUp() {
        let gID = this.gID;
        this.diaryPopUp = gID('editDiaryEntry');
        this.diaryPopUpHeading = gID('diaryPopUpHeading');
        this.diaryPopUpDate = gID('diaryPopUpDate');
        this.diaryPopUpBalance = gID('diaryPopUpBalance');
        this.diaryNotes = gID('diaryNotes');
        this.diaryPopUpBalanceContainer = gID('diaryPopUpBalanceContainer');
        this.diarySave = gID('diarySave');
    }

    initShowDiaryNotePopUp() {
        let gID = this.gID;
        let sDNDiv = this.showDiaryNoteDiv = gID('showDiaryNoteContainer');
        sDNDiv.show = ()=> {
            sDNDiv.className = !sDNDiv.className ? 'showDiaryNoteContainer_slideIn' : '';
        };

        this.sDNHeading = gID('sDN_heading');
        this.sDNDetails = gID('sDN_details');

        this.archiveButton = gID('sDNB_archive');
    }

    addBalancesToDivs() {
        this.balanceRemoveInOutsForResets();
        let money = vars.App.money;
        let dates = this.dates;

        dates.forEach((d)=> {
            let id = `d_${d}`;
            let div = this.gID(id);
            if (!div) return;

            let subDiv = div.getElementsByClassName('diaryDetails')[0];
            let balanceDiv = div.getElementsByClassName('d_balance')[0];

            let m = money.find(m=>m.date===d*1);
            if (!m) {
                balanceDiv.innerHTML = this.currentCash<=this.overdraftAmount ? `<div class="d_overdraft"><i class="fa-solid fa-caret-down"></i> <div class="d_cbalance">&pound;${this.currentCash.toFixed(2)}</div></div>` : `<i class="fa-solid fa-caret-up"></i> <div class="d_cbalance">&pound;${this.currentCash.toFixed(2)}</div>`;
                return;
            };
            
            let bR = false;
            m.notes.forEach((n)=> {
                if (n.type==='Balance Reset') {
                    this.currentCash = n.amount;
                    bR = true;
                } else {
                    this.currentCash += n.deduction ? n.amount*-1 : n.amount;
                    let className = n.deduction ? 'd_deduction' : 'd_incoming';
                    this.currentCash = this.currentCash.toFixed(2)*1;
                    n.amount*=1; // make sure amount is a number (saving an owed amount enters as a string)
                    subDiv.innerHTML += `<div class="${className}">${n.type}: &pound;${n.amount.toFixed(2)}</div>`;
                };
            });

            balanceDiv.innerHTML = bR ? `<div class="dType_balanceReset"><div class="d_cbalance">&pound;${this.currentCash.toFixed(2)}</div></div>` : this.currentCash<=this.overdraftAmount ? `<div class="d_overdraft"><i class="fa-solid fa-caret-down"></i> <div class="d_cbalance">&pound;${this.currentCash.toFixed(2)}</div></div>` : `<i class="fa-solid fa-caret-up"></i>  <div class="d_cbalance">&pound;${this.currentCash.toFixed(2)}</div>`;
        
        });
    }

    addAllDiaryEntriesToDivs(update=false) {
        let entries = vars.App.diary;
        entries.forEach((entry)=> {
            this.addDiaryEntryToClientObject(entry,true,update);
        });
    }

    addDiaryEntryToClientObject(details,ignorePush=false,update=false) {
        // note: the entry doesnt have an ID yet. Its only assigned once its been saved.
        //       this is because archived entries will not be sent to the front end. So the front
        //       end count will NOT include archived notes. Hence dairy notes length is unreliable.
        !ignorePush && vars.App.diary.push(details);

        let date = details.date;

        let div = this.gID(`d_${date}`);
        if (!div) return;

        // get the sub div
        let subDiv = div.getElementsByClassName('diaryDetails')[0];
        let hasCDiv = div.getElementsByClassName('d_hasContents')[0];
        hasCDiv.innerHTML = '*';

        let notes = { 'date': date, notes: [] };
        let dNotes = details.notes;
        let regexOwed = consts.deductionRegex;

        dNotes.forEach((n)=> {
            let type = n.type;
            let data='';
            switch (type) {
                case 'Tablets':
                    data = n.data;
                    notes.notes.push(`<div class="dType_${type}">${data}</div>`);
                break;

                case 'Yearlies':
                    data = n.data;
                    notes.notes.push(`<div class="dType_${type}">${data}</div>`);
                break;

                case 'Note':
                    n.data.forEach((d)=> {
                        notes.notes.push(`<div class="d_note">${d}</div>`);
                        if (update) return;

                        let matches = [...d.matchAll(regexOwed)];
                        if (matches.length) {
                            let much = matches[0][1];
                            if (much.length===1 || much.length===2) {
                                much*=10;
                            } else if (much.length===3) {
                                much*=1;
                            };
                            // update the money array
                            let money = vars.App.money.find(m=>m.date===date);
                            if (money) {
                                money.notes.push({ type: 'Owed', amount: much, deduction: true })
                            } else { // new date not seen yet
                                vars.App.money[notes[0].date] = { type: 'Owed', amount: much, deduction: true };
                            };
                        }
                    });
                break;

                default:
                    debugger;
                break;
            };
        });
        let notesText = notes.notes.join('');

        subDiv.innerHTML += notesText;
    }

    addEntryIDToEntry(id) {
        // get the last entry and add its ID
        // Before the entry is saved it wont have an ID.
        // Now that the entry has been saved, we can update the last entry with its ID.
        vars.App.diary[vars.App.diary.length-1].id=id;
    }

    addSavedDiaryEntries(date,notes) {
        let aV = vars.App;
        
        let notesData =[{ type: 'Note', data: notes }];

        // add the new notes data to the diary array
        let noteIndex = aV.diary.findIndex(n=>n.date===date);
        
        if (noteIndex>-1) { // notes already exist for this date, add the new ones
            aV.diary[noteIndex].notes = [...aV.diary[noteIndex].notes, ...notesData];
        } else {
            aV.diary.push({ date: date, notes: notesData });
        };


        // UI Stuff
        // now add the notes to the div
        let div = this.gID(`d_${date}`);
        if (!div) return; // <-- theres no way this and the next check will fail as it would mean the user added notes to a date not visible in the diary view, but Im leaving it in.

        let subDiv = div.getElementsByClassName('diaryDetails')[0];
        if (!subDiv) return;

        let html = '';
        notes.forEach((n)=> {
            html += `<div class="d_note">${n}</div>`;
        });
        subDiv.innerHTML += html;
    }
    addedSavedDiaryEntries_checkForNewDeductions(date,notes) {
        debugger;
        let aV = vars.App;
        // were any of the notes a deduction?
        let regexOwed = consts.deductionRegex;
        notes.forEach((n)=> {
            let matches = [...n.matchAll(regexOwed)];
            if (matches.length) { // deduction found, convert it and add to money
                let amount = matches[0][1];
                if (amount.length===2) {
                    amount*=10;
                } else if (amount.length===3) {
                    amount*=1;
                };

                let moneyIndex = aV.money.findIndex(m=>m.date===date);
                let details = { type: 'Owed', amount: amount, deduction: true };
                if (moneyIndex>-1) { // we already have money notes
                    // check for a balance reset
                    let n = aV.money[moneyIndex].notes.find(n=>n.type==='Balance Reset');
                    if (n) { delete(details.deduction); }; // balance reset found. remove the deduction var from the details
                    aV.money[moneyIndex].notes.push(details);
                } else {
                    aV.money.push([{ date: date, notes: [details]}]);
                };
            };
        });
    }

    balanceRemoveInOutsForResets() {
        let money = vars.App.money;
        money.forEach((m,i)=> {
            let notes = m.notes;
            let reset = false;
            notes.forEach((n)=> {
                if (!reset && n.type==='Balance Reset') {
                    reset=true;
                };
            });
        
            if (reset && m.notes.length>1) {
                m.notes.forEach((mN,mNI)=> {
                    if (mN.deduction!==undefined) {
                        delete(money[i].notes[mNI].deduction); // make it a standard note
                    };
                });
            };
        });
    }

    emptyDiaryFormAndClose() {
        this.date = '';
        this.type = '';
        this.diaryNotes.value = '';

        this.showDiaryPopUp();
    }

    emptyDiaryHTML() {
        this.gID('diaryView').innerHTML = '';
    }

    extendDiaryEntry(dateID) {
        let hiding = this.hideExtendedDiaryEntry();
        if (hiding===dateID) return;

        this.gID(dateID).className += ' d_extended';
    }

    generateDateRange(update=false) {
        let dayN =  consts.getDayNameFromInt;
        let months = this.dateRange;

        let gDN = consts.getDayNameFromInt;

        var d = new Date();
        let today = d.toLocaleDateString();
        let ISOToday = today.split('/').reverse().join('')*1;

        let thisMonth = today.substring(3,5)*1-1;

        // set the end date
        d.setMonth(d.getMonth() + months);
        let endDate = d.toLocaleDateString();
        this.endDate = endDate.split('/').reverse().join('');

        // jump back to  the start date
        d.setMonth(d.getMonth() - months*2);
        // and grab the start day name
        let startingDayName = dayN(d.getDay());
        this.startDate = d.toLocaleDateString().split('/').reverse().join('');

        // if the start day ISNT a monday, add padding divs
        let html = '';
        if (startingDayName.short!=='Mon') {
            let delta = consts.getDayDelta(startingDayName.short);
            html += this.generateEmptyDayDivs(delta);
        };

        let dayNames = [...consts.dayNamesLong];
        let sunday = dayNames.shift();
        dayNames.push(sunday);
        
        // start looping thru the dates
        let thisMonthDiv = null;
        while (d.toLocaleDateString()!==endDate) {
            let date = d.toLocaleDateString();
            let ISODate = date.split('/').reverse().join('');
            !update && this.dates.push(ISODate);

            let classDate = ISODate*1<ISOToday ? ' d_thepast' : '';
            let classDay = gDN(d.getDay()).short ==='Sat' || gDN(d.getDay()).short ==='Sun' ? ' d_weekend' : '';
            let className = date === today ? ' d_today d_extended' : '';
            className += classDate + classDay;
            let day = dayN(d.getDay());
            if (d.getDate()===1) { // new month
                let monthName = convertFromIntToMonthNameLong(d.getMonth()+1);
                let image = this.monthImageNames.find(mI=>mI.monthLong===monthName).src;
                
                let id = thisMonth===d.getMonth() ? ' id="thisMonth"' : '';
                html += `</div><div${id} class="diaryLine d_month" style="background-image: url('${image}')"><div class="d_mMHeading">${monthName}</div> <div class="d_mYHeading">${d.getFullYear()}</div></div>`;
                html += `<div class="diaryLine">`;
                dayNames.forEach((dN)=> {
                    html += `<div class="d_day d_heading">${dN}</div>`;
                });
                html += `</div>`;
                // get delta distance
                let delta =  consts.getDayDelta(day.short);
                html += this.generateEmptyDayDivs(delta);
            };
            
            if (day.short==='Mon') { // start a new line div (new week)
                html += `</div><div class="diaryLine">`
            };
            
            let dateID = date.split('/').reverse().join('');
            let id = `d_${dateID}`;
            date===today && (thisMonthDiv=id);

            let dayPart = date.substring(0,2)*1;
            let ext = getStringExtForInt(dayPart)
            let dateAndExt = `${dayPart}${ext}`;
            //let monthName = convertFromIntToMonthNameShort(d.getMonth()+1);

            html += `<div id="${id}" class="d_day${className}" onclick="vars.App.extendDiaryEntry(this.id,event)">
                        <div class="d_dayAndExtContainer"><div class="d_hasContents"></div><div class="d_dayAndExt">${dateAndExt}</div></div>
                        <div class="d_balance"></div>
                        <div class="d_buttonsLine">
                            <div class="d_icon" data-type="note" onclick="vars.App.showInputType(event,'note',${dateID.replace('d_','')})">
                                <i class="fa-solid fa-file-circle-plus"></i>
                            </div>
                            <div class="d_icon" data-type="note" onclick="vars.App.showInputType(event,'money',${dateID.replace('d_','')});">
                                <i class="fa-solid fa-sterling-sign"></i>
                            </div>
                        </div>
                        <div class="diaryDetails"></div>
                    </div>`;
            d.setDate(d.getDate() + 1);
        };
        html += `</div>`;

        this.gID('diaryView').innerHTML = html;

        // find the current days box and scroll it into view
        this.thisMonthDiv = this.gID('thisMonth');
        
    }

    generateEmptyDayDivs(delta) {
        let html = `<div class="diaryLine">`;
        while (delta) {
            html += `<div class="d_day d_empty">&nbsp;</div>`;
            delta--;
        };
        return html;
    }

    hideExtendedDiaryEntry() {
        let currentlyExtended = document.getElementsByClassName('d_extended')[0];
        currentlyExtended && (currentlyExtended.className = currentlyExtended.className.replace(' d_extended',''));

        return currentlyExtended ? currentlyExtended.id : false;
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    rebuildDiary() {
        this.emptyDiaryHTML();
        this.generateDateRange(true);
        this.addAllDiaryEntriesToDivs(true);
        this.addBalancesToDivs();
        this.showDiaryPopUp();
    }

    saveDiaryEntry() {
        let date = this.date;
        let type = this.type;

        let details = {};


        switch (type) {
            case 'note':
                let note = this.diaryNotes.value.trim();
                if (type==='note' && !note) {
                    let msg = `<div class="error">The note is empty. Unable to save.</div>`;
                    vars.UI.newPopUpMessage(msg);
                    this.showDiaryPopUp();
                    return false;
                };

                // save the note
                let notes = note.split("\n");
                details = { date: date, notes: notes };
                this.saveDiaryEntryNoteDo(details);
                return;
            break;

            case 'money':
                let balance = this.diaryPopUpBalance.value;
                if (this.diarySave.dataset.amount===balance) {
                    let msg = `<div class="error">The balance hasnt changed. Unable to save.</div>`;
                    vars.UI.newPopUpMessage(msg);
                    this.showDiaryPopUp();
                    return;
                };
                details = { date: date, balance: balance };
                this.saveDiaryEntryBalanceDo(details);
                return;
            break;
        };
    }

    saveDiaryEntryBalanceDo(details) {
        let x = new HTTPRequest();
        x.saveBalanceReset(details.date,details.balance);
    }
    saveDiaryEntryNoteDo(details) {
        let x = new HTTPRequest();
        x.saveDiaryEntryNote(details.date,details.notes);
    }

    setDiaryPopUpHeading() {
        let msg = '';
        switch (this.type) {
            case 'money':
                msg = 'Modify Balance';
            break;

            case 'note':
                msg = 'Add New Note';
            break;

            default:
                // unknown type
                debugger;
            break;
        };
        this.diaryPopUpHeading.innerHTML = msg;
    }

    setDiaryPopUpDate() {
        let date = this.date.toString();

        let day = date.substring(6,8);
        day = (day*1).toString() + getStringExtForInt(day*1);

        let month= date.substring(4,6);
        month = convertFromIntToMonthNameLong(month);

        date = `${day} ${month} ${date.substring(0,4)}`;
        this.diaryPopUpDate.innerHTML = date;
    }

    showInputType(e,type,date) {
        this.preventDefaults(e);

        this.type = type;
        this.date = date;
        this.setDiaryPopUpHeading();
        this.setDiaryPopUpDate(date);

        let balanceDiv = this.gID(`d_${date}`).getElementsByClassName('d_cbalance')[0];
        let diaryNotesDiv = this.diaryNotes;

        switch (type) {
            case 'note':
                this.diaryPopUpBalanceContainer.className = 'hidden';
                this.diaryPopUpBalance.value = 0;
                this.diarySave.dataset.amount = 0;
                diaryNotesDiv.className = '';
            break;

            case 'money':
                let balance = balanceDiv.innerHTML.replace('£','')*1;
                // get the balance child
                this.diaryPopUpBalanceContainer.className = '';
                this.diaryPopUpBalance.value = balance.toFixed(2);
                this.diaryPopUpBalance.select();
                this.diarySave.dataset.amount = balance;
                diaryNotesDiv.className = 'hidden'; // hide the notes text area
            break;
            
            default:
                // unknown type
                debugger;
                break;
            };
                
        this.diarySave.dataset.date = date;
        this.diarySave.dataset.type = type;


        this.showDiaryPopUp();
    }

    showDiaryPopUp() {
        this.diaryPopUp.className = !this.diaryPopUp.className ? 'editDiaryEntry_slideIn' : '';
    }

    showSwitch() {
        let container = this.container;
        let tD = this.thisMonthDiv;

        let className = !container.className ? 'diaryContainer_slideIn' : '';
        container.className = className;

        if (className!=='') {
            setTimeout(()=> {
                tD.scrollIntoView({behavior:'smooth'});
            }, 500);
            return;
        };

        this.hideExtendedDiaryEntry();
    }

};
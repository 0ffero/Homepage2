let UI_MainPage = class {
    constructor() {
        this.gID = vars.getElementByID;
        this.init();
    }

    init() {
        let gID = this.gID;

        this.container = gID('mainPageContainer');

        this.comboLoad = [];
        this.vpnRequired = false;

        this.initUI();
    }

    initUI() {
        this.buttons = vars.App.buttons;

        this.lines = [
            {
                containerName: 'Media',
                buttons: [
                    'Youtube','Youtube Downloader','BLANK','BLANK','BLANK','BLANK','IMDB','Hura Watch','YIFY'
                ]
            },
            {
                containerName: 'Other',
                buttons: [
                    'Diary','Facebook','Google Mail'
                ]
            },
            {
                containerName: 'Search',
                buttons: [
                    'Google','Google Images','Google Maps'
                ]
            },
            {
                containerName: 'Shopping',
                buttons: [
                    'Amazon','CEX','E-Bay','Tesco'
                ]
            },
            { 
                containerName: 'Downloads',
                buttons: [
                    'Fitgirl','MagnetDL','BLANK','DODI','1337x','RarBG'
                ]
            }
        ];

        this.lines.forEach((l)=> {
            this.createNewSection(l);
        })
    }

    addEmptySpace() {
        let html = `<div class="buttonContainer">
                        <div class="oB_buttonEmpty"></div>
                    </div>`;
        return html;
    }

    addURLToComboList(url,deleteIfFound) {
        if (!url || !url.startsWith('http')) return;

        if (this.comboLoad.includes(url)) { // we've found the url in the combo list
            if (!deleteIfFound) return; // should we delete it? (default is YES)

            // yes, remove it from the array
            let i = this.comboLoad.findIndex(cL=>cL===url);
            this.comboLoad.splice(i,1);
            return false;
        };

        this.comboLoad.push(url);
        
        return true;
    }

    buttonClickMain(url) {
        // add the url to combo load
        this.addURLToComboList(url);
        // set the vpn required var
        !this.vpnRequired && (this.vpnRequired = this.isVPNRequiredForURL(url));

        // start dealing with the urls
        if (this.vpnRequired) {
            vars.App.checkForVPN(); // we have to wait for this to respond before doing anything else
            return;
        };

        // none of the urls need a vpn
        this.comboLoadAll();
    }

    comboLoadAll() {
        while (this.comboLoad.length) {
            let url = this.comboLoad.shift();
            this.openURL(url);
        };

        // reset the VPN vars
        vars.App.vpn = false;
        this.vpnRequired = false;

        // unhighlight comboloads
        this.comboLoadsUIReset();
    }

    comboLoadsUIReset() {
        [...vars.UI.mainPage.class.container.getElementsByClassName('hlMPButton')].forEach((button)=> {
            button.classList.remove('hlMPButton');
        });
    }

    createNewSection(sectionDetails) {
        let containerName = sectionDetails.containerName;
        let buttons = sectionDetails.buttons;

        let html = '';

        html += `<div id="${containerName}Container" class="subContainer">`;
        buttons.forEach((buttonName)=> {
            if (buttonName==='BLANK') { html+=this.addEmptySpace(); return; };


            let data = this.buttons.find(b=>b.text===buttonName);

            let image = data.image;
            let text = data.text;
            let url = data.url;
            let type = data.type;

            let js = '';
            switch (type) {
                case 'internal':
                    switch (text) {
                        case 'Diary':
                            js = `onclick="vars.UI.diary.class.showSwitch()"`;
                        break;

                        case 'Youtube Downloader':
                            js = `onclick="vars.UI.ytdlp.showContainer()"`;
                        break;

                        default: // unknown button!
                            debugger;
                        break;
                    }
                break;

                default:
                    if (!url) {
                        // URL is missing from button definition
                        debugger;
                        return;
                    };
                    js = `onclick="vars.input.buttonClickMain(event,'${url}')"`;
                break;
            };


            html += `<div data-url="${url}" class="buttonContainer" ${js}>
                        <div class="button" style="background-image: url('./assets/images/buttons/${image}');">
                            <div class="buttonImage">
                                &nbsp;
                            </div>
                            <div class="buttonText">${text}</div>
                        </div>
                    </div>`;
        });
        html += `</div>`; // end of container div

        // push the finished html into the main container
        this.container.innerHTML += html;
    }

    isVPNRequiredForURL(url) {
        let aV = vars.App;
        if (!aV.buttons.find(b=>b.url===url).vpn) {
            return false;
        };

        return true;
    }

    openURL(url) {
        window.open(url, '_blank');
    }
};
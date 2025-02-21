let UI_OtherButtons = class {
    constructor() {
        this.gID = vars.getElementByID;
        this.init();
    }

    init() {
        this.createContainer();
    }

    createContainer() {
        let html = '';

        html += `<div id="otherButtons" class="hidden">
                    <div id="oB_closeOthersPage" onclick="vars.App.showOtherButtons()"><i class="fa-solid fa-rectangle-xmark"></i></div>
                    <div id="oB_actualButtons">
                        <div id="oB_edit" class="oB_button" onclick="vars.input.buttonClickOthers('edit')">EDIT</div>
                        <div id="oB_DB" class="oB_button" onclick="vars.input.buttonClickOthers('db')">DB</div>
                    </div>
                </div>`;

        document.body.innerHTML += html;

        this.container = this.gID('otherButtons');
    }

    click(which) {
        let url = '';
        switch (which) {
            case 'db':
                url = `http://offero04.gw/Apps/videosplitImageGen/index.html`;
            break;

            case 'edit':
                url = `http://offero04.gw/Apps/videosplit/`;
            break;

            default:
                // unknown which
                debugger;
            break;
        };

        if (!url) return;

        window.open(url,'_blank');

    }
};
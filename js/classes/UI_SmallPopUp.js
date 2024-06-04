let UI_SmallPopUp = class {
    constructor() {
        this.gID = vars.getElementByID;

        this.init();
    }

    init() {
        this.container = this.gID('smallPopUp')
    }

    clearTimeout() {
        clearTimeout(this.timeout);
        delete(this.timeout);
    }

    setMsgAndShow(msg) {
        this.timeout && this.clearTimeout();
        
        let c = this.container;
        c.innerHTML = c.innerHTML ? `${c.innerHTML}<br/>${msg}` : msg;

        c.className = 'smallPopUpSlideIn';

        this.timeout = setTimeout(()=> {
            c.className = '';
            setTimeout(()=> {
                c.innerHTML = '';
            }, 500);
        }, 5000);
    }
};
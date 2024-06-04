let UI = class {
    constructor(_type) {
        this.gID = vars.getElementByID;
        this.valid = false;
        this.type = _type;

        this.init();
    }

    init() {
        // is this a valid UI call?
        let types = ['diary','smallPopUp','mainPage','youtubeVideoList'];
        if (!types.includes(this.type)) { let msg = 'Invalid UI type!'; this.error(msg); return; }; // ummm... no, it isnt valid

        switch (this.type) {
           case 'diary':
                this.class = new UI_Diary();
            break;

            case 'mainPage':
                this.class = new UI_MainPage();
            break;

            case 'smallPopUp':
                this.class = new UI_SmallPopUp();
            break;

            case 'youtubeVideoList':
                this.class = new UI_YoutubeVideoList();
            break;

            default:
                console.log(`UI type ${this.type} was invalid`);
                return false;
            break;
        };

        this.valid = true;
    }

    error(msg) {
        console.error(msg);
        return msg;
    }
};
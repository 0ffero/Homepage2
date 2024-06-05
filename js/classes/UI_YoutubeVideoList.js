let UI_YoutubeVideoList = class {
    constructor() {
        this.gID = vars.getElementByID;

        this.videoLoading = false;
        this.videoList = vars.App.youtubeVideoList;

        this.container = this.gID('youtubeVideoList');
        this.videoContainer = this.gID('videoContainer');

        let vP = this.videoPlayer = this.gID('videoPlayer');
        vP.addEventListener('ended', ()=> {
            this.resetVideo();
        });
        vP.addEventListener('canplay', ()=> {
            if (!this.videoLoading) return;

            this.videoLoading = false;
            if (!this.loadingVars) return;

            this.videoPlayer.currentTime = this.videoPlayer.duration * this.loadingVars.percent;
            this.loadingVars = false;

        });
        vP.addEventListener('pause', ()=> {
            this.saveCurrentYTPosition();
            this.resetSaveDelay();
        });

        this.saveDelay = 5; // every 5 seconds we save the current yt video position thats playing
        this.saveDelayMax = 5;
        this.init();
    }
    
    init() {
        let files = this.videoList;
        let html = '<div id="closeYTList" class="" onclick="vars.UI.youtubeVideoList.class.mainContainerSwitchVisibility()"><i class="fa-solid fa-rectangle-xmark"></i></div>';
        files.forEach((file)=> {
            let fileSafe = file.replaceAll("'","\\'")
            let crc = crc32(file);
            vars.App.ytCRCs.push({ fileName: file, crc: crc });
            let data = vars.App.ytWatchingList.find(w=>w.crc===crc)
            let width = data ? data.percent : 0;
            width*=100;
            html +=`<div class="ytFileRow">
                        <div class="ytDeleteFile" onclick="vars.App.deleteYTVideo('${fileSafe}')"><i class="deleteFile fa-solid fa-trash"></i></div><div class="ytPercentContainer"><div class="ytPercent" style="width: ${width}px"></div></div><div class="ytFileName" onclick="vars.App.youtubeVideoListClick('${fileSafe}')">${file}</div>
                    </div>`;
        });

        this.container.innerHTML = html;
    }

    mainContainerSwitchVisibility() {
        this.container.className = !this.container.className ? 'hidden' : '';
    }

    resetSaveDelay() {
        this.saveDelay = this.saveDelayMax;
    }

    resetVideo() {
        let crc = this.videoPlayer.crc;
        // save the fact that this is complete
        vars.localStorage.setAsWatched(crc);
        delete(this.videoPlayer.crc);
        this.videoPlayer.src = '';
    }

    saveCurrentYTPosition() {
        let vP = this.videoPlayer;
        let crc = vP.crc;
        if (!crc) return; // fail safe in case we get here but the crc has been deleted

        let cP = vP.currentTime;
        let dur = vP.duration;
        let percent = cP/dur;
        vars.App.saveCurrentYTPosition(crc,percent);
    }

    update() {
        if (!this.videoPlayer.paused) { // theres a video playing
            this.saveDelay--;
            if (this.saveDelay) return;

            // update the current position of this file
            this.saveCurrentYTPosition();
            this.resetSaveDelay();
        };
    }

    videoSwitchVisibility() {
        this.videoContainer.className = !this.videoContainer.className ? 'hidden' : '';
    }
};
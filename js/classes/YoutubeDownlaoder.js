let YoutubeDownlaoder = class {
    constructor() {
        this.gID = vars.getElementByID;

        this.containerName = 'ytdlpContainer';
        this.showClass = 'ytdlpContainerShow';

        this.ytdlpUpdateDone = false;

        this.musicList = [];
        this.videoList = [];

        this.init();
    }

    init() {
        this.getVideoAndMusicList();
        this.initUI();
    }

    initUI() {
        let thisClass = 'vars.UI.ytdlp';
        let body = document.body;

        let html = `<div id="${this.containerName}">`;
        html +=    `  <div id="ytdlpHeader">YOUTUBE DOWNLOADER.<br/>Music Player. Video Player.</div>`;
        html +=    `  <div id="ytdlpButtonsContainer">`;
        html +=    `    <div class="ytdlpButton" onclick="${thisClass}.updateYTDLP()">Update YT-DLP</div><div class="ytdlpButton" onclick="${thisClass}.switchVisibilityOfDownloaderContainer()">Download</div><div class="ytdlpButton" onclick="${thisClass}.switchVisibilityOfList('music')">Show Music List</div><div class="ytdlpButton" onclick="${thisClass}.switchVisibilityOfList('video')">Show Video List</div><div id="ytdlpButtonClose" class="ytdlpButton" onclick="${thisClass}.showContainer(false)">Close</div>`
        html +=    `  </div>`;
        html +=    `  <div id="ytdlpUpdateResponseText"></div>`
        html +=    `  <div id="ytDownloaderContainer" class="hidden">`;
        html +=    `    <div id="ytDLHeader">Please enter the Youtube URL you want to download</div>`;
        html +=    `    <div id="ytDLInputContainer">URL <input id="ytDLURL" type="text" plcaeholder="Enter URL..." /> Music<input class="ytDLOption" name="ytDLOption" type="radio" checked /> Video<input class="ytDLOption" name="ytDLOption" type="radio" /></div>`;
        html +=    `  </div>`
        html +=    `  <div id="ytdlpVideos">`;
        html +=    `    <div id="ytVideoHeader" class="ytFileHeadings hidden">VIDEOS</div>`;
        html +=    `    <div id="ytVideoList" class="hidden"></div>`;
        html +=    `    <div id="ytMusicHeader" class="ytFileHeadings hidden">MUSIC</div>`;
        html +=    `    <div id="ytMusicList" class="hidden"></div>`;
        html +=    `  </div>`;
        html +=    '</div>';

        body.innerHTML += html;
    }

    addToMusicList(fileName, add) {
        if (add) {
            this.musicList.push(fileName)
            return;
        };

        // removing the file
        let index = this.musicList.findIndex(m=>m===fileName);
        if (index===-1) {
            console.error(`Unable to find ${fileName} in the music list!`)
            return false;
        };
        this.musicList.splice(index,1);
    }

    addToVideoList(fileName, add) {
        if (add) {
            this.videoList.push(fileName)
            return;
        };

        // removing the file
        let index = this.videoList.findIndex(v=>v===fileName);
        if (index===-1) {
            console.error(`Unable to find ${fileName} in the video list!`)
            return false;
        };
        this.videoList.splice(index,1);
    }

    addVideoAndMusicListToUI(list) {
        this.files = list; // cache the file list

        let musicListContainer = this.gID('ytMusicList');
        let music = list.music;
        let videoListContainer = this.gID('ytVideoList');
        let videos = list.videos;

        // build the music list
        let clickFunction = 'vars.UI.ytdlp.clickMusic';
        let musicHTML = '';
        music.forEach((m)=> {
            musicHTML += `<div class="musicFile"><input type="checkbox" onclick="${clickFunction}('${m}',this.checked);"> ${m}</div>`;
        });
        !musicHTML && (musicHTML='No Music Files Found');
        musicListContainer.innerHTML = musicHTML;

        // build the video list
        clickFunction = 'vars.UI.ytdlp.clickVideo';
        let videoHTML = '';
        videos.forEach((v)=> {
            videoHTML += `<div class="videoFile"><input type="checkbox" onclick="${clickFunction}('${v},this.checked');"> ${v}</div>`;
        });
        !videoHTML && (videoHTML='No Video Files Found');
        videoListContainer.innerHTML = videoHTML;
    }

    clickMusic(fileName,add) {
        this.addToMusicList(fileName,add);
    }

    clickVideo(fileName,add) {
        this.addToVideoList(fileName,add);
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

    getVideoAndMusicList() {
        this.doRequest('./endpoints/ytdlp/getVideoAndMusicList.php',null,this.getVideoAndMusicListHandler);
    }
    getVideoAndMusicListHandler(rs) {
        if (rs.ERROR) { // Error found!
            console.error(rs.ERROR);
            return false;
        };

        vars.UI.ytdlp.addVideoAndMusicListToUI(rs.files); // send the response to the UI builder
    }

    showContainer(show=true) {
        let div = this.gID(this.containerName);
        let sC = this.showClass;
        if (show) {
            !div.classList.contains(sC) && div.classList.add(sC);
        } else {
            div.classList.contains(sC) && div.classList.remove(sC);
        };
    }

    switchVisibilityOfDownloaderContainer() {
        let container = this.gID('ytDownloaderContainer');
        if (container.classList.contains('hidden')) {
            container.classList.remove('hidden');
            return;
        };

        container.classList.add('hidden');
    }

    switchVisibilityOfList(which=null) {
        if (which===null || (which!=='video' && which!=='music')) {
            console.error(`Container type was invalid!`);
            debugger;
            return false;
        };

        let divHeader;
        let divList;
        switch(which) {
            case 'video':
                divHeader = this.gID('ytVideoHeader');
                divList = this.gID('ytVideoList');
            break;

            case 'music':
                divHeader = this.gID('ytMusicHeader');
                divList = this.gID('ytMusicList');
            break;
        };

        let hide = divHeader.classList.contains('hidden') ? false : true;

        if (hide) {
            divHeader.classList.add('hidden');
            divList.classList.add('hidden');
        } else {
            divHeader.classList.remove('hidden');
            divList.classList.remove('hidden');
        };
    }

    updateYTDLP() {
        if (this.ytdlpUpdateDone) return; // weve already updated yt-dlp this session

        this.doRequest('./endpoints/ytdlp/updateYTDLP.php',null,this.updateYTDLPHandler);
    }
    updateYTDLPHandler(rs) {
        if (rs.ERROR) { // Error found!
            console.error(rs.ERROR);
            return false;
        };

        vars.UI.ytdlp.updateYTDLPValid(rs);
    }
    updateYTDLPValid(rs) {
        let updateText = rs.updated ? `YT-DLP was updated successfully` : `YT-DLP is already up to date`;
        let className = rs.updated ? 'ytUpdated' : 'ytAlready';
        let div = this.gID('ytdlpUpdateResponseText');
        div.innerHTML = updateText;
        div.classList.add(className);
        this.ytdlpUpdateDone =  true;
    }
};
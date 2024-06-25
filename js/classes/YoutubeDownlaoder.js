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
        html +=    `    <div id="ytDLInputContainer">URL <input id="ytDLURL" type="text" placeholder="Enter URL..." /> Music<input class="ytDLOption" name="ytDLOption" type="radio" value="audio" checked /> Video<input class="ytDLOption" name="ytDLOption" type="radio" value="video" /><div id="ytDLDownloadButton" class="" onclick="vars.input.buttonClickYTDL()">Download</div></div>`;
        html +=    `    <div id="ytDLOutput"></div>`;
        html +=    `  </div>`;
        html +=    `  <div id="ytdlpVideos">`;
        html +=    `    <div id="ytVideoHeader" class="ytFileHeadings hidden">VIDEOS</div>`;
        html +=    `    <div id="ytVideoList" class="hidden"></div>`;
        html +=    `    <div id="ytMusicHeader" class="ytFileHeadings hidden">MUSIC</div>`;
        html +=    `    <div id="ytMusicList" class="hidden"></div>`;
        html +=    `  </div>`;
        html +=    '</div>';

        body.innerHTML += html;

        this.outputDiv = this.gID('ytDLOutput');
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
            musicHTML += `<div class="musicFileContainer"><input type="checkbox" onclick="${clickFunction}('${m},this.checked');"><i onclick="vars.UI.ytdlp.editFileName('music','${v}')" onclick="${clickFunction}('${m}',this.checked);"><div class="musicFile">${m}</div>`;
        });
        !musicHTML && (musicHTML='No Music Files Found');
        musicListContainer.innerHTML = musicHTML;

        // build the video list
        clickFunction = 'vars.UI.ytdlp.clickVideo';
        let videoHTML = '';
        videos.forEach((v)=> {
            videoHTML += `<div class="videoFileContainer"><input type="checkbox" onclick="${clickFunction}('${v},this.checked');"><i onclick="vars.UI.ytdlp.editFileName('video','${v}')" class="ytEditIcon fa-solid fa-pen-to-square"></i><div class="videoFile">${v}</div></div>`;
        });
        !videoHTML && (videoHTML='No Video Files Found');
        videoListContainer.innerHTML = videoHTML;
    }

    clickMusic(fileName,add) {
        debugger;
        this.addToMusicList(fileName,add);
    }

    clickVideo(fileName,add) {
        debugger;
        this.addToVideoList(fileName,add);
    }

    createOutputMessage(msg,type) {
        if (!msg || !type) return false;

        let className;
        switch (type) {
            case 'error': className = 'ytDLError'; break;
            case 'good': className = 'ytDLGood'; break;
            default: className=''; break;
        };

        let divID = `info_` + generateRandomID();
        let html = `<div id="${divID}" class="${className}">${msg}</div>`;
        let opDiv = this.outputDiv;
        opDiv.innerHTML += html;
        let newDiv = this.gID(divID);
        newDiv.timeout = setTimeout(()=> {
            this.gID(divID).remove();
        }, 5000);
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

    download(id) {
        let video = null;
        // are we wanting the video or just audio?
        [...document.getElementsByClassName('ytDLOption')].forEach((o)=> {
            if (!o.checked || video!==null) return;
            video = o.value==='video' ? 'yes' : 'no';
        });
        // dot he request
        let post = `id=${id}&video=${video}`;
        this.doRequest('./endpoints/ytdlp/getVideo.php', post, vars.handlers.getYouTubeVideoOrAudio);
    }

    downloadClick() {
        let input = this.gID('ytDLURL');
        let url = input.value;
        if (!url) return;
        let id = this.getYTIDFromLink(url);

        if (id.length!==11) return;

        // YUP. Everything looks good. We have an id (url) that is 11 characters long. Basically its as valid as it gets
        // empty out the input box
        input.value='';

        // add a download msg to the log
        let msg = `Downloading youtube video with ID: ${url}<br/>Please wait...`;
        // let the user know the file is downloading! TODO
        this.createOutputMessage(msg,'default');

        // send URL to the endpoint
        this.download(id);
    }

    downloadHandler(rs) {
        let className = rs.ERROR ? 'error' : 'good';
        let msg = rs.ERROR ? rs.ERROR : 'Downloaded Successfully';
        this.createOutputMessage(msg, className);
        if (rs.ERROR) return;
        
        // no errors found, display success or warning for file rename
        msg = rs.success ? rs.success : rs.warning;
        msg += `<br/>${rs.file_name}`; // and show the file name it was saved as
        setTimeout(()=> {
            this.createOutputMessage(msg, className);
        }, 2000);
    }

    editFileName(type=null,fileName=null) {
        if (!type || !fileName) return false;
        debugger;
        if (type==='video') {
            
            return;
        };

        // audio file name change
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

    getYTIDFromLink(url) {
        let ytIDLength = 11;
        
        let allowed = ['https://youtu.be/','https://www.youtube.com/'];
        let found = false;
        // check for a valid url whilst removing common url parts (in allowed array above)
        allowed.forEach((a)=> {
            (url.startsWith(a) && !found) && (found=true);
            url = url.replace(a,'');
        });
        url = url.replace('watch?v=','');
        if (!found) { console.error(`%cURL was invalid.\nIt must be in its original format starting with:\n%c    https://youtu.be/\n    %cor\n    %chttps://www.youtube.com/%c\nExamples:\n    %chttps://www.youtube.com/watch?v=wYkmvq_vANs\n    https://www.youtube.com/watch?v=wYkmvq_vANs&t=120\n    https://www.youtube.com/watch?v=8ifY2dvQnK4&list=PLAAetX470-WjEnvqIrmN_1AusoXtJAUoe&index=1\n  %cor\n    https://youtu.be/8ifY2dvQnK4\n    https://youtu.be/8ifY2dvQnK4?t=205`, 'color: #ff0000', 'color: default','color: #ffff00', 'color: default','color: #30ff30', 'color: default', 'color: #30FF30'); return false; }
        
        // url is valid
        // start parsing the URL
        if (url.length!==ytIDLength) { // we dont have the ID after removing the common part of the url
            console.log(url);
            url = url.split('&')[0];
            url.includes('?t=') && (url=url.split('?')[0]);
        };

        // again, check if the url is 11 characters long
        if (url.length!==11) {
            console.error(`The url couldnt be parsed.\nWhen looking for the videos ID, the function was left with ${url}`);
            return false;
        };

        return url;
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
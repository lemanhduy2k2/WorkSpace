// All of Task you need to Do
/**
 *  1. Render songs
 *  2. Scroll top 
 *  3. Play / pause / seek
 *  4. CD rotate
 *  5. Next / prev
 *  6. Random
 *  7. Next / Repeat when ended
 *  8. Active song
 *  9. Scroll active song into view
 *  10. Play song when click
 */


        var $ = document.querySelector.bind(document);
        var $$ = document.querySelector.bind(document);
        var songList = $('.songs-list');
        const orderMusic = $('.order-music');
        const allMusic = $('.all-music');
        const songName = $('.song--name');
        const songAuthor = $('.song--author');
        const audio = $('#audio');
        const PlayBtn = $('.tongle-play');
        const Adjust = $('.song-adjust');
        const timeNow = $('.time-start');
        const timeDuration = $('.time-duration');
        const rangeTime = $('#duration-bar');
        const cd = $('.cd');
        const nextBtn = $('.next-btn');
        const prevBtn = $('.previous-btn');
        const randomBtn = $('.random-btn');
        const repeatBtn = $('.repeat-btn');
        const songlist = $('.songs-list');
        const Wave = $('#wave');
        const muteSounds = $('.mute-volume');
        const enableSounds = $('.volume-on');
        const soundBar = $('.sounds-bar');
        
        muteSounds.style.cursor = 'pointer';
        enableSounds.style.cursor = 'pointer';

const app = {
    currentIndex: 0,
    totalSong : 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'We Don\'t talk anymore',
            singer: 'Charlie Puth',
            path: './assets/songs/song1.mp3',
            image: './assets/images/song1.jpg'
        },
        {
            name: 'HeartBreak Anniversary',
            singer: 'Giveon',
            path: './assets/songs/song2.mp3',
            image: './assets/images/song2.jpg'
        },
        {
            name: 'Take You Home',
            singer: 'Jason Ross & MitiS',
            path: './assets/songs/song3.mp3',
            image: './assets/images/song3.jpg'
        },
        {
            name: 'Monster',
            singer: 'Katie',
            path: './assets/songs/song4.mp3',
            image: './assets/images/song4.jpg'
        },
        {
            name: 'Greatful',
            singer: 'Neffex',
            path: './assets/songs/song5.mp3',
            image: './assets/images/song5.jpg'
        },
        {
            name: 'Photograph',
            singer: 'Ed Sheeran',
            path: './assets/songs/song6.mp3',
            image: './assets/images/song6.jpg'
        },
        {
            name: 'Psycho',
            singer: 'Russ',
            path: './assets/songs/song7.mp3',
            image: './assets/images/song7.jpg'
        },
        {
            name: 'Treat You Better',
            singer: 'Shawn Mendes',
            path: './assets/songs/song8.mp3',
            image: './assets/images/song8.jpg'
        },
        {
            name: 'Apologize',
            singer: 'Timbaland',
            path: './assets/songs/song9.mp3',
            image: './assets/images/song9.jpg'
        },
        {
            name: 'I Do',
            singer: '911 Band',
            path: './assets/songs/song10.mp3',
            image: './assets/images/song10.jpg'
        },
        {
            name: 'Why Not Me',
            singer: 'Enrique Iglesias',
            path: './assets/songs/song11.mp3',
            image: './assets/images/song11.jpg'
        },
        {
            name: 'Dusk Till Dawn',
            singer: 'ZAYN & Sia',
            path: './assets/songs/song12.mp3',
            image: './assets/images/song12.jpg'
        }
    ],

    defineProperties: function() {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },


    render: function() {
        var htmls = this.songs.map((song ,index) => {
            totalSong = index;
            return `
                <div data-index = ${index} id = data-${index} class="song ${(index === this.currentIndex) ? 'active' : ''}">
                    <div class="song-cd" style="background-image: url('${song.image}');">
                    </div>
                    <div class="song-decs">
                        <div class="song-name">${song.name}</div>
                        <div class="song-author">${song.singer}</div>
                    </div>
                    <div class="setting">
                        <i class="fa-sharp fa-solid fa-ellipsis"></i>
                    </div>
                </div>
                `
        })
        songList.innerHTML = htmls.join('');
    },


    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const cdAnimated = cd.animate([
            { transform : 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        });

        cdAnimated.pause();

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop ;
            cd.style.width = newcdWidth + 'px';
            cd.style.height = newcdWidth + 'px';
        }

        PlayBtn.onclick = function(e) {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }

            audio.onplay = function() {
                _this.isPlaying = true;
                Adjust.classList.add('playing');
                let updateTime = setInterval(_this.progressTime ,1000);
                cdAnimated.play();
                Wave.classList.add('loader');
            }
            audio.onpause = function() {
                _this.isPlaying = false;
                Adjust.classList.remove('playing');
                cdAnimated.pause();
                Wave.classList.remove('loader');
            }
        }
        audio.oncanplay = function() {
            timeDuration.innerText = covertSeconds(audio.duration);
        }
        audio.ontimeupdate = function() {
            if(audio.duration) {
                var percentSong = (audio.currentTime / audio.duration) * 100;
                rangeTime.value = Math.floor(percentSong);
            }
        }
        rangeTime.oninput = function(e) {
            e.preventDefault();
            const seekTime = this.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
                _this.loadCurrentSong();
                audio.play();
            } else {
                const nodeDelete = $(`#data-${_this.currentIndex}`);
                if(nodeDelete) {
                    nodeDelete.classList.remove('active');
                }
                _this.nextSong();
                let playingSong = $(`#data-${_this.currentIndex}`);
                playingSong.classList.add('active');
            }
            _this.scrollSongintoView();
        };

        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
                _this.loadCurrentSong();
                audio.play();
            } else {
                const nodeDelete = $(`#data-${_this.currentIndex}`);
                if(nodeDelete) {
                    nodeDelete.classList.remove('active');
                }
                _this.prevSong();
                let playingSong = $(`#data-${_this.currentIndex}`);
                playingSong.classList.add('active');
            }
            _this.scrollSongintoView();
        }

        audio.onended = function() {
            if(_this.isRepeat) {
                _this.repeatSong();
                audio.play();
            } else {
                _this.nextSong();
            }
        }

        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;

            this.classList.toggle('active' ,_this.isRandom);
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle('active' , _this.isRepeat);
        }

        songlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.setting')) {
                if(songNode) {
                    const nodeDelete = $(`#data-${_this.currentIndex}`);
                    nodeDelete.classList.remove('active');

                    var clicksongIndex = songNode.getAttribute('data-index');
                    _this.currentIndex = Number(clicksongIndex);

                    let playingSong = $(`#data-${_this.currentIndex}`);
                    playingSong.classList.add('active');
                    _this.loadCurrentSong();
                    
                    audio.play();
                } else {

                }
            }
        }
        //Control sound
        muteSounds.onclick = function() {
            soundBar.value = 0;
            audio.muted = true;
        }

        enableSounds.onclick = function() {
            audio.muted = false;
            soundBar.value = 80;
            audio.volume = 0.8;
        }
        soundBar.oninput = function(e) {
            audio.volume = e.target.value / 100;
        }

    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0 ;
        }
        this.loadCurrentSong();
        audio.play();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
        audio.play();
    },

    randomSong: function() {
        let newCurrentIndex;

        do{
            newCurrentIndex = Math.floor(Math.random() * this.songs.length);

        }while(newCurrentIndex === this.currentIndex);
        this.currentIndex = newCurrentIndex;
    },
    repeatSong: function() {
        this.loadCurrentSong();
    },

    progressTime : function() {
        var minutes = Math.floor(audio.currentTime / 60);
        var seconds = Math.floor(audio.currentTime - (minutes * 60));

        if(minutes < 10 ) { minutes = '0' + minutes};
        if(seconds < 10 ) { seconds = '0' + seconds};

        timeNow.innerText = `${minutes}:${seconds}`;
    },

    loadCurrentSong: function() {

        orderMusic.innerText = this.currentIndex + 1;
        allMusic.innerText = ' of ' + (totalSong + 1);
        songName.innerText = this.currentSong.name;
        songAuthor.innerText = this.currentSong.singer;
        cd.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    scrollSongintoView: function() {
        setTimeout(()=> {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        },300);
    },


    start: function() {
        this.handleEvents();

        this.defineProperties();

        this.render();

        this.loadCurrentSong();
    },
}

app.start();
function covertSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var surplusSeconds = Math.ceil(seconds % 60);

    if(minutes < 10) {
        minutes = '0' + minutes;
    }

    if(surplusSeconds < 10) {
        surplusSeconds = '0' + surplusSeconds;
    }

    return `${minutes}:${surplusSeconds}`;
}
var cc_streaminfo_get_callback,
    cc_recenttracks_get_callback;

$(document).on('ready', function () {

  // Init vars
  var serverOn = false,
      playing = false,
      colors = ['2c3e50', '8e44ad', '2980b9', '27ae60', '16a085', 'e74c3c', 'e67e22'],
      lastColor = '',
      songTitle = '',
      lastSongTitle = '',
      $btnRepro = $('.btn-repro'),
      $infoList = $('.info-list'),
      $nowPlaying = $('#now-playing');

  // radio-info
  var $radioLoading = $('.radio-loading'),
      $radioOn = $('.radio-on'),
      $radioOff = $('.radio-off');

  var _setReproColor = function () {
    var randomColor = colors[Math.floor((Math.random() * 6) + 1)];

    $('.player')
      .removeClass('player-' + lastColor)
      .addClass('player-' + randomColor);

    lastColor = randomColor;
  };

  var _clearMarquee = function () {
    $nowPlaying
      .empty()
      .marquee('destroy');
  };

  var _setMarquee = function () {
    if (songTitle !== lastSongTitle) {
      lastSongTitle = songTitle;

      _clearMarquee();
      _setReproColor();

      $nowPlaying
        .text(songTitle)
        .marquee();
    }
  };

  var _getRadioInfo = function () {
    $.getScript('https://radio02.ferozo.com/js.php/ra02000762/streaminfo/rnd0');
  };

  cc_streaminfo_get_callback = function (info) {
    $radioLoading.hide();

    if (info.title !== '') {
      var data;

      try {
        data = JSON.parse(info.title);
        $infoList.empty();

        if (data.msg) {
          var msgHashtag = data.msg.replace(/#(\w+)/g, '<a href="https://twitter.com/hashtag/$1" target="_blank">#$1</a>');
          var msg = '<li class="list-group-item">' + msgHashtag + '</li>';
          $infoList.append(msg);
        }

        if (data.link) {
          var link = '<li class="list-group-item"><a href="' + data.link + '">' + data.link + '</a></li>';
          $infoList.append(link);
        }

        $infoList.show();
      } catch (e) {
        console.log('>>> Error parsing title');
      }
    }

    // Set maerquee
    if (info.song !== '') {
      songTitle = info.song;

      $nowPlaying
        .bind('finished', function () {
          _setMarquee();
        });
    }

    if (info.server === 'Activo') {
      serverOn = true;

      $btnRepro.removeClass('disabled');

      $radioOn.show();
      $radioOff.hide();
    } else {
      serverOn = false;

      $btnRepro.addClass('disabled');

      $radioOff.show();
      $radioOn.hide();
    }
  };

  setInterval(function () {
    _getRadioInfo();
  }, 30000);

  // recent-tracks
  var $lastSongs = $('#last-songs');

  var _getLastSongsData = function () {
    $.getScript('https://radio02.ferozo.com/js.php/ra02000762/recenttracks/rnd0');
  };

  cc_recenttracks_get_callback = function (tracks) {
    if (tracks && Array.isArray(tracks)) {
      $lastSongs.empty();

      tracks.forEach(function (track) {
        var html = '<p><strong>' + track.title + '</strong><br><small class="text-muted">' + track.artist + ' - ' + track.album + '</small></p>';

        $lastSongs.append(html);
      });
    }
  };

  setInterval(function () {
    _getLastSongsData();
  }, 60000);

  // Init
  _setReproColor();
  _getRadioInfo();
  _getLastSongsData();

  var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent ),
      displayBlock = { display: 'block' },
      audio;

  // Hide Volume controls for iOS
  if (iOS) $('#volume').hide();

  // Play/Pause controls
  $btnRepro.on('click', function (e) {
    e.preventDefault();

    if ( ! serverOn) return false;

    var $this = $(this);

    // Play/Pause
    if ($this.hasClass('btn-play')) {
      playing = true;

      audio = new Audio('http://200.58.106.247:8550/;&type=mp3');
      audio.play();

      $this.hide();
      $('.btn-pause').css(displayBlock);

      _setMarquee();
    }

    if ($this.hasClass('btn-pause')) {
      playing = false;
      lastSongTitle = '';

      audio.pause();
      audio = null;

      $this.hide();
      $('.btn-play').css(displayBlock);

      _clearMarquee();
    }

    // Mute/VolumeUp
    if ($this.hasClass('btn-volume-off')) {
      audio.muted = false;
      $this.hide();
      $('.btn-volume-up').css(displayBlock);
    }

    if ($this.hasClass('btn-volume-up')) {
      audio.muted = true;
      $this.hide();
      $('.btn-volume-off').css(displayBlock);
    }
  });
});

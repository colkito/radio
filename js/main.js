var cc_streaminfo_get_callback,
    cc_recenttracks_get_callback;

$(document).on('ready', function () {

  // Init vars
  var serverOn = false,
      colors = ['2c3e50', '8e44ad', '2980b9', '27ae60', '16a085', 'e74c3c', 'e67e22'],
      randomColor = colors[Math.floor((Math.random() * 6) + 1)],
      $btnRepro = $('.btn-repro');

  // radio-info
  var $radioLoading = $('.radio-loading'),
      $radioOn = $('.radio-on'),
      $radioOff = $('.radio-off');

  var _getRadioInfo = function () {
    $.getScript('https://radio02.ferozo.com/js.php/ra02000762/streaminfo/rnd0');
  };

  cc_streaminfo_get_callback = function (info) {
    $radioLoading.hide();

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
  }, 60000);

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
  $('.player').addClass('player-' + randomColor);

  _getRadioInfo();
  _getLastSongsData();

  var audio = new Audio('http://200.58.106.247:8550/;&type=mp3'),
      iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
      displayBlock = { display: 'block' };

  // Hide Volume controls for iOS
  if (iOS) $('#volume').hide();

  // Play/Pause controls
  $btnRepro.on('click', function (e) {
    e.preventDefault();

    if ( ! serverOn) return false;

    var $this = $(this);

    // Play/Pause
    if ($this.hasClass('btn-play')) {
      audio.play();
      $this.hide();
      $('.btn-pause').css(displayBlock);
    }

    if ($this.hasClass('btn-pause')) {
      audio.pause();
      $this.hide();
      $('.btn-play').css(displayBlock);
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

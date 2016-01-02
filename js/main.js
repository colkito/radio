$(document).on('ready', function() {
  var audio = new Audio('http://200.58.106.247:8550/;&type=mp3'),
      iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
      displayBlock = { display: 'block' };

  // Hide Volume controls for iOS
  if (iOS) $('#volume').hide();

  // Play/Pause controls
  $('.btn-repro').on('click', function(e) {
    e.preventDefault();

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

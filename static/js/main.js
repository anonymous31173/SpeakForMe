$(document).foundation();

var $btnRecord = $('.js-btn-record');
var $btnStop = $('.js-btn-stop');

var $name = $('.js-name');

var $weHeard = $('.js-we-heard').hide();
var $textSaid = $('.js-text-said');

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = 'eng';

var recorder = null;
var audioContext = new AudioContext();

$btnRecord.on('click', function () {
  $weHeard.fadeOut();

  if (!recorder) {
    navigator.webkitGetUserMedia({
      audio: true
    }, function (stream) {
      var input = audioContext.createMediaStreamSource(stream);
      recorder = new Recorder(input);
    }, function (er) {
      console.log(er);
    });
  } else {
    recorder.clear();
  }

  recognition.start();

  recognition.addEventListener('audiostart', function () {
    $btnRecord.addClass('hide');
    $btnStop.removeClass('hide');

    recorder.record();
  });
});

$btnStop.on('click', function () {
  recognition.stop();
  recorder.stop();

  $btnRecord.removeClass('hide');
  $btnStop.addClass('hide');
});

recognition.addEventListener('result', function (evt) {
  $weHeard.fadeIn();

  for (var r = 0; r < evt.results.length; r++) {
    var result = evt.results[r];
    var items = [];

    for (var i = 0; i < result.length; i++) {
      var item = result[i];

      items.push(item.transcript);
    }

    $textSaid.val(items.join(' '));
  }

  recorder.exportWAV(function (blob) {
    $('.js-audio-clip').remove();

    var url = URL.createObjectURL(blob);
    var $audio = $('<audio class="js-audio-clip"></audio>');
    $audio.attr('src', url);
    $audio.prop('controls', true);

    $audio.insertAfter($textSaid);

    var formData = new FormData();

    formData.append('file', blob);
    formData.append('name', $name.val());
    formData.append('text', $textSaid.val());

    $.ajax({
      type: 'POST',
      url: '/api/add',
      data: formData,
      processData: false,
      contentType: false
    });
  });
});

$('.js-form-play').on('submit', function (evt) {
  evt.preventDefault();
  evt.stopPropagation();

  $('.js-audio-clip').remove();

  var url = '/play?name=' + this.name.value + '&text_input=' + this.text_input.value;

  var $audio = $('<audio class="js-audio-clip"></audio>');
  $audio.attr('src', url);
  $audio.prop('controls', true);

  $(this).append($audio);
});

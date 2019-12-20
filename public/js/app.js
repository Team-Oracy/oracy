jQuery(document).ready(function($) {
  // Variables
  let activeSound = {
    $listItem: undefined,
    howl: undefined,
    metadata: undefined,
    src: undefined,
  }
  let playHistory = []

  $html = $(document.documentElement)
  $player = $('#player')
  $playerCoverImage = $('#playerCoverImage')
  $playerTitle = $('#playerTitle')
  $playerAuthor = $('#playerAuthor')

  // Listeners
  $('[data-click]').on('click', function(e) {
    e.stopPropagation()
    const functionName = $(this).attr('data-click').toString()
    eval(functionName)(e, $(this));
  })
  navigator.mediaSession.setActionHandler('play', play)
  navigator.mediaSession.setActionHandler('pause', pause)
  navigator.mediaSession.setActionHandler('pause', pause)

  // Init

  // Functions

  // Functions: General
  function retryLoadingAudiobooks() {
    location.reload()
  }

  // Functions: Player
  function listItemPlay(e, $el) {
    $listItem = $el.closest('.listItem')
    if (activeSound.src != $listItem.attr('data-audioTrack-1')) {
      // New audiobook to be played from start.
      if(activeSound.howl) {
        // Stop current audiobook.
        activeSound.$listItem.removeClass('-playing')
        activeSound.howl.unload()
      }
      // Set new sound.
      activeSound = {
        howl: new Howl({
          html5: true,
          src: [$listItem.attr('data-audioTrack-1')]
        }),
        src: $listItem.attr('data-audioTrack-1'),
        $listItem: $listItem
      }
    }
    $player.addClass('-mini')
    play()
  }
  
  function listItemPause(e, $el) {
    $el.closest('.listItem').removeClass('-playing')
    activeSound.howl.pause()
    $player.removeClass('-playing')
  }

  function playerPlay(e, $el) {
    play()
  }
  
  function playerPause(e, $el) {
    pause()
  }

  function play() {
    // Update listItem UI.
    activeSound.$listItem.addClass('-playing')
    // Update player UI.
    $playerTitle.text(activeSound.$listItem.attr('data-title'))
    $playerAuthor.text(activeSound.$listItem.attr('data-author'))
    $playerCoverImage.attr('src', activeSound.$listItem.attr('data-cover-image-src'))
    $player.addClass('-playing')
    // Play sound.
    activeSound.howl.play()
  }

  function pause() {
    // Update listItem UI.
    activeSound.$listItem.removeClass('-playing')
    // Update player UI.
    $player.removeClass('-playing')
    // Pause sound.
    activeSound.howl.pause()
  }

  function playerRewind() {
    rewind()
  }

  function rewind() {
    const currentSeek = activeSound.howl.seek()
    if (currentSeek < 10) {
      activeSound.howl.seek(0)
    } else {
      activeSound.howl.seek((currentSeek) - 10)
    }
  }

  function playerForward() {
    forward()
  }

  function forward() {
    activeSound.howl.seek(activeSound.howl.seek() + 10)
  }

  function expandFullView() {
    $player.removeClass('-mini').addClass('-full')
    $html.addClass('-playerFullView')
  }

  function collapseFullView(e, $el) {
    $player.removeClass('-full').addClass('-mini')
    $html.removeClass('-playerFullView')
  }
});

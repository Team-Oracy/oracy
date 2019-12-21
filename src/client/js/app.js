jQuery(document).ready(function($) {
  // Variables
  let activeSound = {
    $listItem: undefined,
    howl: undefined,
    metadata: undefined,
    src: undefined,
  }
  let playHistory = []

  const $html = $(document.documentElement)
  const $player = $('#player')
  const $playerCoverImage = $('#playerCoverImage')
  const $playerTitle = $('#playerTitle')
  const $playerAuthor = $('#playerAuthor')
  const $playerScrubber = $('#playerScrubber')
  const $playerScrubberThumb = $('#playerScrubberThumb')
  const $playerScrubberBarActive = $('#playerScrubberBarActive')

  var userIsScrubbing = false

  // Listeners
  $('[data-click]').on('click', function(e) {
    e.stopPropagation()
    const functionName = $(this).attr('data-click').toString()
    eval(functionName)(e, $(this));
  })
  $('[data-mousedown]').on('mousedown', function(e) {
    e.stopPropagation()
    const functionName = $(this).attr('data-mousedown').toString()
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
          src: [$listItem.attr('data-audioTrack-1')],
          onend: endPlayback
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

  function playerScrub(e, $el) {
    userIsScrubbing = true
    const xPos = e.pageX - $playerScrubber.offset().left
    updateScrubUIWithXPosition(xPos)
    $html.on('mousemove', scrubbing)
    $html.on('mouseup', scrubbed)
  }

  function scrubbing(e) {
    const xPos = e.pageX - $playerScrubber.offset().left
    updateScrubUIWithXPosition(xPos)
  }

  function scrubbed(e) {
    userIsScrubbing = false
    $html.off('mousemove').off('mouseup')
    const xPos = e.pageX - $playerScrubber.offset().left
    const scrubPercentage = updateScrubUIWithXPosition(xPos)
    $playerScrubber.attr('data-position', scrubPercentage)
    // Set audio seek to new position
    const duration = activeSound.howl.duration()
    activeSound.howl.seek(scrubPercentage * duration)
  }

  function updateScrubUIWithXPosition(xPos) {
    const playerScrubberWidth = $playerScrubber.outerWidth()
    if (xPos < 0) {
      xPos = 0
    } else if (xPos > playerScrubberWidth) {
      xPos = playerScrubberWidth
    }
    $playerScrubberBarActive.css('width', xPos)
    $playerScrubberThumb.css('transform', 'translateX('+xPos+'px)')
    const scrubPercentage = xPos / playerScrubberWidth
    return scrubPercentage
  }

  function endPlayback(e) {
    pause()
  }

  function updateScrubUIWithPercentage(percentage) {
    if (activeSound.howl && !userIsScrubbing) {
      const elapsed = activeSound.howl.seek()
      const percentage = elapsed / activeSound.howl.duration()
      const playerScrubberWidth = $playerScrubber.outerWidth()
      const xPos = percentage * playerScrubberWidth
      $playerScrubberBarActive.css('width', xPos)
      $playerScrubberThumb.css('transform', 'translateX('+xPos+'px)')
    }
    requestAnimationFrame(updateScrubUIWithPercentage)
  }
  requestAnimationFrame(updateScrubUIWithPercentage)
})

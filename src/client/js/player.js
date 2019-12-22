jQuery(document).ready(function($) {

  // Variables
  const $player = $('#player')
  const $playerCollapse = $('#playerCollapse')
  const $playerControlsRewind = $('#playerControlsRewind')
  const $playerControlsForward = $('#playerControlsForward')
  const $playerControlsPlay = $('#playerControlsPlay')
  const $playerControlsPause = $('#playerControlsPause')
  const $playerCoverImage = $('#playerCoverImage')
  const $playerTitle = $('#playerTitle')
  const $playerAuthor = $('#playerAuthor')
  const $playerScrubber = $('#playerScrubber')
  const $playerScrubberThumb = $('#playerScrubberThumb')
  const $playerScrubberBarActive = $('#playerScrubberBarActive')
  let userIsScrubbing = false

  // Listeners
  $document.on('play', play)
  $document.on('pause', pause)
  $player.on('click', expandFullView)
  $playerCollapse.on('click', collapseFullView)
  $playerControlsRewind.on('click', rewind)
  $playerControlsForward.on('click', forward)
  $playerControlsPlay.on('click', play)
  $playerControlsPause.on('click', pause)
  $playerScrubber.on('mousedown', playerScrub)
  navigator.mediaSession.setActionHandler('play', play)
  navigator.mediaSession.setActionHandler('pause', pause)
  navigator.mediaSession.setActionHandler('pause', pause)

  // Init
  
  // Functions
  function play(e, $clickedListItem) {
    e.stopPropagation()
    if ($clickedListItem && activeSound.src != $clickedListItem.attr('data-audio-track-1')) {
      // New audiobook.
      if(activeSound.howl) {
        // Stop current audiobook.
        activeSound.howl.unload()
        activeSound.$listItem.removeClass('-playing')
      }
      // Set new sound.
      activeSound = {
        howl: new Howl({
          html5: true,
          src: [$clickedListItem.attr('data-audio-track-1')],
          onend: endPlayback
        }),
        src: $clickedListItem.attr('data-audio-track-1'),
        $listItem: $clickedListItem
      }
      $player.addClass('-mini')
      // Update player UI.
      $playerTitle.text(activeSound.$listItem.attr('data-title'))
      $playerAuthor.text(activeSound.$listItem.attr('data-author'))
      $playerCoverImage.attr('src', activeSound.$listItem.attr('data-cover-image-src'))
    }
    // Update listItem UI.
    activeSound.$listItem.addClass('-playing')
    // Play sound.
    $player.addClass('-playing')
    activeSound.howl.play()
  }

  function pause(e) {
    if (typeof e !== 'undefined') {
      e.stopPropagation()
    }
    // Update listItem UI.
    activeSound.$listItem.removeClass('-playing')
    // Update player UI.
    $player.removeClass('-playing')
    // Pause sound.
    activeSound.howl.pause()
  }

  function rewind(e) {
    e.stopPropagation()
    const currentSeek = activeSound.howl.seek()
    if (currentSeek < 10) {
      activeSound.howl.seek(0)
    } else {
      activeSound.howl.seek((currentSeek) - 10)
    }
  }

  function forward(e) {
    e.stopPropagation()
    activeSound.howl.seek(activeSound.howl.seek() + 10)
  }

  function expandFullView(e) {
    e.stopPropagation()
    $player.removeClass('-mini').addClass('-full')
    $html.addClass('-playerFullView')
  }

  function collapseFullView(e) {
    e.stopPropagation()
    $player.removeClass('-full').addClass('-mini')
    $html.removeClass('-playerFullView')
  }

  function playerScrub(e) {
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
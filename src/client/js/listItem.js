jQuery(document).ready(function($) {
  
  // Variables

  // Listeners
  $('.listItemImageControlsPlay').on('click', listItemPlay)
  $('.listItemImageControlsPause').on('click', listItemPause)

  // Init

  // Functions
  function listItemPlay(e) {
    $document.trigger('play', [$(e.currentTarget).closest('.listItem')])
  }

  function listItemPause() {
    $document.trigger('pause')
  }
  
})

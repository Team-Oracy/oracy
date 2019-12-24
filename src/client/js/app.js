jQuery(document).ready(function($) {

  // Variables
  window.activeSound = {
    $listItem: undefined,
    howl: undefined,
    metadata: undefined,
    src: undefined,
  }
  window.playHistory = []

  window.$document = $(document)
  window.$html = $(document.documentElement)

  // Listeners
  document.addEventListener('touchmove', function (e) {
    // Disable zooming on mobile.
    if (e.scale !== 1) { 
      e.preventDefault()
    }
  }, { passive: false })

  // Init

  // Functions

})

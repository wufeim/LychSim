Basic API
=========

Basics
------

:mono:`lych status`
"""""""""""""""""""

Check the status of the game.

**Returns:**

.. list-table::
   :header-rows: 0
   :widths: 25 75

   * - :mono:`status` : :mono:`str`
     - Current status of the game, including server status, client status, and basic configs.

:mono:`lych data pause`
"""""""""""""""""""""""

Pause the game. This helps preserve game states, for example when running multiple camera captures.

:mono:`lych data unpause`
"""""""""""""""""""""""""

Unpause the game.

Editor Visualizations
---------------------

:mono:`lych data debug_line`

Draw a debug line connecting the centers of a list of objects.

:mono:`lych data debug_line_pts`

Draw a debug line connecting a list of 3D points.

:mono:`lych data clear_debug_lines`

Clear all debug lines.

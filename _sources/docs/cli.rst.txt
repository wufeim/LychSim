Command-Line Interface
======================

The :code:`lychsim` command-line tool manages Unreal projects, launches them in the background, and inspects running instances -- so you don't have to drive :code:`subprocess.Popen` by hand. Run :code:`lychsim --help` to list every subcommand, or :code:`lychsim <command> --help` for per-command flags.

The subcommands are grouped by workflow:

* **Lifecycle** -- :ref:`cli-run`, :ref:`cli-ps`, :ref:`cli-logs`, :ref:`cli-stop`
* **Data capture** -- :ref:`cli-capture`
* **Registries** -- :ref:`cli-env`, :ref:`cli-engine`
* **Diagnostics** -- :ref:`cli-doctor`

Lifecycle
---------

.. _cli-run:

``lychsim run``
~~~~~~~~~~~~~~~

Launch a registered UE binary or :code:`.uproject` in the background and print its :code:`ip:port` once UnrealCV is listening.

.. code-block:: bash

   lychsim run                          # arrow-key picker over registered envs
   lychsim run MyProject                # launch a registered env by name
   lychsim run MyProject --port 7777    # pin the UnrealCV port
   lychsim run MyProject --offscreen    # render off-screen (-RenderOffScreen)
   lychsim run MyProject --map MyLevel  # open a specific level
   lychsim run MyProject --extra-arg=-vulkan --extra-arg=-windowed

Multiple instances can run side-by-side; :code:`lychsim` auto-bumps each new instance's port so they don't fight over :code:`unrealcv.ini`.

.. _cli-ps:

``lychsim ps``
~~~~~~~~~~~~~~

Show running LychSim instances. Stale entries (pid dead or exe mismatch) are reaped before listing.

.. code-block:: bash

   lychsim ps
   lychsim ps --json     # machine-readable

.. _cli-logs:

``lychsim logs``
~~~~~~~~~~~~~~~~

Print or follow a launched instance's redirected UE log.

.. code-block:: bash

   lychsim logs <handle>            # last 50 lines
   lychsim logs <handle> -n 200     # last 200 lines
   lychsim logs <handle> --all      # entire log
   lychsim logs <handle> -f         # follow (tail -f)

The :code:`<handle>` is the value shown in the :code:`HANDLE` column of :code:`lychsim ps`.

.. _cli-stop:

``lychsim stop``
~~~~~~~~~~~~~~~~

Terminate a running instance by handle, or all of them with confirmation.

.. code-block:: bash

   lychsim stop <handle>
   lychsim stop all              # prompts y/N
   lychsim stop all -y           # skip the prompt
   lychsim stop all --dry-run    # show what would be killed
   lychsim stop <handle> --grace 10  # SIGTERM, then SIGKILL after 10s

Data Capture
------------

.. _cli-capture:

``lychsim capture``
~~~~~~~~~~~~~~~~~~~

Snapshot a running scene's visuals and annotations to disk. The simulation is paused (so physics and animations don't drift between requests), the standard outputs are captured, then the simulation is resumed -- even on error.

.. code-block:: bash

   lychsim capture ./snapshot
   lychsim capture ./snapshot --host 127.0.0.1 --port 7777
   lychsim capture ./snapshot --cam-id 1
   lychsim capture ./snapshot --width 1920 --height 1080 --warmup 100
   lychsim capture ./snapshot --no-pause   # if the scene is already static

Output layout::

   output_dir/
       lit.png
       seg.png
       depth.npy
       normal.png
       object_annots.json
       camera_annots.json

The camera annotations JSON is augmented with an :code:`fxfycxcy` intrinsics field derived from the FOV and film size.

.. note::
   Connecting via the wrapper resizes camera 0's film size to :code:`--width` x :code:`--height` (default 1920 x 1080). If you are capturing camera 0, that matches the flag. If you are capturing a different camera and care about camera 0's resolution, leave the defaults alone or pick values matching the running instance.

Registries
----------

LychSim keeps two configuration registries under :code:`$LYCHSIM_HOME`:

* :code:`env` -- registered projects and shipped binaries (a :code:`.uproject`, an :code:`.exe`/:code:`.sh`, or a directory containing either).
* :code:`engine` -- UE installs (e.g. :code:`5.4`, :code:`custom-build`).

.. _cli-env:

``lychsim env``
~~~~~~~~~~~~~~~

Manage registered UE projects and binaries.

.. code-block:: bash

   lychsim env                                      # list registered envs (default)
   lychsim env list --json
   lychsim env add /path/to/MyProject.uproject      # auto-named from the path
   lychsim env add /path/to/Demo --name demo        # custom name
   lychsim env remove <name> [<name> ...]

.. _cli-engine:

``lychsim engine``
~~~~~~~~~~~~~~~~~~

Manage UE engine installs. Auto-discovery covers the common installation locations on each platform; use :code:`add` for custom builds.

.. code-block:: bash

   lychsim engine                          # list discovered + registered engines
   lychsim engine add 5.4 /path/to/UE_5.4
   lychsim engine remove <name> [<name> ...]

Diagnostics
-----------

.. _cli-doctor:

``lychsim doctor``
~~~~~~~~~~~~~~~~~~

Run sanity checks across the install: registered env paths, engine discovery, GPU presence, default port availability, LychSim plugin enablement.

.. code-block:: bash

   lychsim doctor
   lychsim doctor --verbose    # include passing checks
   lychsim doctor --json       # machine-readable

A non-zero exit code indicates one or more failed checks.

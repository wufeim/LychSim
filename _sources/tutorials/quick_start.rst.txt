Quick Start
===========

**Try LychSim with our Quick Start Package -- without Unreal Engine 5 installation!**

1. Install the LychSim Python package straight from GitHub:

   .. code-block:: bash

      pip install git+https://github.com/wufeim/LychSim.git
2. Download the demo scene package built for Linux from `here <https://drive.google.com/file/d/15qrPS7dLzM7LGM8dfTxvngcsV0dypo94/view?usp=drive_link>`_.
3. Unpack the zip, then register and launch the demo with the :code:`lychsim` CLI:

   .. code-block:: bash

      lychsim env add /path/to/demo        # accepts the unpacked directory, or the .sh / .exe directly
      lychsim run demo                     # detached background launch; prints ip:port once ready

4. Test the connection and rendering: :code:`pytest tests --server_name=0.0.0.0 -v`. Rendered images will be written to the :code:`test_outputs/` folder.
5. Explore the demo scene with our `LychSim Python API <https://wufeim.github.io/LychSim/docs/index.html#lychsim-python-api-reference>`_!

Use :code:`lychsim ps` to inspect running instances, :code:`lychsim logs <handle> -f` to tail the UE log, and :code:`lychsim stop all` to tear everything down when you are done. If anything looks off, run :code:`lychsim doctor` to flag missing paths, plugin issues, or port conflicts.

.. figure:: figures/quick_start_01.png
   :align: center

   Example rendering from the demo scene.

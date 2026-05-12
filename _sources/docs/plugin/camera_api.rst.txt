Camera API
==========

Getting Camera Information
--------------------------

* :code:`lych cam get_loc <cam_id>` Get 3D location of a camera.

  .. list-table::
     :header-rows: 0
     :widths: 25 75

     * - Parameters
       - :code:`<cam_id>`: ID of the camera.
     * - Returns
       - :code:`<x> <y> <z>`: 3D coordinates of the camera in the scene.

* :code:`lych cam get_rot <cam_id>` Get rotation of a camera.

  .. list-table::
     :header-rows: 0
     :widths: 25 75

     * - Parameters
       - :code:`<cam_id>`: ID of the camera.
     * - Returns
       - :code:`<p> <y> <r>`: Get pitch, yaw, and roll angles of the camera.

* :code:`lych cam get_fov <cam_id>` Get field of view of a camera.

  .. list-table::
     :header-rows: 0
     :widths: 25 75

     * - Parameters
       - :code:`<cam_id>`: ID of the camera.
     * - Returns
       - :code:`<fov>`: Field of view angle in degrees.

* :code:`lych cam get_c2w <cam_id>` Get the camera-to-world transformation matrix.

  .. list-table::
     :header-rows: 0
     :widths: 25 75

     * - Parameters
       - :code:`<cam_id>`: ID of the camera.
     * - Returns
       - :code:`<16 floats>`: 4x4 transformation matrix in row-major order.

* :code:`lych cam set_film_size <cam_id> <width> <height>` Set the film size of a camera.

  .. list-table::
     :header-rows: 0
     :widths: 25 75

     * - Parameters
       - :code:`<cam_id>`: ID of the camera; :code:`<width>`: width of the film in pixels; :code:`<height>`: height of the film in pixels.
     * - Returns
       - :code:`ok` if successful, or an error message if failed.

Rendering 2D Data
-----------------

:mono:`lych cam get_lit`
""""""""""""""""""""""""

Get 2D lit rendering data of one or multiple cameras.

**Examples:**

.. code-block::

   lych cam get_lit 0 /path/to/save
   lych cam get_lit 0 npy
   lych cam get_lit 0 png
   lych cam get_lit 0 1 2 npy

**Parameters:**

.. list-table::
   :header-rows: 0
   :widths: 25 75

   * - :mono:`cam_id...` : :mono:`str`
     - IDs of all target cameras, separated by spaces.
   * - :mono:`path` : :mono:`str`
     - Save path or return format. In *single mode*: A local path, or keywords :code:`npy` / :code:`png` to return data directly. In *batch mode*: must be :code:`npy`, which returns data with shape :code:`(N, H, W, C)`, :code:`BGRA` mode, and :code:`np.uint8` dtype.

**Returns:**

.. list-table::
   :header-rows: 0
   :widths: 25 75

   * - :mono:`result` : :mono:`str` or :mono:`bytes`
     - Returns :code:`ok` if successful, or an error message if failed. If keywords :code:`npy` or :code:`png` are used, returns the corresponding data stream.

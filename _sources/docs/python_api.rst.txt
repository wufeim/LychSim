Python API Reference
====================

The Python-level entry point is the :class:`lychsim.api.LychSim` class. It composes three mixins -- :class:`~lychsim.api.wrapper.camera_mixin.CameraCommandsMixin`, :class:`~lychsim.api.wrapper.object_mixin.ObjectCommandsMixin`, and :class:`~lychsim.api.wrapper.data_mixin.DataCommandsMixin` -- that group the command surface by what it acts on (the camera, an object, or simulation data). Beyond the wrapper, :mod:`lychsim.core` provides serializable bounding-box and scene-graph types, and :mod:`lychsim.utils` collects camera-projection, color, and image helpers.

::

   from lychsim.api import LychSim

   sim = LychSim(server_name="localhost", port=9000, width=1920, height=1080)
   rgb    = sim.get_cam_lit(cam_id=0)
   annots = sim.get_obj_annots()
   sim.close()

The LychSim Class
-----------------

The user-facing wrapper. Constructing it opens a socket connection to the running UnrealCV / LychSim plugin and resizes camera 0 to the requested film size; ``close()`` tears the connection back down.

.. autoclass:: lychsim.api.LychSim
   :show-inheritance:
   :members: post_init, print_status, get_status, close

Camera Commands
---------------

Image capture (lit / segmentation / element segmentation / normal / depth / point map / per-object z-buffer), camera pose queries and updates, intrinsics, and per-camera annotations. All methods operate on a single camera identified by ``cam_id`` (``0`` is the default).

.. autoclass:: lychsim.api.wrapper.camera_mixin.CameraCommandsMixin
   :members:
   :undoc-members:
   :exclude-members: _ensure_cam_binary, _parse_cam_envelope

Object Commands
---------------

Scene queries and manipulation: list / spawn / delete actors, query bounding boxes (AABB / OBB / bounds), update locations and rotations, fetch per-object semantic and pose annotations, render per-object masks. Object IDs match the Unreal actor labels seen in :meth:`~lychsim.api.wrapper.object_mixin.ObjectCommandsMixin.get_obj_list`.

.. autoclass:: lychsim.api.wrapper.object_mixin.ObjectCommandsMixin
   :members:
   :undoc-members:

Data Commands
-------------

Simulation-state control (pause / resume) and debug-line drawing. Use :meth:`~lychsim.api.wrapper.data_mixin.DataCommandsMixin.pause` before reading scene state when physics or animations would otherwise drift between requests.

.. autoclass:: lychsim.api.wrapper.data_mixin.DataCommandsMixin
   :members:
   :undoc-members:

Bounding Boxes
--------------

Serializable axis-aligned and oriented bounding-box types, plus a corner-construction helper. These are produced by :meth:`~lychsim.api.wrapper.object_mixin.ObjectCommandsMixin.get_obj_aabb` / :meth:`~lychsim.api.wrapper.object_mixin.ObjectCommandsMixin.get_obj_obb` and consumed by downstream collision / sampling code.

.. autoclass:: lychsim.core.AABB
   :members:

.. autoclass:: lychsim.core.OBB
   :members:

.. autofunction:: lychsim.core.bbox.get_corners

Scene Graph
-----------

A scene is a hierarchy of :class:`SemanticScene` -> :class:`SemanticLevel` -> :class:`SemanticRegion` -> :class:`Object`. Each level holds a list of regions and aggregates objects from its children; serialization is supported via ``to_dict`` / ``from_dict``, and :class:`SemanticScene` additionally loads from ``.npz`` via :meth:`SemanticScene.from_npz`.

.. autoclass:: lychsim.core.Object
   :members:

.. autoclass:: lychsim.core.SemanticRegion
   :members:

.. autoclass:: lychsim.core.SemanticLevel
   :members:

.. autoclass:: lychsim.core.SemanticScene
   :members:

Camera Projection
-----------------

3D bounding-box corner / edge construction, world <-> camera transforms, and intrinsics-based projection helpers used to back-project depth maps and project bounding boxes into image space.

.. automodule:: lychsim.utils.camera_projection_utils
   :members:

Colors
------

Pre-baked categorical colormaps in three formats (:data:`COLORMAPS_INT`, :data:`COLORMAPS_FLOAT`, :data:`COLORMAPS_HEX`) for visualizing object masks and bounding boxes.

.. automodule:: lychsim.utils.colors
   :members:

Image Helpers
-------------

.. autofunction:: lychsim.utils.general.rgbd2rgb

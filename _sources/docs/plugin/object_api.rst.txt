Object API
==========

All object commands return the :doc:`structured JSON envelope <response_format>`.
Positions are in centimeters (left-handed, Z-up). Rotations are in degrees
``[pitch, yaw, roll]``.

Listing Objects
---------------

:mono:`lych obj list`
"""""""""""""""""""""

List all objects in the scene.

**Returns:** A JSON envelope with ``status``, ``error``, and ``outputs``, which is
a flat list of object ID strings.

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Field
     - Description
   * - :mono:`outputs` : :mono:`array[str]`
     - Object ID strings for every actor in the scene.

Getting Object Information
--------------------------

All batch queries accept one or more positional object IDs, or the ``-all`` flag
to query every object. Each entry in ``outputs`` contains ``object_id`` and
``status`` (``"ok"`` or ``"not_found"``), plus the fields listed below when
the object was found.

:mono:`lych obj get_loc`
""""""""""""""""""""""""

Get world-space locations of one or more objects.

**Examples:**

.. code-block::

   lych obj get_loc Table_0 Chair_1
   lych obj get_loc -all

**Parameters:**

.. list-table::
   :header-rows: 0
   :widths: 25 75

   * - :mono:`obj_id...` : :mono:`str`
     - One or more object IDs.
   * - :mono:`-all`
     - Query every object in the scene.

**Returns:** A JSON envelope with ``status``, ``error``, and ``outputs``, which is
a list of dicts each with the following fields:

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Field
     - Description
   * - :mono:`object_id` : :mono:`str`
     - The requested object ID.
   * - :mono:`status` : :mono:`str`
     - ``"ok"`` or ``"not_found"``.
   * - :mono:`location` : :mono:`[x, y, z]`
     - World-space position in centimeters. Omitted when ``status`` is ``"not_found"``.

:mono:`lych obj get_rot`
""""""""""""""""""""""""

Get world-space rotations of one or more objects.

**Examples:**

.. code-block::

   lych obj get_rot Table_0
   lych obj get_rot -all

**Parameters:** Same as ``get_loc``.

**Returns:** A JSON envelope with ``status``, ``error``, and ``outputs``, which is
a list of dicts each with the following fields:

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Field
     - Description
   * - :mono:`object_id` : :mono:`str`
     - The requested object ID.
   * - :mono:`status` : :mono:`str`
     - ``"ok"`` or ``"not_found"``.
   * - :mono:`rotation` : :mono:`[pitch, yaw, roll]`
     - World-space rotation in degrees. Omitted when ``status`` is ``"not_found"``.

.. warning::

   The returned order is ``[pitch, yaw, roll]``, which differs from the
   ``[roll, pitch, yaw]`` order shown in the UE5 editor's axis-aligned
   transform panel.

:mono:`lych obj get_aabb`
"""""""""""""""""""""""""

Get the axis-aligned bounding box of one or more objects. Uses the root/collision
component bounds (``FActorController::GetAxisAlignedBoundingBox``).

**Examples:**

.. code-block::

   lych obj get_aabb Table_0
   lych obj get_aabb -all

**Returns:** A JSON envelope with ``status``, ``error``, and ``outputs``, which is
a list of dicts each with the following fields:

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Field
     - Description
   * - :mono:`object_id` : :mono:`str`
     - The requested object ID.
   * - :mono:`status` : :mono:`str`
     - ``"ok"`` or ``"not_found"``.
   * - :mono:`center` : :mono:`[x, y, z]`
     - AABB center in centimeters.
   * - :mono:`extent` : :mono:`[x, y, z]`
     - AABB half-extents in centimeters.

:mono:`lych obj get_obb`
""""""""""""""""""""""""

Get the oriented bounding box of a single object. Uses
``Actor->GetActorBounds(false)`` which aggregates all visual mesh components.

**Examples:**

.. code-block::

   lych obj get_obb Table_0

**Returns:** A JSON envelope with ``status``, ``error``, and ``outputs``, which is
a list of dicts each with the following fields:

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Field
     - Description
   * - :mono:`object_id` : :mono:`str`
     - The requested object ID.
   * - :mono:`status` : :mono:`str`
     - ``"ok"`` or ``"not_found"``.
   * - :mono:`center` : :mono:`[x, y, z]`
     - OBB center in centimeters.
   * - :mono:`extent` : :mono:`[x, y, z]`
     - OBB half-extents in centimeters.
   * - :mono:`rotation` : :mono:`[pitch, yaw, roll]`
     - Actor rotation in degrees.

:mono:`lych obj get_mesh_extent`
""""""""""""""""""""""""""""""""

Get the 3D mesh extents of one or more assets by their Unreal asset path. Useful
for computing spawn offsets before placing objects.

**Examples:**

.. code-block::

   lych obj get_mesh_extent /Game/Assets/Mesh/SM_Table

**Returns:** A JSON envelope with ``status``, ``error``, and ``outputs``, which is
a list of dicts each with the following fields:

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Field
     - Description
   * - :mono:`mesh_path` : :mono:`str`
     - The requested asset path.
   * - :mono:`status` : :mono:`str`
     - ``"ok"`` or ``"not_found"``.
   * - :mono:`extent` : :mono:`[x, y, z]`
     - Full mesh bounding box dimensions (width, depth, height) in centimeters.

:mono:`lych obj get_color`
""""""""""""""""""""""""""

Get the annotation color (RGBA) of one or more objects.

**Examples:**

.. code-block::

   lych obj get_color Table_0
   lych obj get_color -all

**Returns:** A JSON envelope with ``status``, ``error``, and ``outputs``, which is
a list of dicts each with the following fields:

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Field
     - Description
   * - :mono:`object_id` : :mono:`str`
     - The requested object ID.
   * - :mono:`status` : :mono:`str`
     - ``"ok"`` or ``"not_found"``.
   * - :mono:`color` : :mono:`[r, g, b, a]`
     - Annotation color (0--255 per channel).

:mono:`lych obj get_annots`
"""""""""""""""""""""""""""

Get full annotations for one or more objects.

**Examples:**

.. code-block::

   lych obj get_annots Table_0
   lych obj get_annots -all

**Returns:** A JSON envelope with ``status``, ``error``, and ``outputs``, which is
a list of dicts each with the following fields:

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Field
     - Description
   * - :mono:`object_id` : :mono:`str`
     - The requested object ID.
   * - :mono:`status` : :mono:`str`
     - ``"ok"`` or ``"not_found"``.
   * - :mono:`guid` : :mono:`str`
     - Actor GUID (editor builds only; ``"NO_GUID"`` otherwise).
   * - :mono:`aabb` : :mono:`{center, extent}`
     - Axis-aligned bounding box from ``GetAxisAlignedBoundingBox``.
   * - :mono:`obb` : :mono:`{center, extent, rotation}`
     - Oriented bounding box from ``GetActorBounds(false)``.
   * - :mono:`bounds` : :mono:`{center, extent}`
     - Visual bounds from ``GetActorBounds(false)`` (all components).
   * - :mono:`bounds_tight` : :mono:`{center, extent}`
     - Tight bounds from ``GetActorBounds(true)`` (colliding components only).
   * - :mono:`location` : :mono:`[x, y, z]`
     - World-space position in centimeters.
   * - :mono:`rotation` : :mono:`[pitch, yaw, roll]`
     - World-space rotation in degrees.
   * - :mono:`scale` : :mono:`[x, y, z]`
     - Actor scale.
   * - :mono:`color` : :mono:`[r, g, b, a]`
     - Annotation color (0--255 per channel).
   * - :mono:`asset_path` : :mono:`str`
     - Unreal asset path.

Modifying Objects
-----------------

Single-target mutations return ``{"status": "ok", "outputs": []}`` on success,
or ``{"status": "error", "error": "<message>", "outputs": []}`` on failure.

:mono:`lych obj set_loc`
""""""""""""""""""""""""

Set the world-space position of an object.

**Examples:**

.. code-block::

   lych obj set_loc Table_0 120.0 -50.0 90.0

**Parameters:**

.. list-table::
   :header-rows: 0
   :widths: 25 75

   * - :mono:`obj_id` : :mono:`str`
     - Object ID.
   * - :mono:`x y z` : :mono:`float`
     - New position in centimeters.

:mono:`lych obj set_rot`
""""""""""""""""""""""""

Set the world-space rotation of an object.

**Examples:**

.. code-block::

   lych obj set_rot Table_0 0.0 90.0 0.0

**Parameters:**

.. list-table::
   :header-rows: 0
   :widths: 25 75

   * - :mono:`obj_id` : :mono:`str`
     - Object ID.
   * - :mono:`pitch yaw roll` : :mono:`float`
     - New rotation in degrees.

:mono:`lych obj update`
"""""""""""""""""""""""

Move and/or rotate an object in a single command using keyword arguments.

**Examples:**

.. code-block::

   lych obj update Table_0 --loc=120.0,50.0,90.0
   lych obj update Table_0 --rot=0.0,90.0,0.0
   lych obj update Table_0 --loc=120.0,50.0,90.0 --rot=0.0,90.0,0.0

**Parameters:**

.. list-table::
   :header-rows: 0
   :widths: 25 75

   * - :mono:`obj_id` : :mono:`str`
     - Object ID.
   * - :mono:`--loc` : :mono:`str`
     - New position as ``x,y,z`` (comma-separated). Optional.
   * - :mono:`--rot` : :mono:`str`
     - New rotation as ``pitch,yaw,roll`` (comma-separated). Optional.

At least one of ``--loc`` or ``--rot`` must be provided.

:mono:`lych obj add`
""""""""""""""""""""

Spawn a new object into the scene.

**Examples:**

.. code-block::

   lych obj add MyTable /Game/Assets/Mesh/SM_Table
   lych obj add MyTable /Game/Assets/Mesh/SM_Table 100 200 0
   lych obj add MyTable /Game/Assets/Mesh/SM_Table 100 200 0 0 90 0
   lych obj add MyTable /Game/Assets/Mesh/SM_Table 100 200 0 0 90 0 1.5

**Parameters:**

.. list-table::
   :header-rows: 0
   :widths: 25 75

   * - :mono:`obj_name` : :mono:`str`
     - Unique name for the new object.
   * - :mono:`obj_path` : :mono:`str`
     - Unreal asset path for the mesh or blueprint.
   * - :mono:`x y z` : :mono:`float`
     - Spawn position (default: 0 0 0).
   * - :mono:`pitch yaw roll` : :mono:`float`
     - Spawn rotation in degrees (default: 0 0 0).
   * - :mono:`scale` : :mono:`float`
     - Uniform scale factor (default: 1.0).

**Flags:**

- ``-skipIfColliding`` — do not spawn if location overlaps existing geometry.
- ``-adjustIfPossible`` — try to nudge to a free spot, fail if none found.
- ``-lockRotation`` — lock the actor's rotation after spawning.

:mono:`lych obj del`
""""""""""""""""""""

Remove an object from the scene.

**Examples:**

.. code-block::

   lych obj del Table_0

:mono:`lych obj set_mtl`
""""""""""""""""""""""""

Set the material of an object's mesh component.

**Examples:**

.. code-block::

   lych obj set_mtl Table_0 /Game/Materials/M_Wood 0

**Parameters:**

.. list-table::
   :header-rows: 0
   :widths: 25 75

   * - :mono:`obj_name` : :mono:`str`
     - Object ID.
   * - :mono:`material_path` : :mono:`str`
     - Unreal asset path for the material.
   * - :mono:`element_idx` : :mono:`int`
     - Material element index on the mesh.

Editor Utilities
----------------

:mono:`lych obj list_selected`
""""""""""""""""""""""""""""""

Get the object IDs and GUIDs of the currently selected actors in the Unreal
Editor. Editor-only; returns an error in non-editor builds.

**Returns:** A JSON envelope with ``status``, ``error``, and ``outputs``, which is
a list of dicts each with the following fields:

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Field
     - Description
   * - :mono:`object_id` : :mono:`str`
     - Actor name.
   * - :mono:`guid` : :mono:`str`
     - Actor GUID (or ``"NO_GUID"``).

:mono:`lych obj adjust_light`
"""""""""""""""""""""""""""""

Adjust properties of a directional light.

**Examples:**

.. code-block::

   lych obj adjust_light DirectionalLight_0 --intensity=5.0
   lych obj adjust_light DirectionalLight_0 --rot=0.0,-45.0,0.0
   lych obj adjust_light DirectionalLight_0 --color=1.0,0.9,0.8
   lych obj adjust_light DirectionalLight_0 --temp=6500

**Parameters:**

.. list-table::
   :header-rows: 0
   :widths: 25 75

   * - :mono:`light_id` : :mono:`str`
     - Name of the directional light actor.
   * - :mono:`--intensity` : :mono:`float`
     - Light intensity (lux).
   * - :mono:`--rot` : :mono:`str`
     - Rotation as ``pitch,yaw,roll`` (comma-separated degrees).
   * - :mono:`--color` : :mono:`str`
     - Linear color as ``r,g,b`` (comma-separated, 0.0--1.0).
   * - :mono:`--temp` : :mono:`int`
     - Color temperature in Kelvin.

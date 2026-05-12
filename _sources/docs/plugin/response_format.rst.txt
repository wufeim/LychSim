Response Format
===============

All LychSim plugin commands return an ``FExecStatus`` containing either binary
data (images, depth maps) or a UTF-8 string.  For non-binary responses all
object handlers use a **structured JSON envelope** built by
``FLychSimStructuredResponse``:

.. code-block:: json

   {
     "status": "ok",
     "outputs": [
       {
         "object_id": "Table_0",
         "status": "ok",
         "location": [120.0, -50.0, 90.0]
       }
     ]
   }

Envelope Fields
---------------

.. list-table::
   :header-rows: 1
   :widths: 15 15 70

   * - Field
     - Type
     - Description
   * - ``status``
     - ``string``
     - Top-level outcome. One of ``"ok"``, ``"partial"``, ``"none"``, or
       ``"error"``.
   * - ``error``
     - ``string``
     - Human-readable error message. Present only when ``status != "ok"``.
   * - ``outputs``
     - ``array``
     - Per-object result entries. Always present (may be empty).

Each entry in ``outputs`` contains at minimum ``"object_id"`` and
``"status"`` (``"ok"`` or ``"not_found"``), plus command-specific fields
when the object was found.

Status Codes
------------

For **batch queries** (commands that accept multiple object IDs or ``-all``),
the top-level ``status`` is derived from how many objects resolved:

.. list-table::
   :header-rows: 1
   :widths: 15 85

   * - Status
     - Meaning
   * - ``ok``
     - All requested objects were found, or the request was empty.
   * - ``partial``
     - Some objects were found but others were not.
   * - ``none``
     - No requested objects were found.

For **single-target mutations** (e.g. ``set_loc``, ``add``, ``del``),
the response uses ``"ok"`` on success or ``"error"`` on failure with a
human-readable message in the ``error`` field. The ``outputs`` array is
always present but empty for these commands.

.. code-block:: json

   {"status": "ok", "outputs": []}

.. code-block:: json

   {"status": "error", "error": "object not found: Table_99", "outputs": []}

Handler Categories
------------------

All object handlers return the structured JSON envelope.  They fall into two
categories:

**Batch queries** — ``list``, ``get_loc``, ``get_rot``, ``get_aabb``,
``get_obb``, ``get_mesh_extent``, ``get_color``, ``get_annotations``,
``list_selected``

These accept one or more object IDs (or ``-all``) and return the full envelope
with per-object entries in ``outputs`` and ``ok``/``partial``/``none``
top-level status.

**Single-target mutations** — ``set_loc``, ``set_rot``, ``update``, ``add``,
``del``, ``set_mtl``, ``adjust_light``

These return ``{"status": "ok", "outputs": []}`` on success, or
``{"status": "error", "error": "<message>", "outputs": []}`` on failure.

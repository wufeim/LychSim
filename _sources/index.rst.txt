LychSim
=======

.. toctree::
   :maxdepth: 1
   :hidden:

   intro
   tutorials/index
   docs/index

LychSim is a controllable, interactive simulation framework on Unreal Engine 5 -- a streamlined Python API, a procedural data pipeline with rich 2D / 3D ground truth, and native MCP integration for reasoning agentic LLMs.

.. centered:: `Quick Start`_ · `Python API`_ · MCP_ · CLI_ · `Data Annotations`_ · `Case Studies`_ · Citation_

.. figure:: ../figures/teaser.jpg
   :align: center
   :width: 100%

   LychSim: a controllable, interactive simulation framework for computer vision research.

Quick Start
-----------

Try LychSim with our `Quick Start Package <tutorials/quick_start.html>`_ -- without an Unreal Engine 5 installation:

.. code-block:: bash

   pip install git+https://github.com/wufeim/LychSim.git
   lychsim env add /path/to/demo
   lychsim run demo

For full UE5 setup or building scenes from source, see the `installation guide <tutorials/installation.html>`_.

Python API
----------

LychSim provides a Pythonic wrapper that abstracts away UE5 and C++ engine complexities. Researchers can spawn objects, query annotations, and capture pixel-accurate ground truth in a few lines.

.. figure:: figures/intro/python_api.png
   :align: center
   :width: 100%

   The Python API provides a unified interface for spawning diverse asset types and rendering comprehensive 2D and 3D ground truths.

For the full surface, see the `Python API reference <docs/python_api.html>`_.

MCP
---

LychSim ships with a `Model Context Protocol <https://modelcontextprotocol.io/>`_ server, exposing the same Python API to LLM agents (Claude Code, Claude Desktop, Gemini CLI, ...) over stdio. The agent reads and acts on a live Unreal scene through standardized tool calls.

For example, when prompted with *"Move the table next to the window"*, an agent resolves the request through a sequence of MCP tool calls against the running scene::

   list_objects()                       → ["Table_0", "Window_3", "Chair_1", ...]
   get_object_location(["Window_3"])    → {"location": [320, -110,  90]}
   get_object_location(["Table_0"])     → {"location": [ 50,   40,  90]}
   set_object_location("Table_0", [310,  -90,  90]) → ok

.. figure:: figures/intro/interactive.png
   :align: center
   :width: 100%

   LychSim's MCP integration lets agentic LLMs navigate, query, and manipulate the 3D world in real time.

CLI
---

LychSim ships a ``lychsim`` command-line tool for managing Unreal projects, launching them in the background, and inspecting running instances -- without driving ``subprocess.Popen`` by hand.

- **Detached background launches** with auto-bumped ports -- multiple UE instances run side-by-side without fighting over ``unrealcv.ini``.
- **Per-handle runs registry** with pid + exe-match liveness -- powers ``ps`` / ``logs`` / ``stop`` accurately.
- **Two configuration registries**: ``env`` for projects and binaries, ``engine`` for UE installs.
- :code:`lychsim doctor` flags configuration issues -- missing paths, disabled plugins, port conflicts.

.. figure:: ../figures/cli.png
   :align: center
   :width: 90%

See the `CLI reference <docs/cli.html>`_ for every subcommand and its flags.

Data Annotations
----------------

We release two complementary annotation datasets on the scenes and objects used in LychSim, both loadable with a single ``datasets.load_dataset`` call:

- ``wufeim/lychsim_objects`` -- per-asset semantic category, canonical scale, pose alignment, and precomputed ``mesh_offset`` for bottom-center spawning.
- ``wufeim/lychsim_scenes`` -- scene-level procedural rules: navigable floor spaces, road areas, pedestrian walks, and dynamic vehicle / pedestrian trajectories.

.. figure:: figures/intro/procedural_rules.jpg
   :align: center
   :width: 100%

   Annotated scene-level procedural rules guide the structural generation of new layouts.

Case Studies
------------

Synthetic Data Engine
~~~~~~~~~~~~~~~~~~~~~

LychSim's procedural simulation pipeline generates high-fidelity synthetic data with comprehensive 2D and 3D ground truth -- depth, surface normals, instance / part-level segmentation, point maps, and per-object pose, plus beyond-visible-region annotations such as the underlying geometry of occluded objects. These annotations support the training and evaluation of vision-language models. Recent works built on LychSim include Unreal3DSpace, which analyzes failure patterns in spatial reasoning, and `Perceptual Taxonomy <https://arxiv.org/abs/2511.19526>`_, which targets goal-directed reasoning from 3D scenes.

.. figure:: figures/intro/groundtruths_2d_3d.png
   :align: center
   :width: 100%

   Comprehensive 2D and 3D ground-truth annotations rendered automatically by LychSim.

Adversarial Examiners
~~~~~~~~~~~~~~~~~~~~~

Standard datasets cover only a narrow subset of the real-world parameter space. LychSim's controllable simulation enables RL-based adversarial examiners that systematically explore camera viewpoints and scene configurations to surface vision-model weaknesses. We adopt a Gaussian policy trained to minimize Segment Anything's IoU on a target object; failure cases reveal model weaknesses even on common objects in simple environments.

.. figure:: figures/intro/adversarial_examiner.png
   :align: center
   :width: 100%

   RL-based adversarial examiner exposes Segment Anything's failure modes by exploring 3D camera viewpoints around a target.

Interactive Scene Planning
~~~~~~~~~~~~~~~~~~~~~~~~~~

The MCP integration turns LychSim into a closed-loop playground for language-driven scene layout generation. Agentic LLMs query scene state, plan layouts from natural language, place actors, and verify the result -- all through the same standardized tool calls.

.. figure:: figures/intro/scene_planning.jpg
   :align: center
   :width: 100%

   Language-driven scene planning: an agent constructs and edits 3D layouts through MCP tool calls.

Citation
--------

If you find LychSim helpful in your research, please cite our paper:

| **LychSim: A Controllable and Interactive Simulation Framework for Vision Research**
| `Wufei Ma <https://wufeim.github.io/>`_, Chloe Wang, Siyi Chen, `Jiawei Peng <https://openreview.net/profile?id=~Jiawei_Peng1>`_, Patrick Li, and `Alan Yuille <https://www.cs.jhu.edu/~ayuille1/>`_
| Johns Hopkins University

.. code-block:: bibtex

   @article{ma2026lychsim,
     title={LychSim: A Controllable and Interactive Simulation Framework for Vision Research},
     author={Ma, Wufei and Wang, Chloe and Chen, Siyi and Peng, Jiawei and Li, Patrick and Yuille, Alan},
     journal={arXiv preprint arXiv:2605.12449},
     year={2026}
   }

Acknowledgements
----------------

LychSim is built on the architecture of `UnrealCV <https://unrealcv.org/>`_ (`Qiu et al., 2017 <https://arxiv.org/abs/1609.01326>`_), which exposes Unreal Engine to external Python clients. LychSim extends the plugin into a full interactive simulation framework with new functionalities, procedural generation, and native Python/MCP integration for agentic research.

<div align="center">
  <h1><img src="https://cdn3.emoji.gg/emojis/4976-lychee-fruit.png" width="28px" height="28px" alt="lychee_fruit">LychSim</h1>
</div>
<div align="center">
  <a href="https://lychsim.github.io/" target="_blank">
    <img alt="webpage" src="https://img.shields.io/badge/LychSim-Project%20Page-blue">
  </a>
  <a href="https://wufeim.github.io/LychSim/" target="_blank">
    <img alt="documentation" src="https://img.shields.io/badge/LychSim-Documentation-CC3333">
  </a>
  <a href="https://arxiv.org/" target="_blank">
    <img alt="arXiv" src="https://img.shields.io/badge/arXiv-Technical%20Report-red?logo=arxiv">
  </a>
  <a href="https://huggingface.co/collections/wufeim/lychsim" target="_blank">
    <img alt="arXiv" src="https://img.shields.io/badge/Hugging%20Face-Data%20Releases-FFD21E?logo=huggingface">
  </a>
</div>

<div align="center">
  <a href="#what-is-lychsim">What is LychSim</a> ·
  <a href="#mcp">MCP</a> ·
  <a href="#cli">CLI</a> ·
  <a href="#data-annotations">Data Annotations</a> ·
  <a href="#installation">Installation</a> ·
  <a href="#documentation">Docs</a> ·
  <a href="ROADMAP.md">Roadmap</a> ·
  <a href="#citation">Citation</a>
</div>

## What is LychSim

LychSim is a highly controllable, interactive simulation framework built on Unreal Engine 5, designed to lower the technical barrier of using a modern game engine for computer vision research. It is organized around three pillars: a **streamlined Python API** that abstracts away engine complexities, a **procedural data pipeline** that generates diverse high-fidelity environments — with controllable out-of-distribution visual challenges paired with rich 2D / 3D ground truth — and a **native [MCP](#mcp) integration** that turns the simulator into a closed-loop playground for reasoning agentic LLMs. It powers downstream applications spanning synthetic data generation, RL-based adversarial examiners, and interactive, language-driven scene layout generation.

```python
from lychsim.api import LychSim

sim = LychSim(server_name="localhost", port=9000, width=1920, height=1080)
rgb    = sim.get_cam_lit(cam_id=0)
depth  = sim.get_cam_depth(cam_id=0)
annots = sim.get_obj_annots()  # per-object category, location, rotation, AABB/OBB/bounds
sim.close()
```

### Technical Report

**LychSim: A Controllable and Interactive Simulation Framework for Vision Research**<br/>
[Wufei Ma](https://wufeim.github.io/), Chloe Wang, Siyi Chen, [Jiawei Peng](https://openreview.net/profile?id=~Jiawei_Peng1), Patrick Li, and [Alan Yuille](https://www.cs.jhu.edu/~ayuille1/)<br/>
Johns Hopkins University

![teaser](figures/teaser.jpg)

## MCP

LychSim ships with a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server, so an LLM agent (Claude Code, Gemini CLI, …) can read and act on a live Unreal scene through the same Python API.

**Example.** A user prompts Claude:

> *Move the table next to the window.*

Claude resolves the request through a sequence of MCP tool calls against the running scene:

```text
┌─ user ─────────────────────────────────────────────────┐
│ "move the table next to the window"                    │
└───────────────────────┬────────────────────────────────┘
                        ↓
  list_objects()                       → ["Table_0", "Window_3", "Chair_1", ...]
  get_object_location(["Window_3"])    → {"location": [320, -110,  90]}
  get_object_location(["Table_0"])     → {"location": [ 50,   40,  90]}
  set_object_location("Table_0", [310,  -90,  90]) → ok
                        ↓
┌─ scene ────────────────────────────────────────────────┐
│ Table_0 is now beside Window_3                         │
└────────────────────────────────────────────────────────┘
```

Each tool returns plain JSON the model can reason over:

```json
{
  "status": "ok",
  "outputs": [
    {
      "object_id": "Window_3",
      "status": "ok",
      "location": [320.0, -110.0, 90.0]
    }
  ]
}
```

## CLI

LychSim ships a `lychsim` command-line tool for managing Unreal projects, launching them in the background, and inspecting running instances — so you don't have to drive `subprocess.Popen` by hand.

- **Detached background launches** with auto-bumped ports — multiple UE instances run side-by-side without fighting over `unrealcv.ini`.
- **Per-handle runs registry** with pid + exe-match liveness — powers `ps` / `logs` / `stop` accurately, with no ghosts after pid recycling.
- **Two configuration registries**: `env` for projects and binaries, `engine` for UE installs, both with auto-discovery on each platform and an arrow-key picker (`lychsim run` with no args).
- **`lychsim doctor`** flags configuration issues — missing paths, disabled LychSim plugins, no GPU, port conflicts.

```bash
$ lychsim env add /path/to/MyProject.uproject     # register a project (or .exe, or a directory of either)
$ lychsim run MyProject                           # launch in background, prints ip:port when ready
$ lychsim ps                                      # show running instances
$ lychsim logs <handle> -f                        # tail the redirected UE log
$ lychsim stop all                                # tear down, with confirmation
```

![CLI](figures/cli.png)

See the [CLI reference](https://wufeim.github.io/LychSim/docs/cli.html) for the full list of subcommands and flags.

## Data Annotations

We release two complementary annotation datasets on the scenes and objects used in LychSim. Both datasets can be loaded with a single `datasets.load_dataset` call and are integrated with the built-in procedural generation pipeline.

**Object annotations** &nbsp;<a href="https://huggingface.co/datasets/wufeim/lychsim_objects"><img alt="Hugging Face — lychsim_objects" style="position: relative; top: 3px;" src="https://img.shields.io/badge/Hugging%20Face-lychsim__objects-FFD21E?logo=huggingface"></a><br>
For each 3D asset that appears in our scenes we annotate its semantic category, canonical scale, and pose alignment (the calibration yaw that puts the asset's "front" along +X), together with a precomputed `mesh_offset` so that spawning at `loc + mesh_offset` lands the visual bbox bottom-center exactly on `loc`. These annotations are critical for producing semantically aligned ground-truth 3D object poses and for programmatic object placement and scene manipulation.

**Scene-level procedural rules** &nbsp;<a href="https://huggingface.co/datasets/wufeim/lychsim_scenes"><img alt="Hugging Face — lychsim_scenes" style="position: relative; top: 3px;" src="https://img.shields.io/badge/Hugging%20Face-lychsim__scenes-FFD21E?logo=huggingface"></a><br>
For each scene we capture structural priors — navigable floor spaces, road areas, pedestrian walks, and dynamic vehicle / pedestrian trajectories — as structured records keyed to the underlying placed actors. These spatial priors guide the procedural generation process, ensuring that newly synthesized layouts remain faithful to the original scene semantics.

```python
from datasets import load_dataset

objects = load_dataset("wufeim/lychsim_objects")
scenes  = load_dataset("wufeim/lychsim_scenes")
```

> [!NOTE]
> The currently published versions are preview data. The full release will follow.

## Installation

For a quick try-it-out — no Unreal Engine 5 install required — install LychSim straight from GitHub, then grab one of our pre-built scene binaries and launch it with `lychsim run`:

```bash
pip install git+https://github.com/wufeim/LychSim.git
```

See the [Quick Start guide](https://wufeim.github.io/LychSim/tutorials/quick_start.html) for the full walkthrough.

For a full installation (UE5 setup, building scenes from source, integrating your own projects), refer to the [installation guide](https://wufeim.github.io/LychSim/tutorials/installation.html).

## Documentation

LychSim's full documentation lives at [wufeim.github.io/LychSim](https://wufeim.github.io/LychSim/) — start there for an overview of the project. From the landing page you can dive into the [tutorials](https://wufeim.github.io/LychSim/tutorials/index.html) for step-by-step walkthroughs (installation, first scene, capturing data, MCP setup), or jump straight to the [API reference](https://wufeim.github.io/LychSim/docs/index.html) for the full surface of the C++ commands and Python API/MCP packages.

## Roadmap

*See roadmap and releases [here](ROADMAP.md).*

## Works Based on LychSim

The following research works have been built with LychSim:

* Unreal3DSpace
* [Perceptual Taxonomy](https://arxiv.org/abs/2511.19526)

## Citation

If you find our work useful for your research, please consider citing our work:

```
@article{ma2026lychsim,
  title={LychSim: A Controllable and Interactive Simulation Framework for Vision Research},
  author={Ma, Wufei and Wang, Chloe and Chen, Siyi and Peng, Jiawei and Li, Patrick and Yuille, Alan},
  journal={arXiv preprint arXiv:2605.12449},
  year={2026}
}
```

## Acknowledgements

LychSim is built on the architecture of [UnrealCV](https://unrealcv.org/) ([Qiu et al., 2017](https://arxiv.org/abs/1609.01326)), which exposes Unreal Engine to external Python clients. LychSim extends the plugin into a full interactive simulation framework with new functionalities, procedural generation, and native Python/MCP integration for agentic research.

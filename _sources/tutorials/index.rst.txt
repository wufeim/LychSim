Tutorials
=========

.. toctree::
   :maxdepth: 1

   quick_start
   installation
   data_collection
   outdoor_scenes
   annotate_rules
   linux
   integration/index
   development

FAQs
----

1. How fast is the rendering?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Rendering images, videos, and other 2D/3D annotations in Unreal Engine 5 is generally very fast because lighting is cached and can be reused across frames. However, in rare situations, such as during rapid camera or object movement, the lighting history can become invalid. In these cases, the camera needs a brief warm-up period to allow the lighting to accumulate correctly again.

2. How good is the physics simulation?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Unreal Engine 5 is built on the Chaos Physics simulator providing "realistic" and real-time simulation of rigid body dynamics. Limitations include (1) certain approximations suitable for games, (2) instability in stacking, grasping, or precise manipulation, or (3) non-deterministic stepping. Possible extensions include integrating external physics simulators, such as `MuJoCo <https://mujoco.org/>`_, with Unreal Engine 5.

3. Integration with Objaverse?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

LychSim can seamlessly import meshes from Objaverse, enabling richer and more diverse simulations. However, there remains several concerns: (1) ensuring correct object scale when using Internet-collected datasets, and (2) properly configuring mesh components to enable fine-grained control.

4. Simulation of humans, poses, and actions?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Current indoor and outdoor simulations in LychSim include human meshes built on `MetaHuman <https://www.metahuman.com/en-US>`_, which can be integrated with various human actions purchased online or captured from real videos. One example is `MetaHuman Animator that animates MetaHuman meshes with real-time facial expressions <https://youtu.be/PgzSGQnWVcU?si=6vPIgoN-piTnt_M8>`_. Another example is `connecting MetaHuman with PoseAI that includes both Face and Body controls <https://youtu.be/KcniN_TgDqw?si=8F0_0BpngkuDonzz>`_.

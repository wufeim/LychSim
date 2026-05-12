Using Unreal Engine and LychSim on Linux Server
===============================================

Set Up WSL for Local Testing
----------------------------

1. **Install and enable WSL 1.** Following the `official documentation <https://learn.microsoft.com/en-us/windows/wsl/install>`_ to set up WSL. In this tutorial, we prefer WSL 1 because of a discrepancy in network access between WSL 1 and WSL 2. Read more `here <https://learn.microsoft.com/en-us/windows/wsl/compare-versions#exceptions-for-using-wsl-1-rather-than-wsl-2>`_.

   .. figure:: figures/linux_01.png
      :align: center

      Setting up WSL 1.

2. **Install Ubuntu.** Run :code:`wsl --install -d Ubuntu`.

   .. figure:: figures/linux_02.png
      :align: center

      Installing Ubuntu.

   .. figure:: figures/linux_03.png
      :align: center

      Installation successful.

Set Up Build Tools
------------------

1. **Install cross-compile toolchain.** Download and install the cross-compile toolchain for Linux from `here <https://dev.epicgames.com/documentation/en-us/unreal-engine/linux-development-requirements-for-unreal-engine#cross-compile-toolchain>`_. Choose the version according to your Unreal Engine version, *e.g.*, download v23 for UE5.5. Verify the installation by running the command below. **Reboot your computer after installation.**

   .. code::

      "%LINUX_MULTIARCH_ROOT%x86_64-unknown-linux-gnu\bin\clang++" -v

   .. figure:: figures/linux_04.png
      :align: center

      Cross-compile toolchain verification.

2. **Enable Linux as target platform in Epic Games Launcher.**

   .. figure:: figures/linux_05.png
      :align: center

      Enabling Linux as target platform.

3. **Modify Visual Studio installation to include Linux development with C++ workload.**

   .. figure:: figures/linux_06.png
      :align: center

      Visual Studio Installer.

   .. figure:: figures/linux_07.png
      :align: center

      Include Linux development.

.. 4. **Download Unreal Engine source code.** Follow the `official documentation <ttps://dev.epicgames.com/documentation/en-us/unreal-engine/downloading-source-code-in-unreal-engine>`_ to access Unreal Engine source code. After access is granted, clone the repository with :code:`git clone https://github.com/EpicGames/UnrealEngine.git`. Follow the instructions in the README to set up the source code. Essentially steps include the following:

..       3. Open your source folder in Windows Explorer and run **Setup.bat**. This will download binary content for the engine, install prerequisites, and set up Unreal file associations.

..       4. Run **GenerateProjectFiles.bat** to create project files for the engine. It should take less than a minute to complete.

..       5. Load the project into Visual Studio by double-clicking the new **UE5.sln** file.

.. 5. **Select build target.** In Visual Studio, set the build target to `Development` and `Linux`.

..    .. figure:: figures/linux_08.png
..       :align: center

..       Setting build target.

Build the UE Project for Linux
------------------------------

1. **Set up the UE project.** Follow `this tutorial <https://wufeim.github.io/LychSim/tutorials/installation.html>`_ to set up a UE project with LychSim plugin. Import necessary scenes and assets.

2. **Package the project for Linux.** If you don't see available SDK for Linux development, check the installation of your cross-compile toolchain. Also make sure you have rebooted your computer after installing the toolchain.

   See `troubleshooting <https://wufeim.github.io/LychSim/docs/known_issues.html#cannot-package-project-for-linux-issue-with-ubasessionserver>`_ for a known issue about failure of :code:`UbaSessionServer` on latest Windows updates.

   .. figure:: figures/linux_14.png
      :align: center

      Packaging for Linux.

   .. figure:: figures/linux_09.png
      :align: center

      You should now see a launching script in your project directory or a subdirectory named :code:`Linux`.

Run UE Project in WSL
---------------------

1. **Locate the launch script.** To test it in WSL, identify the path in Windows and in WSL. For example, if your launching script is located at :code:`C:\Users\username\Documents\Unreal Projects\linux_demo\linux_demo.sh` in Windows, the corresponding WSL path would be :code:`/mnt/c/Users/username/Documents/Unreal\ Projects/linux_demo/linux_demo.sh`.

2. **Identify the map name.** From the :code:`Project Settings -> Maps & Modes` in Unreal Editor, you will find a list of maps that are available to launch from. Note the name of the map you want to launch. In this example, the map name is :code:`FirstPersonMap`.

   .. figure:: figures/linux_10.png
      :align: center

      Map name.

3. **Run the script in WSL.** Open your WSL terminal and navigate to the directory containing the launch script. Run the script with the following command:

   .. code-block:: bash

      linux_demo.sh "FirstPersonMap?listen" -port=7777 -nullrhi -nosound

   * :mono:`-port=7777` specifies the port number for network communication.
   * :mono:`-nullrhi` disables rendering, which is useful for (1) quick tests, or (2) connecting from a UE game client.
   * :mono:`-nosound` disables sound processing.

   .. figure:: figures/linux_11.png
      :align: center

      UE5 instance running in WSL and listening on port 7777.

4. **Connect to the UE instance from Unreal Editor.** Open another WSL terminal and identify the IP address of WSL by running :code:`ip addr show eth0`. Use this IP address to connect to the UE instance from another terminal or machine.

   .. code-block:: bash

      wsl hostname -I

   Now play the game and then run the following command in the Unreal Editor console to connect to the UE instance running in WSL:

   .. code-block::

      open 192.168.1.169:7777

   .. figure:: figures/linux_12.png
      :align: center

      Connecting to the UE5 instance from Unreal Editor.

   .. figure:: figures/linux_13.png
      :align: center

      You should also see the connection log in the WSL terminal where the UE instance is running.

Run UE Project in Linux Server with LychSim
-------------------------------------------

1. **Transfer the packaged project to your Linux server.** For example, you can use :code:`scp` command to copy the project files from your local machine to the server.

   .. code-block:: bash

      scp -r C:\Users\username\Unreal Projects\server_demo\Linux username@your_server_ip:~/ue/server_demo

2. **Connect to the Linux server and launch the script.** Use the map name identified earlier to run the launch script on the server.

   .. code-block:: bash

      ssh username@your_server_ip
      cd ~/ue/server_demo
      chmod +x ./server_demo.sh
      ./server_demo.sh "FirstPersonMap?listen" -port=7777 -RenderOffscreen -vulkan -windowed -ResX=1920 -ResY=1080

   * :mono:`-port=7777` specifies the port number for network communication.
   * :mono:`-RenderOffscreen` enables GPU rendering without displaying to a physical screen.
   * :mono:`-vulkan` specifies the use of Vulkan rendering API.
   * :mono:`-windowed -ResX=1920 -ResY=1080` sets the windowed mode and resolution.

   .. figure:: figures/linux_16.png
      :align: center

      UE5 instance running on Linux server using GPU rendering.

3. **Enable remote access.** If you want to run LychSim on local machine, enable remote access to port 7777 for UE instance and port 9000 for LychSim server.

   .. code-block:: bash

      sudo ufw allow 7777
      sudo ufw allow 7777/tcp
      sudo ufw allow 9000
      sudo ufw allow 9000/tcp

3. **Now we can use LychSim by specifying the server IP and port number.** For example, in Python API:

   .. code-block:: python

      from lychsim.api import LychSim
      sim = LychSim(server_name='your_server_ip', port=9000)

   .. figure:: figures/linux_17.png
      :align: center

      All tests passed successfully!

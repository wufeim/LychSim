Installation
============

Install UE5
-----------

Install Unreal Engine 5 from `Unreal Engine website <https://www.unrealengine.com/en-US>`_.

Current LychSim plugin is only tested with Unreal Engine :code:`5.5.4` on Windows and macOS.

Install and Compile LychSim Plugin
----------------------------------

1. **Create a new Unreal Engine project.**

   - Create a new project using the "Games - First Person" template.

   .. figure:: figures/installation_01.png
      :align: center

2. **Add LychSim plugin source code to the Unreal project.**

   - First create the `Plugins` directory in your Unreal project folder.
   - For windows users, link the code with the following command (in `cmd` with administrator privileges):

   .. code-block:: batch

      mklink /J ^
      "C:\Users\username\Documents\Unreal Projects\LychSimTest\Plugins\LychSim" ^
      "C:\Users\username\Documents\LychSim\ue_plugin\LychSim"
   
   - For macOS users, use the following command (in `Terminal`):

   .. code-block:: bash

      ln -s /Users/username/Documents/LychSim/ue_plugin/LychSim \
         /Users/username/Documents/Unreal\ Projects/LychSimTest/Plugins/LychSim

3. **Re-generate project files.** This helps Unreal Engine and Visual Studio recognize the new plugin.

   - *Option 1:* Right-click on the `.uproject` file of your Unreal project and select "Generate Visual Studio project files".
   - *Option 2.a:* For Windows users, open a command prompt and navigate to the Unreal Engine installation directory, then run the following command:

   .. code-block:: batch

      "C:\Program Files\Epic Games\UE_5.5\Engine\Binaries\DotNET\UnrealBuildTool\UnrealBuildTool.exe" ^
      -projectfiles -project="C:\Users\username\Documents\Unreal Projects\LychSimTest\LychSimTest.uproject" ^
      -game -engine
   
   - *Option 2.b:* For macOS users, use the following command in `Terminal`:

   .. code-block:: bash

      /Users/Shared/Epic\ Games/UE_5.5/Engine/Build/BatchFiles/Mac/GenerateProjectFiles.sh \
         -project="/Users/username/Documents/Unreal Projects/LychSimTest/LychSimTest.uproject"

4. **(Windows users only) Compile the plugin in Visual Studio.**

   - Open the generated `.sln` file in Visual Studio.
   - Click on "Build" in the top menu, then select "Build Solution".

   .. figure:: figures/installation_04.png
      :align: center

5. **(macOS users only) Compile the plugin in Xcode.**

   - Open the generated `.xcworkspace` file in Xcode.
   - Click on "Product" in the top menu, then select "Build".

   .. figure:: figures/installation_05.png
      :align: center

6. **Enable the LychSim plugin in Unreal Engine.**

   - Open your Unreal Engine project.
   - Go to "Edit" > "Plugins".
   - Find the LychSim plugin in the list and enable it.
   - Restart Unreal Engine if prompted.

   .. figure:: figures/installation_03.png
      :align: center

7. **Verify the installation.**

   - Start the Unreal Engine project by clicking the "Play" button.
   - From the Unreal Engine built-in Cmd, run the following command: :code:`vget /object`.

   .. figure:: figures/installation_02.png
      :align: center

Install LychSim Python Package
------------------------------

From the root directory of the repository, run:

.. code-block:: bash

   pip install -e .

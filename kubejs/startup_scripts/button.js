let $Button = Java.loadClass("net.minecraft.client.gui.components.Button")
let $InventoryScreen = Java.loadClass("net.minecraft.client.gui.screens.inventory.InventoryScreen")
const $KeyMapping = Java.loadClass("net.minecraft.client.KeyMapping");
const $GLFWkey = Java.loadClass("org.lwjgl.glfw.GLFW");
const $KeyMappingRegistry = Java.loadClass("dev.architectury.registry.client.keymappings.KeyMappingRegistry")

global.LEFT_SHIFTKey = new $KeyMapping(
  "左SHIFT",
  $GLFWkey.GLFW_KEY_LEFT_SHIFT,
  "心灵感应"
)

global.WKey = new $KeyMapping(
  "W键",
  $GLFWkey.GLFW_KEY_W,
  "心灵感应"
)

global.AKey = new $KeyMapping(
  "A键",
  $GLFWkey.GLFW_KEY_A,
  "心灵感应"
)

global.SKey = new $KeyMapping(
  "S键",
  $GLFWkey.GLFW_KEY_S,
  "心灵感应"
)

global.DKey = new $KeyMapping(
  "D键",
  $GLFWkey.GLFW_KEY_D,
  "心灵感应"
)

global.SPACEKey = new $KeyMapping(
  "空格",
  $GLFWkey.GLFW_KEY_SPACE,
  "心灵感应"
)

global.GKey = new $KeyMapping(
  "G键",
  $GLFWkey.GLFW_KEY_G,
  "施法"
)
 
ClientEvents.init(() => {
  $KeyMappingRegistry.register(global.LEFT_SHIFTKey)
  $KeyMappingRegistry.register(global.WKey)
  $KeyMappingRegistry.register(global.AKey)
  $KeyMappingRegistry.register(global.SKey)
  $KeyMappingRegistry.register(global.DKey)
  $KeyMappingRegistry.register(global.GKey)
  $KeyMappingRegistry.register(global.SPACEKey)
})

ForgeEvents.onEvent("net.minecraftforge.client.event.ScreenEvent$Init$Post", (event) => {
    let screen = event.screen
    
    if (screen instanceof $InventoryScreen) {
        screen.addRenderableWidget(
            $Button
                .builder(Text.of('\u0069').font('kubejs:texture_font'), () =>
                    Client.player.sendData("crafting_table", {})
                )
                .bounds(screen.guiLeft + screen.getXSize() - 79, screen.guiTop + 61, 18, 18)
                .build()
        )

        screen.addRenderableWidget(
            $Button
                .builder(Text.of("\u0068").font('kubejs:texture_font'), () =>
                    Client.player.sendData("enderchest", {})
                )
                .bounds(screen.guiLeft + screen.getXSize() - 61, screen.guiTop + 61, 18, 18)
                .build()
        )

        screen.addRenderableWidget(
            $Button
                .builder(Text.of("\u0078").font('kubejs:texture_font'), (button) =>
                    Client.player.sendData("trashcan", {})
                )
                .bounds(screen.guiLeft + screen.getXSize(), screen.guiTop + 142, 20, 20)
                .build()
        )

        screen.addRenderableWidget(
            $Button
                .builder(Text.of("\u0070").font('kubejs:texture_font'), (button) =>
                    Client.player.sendData("anvil", {})
                )
                .bounds(screen.guiLeft + screen.getXSize() - 100, screen.guiTop + 35, 18, 18)
                .build()
        )

        screen.addRenderableWidget(
            $Button
                .builder(Text.of("\u0071").font('kubejs:texture_font'), (button) =>
                    Client.player.sendData("stonecutter", {})
                )
                .bounds(screen.guiLeft + screen.getXSize() - 100, screen.guiTop + 17, 18, 18)
                .build()
        )
    }
})
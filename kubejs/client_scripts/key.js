ClientEvents.tick((event) => {
  if (global.LEFT_SHIFTKey.consumeClick()) {
    event.player.sendData("global.LEFT_SHIFTKey.consumeClick")
  }
})

ClientEvents.tick((event) => {
  if (global.GKey.consumeClick()) {
    event.player.sendData("global.GKey.consumeClick")
  }
})

ClientEvents.tick((event) => {
  if (global.WKey.consumeClick()) {
    event.player.sendData("global.WKey.consumeClick")
  }
})

ClientEvents.tick((event) => {
  if (global.AKey.consumeClick()) {
    event.player.sendData("global.AKey.consumeClick")
  }
})

ClientEvents.tick((event) => {
  if (global.SKey.consumeClick()) {
    event.player.sendData("global.SKey.consumeClick")
  }
})

ClientEvents.tick((event) => {
  if (global.DKey.consumeClick()) {
    event.player.sendData("global.DKey.consumeClick")
  }
})

ClientEvents.tick((event) => {
  if (global.SPACEKey.consumeClick()) {
    event.player.sendData("global.SPACEKey.consumeClick")
  }
})
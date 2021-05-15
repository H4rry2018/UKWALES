module.exports = {
  name: 'Find Reaction',
  section: 'Reaction Control',

  subtitle (data) {
    return `${data.find}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName2, 'Reaction'])
  },

  fields: ['message', 'varName', 'info', 'find', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Message:<br>
    <select id="message" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
      ${data.messages[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br><br>
<div>
  <div style="float: left; width: 40%;">
    Source Emoji:<br>
    <select id="info" class="round">
      <option value="0" selected>Emoji ID</option>
      <option value="1">Emoji Name</option>
    </select>
  </div>
  <div style="float: right; width: 55%;">
    Search Value:<br>
    <input id="find" class="round" type="text">
  </div>
</div><br><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text">
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.messageChange(document.getElementById('message'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const message = parseInt(data.message)
    const varName = this.evalMessage(data.varName, cache)
    const msg = this.getMessage(message, varName, cache)
    const info = parseInt(data.info)
    const emoji = this.evalMessage(data.find, cache)

    let result
    switch (info) {
      case 0:
        result = msg.reactions.cache.get(emoji)
        break
      case 1:
        result = msg.reactions.cache.find((r) => r.emoji.name === emoji)
        break
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage)
      const varName2 = this.evalMessage(data.varName2, cache)
      result.fetch().then((react) => {
        this.storeValue(react, storage, varName2, cache)
        this.callNextAction(cache)
      })
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}

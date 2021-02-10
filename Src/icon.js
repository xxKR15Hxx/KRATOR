const { Guild } = require('discord.js')
const command = require('./command')

module.exports = (client) => {
    command(client, 'changeIcon', message => {
        

        message.guild
            .setIcon('./xd.png')
        message.react('👍')
    })
}
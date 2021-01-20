const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json');
const command = require('./command');
const firstMessage = require('./first-message');
const privateMessage = require('./private-message');

client.on('ready', () => {
    console.log('The client is ready!')

    command(client, ['ping', 'test'], (message) => {
        message.channel.send('Pong!')
    })

    command(client, 'servers', message => {
        client.guilds.cache.forEach((guild) => {
            message.channel.send(
                `${guild.name} has a total of ${guild.memberCount} members`
            )
        })
    })

    command(client, ['cc', 'clearchannel'], message => {
        if (message.member.hasPermission('ADMININSTRATOR')) {
            message.channel.messages.fetch().then((resuslts) => {
                message.channel.bulkDelete(resuslts);
            })
        }
    })


    command(client, 'status', message => {
        const content = message.content.replace('!status', '')

        client.user.setPresence({
            activity: {
                name: content,
                type: 0
            }
        })
    })

    firstMessage(client, '801394100124385281', 'tu kasa ahes', ['🌞'])

    command(client, 'createtextchannel', (message) => {
        const name = message.content.replace('!createtextchannel', '')

        message.guild.channels
            .create(name, {
                type: 'text',
            }).then(channel => {
                const categoryId = '801472906483073034'
                channel.setParent(categoryId)
            })
    })


    privateMessage(client, "ping", 'pong')


    command(client, 'createvoicechannel', (message) => {
        const name = message.content.replace('!createvoicechannel', '')
        message.guild.channels
        .create(name, {
            type: 'voice',
        }).then(channel => {
            channel.setUserLimit(10)
            const categoryId = '801472906483073034'
            channel.setParent(categoryId)
        })
    })
})

client.login(config.token)
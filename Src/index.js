const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json');
const command = require('./command');
const firstMessage = require('./first-message');
const privateMessage = require('./private-message');
const poll = require('./poll');
const memberCount = require('./member-count')
const mongo = require('../db/mongo')
const welcome = require('./welcome')
const messageCounter = require('./message-counter')
const mute = require('./mute')
require('events').EventEmitter.defaultMaxListeners = Infinity;

client.on('ready', async () => {
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
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((resuslts) => {
                message.channel.bulkDelete(resuslts);
                const addReactions = (message) => {
                    message.react('👍')
                }
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

        message.react('👍')
    })

    firstMessage(client, '801394100124385281', 'hello', ['🌞'])

    command(client, 'createtextchannel', (message) => {
        const name = message.content.replace('!createtextchannel', '')

        message.guild.channels
            .create(name, {
                type: 'text',
            })
        message.react('👍')
    })


    privateMessage(client, "ping", 'pong')


    command(client, 'createvoicechannel', (message) => {
        const name = message.content.replace('!createvoicechannel', '')
        message.guild.channels
            .create(name, {
                type: 'voice',
            }).then(channel => {
                channel.setUserLimit(1);
            })
        message.react('👍')
    })

    const logo = 'https://cdn.discordapp.com/attachments/754906819540811797/808908058880376833/dc4993a0-b0ba-45bb-b9b2-8c68b9361fe3_200x200.png'
    command(client, 'embed', (message) => {
        const embed = new Discord.MessageEmbed()
            .setTitle('Example Text embed')
            .setAuthor(message.author.username)
            .setImage(logo)
            .setThumbnail(logo)
            .setFooter('this is a footer')
            .setColor('#438D80')
            .addFields({
                name: 'Field 1',
                value: 'Hello World'
            })


        message.channel.send(embed);
    })
    command(client, 'serverinfo', message => {
        const { guild } = message
        //console.log(guild)

        const { name, region, memberCount, owner, afkTimeout } = guild
        const icon = guild.iconURL()

        const embed = new Discord.MessageEmbed()
            .setTitle(`Server info for "${name}"`)
            .setThumbnail(icon)
            .addFields({
                name: 'region',
                value: region,
            }, {
                name: 'Members',
                value: memberCount,
            }, {
                name: 'Owner',
                value: owner.user.tag,
            }, {
                name: 'AfkTimeout',
                value: afkTimeout / 60,
            })

        message.channel.send(embed)
        message.react('👍')
    })
    command(client, 'help', message => {
        const embed = new Discord.MessageEmbed()
            .setTitle('**__Help__**')
            .setThumbnail(logo)
            .addFields({
                name: 'Createvoicechannel:',
                value: '**!createvoicechannel <name>** - creates voice channels'
            }, {
                name: 'Createtextchannel:',
                value: '**!createtextxhannel <name>** - create text channels'
            }, {
                name: 'Serverinfo:',
                value: '**!serverinfo <num1> <num2>** - gives server info'
            }, {
                name: 'Status:',
                value: '**!status** - updates status'
            }, {
                name: 'Clearchannel:',
                value: '**!clearchannel** - clears the entire channel'
            }, {
                name: 'Ban',
                value: '**!ban <name>** - bans the person'
            }, {
                name: 'Kick:',
                value: '**!kick <name>** - Kicks the person'
            }, {
                name: 'poll:',
                value: '**!poll**mem - A basic poll with 2 emojis'
            }, {
                name: 'mute:',
                value: `**!mute <@> <duration as a number> <m, h, d, or life> ** - mutes a person for a specific time`
            }
            )
            .setFooter('more in development', logo)
        message.channel.send(embed)
        message.react('👍')
    })
    const { prefix } = config

    client.user.setPresence({
        activity: {
            name: `${prefix}help for help`,
        }
    })


    command(client, 'ban', message => {
        const { member, mentions } = message
        const tag = member.id

        if (member.hasPermission('BAN_MEMBERS')) {
            const target = mentions.users.first()

            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.ban()
                message.react('👍')
                message.channel.send(`${targetMember} has been banned.`)
            } else {
                message.channel.send(`<@${tag}> please specify someone to ban.`)
            }
            console.log(target)
        } else {
            message.channel.send(`<@${tag}> you do not have permission to use this command.`)
        }

    })

    command(client, 'kick', message => {
        const { member, mentions } = message
        const tag = member.id
        message.react('👍')
        if (member.hasPermission('KICK_MEMBERS')) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)

                client.users.fetch(target.id).then(user => {
                    user.send('https://discord.gg/94A6KKM8').then(() => {
                        targetMember.kick();
                    });
                })

                message.channel.send(`${target} has been kicked.`)



            } else {
                message.channel.send(`<@${tag}> please specify someone to kicked.`)
            }
            console.log(target)
        } else {
            message.channel.send(`<@${tag}> you do not have permission to use this command.`)
        }

    })


    poll(client)


    memberCount(client)

    const guild = client.guilds.cache.get('801005076474626048')
    const channel = guild.channels.cache.get('801005076474626052')

    // sendMessage(channel, 'hello World!', 1) // channe;s, 'text', time for delete
    await mongo().then((mongoose) => {
        try {
            console.log('Connected to mongo!')
        } finally {
            mongoose.connection.close()
        }
    })

    welcome(client)

    messageCounter(client)

    mute(client)
    

    
})


client.login(config.token)


const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json');
const command = require('./command');
const firstMessage = require('./first-message');
const privateMessage = require('./private-message');
const poll = require('./poll');
const memberCount = require('./member-count')
const mongo = require('./mongo')
const welcome = require('./welcome')
const messageCounter = require('./message-counter')
const mute = require('./mute')

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
        if (message.member.hasPermission('ADMININSTRATOR')) {
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

    const logo = 'https://core.telegram.org/file/811140327/1/zlN4goPTupk/9ff2f2f01c4bd1b013'
    command(client, 'embed', (message) => {
        const embed = new Discord.MessageEmbed()
            .setTitle('Example Text embed')
            .setAuthor(message.author.username)
            .setImage(logo)
            .setThumbnail(logo)
            .setFooter('this is a footer')
            .setColor('#00AAFF')
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
            .setTitle('**__!help__**')
            .setThumbnail(logo)
            .addFields({
                name: 'createvoicechannel:',
                value: '**!createvoicechannel <name>** - creates voice channels'
            }, {
                name: 'createtextchannel:',
                value: '**!createtextxhannel <name>** - create text channels'
            }, {
                name: 'serverinfo:',
                value: '**!serverinfo <num1> <num2>** - gives server info'
            }, {
                name: 'status:',
                value: '**!status** - updates status'
            }, {
                name: 'clearchannel:',
                value: '**!clearchannel** - clears the entire channel'
            })
            .setThumbnail(logo)
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
                    user.send('https://discord.gg/ZauQm8jC').then(() => {
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

     // welcome(client)

    messageCounter(client)

    mute(client)
    })

client.login(config.token)


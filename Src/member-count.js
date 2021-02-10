module.exports = client => {
    const channelId = '808675037446930432'

    const updateMembers = guild => {
        const channel = guild.channels.cache.get(channelId)
        channel.setName(`members: ${guild.memberCount.toLocaleString()}`)
    }

    client.on('guildMemberAdd', member => updateMembers(member.guild))
    client.on('guildMemberRemove', member => updateMembers(member.guild))

    const guild = client.guilds.cache.get('801005076474626048')
    updateMembers(guild)
}
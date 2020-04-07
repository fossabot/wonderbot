module.exports.execute = async (
  client,
  message,
  locale,
  embed,
  tools,
  knex,
  props
) => {
  const stocks = await knex('stocks').select('*')

    var leaderboard = await knex.select('*').from('users')
    var txt = ''
    leaderboard.sort(function(a, b) {
      var bm = 0
      var am = 0
      Object.keys(JSON.parse(b.items)).forEach(el => {
        bm += stocks.find(i => i.name == el).now * JSON.parse(b.items)[el]
      })
      Object.keys(JSON.parse(a.items)).forEach(el => {
        am += stocks.find(i => i.name == el).now * JSON.parse(a.items)[el]
      })
      if (Number.isNaN(am)) am = 0
      if (Number.isNaN(bm)) bm = 0
      return bm + b.money - (am + a.money)
    })

    for (var i = 1; i < 11; i++) {
      var m = 0
      if (leaderboard[i - 1]) {
        Object.keys(JSON.parse(leaderboard[i - 1].items)).forEach(el => {
          m +=
            stocks.find(i => i.name == el).now *
            JSON.parse(leaderboard[i - 1].items)[el]
        })
        txt +=
          `\n${i}. [${
            client.users.cache.get(leaderboard[i - 1].id)
              ? client.users.cache.get(leaderboard[i - 1].id).tag.replace(/..$/,"**")
              : 'None'
          }](${locale.commands.leaderboard.all} ` +
          (m + leaderboard[i - 1].money).num2han() +
          locale.commands.money.won +
          ')'
      }
    }
    message.channel.send(
      '```md\n' +
        locale.commands.leaderboard.leaderboard.bind({
          season: require('../../config').client.bot.season
        }) +
        `\n${
          message.data.arg[0] == '전체' || message.data.arg[0] == 'global'
            ? locale.commands.leaderboard.global
            : locale.commands.leaderboard.guild.bind({
                server: message.guild.name
              })
        }\n ` +
        txt +
        '```'
    )
  
}

module.exports.props = {
  name: 'reset',
  perms: 'dev',
  alias: ['시즌초기화'],
  args: []
}

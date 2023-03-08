// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID
  try {
    return await db.collection('collect').aggregate()
    .lookup({
      from:'photos',
      localField: 'pictureid',
      foreignField: '_id',
      as: 'photolist'
    })
    .match(
      {_openid: openid}
    )
    // .lookup({
    //   from:event.from2,
    //   localField: event.localField2,
    //   foreignField: event.foreignField2,
    //   as: event.as2
    // })
    // .match(event.match)
    .end()
  } catch (e) {
    console.error(e)
  }
}

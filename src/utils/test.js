arr = [
  {
    name: "累计关注人数",
    type: "scanNum",
  },
  {
    name: "新增人数",
    type: "followersNum",
  },
  {
    name: "净增人数",
    type: "followedNum",
  },
  {
    name: "已取消人数",
    type: "cancelFollowNum",
  }
]

console.log(
  arr.find(i => i.type === 'scanNum')
)

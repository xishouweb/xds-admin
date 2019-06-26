export default {
  methods: {
    // 向上找指定父组件
    findComponentUpward(context, componentName) {
      let parent = context.$parent
      let name = parent.$options.name

      while (parent && (!name || [componentName].indexOf(name) < 0)) {
        parent = parent.$parent
        if (parent) name = parent.$options.name
      }
      return parent
    },
    // 向上找所有指定父元素
    findComponentsUpward(context, componentName) {
      let parents = []
      const parent = context.$parent

      if (parent) {
        if (parent.$options.name === componentName) parents.push(parent)
        return parents.concat(this.findComponentsUpward(parent, componentName))
      } else {
        return []
      }
    },
    // 向下找指定子元素
    findComponentDownward(context, componentName) {
      const childrens = context.$children
      let children = null

      if (childrens.length) {
        for (const child of childrens) {
          const name = child.$options.name

          if (name === componentName) {
            children = child
            break
          } else {
            children = this.findComponentDownward(child, componentName)
            if (children) break
          }
        }
      }
      return children
    },
    // 向下找所有子元素
    findComponentsDownward(context, componentName) {
      return context.$children.reduce((components, child) => {
        if (child.$options.name === componentName) components.push(child)
        const foundChilds = this.findComponentsDownward(child, componentName)
        return components.concat(foundChilds)
      }, [])
    },
    // 兄弟组件
    findBrothersComponents(context, componentName, exceptMe = true) {
      let res = context.$parent.$children.filter(item => {
        return item.$options.name === componentName
      })
      let index = res.findIndex(item => item._uid === context._uid)
      if (exceptMe) res.splice(index, 1)
      return res
    }
  }
}

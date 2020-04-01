const Plugin = {
  install: function (Vue) {
    const down = [32, 34, 35, 40]
    const up = [33, 36, 38]
    const processScrollEvent = (event, element) => {
      const elScrollTop = element.scrollTop
      const elScrollHeight = element.scrollHeight
      const elClientHeight = element.clientHeight

      //抹平不同事件的 *delta / delta* 值(判断滚动方向)
      let delta = event.deltaY
      if (!delta && event.type === 'touchmove') {
        delta = element.startClientY - event.changedTouches[0].clientY
      }

      //是否阻止
      let prevent =
        (delta < 0 && elScrollTop === 0) ||
        (delta > 0 && (elScrollHeight === elScrollTop + elClientHeight))

      return prevent
    }

    const handlerTouchStart = (event) => {
      const self = event.currentTarget
      self.startClientY = event.touches[0].clientY
    }
    const handler = (event) => {
      const result = processScrollEvent(event, event.currentTarget)
      if (result && event.cancelable) {
        event.preventDefault()
      }
    }
    const handlerKeyboard = (event) => {
      const self = event.currentTarget
      const elScrollTop = self.scrollTop
      const elScrollHeight = self.scrollHeight
      const elClientHeight = self.clientHeight

      let top = elScrollTop === 0 && up.includes(event.keyCode)
      let bottom = (elScrollHeight === elScrollTop + elClientHeight) && down.includes(event.keyCode)
      if (top || bottom) {
        event.preventDefault()
      }
    }
    Vue.directive('scroll-lock', {
      bind: (element) => {
        element.setAttribute("tabindex", "-1")
        element.style.outline = 'none'
        element.startClientY = 0
        element.addEventListener("touchstart", handlerTouchStart)
        element.addEventListener("touchmove", handler)
        element.addEventListener("wheel", handler)
        element.addEventListener("keydown", handlerKeyboard)
      },
      componentUpdated: function (element) {
        element.focus()
      },
      unbind: function (element) {
        element.removeEventListener("touchstart", handlerTouchStart)
        element.removeEventListener("touchmove", handler)
        element.removeEventListener("wheel", handler)
        element.removeEventListener("keydown", handlerKeyboard)
      }
    })
  }
}

export default Plugin;
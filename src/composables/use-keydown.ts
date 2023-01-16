import { onBeforeUnmount } from 'vue'
type KeyCombo = {
  key: string
  fn: () => void
}
let useKeydown = (keyCombos: KeyCombo[]) => {
  let onKeydown = (event: any) => {
    let kc = keyCombos.find(kc => kc.key == event.key)
    if(kc) {
      kc.fn()
    }
  }

  window.addEventListener('keydown', onKeydown)
  onBeforeUnmount(()=>{
    window.removeEventListener('keydown', onKeydown)
  })
}

export default useKeydown;
import { defineAsyncComponent } from 'vue'

interface IComponent {
  type: string
  path: ReturnType<typeof defineAsyncComponent>
}

const componentsList: Array<IComponent> = [
  {
    type: 'chain',
    title: 'Choose Chain',
    path: defineAsyncComponent(() => import('../Chain.vue'))
  },
  {
    type: 'wallet',
    title: 'Choose Wallet',
    path: defineAsyncComponent(() => import('../Wallet.vue'))
  },
  {
    type: 'extension',
    title: '',
    path: defineAsyncComponent(() => import('../Extension.vue'))
  }
]

export { IComponent, componentsList }

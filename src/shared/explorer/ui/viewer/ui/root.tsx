import React from 'react'

import { type Item } from '~/shared/explorer'
import Flex from '~/shared/flex'
import { c } from '~/utils/core'

import type { Context } from '../models/context'
import { context } from '../models/context'

export interface Props<TItem extends Item> extends Context<TItem> {
  className?: string | undefined
  children: React.ReactNode
}

export const NAME = 'explorer-Viewer-c-Root'

/**
 * explorer-Viewer
 */
export default function Component<TItem extends Item>(props: Props<TItem>): JSX.Element {
  const { children, className, ...contextProps } = props

  return (
    <context.Provider value={{ ...contextProps }}>
      <Flex direction='column' gap='4' width='100%' className={c(className, NAME)}>
        {children}
      </Flex>
    </context.Provider>
  )
}

Component.displayName = NAME

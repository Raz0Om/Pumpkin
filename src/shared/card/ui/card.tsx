import { Card, CardProps } from '@radix-ui/themes'
import { ForwardedRef, forwardRef } from 'react'
import './card.scss'
import { c } from '~/utils/core'

export interface Props extends CardProps {}

export const NAME = 'ui-Card'

/**
 * ui-Card
 */
export function Component(props: Props, ref: ForwardedRef<HTMLDivElement>): JSX.Element {
  const { ...cardProps } = props

  return <Card {...cardProps} ref={ref} className={c(props.className, NAME)} />
}

const ForwardRef = forwardRef(Component)
ForwardRef.displayName = NAME
export default ForwardRef

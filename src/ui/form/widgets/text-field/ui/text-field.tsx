import React, { useId } from 'react'
import { FieldInputProps, FieldMetaState } from 'react-final-form'
import { NAME as PARENT_NAME } from '../../../ui/form'
import Label from '../../label/ui/label'
import Flex, { FlexProps } from '~/ui/flex'
import { _checkErrorVisible } from '~/ui/form/lib/_check-error-visible'
import { _renderHint } from '~/ui/form/lib/_render-hint'
import TextField, { TextFieldProps } from '~/ui/text-field'
import { c, fns } from '~/utils/core'

export const NAME = `${PARENT_NAME}-w-TextField`

export type Props<FieldValue> = Omit<TextFieldProps, 'name' | 'value'> & {
  label?: string | undefined
  rootProps?: FlexProps | undefined
  input: FieldInputProps<string, HTMLInputElement>
  meta: FieldMetaState<FieldValue>
  renderHint?: (props: {
    input: FieldInputProps<string, HTMLInputElement>
    meta: FieldMetaState<FieldValue>
    isErrorVisible: boolean
  }) => React.ReactNode
  checkIsErrorVisible?: (props: {
    input: FieldInputProps<string, HTMLInputElement>
    meta: FieldMetaState<FieldValue>
  }) => boolean
}

export default function Component<FieldValue>(props: Props<FieldValue>) {
  const {
    input,
    meta,
    className,
    renderHint = _renderHint,
    label,
    rootProps,
    checkIsErrorVisible = _checkErrorVisible,
    variant = 'soft',
    ...textFieldProps
  } = props

  const id = useId()
  const isErrorVisible = checkIsErrorVisible({ input, meta })

  return (
    <Flex className={c(className, rootProps?.className, NAME)} direction='column' width='100%' {...rootProps}>
      <Label content={label} htmlFor={id} />
      <TextField.Root
        color={isErrorVisible ? 'red' : undefined}
        {...textFieldProps}
        id={id}
        variant={variant}
        value={input.value}
        type={input.type as 'text'}
        onChange={fns(input.onChange, textFieldProps.onChange)}
        onBlur={fns(input.onBlur, textFieldProps.onBlur)}
        onFocus={fns(input.onFocus, textFieldProps.onFocus)}
      />
      {React.createElement(renderHint, { input, meta, isErrorVisible })}
    </Flex>
  )
}

Component.displayName = NAME

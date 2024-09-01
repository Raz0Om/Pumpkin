import { Table } from '@radix-ui/themes'
import { type RootProps } from '@radix-ui/themes/dist/esm/components/table.d.ts'

import { useContext } from 'react'
import React from 'react'

import { type CellProps } from '~/ui/table'
import Text from '~/ui/text'
import { c } from '~/utils/core'

import { type Item } from '../../../../../types/explorer'
import { context } from '../../../models/context'
import { NAME as ROOT_NAME } from '../../../ui/viewer'

export interface Column<TDataItem extends Record<string, unknown>, TContext extends Record<string, unknown>> {
  accessorKey: keyof TDataItem
  cellProps?: CellProps | undefined
  headerProps?: CellProps | undefined
  context?: TContext | undefined
  renderCell: (props: {
    accessorKey: keyof TDataItem
    value: TDataItem[keyof TDataItem]
    item: TDataItem
    context?: TContext | undefined
  }) => React.ReactNode
  renderHeader: (props: { accessorKey: keyof TDataItem; context?: TContext | undefined }) => React.ReactNode
}

export type Props<TContext extends Record<string, unknown>> = RootProps & {
  className?: string | undefined
  columns: Column<Record<string, unknown>, TContext>[]
}

export const NAME = `${ROOT_NAME}-w-Table`

/**
 * explorer-Viewer-w-Table
 */
export default function Component<TContext extends Record<string, unknown>>(props: Props<TContext>): JSX.Element {
  const { className, columns: propsColumns, ...rootTableProps } = props

  const { data, loading, onPathChange, paths, context: contextProp } = useContext(context)

  const columns = propsColumns as unknown as Column<Item, TContext>[] /* иначе никак */

  return (
    <Table.Root className={c(className, NAME)} {...rootTableProps}>
      <Table.Header>
        <Table.Row>
          {columns.map((column, i) => {
            return (
              <Table.ColumnHeaderCell key={i} {...column.headerProps}>
                <Text>
                  {React.createElement(column.renderHeader, {
                    accessorKey: column.accessorKey,
                    context: contextProp as TContext,
                  })}
                </Text>
              </Table.ColumnHeaderCell>
            )
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data?.items.map((item, i) => {
          return (
            <Table.Row
              key={i}
              onClick={() => {
                if (loading || isSelected()) return
                onPathChange?.([...(paths || []), { name: item.name, type: item.type }])
              }}
            >
              {columns.map((column, i) => {
                return (
                  <Table.Cell key={i} {...column.cellProps}>
                    {React.createElement(column.renderCell, {
                      accessorKey: column.accessorKey,
                      item,
                      context: contextProp as TContext,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      value: (item.data as any)[column.accessorKey],
                    })}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table.Root>
  )

  /**
   * Private
   */

  function isSelected() {
    try {
      const selection = window.getSelection() as Selection
      const selRange = selection?.getRangeAt(0)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text = (selRange.startContainer as any).data as string
      const start = selRange.startOffset
      const end = selRange.endOffset
      return Boolean(text.substring(start, end))
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

Component.displayName = NAME

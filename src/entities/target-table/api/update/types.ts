import { uncapitalize, unspace } from '~/utils/string'

import { NAME as ENTITY_NAME } from '../../constants/name'
import { TargetTable, UpdateTargetTable } from '../../types/target-table'

export const keyName = `${uncapitalize(unspace(ENTITY_NAME))}.update`

export type RequestData = { input: UpdateTargetTable }

export type ResponseData = TargetTable

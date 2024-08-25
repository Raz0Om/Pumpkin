import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { safeParse } from 'valibot'
import { NAME_ONE } from '../../constants/name'
import {
  api,
  Form,
  FormValues,
  fromFormValues,
  toFormValues,
  updateOperationalTableSchema,
} from '~/entities/operational-table'
import { notify } from '~/shared/notification-list-store'
import { queryClient } from '~/shared/react-query'
import { routes } from '~/shared/routes'
import Button from '~/ui/button'
import Card from '~/ui/card'
import Container from '~/ui/container'
import Flex from '~/ui/flex'
import FForm, { toNestedErrors, useCreateForm } from '~/ui/form'
import Heading from '~/ui/layout/variants/heading'
import Section from '~/ui/section'
import Separator from '~/ui/separator'
import Tooltip from '~/ui/tooltip'

export interface Props {
  className?: string | undefined
}

const displayName = `page-${NAME_ONE.replace(/ /, '')}_id`

/**
 * page-Main
 */
export default function Component(): JSX.Element {
  const { kn = '' } = useParams<{ kn: string }>()

  const fetcher = api.getByKn.useCache(
    { kn },
    {
      onSuccess: (data) => {
        form.initialize(toFormValues(data))
      },
    },
  )

  const form = useCreateForm<FormValues>(
    {
      onSubmit: (values) => {
        console.log(values)

        updateMutator.mutate({ input: fromFormValues(values) })
      },
      validate: (values) => {
        const operationalTable = fromFormValues(values)
        const { issues } = safeParse(updateOperationalTableSchema, operationalTable)
        return toNestedErrors(issues)
      },
      initialValues: fetcher.data || { kn },
    },
    { values: true, initialValues: true },
  )

  const values = form.getState().values

  const updateMutator = api.update.useCache({
    onSuccess: (data) => {
      notify({ title: 'Сохранено', type: 'success' })
      api.getByKn.setCache({ kn }, data.data)
      form.initialize(toFormValues(data.data))
      // 👷 TODO убрать когда навигация будет настраиваться отдельно
      queryClient.invalidateQueries('oper')
    },
    onError: () => notify({ title: 'Ошибка', description: 'Что-то пошло не так', type: 'error' }),
  })

  const render = useCallback(() => <Form />, [])

  return (
    <main className={displayName}>
      <Container p='1.5rem'>
        {fetcher.isError && (
          <Flex width='100%' justify='center' gap='2' align='center'>
            Ошибка <Button onClick={() => fetcher.refetch()}>Перезагрузить</Button>
          </Flex>
        )}

        {!fetcher.isError && (
          <Section size='1'>
            <Heading.Root
              loading={fetcher.isFetching}
              route={routes.operationalTables_kn}
              backRoute={routes.operationalTables}
              renderIcon={routes.operationalTables.renderIcon}
            >
              <Heading.BackToParent />
              <Heading.Name />
              <Heading.Uniq string={values.name} tooltipContent='Название' />
            </Heading.Root>
          </Section>
        )}

        {fetcher.isSuccess && (
          <>
            <Section size='1'>
              <FForm form={form} render={render} />
            </Section>

            <Section size='1'>
              <Flex justify='end'>
                <Card>
                  <Flex gap='2' direction='row' justify='end'>
                    <Flex gap='2' align='center'>
                      <Tooltip content='Сбросить'>
                        <span>
                          <Button
                            size='1'
                            variant='outline'
                            onClick={() => form.reset()}
                            disabled={!form.getState().dirty}
                          >
                            Сбросить изменения
                          </Button>
                        </span>
                      </Tooltip>
                      <Separator orientation='vertical' />
                      <Button
                        // loading={updateMutator.isLoading}
                        disabled={!form.getState().dirty || form.getState().invalid}
                        onClick={form.submit}
                      >
                        Сохранить
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              </Flex>
            </Section>
          </>
        )}
      </Container>
    </main>
  )
}

Component.displayName = displayName

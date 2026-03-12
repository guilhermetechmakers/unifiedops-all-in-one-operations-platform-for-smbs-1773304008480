import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const projectFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(200),
    description: z.string().max(2000).optional(),
    start_date: z.string().optional(),
    due_date: z.string().optional(),
    template: z.enum(['none', 'default']).optional(),
  })
  .refine(
    (data) => {
      if (!data.start_date || !data.due_date) return true
      return new Date(data.start_date) <= new Date(data.due_date)
    },
    { message: 'Due date must be on or after start date', path: ['due_date'] }
  )

export type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>
  onSubmit: (values: ProjectFormValues) => void
  isLoading?: boolean
  className?: string
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  className,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      start_date: '',
      due_date: '',
      template: 'default',
      ...defaultValues,
    },
  })

  return (
    <Card className={cn('animate-fade-in-up', className)}>
      <CardHeader>
        <CardTitle>New project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              placeholder="e.g. Website Redesign"
              {...register('name')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <textarea
              id="description"
              placeholder="Brief description of the project"
              {...register('description')}
              className="flex min-h-[80px] w-full rounded-[10px] border border-input bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start date</Label>
              <Input id="start_date" type="date" {...register('start_date')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due date</Label>
              <Input
                id="due_date"
                type="date"
                {...register('due_date')}
                className={errors.due_date ? 'border-destructive' : ''}
              />
              {errors.due_date ? (
                <p className="text-sm text-destructive">{errors.due_date.message}</p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Template</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="none" {...register('template')} className="rounded-full" />
                <span className="text-sm">Empty project</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="default" {...register('template')} className="rounded-full" />
                <span className="text-sm">Default tasks (Kickoff, Requirements, Design, Build, QA, Deploy)</span>
              </label>
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Creating…' : 'Create project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

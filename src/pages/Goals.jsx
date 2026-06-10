import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle2, Plus, RefreshCw, Target, Trash2, Trophy } from 'lucide-react'
import { Card, EmptyState, Loader, ProgressBar, Pill, SectionHeader } from '../components/ui/Primitives'
import { FormField } from '../components/ui/FormField'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../hooks/useAuth'
import { useUserData } from '../hooks/useUserData'
import { addGoal, deleteGoal, updateGoal } from '../services/dataService'
import { formatKg } from '../utils/carbon'

function goalProgress(goal) {
  const span = goal.baselineKg - goal.targetKg
  if (span <= 0) return goal.completed ? 100 : 0
  const done = goal.baselineKg - goal.currentKg
  return Math.min(100, Math.max(0, Math.round((done / span) * 100)))
}

export default function Goals() {
  const { user } = useAuth()
  const { loading, goals, latest, totalMonthly } = useUserData()
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onCreate = async (values) => {
    await addGoal(user.uid, {
      title: values.title,
      category: values.category || 'overall',
      baselineKg: Number(values.baselineKg),
      targetKg: Number(values.targetKg),
    })
    reset()
    setOpen(false)
  }

  const syncToLatest = (goal) => updateGoal(user.uid, goal.id, { currentKg: totalMonthly })
  const markComplete = (goal) =>
    updateGoal(user.uid, goal.id, { completed: true, currentKg: goal.targetKg })

  if (loading) return <Loader />

  return (
    <div>
      <SectionHeader
        icon={Target}
        title="Carbon Reduction Goals"
        description="Set targets, track your progress and earn rewards for completing them."
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus size={18} /> New goal
          </button>
        }
      />

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals yet"
          description="Create a carbon reduction goal to start working toward a lower footprint."
          action={
            <button onClick={() => setOpen(true)} className="btn-primary">
              <Plus size={18} /> Create your first goal
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((g) => {
            const pct = g.completed ? 100 : goalProgress(g)
            return (
              <Card key={g.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold">{g.title}</h3>
                    <p className="text-xs uppercase tracking-wide text-earth-500">{g.category}</p>
                  </div>
                  {g.completed ? (
                    <Pill tone="eco">
                      <Trophy size={12} /> Completed
                    </Pill>
                  ) : (
                    <Pill tone="amber">In progress</Pill>
                  )}
                </div>

                <div className="mt-4">
                  <ProgressBar value={pct} label={`${pct}% complete`} tone={g.completed ? 'eco' : 'amber'} />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                  <Metric label="Baseline" value={formatKg(g.baselineKg)} />
                  <Metric label="Current" value={formatKg(g.currentKg)} />
                  <Metric label="Target" value={formatKg(g.targetKg)} />
                </div>

                {!g.completed ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => syncToLatest(g)} className="btn-secondary flex-1" disabled={!latest}>
                      <RefreshCw size={15} /> Sync to latest
                    </button>
                    <button onClick={() => markComplete(g)} className="btn-primary flex-1">
                      <CheckCircle2 size={15} /> Complete
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-center text-xs text-eco-600 dark:text-eco-400">
                    🎉 +200 eco points awarded
                  </p>
                )}

                <button
                  onClick={() => deleteGoal(user.uid, g.id)}
                  className="btn-ghost mt-2 w-full text-red-500 hover:bg-red-500/10"
                  aria-label={`Delete goal ${g.title}`}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create a reduction goal">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4" noValidate>
          <FormField
            id="title"
            label="Goal title"
            placeholder="e.g. Cut my footprint by 15%"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
          <div>
            <label htmlFor="category" className="label">Category</label>
            <select id="category" className="input" {...register('category')}>
              <option value="overall">Overall</option>
              <option value="transport">Transport</option>
              <option value="energy">Energy</option>
              <option value="food">Food</option>
              <option value="waste">Waste</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="baselineKg"
              label="Baseline"
              type="number"
              step="any"
              min="0"
              suffix="kg"
              defaultValue={Math.round(totalMonthly) || ''}
              error={errors.baselineKg?.message}
              {...register('baselineKg', { required: 'Required', valueAsNumber: true })}
            />
            <FormField
              id="targetKg"
              label="Target"
              type="number"
              step="any"
              min="0"
              suffix="kg"
              error={errors.targetKg?.message}
              {...register('targetKg', { required: 'Required', valueAsNumber: true })}
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            <Target size={18} /> Create goal
          </button>
        </form>
      </Modal>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-white/50 p-2 dark:bg-white/5">
      <p className="text-[11px] text-earth-500">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  )
}

import { ROLE_BLURB, ROLE_LABELS, type UserRole } from '../../features/auth/types'
import { Icon, type IconName } from '../../components/art/Icon'

const roleIcon: Record<UserRole, IconName> = {
  citizen: 'pin',
  coordinator: 'volunteers',
  rescuer: 'route',
}

const order: UserRole[] = ['citizen', 'coordinator', 'rescuer']

interface RoleChooserProps {
  value: UserRole
  onChange: (role: UserRole) => void
}

/** Segmented role picker used on both login and signup. */
export function RoleChooser({ value, onChange }: RoleChooserProps) {
  return (
    <fieldset className="role-chooser">
      <legend>I am a…</legend>
      <div className="role-chooser__grid" role="radiogroup" aria-label="Select your role">
        {order.map((role) => {
          const selected = role === value
          return (
            <button
              key={role}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`role-opt${selected ? ' is-selected' : ''}`}
              onClick={() => onChange(role)}
            >
              <span className="role-opt__icon">
                <Icon name={roleIcon[role]} size={18} />
              </span>
              <span className="role-opt__name">{ROLE_LABELS[role]}</span>
              <span className="role-opt__blurb">{ROLE_BLURB[role]}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

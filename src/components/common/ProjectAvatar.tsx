export default function ProjectAvatar({
  name,
  id,
  size = 'md',
}: {
  name: string
  id?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const getProjectAvatar = (identifier: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-indigo-500',
    ]
    const colorIndex = identifier.charCodeAt(0) % colors.length
    return colors[colorIndex]
  }

  const getAvatarText = (name: string) => {
    return name.substring(0, 3).toUpperCase()
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs'
      case 'lg':
        return 'w-12 h-12 text-base'
      default:
        return 'w-10 h-10 text-sm'
    }
  }

  const identifier = id || name

  return (
    <div
      className={`${getSizeClasses(size)} rounded-lg flex items-center justify-center text-white font-bold ${getProjectAvatar(identifier)}`}
    >
      {getAvatarText(name)}
    </div>
  )
}

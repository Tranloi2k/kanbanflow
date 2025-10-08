import { useState } from 'react'
import {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  ArrowUp,
  ArrowDown,
  Filter,
} from 'lucide-react'

// Sample data
const sampleData = {
  summary: {
    totalIssues: 45,
    completedIssues: 28,
    inProgressIssues: 12,
    todoIssues: 5,
    overdueTasks: 3,
    averageCompletionTime: 4.2,
    teamVelocity: 23,
    burndownProgress: 78,
  },
  weeklyProgress: [
    { week: 'Week 1', completed: 5, created: 8 },
    { week: 'Week 2', completed: 7, created: 6 },
    { week: 'Week 3', completed: 6, created: 5 },
    { week: 'Week 4', completed: 10, created: 4 },
  ],
  issuesByStatus: [
    { status: 'Done', count: 28, color: 'bg-green-500' },
    { status: 'In Progress', count: 12, color: 'bg-yellow-500' },
    { status: 'To Do', count: 5, color: 'bg-blue-500' },
  ],
  issuesByPriority: [
    { priority: 'High', count: 8, color: 'bg-red-500' },
    { priority: 'Medium', count: 22, color: 'bg-yellow-500' },
    { priority: 'Low', count: 15, color: 'bg-green-500' },
  ],
  teamMembers: [
    { name: 'John Doe', completed: 12, assigned: 15, avatar: 'JD' },
    { name: 'Jane Smith', completed: 8, assigned: 10, avatar: 'JS' },
    { name: 'Bob Wilson', completed: 5, assigned: 8, avatar: 'BW' },
    { name: 'Alice Johnson', completed: 3, assigned: 5, avatar: 'AJ' },
  ],
  recentActivity: [
    {
      action: 'Issue completed',
      user: 'John Doe',
      issue: 'API-123',
      time: '2 hours ago',
    },
    {
      action: 'Issue created',
      user: 'Jane Smith',
      issue: 'API-124',
      time: '4 hours ago',
    },
    {
      action: 'Issue moved',
      user: 'Bob Wilson',
      issue: 'API-122',
      time: '6 hours ago',
    },
    {
      action: 'Issue assigned',
      user: 'Alice Johnson',
      issue: 'API-125',
      time: '1 day ago',
    },
  ],
}

export default function ProjectReportPage() {
  const [timeRange, setTimeRange] = useState('last30days')
  const [reportType, setReportType] = useState('overview')

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend = 'neutral',
  }: {
    title: string
    value: string | number
    change?: string
    icon: React.ElementType
    trend?: 'up' | 'down' | 'neutral'
  }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend === 'up'
                  ? 'text-green-600'
                  : trend === 'down'
                    ? 'text-red-600'
                    : 'text-gray-600'
              }`}
            >
              {trend === 'up' && <ArrowUp className="h-4 w-4 mr-1" />}
              {trend === 'down' && <ArrowDown className="h-4 w-4 mr-1" />}
              {change}
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  )

  const ProgressBar = ({
    label,
    value,
    max,
    color = 'bg-blue-500',
  }: {
    label: string
    value: number
    max: number
    color?: string
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">
          {value}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="p-6 min-h-screen w-full">
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            {/* <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Project Reports
              </h1>
              <p className="text-gray-600 mt-1">
                Insights and analytics for Project {projectId}
              </p>
            </div> */}
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="last7days">Last 7 days</option>
                <option value="last30days">Last 30 days</option>
                <option value="last3months">Last 3 months</option>
                <option value="custom">Custom range</option>
              </select>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="overview">Overview</option>
                <option value="velocity">Velocity</option>
                <option value="burndown">Burndown</option>
                <option value="team">Team Performance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Issues"
            value={sampleData.summary.totalIssues}
            change="+12% from last month"
            icon={Target}
            trend="up"
          />
          <StatCard
            title="Completed Issues"
            value={sampleData.summary.completedIssues}
            change="+8% from last month"
            icon={CheckCircle}
            trend="up"
          />
          <StatCard
            title="Team Velocity"
            value={sampleData.summary.teamVelocity}
            change="-3% from last sprint"
            icon={TrendingUp}
            trend="down"
          />
          <StatCard
            title="Avg. Completion Time"
            value={`${sampleData.summary.averageCompletionTime} days`}
            change="-0.5 days improvement"
            icon={Clock}
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Issues by Status Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Issues by Status
              </h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {sampleData.issuesByStatus.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-gray-700">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.count}</span>
                    <span className="text-sm text-gray-500">
                      (
                      {Math.round(
                        (item.count / sampleData.summary.totalIssues) * 100
                      )}
                      %)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues by Priority */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Issues by Priority
              </h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {sampleData.issuesByPriority.map((item) => (
                <ProgressBar
                  key={item.priority}
                  label={item.priority}
                  value={item.count}
                  max={sampleData.summary.totalIssues}
                  color={item.color}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Weekly Progress
              </h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {sampleData.weeklyProgress.map((week) => (
                <div key={week.week} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{week.week}</span>
                    <span className="font-medium">
                      {week.completed} completed / {week.created} created
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{
                          width: `${(week.completed / (week.completed + week.created)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Team Performance
              </h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {sampleData.teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                      {member.avatar}
                    </div>
                    <span className="text-gray-700">{member.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {member.completed}/{member.assigned}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((member.completed / member.assigned) * 100)}%
                      completion
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {sampleData.recentActivity.map((activity, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action.toLowerCase()}{' '}
                        <span className="font-medium">{activity.issue}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

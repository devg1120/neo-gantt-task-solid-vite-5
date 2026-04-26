import type { Task } from './neo-gantt-task-react/dist/types/public-types'

export function initTasks() {
  console.trace()
  console.log('init -------------------------')
  const currentDate = new Date()
  const tasks1: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 24),
      name: 'Some Project',
      id: 'ProjectSample',
      progress: 25,
      type: 'project',
      hideChildren: false,
      displayOrder: 1,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 12, 28),
      name: 'Idea',
      id: 'Task 0',
      progress: 45,
      type: 'task',
      project: 'ProjectSample',
      displayOrder: 2,
      url: 'https://github.com/ryoma-yama/neo-gantt-task-react',
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: 'Research',
      id: 'Task 1',
      progress: 25,
      dependencies: ['Task 0'],
      type: 'task',
      project: 'ProjectSample',
      displayOrder: 3,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: 'Discussion with team',
      id: 'Task 2',
      progress: 10,
      dependencies: ['Task 1'],
      type: 'task',
      project: 'ProjectSample',
      displayOrder: 4,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      name: 'Developing',
      id: 'Task 3',
      progress: 2,
      dependencies: ['Task 2'],
      type: 'task',
      project: 'ProjectSample',
      displayOrder: 5,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: 'Review',
      id: 'Task 4',
      type: 'task',
      progress: 70,
      dependencies: ['Task 2'],
      project: 'ProjectSample',
      displayOrder: 6,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: 'Review2',
      id: 'Task 5',
      type: 'task',
      progress: 70,
      dependencies: ['Task 2'],
      project: 'ProjectSample',
      displayOrder: 7,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: 'Release',
      id: 'Task 6',
      progress: currentDate.getMonth(),
      type: 'milestone',
      dependencies: ['Task 4'],
      project: 'ProjectSample',
      displayOrder: 8,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: 'Party Time',
      id: 'Task 7',
      progress: 0,
      isDisabled: false,
      type: 'task',
      dependencies: ['Task 6'],
      project: 'ProjectSample',
      displayOrder: 9,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 24),
      name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
      id: 'Task 10',
      progress: 0,
      isDisabled: false,
      type: 'task',
      dependencies: ['Task 7'],
      project: 'ProjectSample',
      displayOrder: 10,
    },
  ]
  let i = 10
  let d = 10
  const tasks2: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 + d),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 24 + d),
      name: 'Some Project2',
      id: 'ProjectSample2',
      progress: 25,
      type: 'project',
      hideChildren: false,
      displayOrder: 1 + i,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 + d),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2 + d, 12, 28),
      name: 'Idea',
      id: 'Task 0',
      progress: 45,
      type: 'task',
      project: 'ProjectSample2',
      displayOrder: 2 + i,
      url: 'https://github.com/ryoma-yama/neo-gantt-task-react',
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2 + d),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4 + d, 0, 0),
      name: 'Research',
      id: 'Task 1',
      progress: 25,
      dependencies: ['Task 0'],
      type: 'task',
      project: 'ProjectSample2',
      displayOrder: 3 + i,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4 + d),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8 + d, 0, 0),
      name: 'Discussion with team',
      id: 'Task 2',
      progress: 10,
      dependencies: ['Task 1'],
      type: 'task',
      project: 'ProjectSample2',
      displayOrder: 4 + i,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8 + d),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9 + d, 0, 0),
      name: 'Developing',
      id: 'Task 3',
      progress: 2,
      dependencies: ['Task 2'],
      type: 'task',
      project: 'ProjectSample2',
      displayOrder: 5 + i,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8 + d),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10 + d),
      name: 'Review',
      id: 'Task 4',
      type: 'task',
      progress: 70,
      dependencies: ['Task 2'],
      project: 'ProjectSample2',
      displayOrder: 6 + i,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8 + d),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10 + d),
      name: 'Review2',
      id: 'Task 5',
      type: 'task',
      progress: 70,
      dependencies: ['Task 2'],
      project: 'ProjectSample2',
      displayOrder: 7 + i,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15 + d),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15 + d),
      name: 'Release',
      id: 'Task 6',
      progress: currentDate.getMonth(),
      type: 'milestone',
      dependencies: ['Task 4'],
      project: 'ProjectSample2',
      displayOrder: 8 + i,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18 + d),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19 + d),
      name: 'Party Time',
      id: 'Task 7',
      progress: 0,
      isDisabled: false,
      type: 'task',
      dependencies: ['Task 6'],
      project: 'ProjectSample2',
      displayOrder: 9 + i,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20 + d),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 24 + d),
      name: 'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit',
      id: 'Task 30',
      progress: 0,
      isDisabled: false,
      type: 'task',
      dependencies: ['Task 7'],
      project: 'ProjectSample2',
      displayOrder: 10 + i,
    },
  ]
  //return tasks2;for (let i = 0; i < arr.length; i++) {

  //return tasks1.concat(tasks2);

  let tasks1_ = make(tasks1)
  let tasks2_ = make(tasks2)

  return tasks1_.concat(tasks2_)
}

function make(tasks: Task[]): Task[] {
  let project_id = ''
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].type == 'project') {
      project_id = tasks[i].id
      break
    }
  }
  console.log(project_id)

  return tasks
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter((t) => t.project === projectId)
  let start = projectTasks[0].start
  let end = projectTasks[0].end

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i]
    if (start.getTime() > task.start.getTime()) {
      start = task.start
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end
    }
  }
  console.log(start, end)
  return [start, end]
}

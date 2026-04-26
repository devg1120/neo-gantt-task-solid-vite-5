import { Gantt, type Task, ViewMode } from './gantt/index.js'
import type { ScrollSyncSig } from './gantt/types/public-types'
import { ViewSwitcher } from './components/view-switcher'
import { getStartEndDateForProject, initTasks } from './helper2'
import './index.css'
import { createSignal, createEffect, For } from 'solid-js'

// Init
const App = () => {
  //console.trace("App---------")
  const [view, setView] = createSignal<ViewMode>(ViewMode.Day)
  //const [view, setView] = createSignal<ViewMode>(ViewMode.Week);
  //const [view, setView] = createSignal<ViewMode>(ViewMode.Month);
  const [tasks, setTasks] = createSignal<Task[]>(initTasks())
  const [isChecked, setIsChecked] = createSignal(true)

  const [key, setKey] = createSignal({})

  //const expandListWidth = "555px"
  //const expandListWidth = "255px"
  const expandListWidth = '200px'
  const [listWidth, setListWidth] = createSignal(expandListWidth)

  //let viewMode = ViewMode.Day;
  /*
    createEffect(()=> {
	console.log(view())
    });
*/
  createEffect(() => {
    //console.log("isChecked",isChecked());
    if (isChecked()) {
      setListWidth(expandListWidth)
    } else {
      setListWidth('')
    }

    //console.log(isChecked(), listWidth());
  })

  let headerHeight = 70
  let rowHeight = 45

  /*
    //let columnWidth = 65;
    let columnWidth = 50;
    if (view() === ViewMode.Year) {
        columnWidth = 350;
    } else if (view() === ViewMode.Month) {
        columnWidth = 300;
    } else if (view() === ViewMode.Week) {
        columnWidth = 250;
    } else if (view() === ViewMode.Day) {
        columnWidth = 50;
    }

    createEffect(()=> {
         console.log("viewMode change",view() );

        if (view() === ViewMode.Year) {
            columnWidth = 350;
        } else if (view() === ViewMode.Month) {
            columnWidth = 300;
        } else if (view() === ViewMode.Week) {
            columnWidth = 250;
        } else if (view() === ViewMode.Day) {
            columnWidth = 50;
        }
    });
*/

  const [columnWidth, setColumnWidth] = createSignal(50)

  if (view() === ViewMode.Year) {
    setColumnWidth(500)
  } else if (view() === ViewMode.Month) {
    //setColumnWidth(300);
    setColumnWidth(400)
  } else if (view() === ViewMode.Week) {
    setColumnWidth(170)
  } else if (view() === ViewMode.Day) {
    setColumnWidth(50)
  }

  createEffect(() => {
    //console.log("viewMode change",view() );
    if (view() === ViewMode.Year) {
      setColumnWidth(500)
    } else if (view() === ViewMode.Month) {
      //setColumnWidth(300);
      setColumnWidth(400)
    } else if (view() === ViewMode.Week) {
      setColumnWidth(170)
    } else if (view() === ViewMode.Day) {
      setColumnWidth(50)
    }
    setKey([{}])
  })

  /*
    createEffect(()=> {

	console.log("update", tasks());
    });
*/
  const handleTaskChange = (task: Task) => {
    let newTasks = tasks().map((t) => (t.id === task.id ? task : t))
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project)
      const project = newTasks[newTasks.findIndex((t) => t.id === task.project)]
      if (project.start.getTime() !== start.getTime() || project.end.getTime() !== end.getTime()) {
        const changedProject = { ...project, start, end }
        newTasks = newTasks.map((t) => (t.id === task.project ? changedProject : t))
      }
    }
    setTasks(newTasks)
  }

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm(`Are you sure about ${task.name} ?`)
    if (conf) {
      setTasks(tasks().filter((t) => t.id !== task.id))
    }
    return conf
  }

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks().map((t) => (t.id === task.id ? task : t)))
    console.log(`On progress change Id:${task.id}`)
  }

  const handleDblClick = (task: Task) => {
    alert(`On Double Click event Id:${task.id}`)
  }

  const handleClick = (task: Task) => {
    console.log(`On Click event Id:${task.id}`)
  }

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(`${task.name} has ${isSelected ? 'selected' : 'unselected'}`)
  }

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks().map((t) => (t.id === task.id ? task : t)))
    console.log(`On expander click Id:${task.id}`)
  }
  const [showFromTo, setShowFromTo] = createSignal(false)

  const [syncScrollX, setSyncScrollX] = createSignal<ScrollSyncSig>({
    sid: 0,
    num: 0,
  })
  const [syncScrollY, setSyncScrollY] = createSignal<ScrollSyncSig>({
    sid: 0,
    num: 0,
  })

  const onScrollX = (sig: ScrollSyncSig) => {
    setSyncScrollX(sig)
  }
  const onScrollY = (sig: ScrollSyncSig) => {
    setSyncScrollY(sig)
  }

  return (
    <div class="Wrapper">
      <ViewSwitcher
        //onViewModeChange={(viewMode) => setView(viewMode)}
        onViewModeChange={(viewMode) => {
          console.log('setView', viewMode)
          setView(viewMode)
        }}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
        showFromTo={showFromTo}
        setShowFromTo={setShowFromTo}
      />
      {/*
            <h3>Gantt With Unlimited Height</h3>
            <Gantt
	        key={key()}
                id={1}
                tasks={tasks}
                viewMode={view()}
                onDateChange={handleTaskChange}
                onDelete={handleTaskDelete}
                onProgressChange={handleProgressChange}
                onDoubleClick={handleDblClick}
                onClick={handleClick}
                onSelect={handleSelect}
                onExpanderClick={handleExpanderClick}
                listCellWidth={isChecked() ? "155px" : ""3
                //ganttHeight={300}
                headerHeight={headerHeight}
                columnWidth={columnWidth()}
                rowHeight={rowHeight}
                showFromTo={showFromTo}
            />
*/}
      <h3>Gantt With Limited Height1</h3>
      <For each={key()}>
        {() => (
          <Gantt
            id={2}
            tasks={tasks}
            viewMode={view()}
            onDateChange={handleTaskChange}
            onDelete={handleTaskDelete}
            onProgressChange={handleProgressChange}
            onDoubleClick={handleDblClick}
            onClick={handleClick}
            onSelect={handleSelect}
            onExpanderClick={handleExpanderClick}
            listCellWidth={listWidth}
            ganttHeight={300}
            headerHeight={headerHeight}
            columnWidth={columnWidth()}
            rowHeight={rowHeight}
            showFromTo={showFromTo}
            onScrollX={onScrollX}
            onScrollY={onScrollY}
            syncScrollX={syncScrollX()}
            syncScrollY={syncScrollY()}
          />
        )}
      </For>

      <h3>Gantt With Limited Height2</h3>
      <Gantt
        id={3}
        tasks={tasks}
        viewMode={view()}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={listWidth}
        ganttHeight={200}
        headerHeight={headerHeight}
        columnWidth={columnWidth()}
        rowHeight={rowHeight}
        showFromTo={showFromTo}
        onScrollX={onScrollX}
        onScrollY={onScrollY}
        syncScrollX={syncScrollX()}
        syncScrollY={syncScrollY()}
      />
    </div>
  )
}

export default App

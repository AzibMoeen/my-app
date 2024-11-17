'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const name = "Azib's Daily Scheduler"

const typeColors = {
  personal: 'bg-green-200',
  health: 'bg-red-200',
  other: 'bg-yellow-200',
}

const statusColors = {
  pending: 'bg-yellow-100',
  inProgress: 'bg-blue-100',
  completed: 'bg-green-100',
}

export default function EnhancedDailyScheduler() {
  const [date, setDate] = useState(new Date())
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [newTodoStartTime, setNewTodoStartTime] = useState('09:00')
  const [newTodoEndTime, setNewTodoEndTime] = useState('10:00')
  const [newTodoType, setNewTodoType] = useState('work')
  const [editingTodo, setEditingTodo] = useState(null)
  const [view, setView] = useState('day')
  const { toast } = useToast()

  
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos).map((todo) => ({
        ...todo,
        date: new Date(todo.date)
      })))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    const checkForUpcomingTodos = () => {
      const now = new Date()
      const upcomingTodos = todos.filter(todo => {
        const todoDateTime = new Date(todo.date)
        const [hours, minutes] = todo.startTime.split(':').map(Number)
        todoDateTime.setHours(hours, minutes)
        const timeDiff = todoDateTime.getTime() - now.getTime()
        return timeDiff > 0 && timeDiff <= 15 * 60 * 1000 // 15 minutes
      })

      upcomingTodos.forEach(todo => {
        toast({
          title: "Upcoming Todo",
          description: `${todo.text} at ${todo.startTime}`,
          duration: 5000,
        })
      })
    }

    const intervalId = setInterval(checkForUpcomingTodos, 60000) // Check every minute
    return () => clearInterval(intervalId)
  }, [todos, toast])

  useEffect(() => {
    const resetTodosAtMidnight = () => {
      const now = new Date()
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setTodos(prevTodos => prevTodos.map(todo => ({
          ...todo,
          status: 'pending'
        })))
      }
    }

    const intervalId = setInterval(resetTodosAtMidnight, 60000) // Check every minute
    return () => clearInterval(intervalId)
  }, [])

  const addOrUpdateTodo = useCallback(() => {
    if (newTodo.trim() === '') return

    const todoToAdd = editingTodo ? {
      ...editingTodo,
      text: newTodo,
      startTime: newTodoStartTime,
      endTime: newTodoEndTime,
      type: newTodoType,
    } : {
      id: Date.now().toString(),
      text: newTodo,
      startTime: newTodoStartTime,
      endTime: newTodoEndTime,
      date: date,
      type: newTodoType,
      status: 'pending',
    }

    setTodos(prevTodos => {
      if (editingTodo) {
        return prevTodos.map(todo => todo.id === editingTodo.id ? todoToAdd : todo)
      } else {
        return [...prevTodos, todoToAdd]
      }
    })

    setNewTodo('')
    setNewTodoStartTime('09:00')
    setNewTodoEndTime('10:00')
    setNewTodoType('work')
    setEditingTodo(null)
  }, [newTodo, newTodoStartTime, newTodoEndTime, newTodoType, date, editingTodo])

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const openEditDialog = (todo) => {
    setEditingTodo(todo)
    setNewTodo(todo.text)
    setNewTodoStartTime(todo.startTime)
    setNewTodoEndTime(todo.endTime)
    setNewTodoType(todo.type)
  }

  const updateTodoStatus = (id, status) => {
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.id === id ? { ...todo, status } : todo
    ))
  }

  const filteredTodos = todos.filter(todo => {
    if (view === 'day') {
      return todo.date.toDateString() === date.toDateString()
    } else if (view === 'week') {
      const firstDayOfWeek = new Date(date)
      firstDayOfWeek.setDate(date.getDate() - date.getDay())
      const lastDayOfWeek = new Date(firstDayOfWeek)
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)
      return todo.date >= firstDayOfWeek && todo.date <= lastDayOfWeek
    } else {
      return todo.date.getMonth() === date.getMonth() && todo.date.getFullYear() === date.getFullYear()
    }
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{name}</h1>
      <Tabs value={view} onValueChange={(value) => setView(value)}>
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{editingTodo ? 'Edit Todo' : 'Add Todo'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="todo-text">Todo</Label>
              <Input
                id="todo-text"
                placeholder="Enter your todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="todo-start-time">Start Time</Label>
                  <Input
                    id="todo-start-time"
                    type="time"
                    value={newTodoStartTime}
                    onChange={(e) => setNewTodoStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="todo-end-time">End Time</Label>
                  <Input
                    id="todo-end-time"
                    type="time"
                    value={newTodoEndTime}
                    onChange={(e) => setNewTodoEndTime(e.target.value)}
                  />
                </div>
              </div>
              <Label htmlFor="todo-type">Type</Label>
              <Select value={newTodoType} onValueChange={(value) => setNewTodoType(value)}>
                <SelectTrigger id="todo-type">
                  <SelectValue placeholder="Select todo type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addOrUpdateTodo}>{editingTodo ? 'Update Todo' : 'Add Todo'}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{view === 'day' ? "Today's" : view === 'week' ? "This Week's" : "This Month's"} Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {filteredTodos
              .sort((a, b) => a.date.getTime() - b.date.getTime() || a.startTime.localeCompare(b.startTime))
              .map(todo => (
                <div key={todo.id} className={`flex justify-between items-center mb-2 p-2 rounded-md ${typeColors[todo.type]} ${statusColors[todo.status]}`}>
                  <span>
                    {view !== 'day' && `${todo.date.toLocaleDateString()} - `}
                    {todo.startTime} - {todo.endTime}: {todo.text}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Select value={todo.status} onValueChange={(value) => updateTodoStatus(todo.id, value)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inProgress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(todo)}>Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Todo</DialogTitle>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => removeTodo(todo.id)}>Delete</Button>
                  </div>
                </div>
              ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
import Header from "./components/Header"
import TaskList from "./components/TaskList"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <TaskList />
      <Footer />
    </div>
  )
}

export default App

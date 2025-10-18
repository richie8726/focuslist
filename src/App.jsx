import Header from "./components/Header";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <Header />
        <TaskList />
        <Footer />
      </div>
    </div>
  );
}

export default App;

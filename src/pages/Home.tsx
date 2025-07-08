
import { UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Settings } from 'lucide-react';

const Home = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CJ</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">JobCopilot</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-purple-600 font-medium">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs">◯</span>
              </div>
              <span>Copilot</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">📋</span>
              </div>
              <span>Applications</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">🔧</span>
              </div>
              <span>Tools</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-gray-600 text-xs">❓</span>
              </div>
              <span>Support</span>
            </div>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <Settings className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Automate Job Applications
          </h1>

          {/* Setup Card */}
          <Card className="mb-8 border-0 shadow-lg bg-white">
            <CardContent className="p-8">
              <Button 
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 text-lg font-semibold rounded-full flex items-center justify-center sm:justify-start space-x-2"
              >
                <span>Setup your first copilot</span>
                <span className="ml-2">→</span>
              </Button>
            </CardContent>
          </Card>

          {/* How Copilot Works Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <button className="flex items-center justify-between w-full text-left">
              <h2 className="text-xl font-semibold text-gray-900">How Copilot Works</h2>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
